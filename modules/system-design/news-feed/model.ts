/**
 * News feed cost model. Illustrative numbers, loosely shaped like Twitter's published 2012
 * figures (about 5,000 posts/s and 300,000 timeline reads/s).
 */

export const POSTS_PER_S = 5000;
export const FEED_READS_PER_S = 300000;
export const FOLLOWS = 200; // accounts a typical user follows
export const CELEB_FOLLOWERS = 10_000_000;
export const FANOUT_CAPACITY = 2_500_000; // timeline inserts/s the fan-out workers can do
const NORMAL_WRITES = 1_000_000; // inserts/s from ordinary accounts

export type Strategy = "write" | "read" | "hybrid";
export const THRESHOLDS = [10_000, 100_000, 1_000_000];

/** Inserts/s caused by accounts above each threshold, and how many such accounts a typical user follows. */
const BIG: Record<number, { writes: number; followed: number }> = {
  10_000: { writes: 2_000_000, followed: 40 },
  100_000: { writes: 1_600_000, followed: 12 },
  1_000_000: { writes: 1_000_000, followed: 3 },
};

export interface FeedResult {
  writesPerS: number; // fan-out inserts per second, steady state
  lookupsPerFeed: number; // accounts whose recent posts are fetched on each feed load
  lookupsPerS: number;
  feedMs: number; // typical feed load time
  celebDeliver: string; // until a celebrity's post is in every follower's feed
  overloaded: boolean;
}

export function evaluate(strategy: Strategy, threshold: number): FeedResult {
  const big = BIG[threshold];
  const allWrites = NORMAL_WRITES + BIG[10_000].writes;
  const writes =
    strategy === "write" ? allWrites : strategy === "hybrid" ? allWrites - big.writes : 0;
  const lookups = strategy === "read" ? FOLLOWS : strategy === "hybrid" ? big.followed : 0;
  // Reading a precomputed timeline is one cache read; each fetched account adds work (in parallel batches).
  const feedMs =
    strategy === "write"
      ? 3
      : (strategy === "hybrid" ? 3 : 0) +
        6 +
        Math.ceil(lookups / 25) * 6 +
        Math.round(lookups * 0.25);
  const spare = FANOUT_CAPACITY - writes;
  const celebDeliver =
    strategy !== "write"
      ? "instant (fetched when read)"
      : spare <= 0
        ? "minutes, and falling behind"
        : `${Math.round(CELEB_FOLLOWERS / spare)} s or more`;
  return {
    writesPerS: writes,
    lookupsPerFeed: lookups,
    lookupsPerS: lookups * FEED_READS_PER_S,
    feedMs,
    celebDeliver,
    overloaded: writes > FANOUT_CAPACITY,
  };
}
