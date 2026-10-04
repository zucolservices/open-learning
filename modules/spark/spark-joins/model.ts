/** How Spark picks a join strategy, simplified. Sizes and executor count are illustrative. */

export const SIZES: [number, string][] = [
  [3, "3 MB"],
  [8, "8 MB"],
  [60, "60 MB"],
  [2_000, "2 GB"],
  [400_000, "400 GB"],
];

export const BIG_MB = 500_000; // the large side: 500 GB
export const EXECUTORS = 20;
export const THRESHOLD_MB = 10;

export type Hint = "none" | "broadcast" | "merge" | "shuffle_hash";
export type Strategy = "bhj" | "smj" | "shj" | "bnlj" | "cartesian";

export const STRATEGIES: Record<Strategy, { name: string; how: string }> = {
  bhj: {
    name: "Broadcast hash join",
    how: "Copy the small side to every executor and build a hash table there. The big side never moves.",
  },
  smj: {
    name: "Sort-merge join",
    how: "Shuffle both sides by the join key, sort each partition, then walk the two sorted lists in step.",
  },
  shj: {
    name: "Shuffled hash join",
    how: "Shuffle both sides by key, then build a hash table from the smaller side in each partition. Skips the sort, but needs memory.",
  },
  bnlj: {
    name: "Broadcast nested loop join",
    how: "No equality key to hash on, so every big row is compared with every broadcast small row.",
  },
  cartesian: {
    name: "Cartesian product",
    how: "No equality key and nothing small enough to broadcast: every row meets every row. Usually a mistake.",
  },
};

export function choose(
  smallMb: number,
  equi: boolean,
  hint: Hint,
): { s: Strategy; movedMb: number; warn?: string } {
  const fits = smallMb <= THRESHOLD_MB;
  const broadcastMoved = smallMb * EXECUTORS;
  const shuffleMoved = BIG_MB + smallMb;
  if (!equi) {
    if (fits || hint === "broadcast")
      return {
        s: "bnlj",
        movedMb: broadcastMoved,
        warn:
          smallMb > 1000
            ? "Broadcasting this much risks running the driver or executors out of memory."
            : undefined,
      };
    return {
      s: "cartesian",
      movedMb: shuffleMoved,
      warn: "Rows compared: 500 GB × the other side. Add an equality condition if you can.",
    };
  }
  if (hint === "broadcast")
    return {
      s: "bhj",
      movedMb: broadcastMoved,
      warn:
        smallMb > 1000
          ? "The hint forces a broadcast of a large table: slow to send, and it may run out of memory or hit the 300 s broadcast timeout."
          : undefined,
    };
  if (hint === "merge") return { s: "smj", movedMb: shuffleMoved };
  if (hint === "shuffle_hash") return { s: "shj", movedMb: shuffleMoved };
  if (fits) return { s: "bhj", movedMb: broadcastMoved };
  return { s: "smj", movedMb: shuffleMoved };
}

export const fmtMb = (mb: number) =>
  mb >= 1000
    ? `${(mb / 1000).toLocaleString("en-GB", { maximumFractionDigits: 1 })} GB`
    : `${mb} MB`;

/* Sort-merge walk ------------------------------------------------------------------------------- */

export const LEFT = [1, 3, 3, 5, 8];
export const RIGHT = [2, 3, 5, 5, 9];

export interface MergeFrame {
  i: number;
  j: number;
  note: string;
  out: string[];
}

function walk(): MergeFrame[] {
  const frames: MergeFrame[] = [];
  const out: string[] = [];
  let i = 0;
  let j = 0;
  frames.push({ i, j, note: "Both sides are sorted by key. Start at the top of each.", out: [] });
  while (i < LEFT.length && j < RIGHT.length) {
    const a = LEFT[i];
    const b = RIGHT[j];
    if (a < b) {
      frames.push({
        i,
        j,
        note: `${a} < ${b}: no match for ${a}, step the left side.`,
        out: [...out],
      });
      i++;
    } else if (a > b) {
      frames.push({
        i,
        j,
        note: `${a} > ${b}: no match for ${b}, step the right side.`,
        out: [...out],
      });
      j++;
    } else {
      let j2 = j;
      while (j2 < RIGHT.length && RIGHT[j2] === a) {
        out.push(`${a}=${a}`);
        j2++;
      }
      frames.push({
        i,
        j,
        note: `${a} = ${b}: a match. Pair it with every right row with key ${a}.`,
        out: [...out],
      });
      i++;
      if (i >= LEFT.length || LEFT[i] !== a) j = j2;
    }
  }
  frames.push({
    i: Math.min(i, LEFT.length - 1),
    j: Math.min(j, RIGHT.length - 1),
    note: "One side is used up: done. Each row was read once, in order.",
    out: [...out],
  });
  return frames;
}

export const MERGE_FRAMES = walk();
