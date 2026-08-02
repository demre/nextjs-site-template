import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { StructuredData } from "@/components/structured-data";
import { breadcrumbJsonLd } from "@/lib/structured-data";

/**
 * Visible breadcrumb trail plus its matching BreadcrumbList JSON-LD.
 * Pass the ancestors in order, excluding the site root - it is prepended
 * for you by breadcrumbJsonLd and rendered here as "Home".
 *
 * <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
 */
export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const trail = [{ name: "Home", path: "/" }, ...items];

  return (
    <>
      <StructuredData data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb">
        <ol className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="size-3.5 shrink-0" aria-hidden />
                )}
                {isLast ? (
                  <span aria-current="page" className="text-foreground">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="hover:text-foreground">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
