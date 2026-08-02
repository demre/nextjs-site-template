import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { StructuredData } from "@/components/structured-data";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { businessJsonLd, websiteJsonLd } from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Lets every other metadata field below use relative URLs.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    // Applies to child segments only, so a page exporting `title: "Contact"`
    // renders as "Contact | <site name>" with no extra work.
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.business.legalName }],
  creator: siteConfig.business.legalName,
  publisher: siteConfig.business.legalName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: "/",
    title: siteConfig.name,
    description: siteConfig.description,
    // og:image comes from src/app/opengraph-image.tsx - don't list it here.
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    ...(siteConfig.twitterHandle
      ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle }
      : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Allows full-size image thumbnails in search results.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: siteConfig.themeColor.light,
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: siteConfig.themeColor.dark,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Toaster />
        <StructuredData data={[websiteJsonLd(), businessJsonLd()]} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
