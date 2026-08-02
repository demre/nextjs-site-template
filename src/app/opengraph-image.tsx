import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share image, generated at build time from src/config/site.ts.
 *
 * Rendered by satori, which supports flexbox only - `display: grid` and most
 * modern layout CSS silently produce a blank image. Every element needs an
 * explicit `display: "flex"`.
 *
 * Uses the bundled default font. To use the site's own typeface, read a .ttf
 * with node:fs and pass it via the `fonts` option below.
 */
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: siteConfig.themeColor.dark,
        color: siteConfig.themeColor.light,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 64,
          height: 8,
          background: siteConfig.themeColor.light,
          borderRadius: 4,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 72, letterSpacing: -2 }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            lineHeight: 1.4,
            opacity: 0.7,
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
