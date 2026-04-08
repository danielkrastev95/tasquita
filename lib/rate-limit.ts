/**
 * Simple in-memory rate limiter.
 * Works per-instance on Vercel serverless (provides burst protection).
 * For production-grade rate limiting, use Upstash Redis (@upstash/ratelimit).
 */
const attempts = new Map<string, { count: number; resetTime: number }>();

// Periodically clean up expired entries to prevent memory leaks
const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, record] of attempts) {
    if (now > record.resetTime) attempts.delete(key);
  }
}

export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { success: boolean; remaining: number } {
  cleanup();
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetTime) {
    attempts.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: maxAttempts - record.count };
}
