import { env } from "@/lib/env";

/**
 * Single source of truth for everything SEO-related.
 *
 * Consumed by the root layout metadata, sitemap.ts, robots.ts, manifest.ts,
 * the generated OG image and icons, and the JSON-LD builders in
 * src/lib/structured-data.ts. Change a value here and it propagates everywhere.
 *
 * Lines tagged `// @scaffold:*` are filled in automatically by
 * scripts/new-project.ps1 - keep the marker comments intact.
 *
 * TODO for each new project: fill in the `business` block below. Leaving the
 * address empty is safe (the site publishes Organization markup instead of
 * LocalBusiness), but filling it in is what unlocks local rich results.
 */
export const siteConfig = {
  name: "Acme Inc.", // @scaffold:name
  description: "Short one-sentence description of the business.", // @scaffold:description

  /** Validated in src/lib/env.ts - a missing value fails the build. */
  url: env.NEXT_PUBLIC_SITE_URL,

  /** Open Graph locale, e.g. "en_US", "de_DE". */
  locale: "en_US",
  /** <html lang> value, e.g. "en", "de". */
  lang: "en",

  /** e.g. "@acme". Leave empty to omit the twitter:site/creator tags. */
  twitterHandle: "",

  /** Browser UI colour. Must be a plain CSS colour - oklch() is not reliably supported here. */
  themeColor: {
    light: "#ffffff",
    dark: "#0a0a0a",
  },

  business: {
    legalName: "Acme Inc.", // @scaffold:name
    telephone: "", // @scaffold:telephone
    email: "",
    /** e.g. "$$" or "£20-£100". Omitted when empty. */
    priceRange: "",

    /** Fill street + locality to upgrade the markup from Organization to LocalBusiness. */
    address: {
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      /** ISO 3166-1 alpha-2, e.g. "GB", "US". */
      addressCountry: "",
    },

    geo: {
      latitude: "",
      longitude: "",
    },

    /** schema.org openingHours format, e.g. ["Mo-Fr 09:00-17:00", "Sa 10:00-14:00"]. */
    openingHours: [] as string[],

    /** Social profile URLs, e.g. ["https://www.linkedin.com/company/acme"]. */
    sameAs: [] as string[],
  },

  /**
   * Every public route, in sitemap order. Adding a page? Add it here too -
   * src/app/sitemap.ts maps over this list.
   */
  routes: [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Up to two initials from the site name, used by the generated app icons. */
export const siteInitials = siteConfig.name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0]!.toUpperCase())
  .join("");
