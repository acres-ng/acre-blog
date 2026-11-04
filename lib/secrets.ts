import { timingSafeEqual } from "node:crypto";

/**
 * Whether `provided` equals the configured secret `expected`.
 *
 * An unset or empty secret never matches anything, so a missing env var
 * locks the route instead of opening it (an empty `?secret=` or a literal
 * "Bearer undefined" header must not pass). Compared in constant time.
 */
export function secretMatches(
  provided: string | null | undefined,
  expected: string | undefined,
): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
