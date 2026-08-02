<#
.SYNOPSIS
  Scaffold a new client website from the nextjs-site-template GitHub template,
  configure local secrets, and launch the dev server - all in one command.

.DESCRIPTION
  1. Prompts for the new project name (or accepts -ProjectName).
  2. Runs `npx create-next-app@latest <name> -e <template repo>`, which clones
     the template and runs `npm install` automatically.
  3. Prompts for site details (name, description, phone) and project-specific
     secrets (Resend, Turnstile, Upstash).
  4. Writes the secrets into <project>/.env.local only - never into
     .env.example or any other committed file.
  5. Writes the site details into <project>/src/config/site.ts, which drives
     page titles, share previews, the sitemap and search-engine metadata.
  6. Renames the "name" field in package.json to match the project name.
  7. Runs `npm run dev` so you land on a working local dev server.

.PARAMETER ProjectName
  Optional. If omitted, you will be prompted for it.

.PARAMETER TemplateRepo
  Optional. Defaults to the demre/nextjs-site-template GitHub template.

.EXAMPLE
  .\new-project.ps1
  .\new-project.ps1 -ProjectName my-client-site
#>

[CmdletBinding()]
param(
    [string]$ProjectName,
    [string]$TemplateRepo = "https://github.com/demre/nextjs-site-template"
)

$ErrorActionPreference = "Stop"

function Read-OptionalSecret {
    param([string]$Prompt)
    $value = Read-Host $Prompt
    return $value
}

