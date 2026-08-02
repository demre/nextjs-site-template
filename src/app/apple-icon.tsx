import { ImageResponse } from "next/og";

import { siteConfig, siteInitials } from "@/config/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS. Replace with an apple-icon.png once a logo exists. */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 96,
        background: siteConfig.themeColor.dark,
        color: siteConfig.themeColor.light,
      }}
    >
      {siteInitials}
    </div>,
    { ...size },
  );
}
