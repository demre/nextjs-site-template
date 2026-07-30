"use client";

import Script from "next/script";
import { useId, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
        },
      ) => string;
    };
  }
}

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

export function TurnstileWidget({ siteKey, onVerify }: TurnstileWidgetProps) {
  const containerId = useId().replace(/:/g, "");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(true);
          window.turnstile?.render(`#${containerId}`, {
            sitekey: siteKey,
            callback: onVerify,
            "expired-callback": () => onVerify(""),
          });
        }}
      />
      <div id={containerId} data-loaded={scriptLoaded} />
    </>
  );
}
