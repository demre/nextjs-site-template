import { ImageResponse } from "next/og";

import { siteConfig, siteInitials } from "@/config/site";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon generated from the site initials. Replace with an icon.svg once a logo exists. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        background: siteConfig.themeColor.dark,
        color: siteConfig.themeColor.light,
      }}
    >
      {siteInitials}
    </div>,
    { ...size },
  );
}
