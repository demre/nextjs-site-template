import { Resend } from "resend";
import { NextResponse } from "next/server";

import ContactNotificationEmail from "../../../../emails/contact-notification";
import { env } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactFormSchema } from "@/lib/schemas/contact";
import { verifyTurnstileToken } from "@/lib/turnstile";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  const rateLimit = await checkRateLimit(ip ?? "anonymous");
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form submission." },
      { status: 400 }
    );
  }

  const { name, email, message, company, turnstileToken } = parsed.data;

  // Honeypot tripped: pretend success so the bot doesn't learn it was
  // caught, but never actually send the email.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const turnstileResult = await verifyTurnstileToken(turnstileToken, ip);
  if (!turnstileResult.success) {
    return NextResponse.json(
      { error: "Bot verification failed. Please try again." },
      { status: 400 }
    );
  }

  const { error } = await resend.emails.send({
    from: env.CONTACT_EMAIL_FROM,
    to: env.CONTACT_EMAIL_TO,
    replyTo: email,
    subject: `New contact form submission from ${name}`,
    react: ContactNotificationEmail({ name, email, message }),
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
