import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Treat unset-but-present ("") env vars the same as truly unset, so
// optional fields don't fail format validation (e.g. .url()) when a
// project simply doesn't use that integration.
const emptyToUndefined = z
  .string()
  .transform((v) => (v === "" ? undefined : v));

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
    CONTACT_EMAIL_TO: z.string().email(),
    CONTACT_EMAIL_FROM: z.string().email(),
    TURNSTILE_SECRET_KEY: emptyToUndefined.pipe(z.string().optional()),
    UPSTASH_REDIS_REST_URL: emptyToUndefined.pipe(z.string().url().optional()),
    UPSTASH_REDIS_REST_TOKEN: emptyToUndefined.pipe(z.string().optional()),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: emptyToUndefined.pipe(
      z.string().optional(),
    ),
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: emptyToUndefined.pipe(
      z.string().optional(),
    ),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_EMAIL_TO: process.env.CONTACT_EMAIL_TO,
    CONTACT_EMAIL_FROM: process.env.CONTACT_EMAIL_FROM,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
});
