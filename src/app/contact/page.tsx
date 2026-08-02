import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";

const title = "Contact";
const description = "Get in touch with us.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    url: "/contact",
    title,
    description,
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <h1 className="mt-4 mb-6 text-2xl font-semibold">Contact us</h1>
      <ContactForm />
    </main>
  );
}
