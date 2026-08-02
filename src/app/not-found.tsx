import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  // Next emits `robots: noindex` for this route automatically.
};

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 text-center">
      <p className="text-muted-foreground text-sm font-medium">404</p>
      <h1 className="mt-2 mb-3 text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground mb-6">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className={buttonVariants({ className: "mx-auto" })}>
        Back to home
      </Link>
    </main>
  );
}
