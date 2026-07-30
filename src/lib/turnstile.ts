import { env } from "@/lib/env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Turnstile is optional: if no secret key is configured, verification
// is skipped (useful for local dev without a Cloudflare site set up).
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return { success: true as const };
  }

  if (!token) {
    return { success: false as const, error: "missing-token" };
  }

  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch(VERIFY_URL, {
    method: "POST",
    body,
  });

  const data = (await res.json()) as { success: boolean };
  return data.success
    ? { success: true as const }
    : { success: false as const, error: "verification-failed" };
}
