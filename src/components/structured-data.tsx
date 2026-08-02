import type { Thing, WithContext } from "schema-dts";

type JsonLd = WithContext<Thing>;

/**
 * Renders JSON-LD structured data into the document.
 *
 * `<` is escaped so a value containing "</script>" cannot break out of the tag.
 */
export function StructuredData({ data }: { data: JsonLd | JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
