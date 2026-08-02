import type {
  BreadcrumbList,
  LocalBusiness,
  Organization,
  WebSite,
  WithContext,
} from "schema-dts";

import { siteConfig } from "@/config/site";

/** Resolve a route path against the configured site URL. */
function absolute(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function websiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absolute("/#website"),
    name: siteConfig.name,
    url: absolute("/"),
    description: siteConfig.description,
    inLanguage: siteConfig.lang,
  };
}

/**
 * LocalBusiness markup, or Organization when the address hasn't been filled in.
 *
 * A LocalBusiness without a PostalAddress is invalid structured data, so an
 * un-configured template degrades to Organization rather than publishing markup
 * that fails validation. Filling in street + locality in src/config/site.ts
 * upgrades it automatically.
 */
export function businessJsonLd(): WithContext<LocalBusiness | Organization> {
  const { business } = siteConfig;
  const hasAddress = Boolean(
    business.address.streetAddress && business.address.addressLocality,
  );

  const base = {
    "@context": "https://schema.org",
    "@id": absolute("/#business"),
    name: business.legalName || siteConfig.name,
    url: absolute("/"),
    description: siteConfig.description,
    image: absolute("/opengraph-image"),
    ...(business.telephone ? { telephone: business.telephone } : {}),
    ...(business.email ? { email: business.email } : {}),
    ...(business.sameAs.length ? { sameAs: [...business.sameAs] } : {}),
  } as const;

  if (!hasAddress) {
    return { ...base, "@type": "Organization" } as WithContext<Organization>;
  }

  const { address, geo, openingHours, priceRange } = business;

  return {
    ...base,
    "@type": "LocalBusiness",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      ...(address.addressRegion
        ? { addressRegion: address.addressRegion }
        : {}),
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
      ...(address.addressCountry
        ? { addressCountry: address.addressCountry }
        : {}),
    },
    ...(geo.latitude && geo.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: geo.latitude,
            longitude: geo.longitude,
          },
        }
      : {}),
    ...(openingHours.length ? { openingHours: [...openingHours] } : {}),
    ...(priceRange ? { priceRange } : {}),
  } as WithContext<LocalBusiness>;
}

/**
 * Breadcrumb trail for nested routes. Pass the ancestors in order, excluding
 * the site root - it is prepended for you.
 *
 * breadcrumbJsonLd([{ name: "Services", path: "/services" }])
 */
export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): WithContext<BreadcrumbList> {
  const trail = [{ name: siteConfig.name, path: "/" }, ...items];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
