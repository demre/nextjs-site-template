import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
  // Honeypot: real users never see or fill this field. Bots that
  // autofill every input will trip it. Checked server-side only, so a
  // filled honeypot fails silently instead of showing a client error.
  company: z.string(),
  turnstileToken: z.string(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
