/**
 * Percentage rollout with consistent bucketing, as flag SDKs do it: hash the flag key and the
 * user's ID into one of 100,000 buckets; a user is in when their bucket is below the rollout
 * percentage. (LaunchDarkly uses SHA-1; Unleash and flagd use MurmurHash. Here a small FNV-1a hash
 * stands in.)
 */

export const USERS = 200;
export const STEPS = [0, 1, 10, 50, 100] as const;
export type Step = (typeof STEPS)[number];

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function bucket(flag: string, user: number): number {
  return fnv1a(`${flag}.salt.user-${user}`) % 100_000;
}

export function enabled(flag: string, user: number, pct: number): boolean {
  return bucket(flag, user) < pct * 1000;
}

/** Users whose phones hit the new checkout's bug (an older Android WebView, say). */
export function buggy(user: number): boolean {
  return fnv1a(`device-${user}`) % 100 < 30;
}

/** Combinations of on/off a codebase with n independent flags can be in. */
export function paths(n: number): number {
  return 2 ** n;
}