# Escape a user-supplied string for embedding in a TypeScript double-quoted literal.
function ConvertTo-TsString {
    param([string]$Value)
    return $Value.Replace('\', '\\').Replace('"', '\"')
}

# Replace a value in src/config/site.ts, anchored to its trailing
# "// @scaffold:<marker>" comment so no other key can accidentally match.
function Set-SiteConfigValue {
    param(
        [string]$Content,
        [string]$Marker,
        [string]$Value
    )
    $pattern = '(?m)^(\s*\w+:\s*)"[^"]*"(,\s*//\s*@scaffold:' + [regex]::Escape($Marker) + ')\s*$'
    # '$' is the substitution marker in .NET replacement strings; '$$' emits a literal one.
    $replacement = '${1}"' + (ConvertTo-TsString $Value).Replace('$', '$$') + '"${2}'
    if ($Content -notmatch $pattern) {
        Write-Warning "Could not find the '@scaffold:$Marker' marker in src/config/site.ts - skipping."
        return $Content
    }
    return [regex]::Replace($Content, $pattern, $replacement)
}

# --- 1. Project name -------------------------------------------------------
if (-not $ProjectName) {
    $ProjectName = Read-Host "Project name (e.g. acme-marketing-site)"
}
if (-not $ProjectName) {
    throw "A project name is required."
}
if ($ProjectName -notmatch '^[a-zA-Z0-9][a-zA-Z0-9._-]*$') {
    throw "Project name '$ProjectName' contains invalid characters. Use letters, numbers, dashes, dots, or underscores."
}

if (Test-Path $ProjectName) {
    throw "A folder named '$ProjectName' already exists here. Choose a different name or remove that folder first."
}

# --- 2. Clone template + install dependencies -------------------------------
Write-Host ""
Write-Host "==> Scaffolding '$ProjectName' from $TemplateRepo ..." -ForegroundColor Cyan
npx --yes create-next-app@latest $ProjectName -e $TemplateRepo --use-npm
if ($LASTEXITCODE -ne 0) {
    throw "create-next-app failed (exit code $LASTEXITCODE)."
}

$projectPath = Join-Path (Get-Location) $ProjectName
if (-not (Test-Path (Join-Path $projectPath "node_modules"))) {
    throw "node_modules not found after create-next-app - dependency install did not complete."
}
Write-Host "==> Dependencies installed." -ForegroundColor Green

# create-next-app installs dependencies before it git-initializes the new
# project, so husky's "prepare" script silently fails to register the
# pre-commit hook (no .git yet at install time). Re-run it now that the
# repo exists so pre-commit hooks actually work.
if (Test-Path (Join-Path $projectPath "node_modules\.bin\husky.cmd")) {
    Push-Location $projectPath
    try {
        npx husky
        Write-Host "==> Re-registered husky pre-commit hook." -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
}

Push-Location $projectPath
try {
    # --- 3. Prompt for project-specific secrets -----------------------------
    Write-Host ""
    Write-Host "==> Enter project configuration (press Enter to skip any optional value)" -ForegroundColor Cyan

    $siteUrl = Read-Host "Site URL [http://localhost:3000]"
    if (-not $siteUrl) { $siteUrl = "http://localhost:3000" }

    $siteName = Read-Host "Site / business name (used in titles, share previews and search results)"
    if (-not $siteName) { $siteName = $ProjectName }
    $siteDescription = Read-OptionalSecret "One-sentence description of the business (shown in search results)"
    $businessPhone   = Read-OptionalSecret "Business phone number (optional)"

    $resendApiKey   = Read-OptionalSecret "Resend API key"
    $contactTo      = Read-OptionalSecret "Contact form 'send to' email address"
    $contactFrom    = Read-OptionalSecret "Contact form 'from' email address (e.g. onboarding@resend.dev)"

    $turnstileSite   = Read-OptionalSecret "Cloudflare Turnstile site key (optional)"
    $turnstileSecret = Read-OptionalSecret "Cloudflare Turnstile secret key (optional)"

    $upstashUrl   = Read-OptionalSecret "Upstash Redis REST URL (optional, for rate limiting)"
    $upstashToken = Read-OptionalSecret "Upstash Redis REST token (optional)"

    # --- 4. Write .env.local (never touches .env.example) -------------------
    $envLocalPath = Join-Path $projectPath ".env.local"
    $envContent = @"
# Generated by scripts/new-project.ps1 - local secrets only. Never commit this file.

NEXT_PUBLIC_SITE_URL=$siteUrl

RESEND_API_KEY=$resendApiKey
CONTACT_EMAIL_TO=$contactTo
CONTACT_EMAIL_FROM=$contactFrom

NEXT_PUBLIC_TURNSTILE_SITE_KEY=$turnstileSite
TURNSTILE_SECRET_KEY=$turnstileSecret

UPSTASH_REDIS_REST_URL=$upstashUrl
UPSTASH_REDIS_REST_TOKEN=$upstashToken
"@
    Set-Content -Path $envLocalPath -Value $envContent -Encoding utf8
    Write-Host "==> Wrote $envLocalPath" -ForegroundColor Green

    # --- 5. Fill in src/config/site.ts (SEO single source of truth) ----------
    $siteConfigPath = Join-Path $projectPath "src\config\site.ts"
    if (Test-Path $siteConfigPath) {
        $siteConfigContent = Get-Content $siteConfigPath -Raw
        $siteConfigContent = Set-SiteConfigValue -Content $siteConfigContent -Marker "name" -Value $siteName
        if ($siteDescription) {
            $siteConfigContent = Set-SiteConfigValue -Content $siteConfigContent -Marker "description" -Value $siteDescription
        }
        else {
            # The description is the summary line Google shows under the site name -
            # shipping the placeholder would be visible to the public.
            Write-Warning "No description given. src/config/site.ts still has placeholder text that would appear in Google search results - edit it before going live."
        }
        if ($businessPhone) {
            $siteConfigContent = Set-SiteConfigValue -Content $siteConfigContent -Marker "telephone" -Value $businessPhone
        }
        Set-Content -Path $siteConfigPath -Value $siteConfigContent -Encoding utf8 -NoNewline
        Write-Host "==> Wrote site details to src/config/site.ts" -ForegroundColor Green
    }
    else {
        Write-Warning "src/config/site.ts not found - skipping site configuration."
    }

    # --- 6. Rename package.json "name" field ---------------------------------
    $pkgPath = Join-Path $projectPath "package.json"
    $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
    $pkg.name = $ProjectName.ToLower()
    ($pkg | ConvertTo-Json -Depth 100) | Set-Content -Path $pkgPath -Encoding utf8
    Write-Host "==> Set package.json name to '$($pkg.name)'" -ForegroundColor Green

    # --- 7. Launch dev server --------------------------------------------------
    Write-Host ""
    Write-Host "Next step for search engines: open src/config/site.ts and fill in the" -ForegroundColor Yellow
    Write-Host "'business' block (address, opening hours, social profile links)." -ForegroundColor Yellow
    Write-Host "With an address filled in, the site publishes LocalBusiness data that" -ForegroundColor Yellow
    Write-Host "Google can use for local results; without one it falls back to a generic" -ForegroundColor Yellow
    Write-Host "Organization listing." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "==> Starting dev server. Press Ctrl+C to stop." -ForegroundColor Cyan
    npm run dev
}
finally {
    Pop-Location
}
