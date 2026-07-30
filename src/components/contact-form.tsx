"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TurnstileWidget } from "@/components/turnstile-widget";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/schemas/contact";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      company: "",
      turnstileToken: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.status === 429) {
        toast.error("Too many requests. Please try again in a few minutes.");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" autoComplete="name" {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.message}>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea id="message" rows={5} {...form.register("message")} />
          <FieldError errors={[form.formState.errors.message]} />
        </Field>

        {/* Honeypot field: hidden from real users via CSS, left empty by
            them, but auto-filled by naive bots. Checked server-side. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("company")}
          />
        </div>

        {turnstileSiteKey && (
          <TurnstileWidget
            siteKey={turnstileSiteKey}
            onVerify={(token) => form.setValue("turnstileToken", token)}
          />
        )}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send message"}
        </Button>
      </FieldGroup>
    </form>
  );
}
