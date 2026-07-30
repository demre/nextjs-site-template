import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { env } from "@/lib/env";

// Rate limiting is optional: if Upstash isn't configured (e.g. local
// dev without a Redis instance), every request is allowed through.
const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "ratelimit:contact-form",
    })
  : null;

export async function checkRateLimit(identifier: string) {
  if (!ratelimit) {
    return { success: true as const };
  }
  const result = await ratelimit.limit(identifier);
  return result;
}
