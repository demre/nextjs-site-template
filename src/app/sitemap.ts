import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Routes live in src/config/site.ts so adding a page can't silently omit it
  // from the sitemap. The URL comes from the validated env, so a misconfigured
  // deploy fails the build instead of publishing localhost URLs.
  return siteConfig.routes.map((route) => ({
    url: new URL(route.path, siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
