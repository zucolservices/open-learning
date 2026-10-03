/**
 * One row updated while another transaction reads it, in PostgreSQL's style: every version is
 * stamped with xmin (who created it) and xmax (who replaced it). Transaction IDs are illustrative.
 */

export interface Version {
  price: number;
  xmin: number;
  /** 0 while no one has replaced it. */
  xmax: number;
  state: "live" | "dead" | "removed";
}

export interface Frame {
  title: string;
  text: string;
  versions: Version[];
  /** What each transaction's SELECT returns at this moment (null = not running). */
  views: { who: string; xid: number; sees: number | null; note?: string }[];
  tone?: "good" | "bad";
}

const V1 = (xmax: number, state: Version["state"] = "live"): Version => ({
  price: 100,
  xmin: 90,
  xmax,
  state,
});
const V2: Version = { price: 120, xmin: 102, xmax: 0, state: "live" };

export const FRAMES: Frame[] = [
  {
    title: "One row, one version",
    text: "Tea costs ₹100. The row was inserted by transaction 90, long since committed, so xmin = 90 and xmax = 0.",
    versions: [V1(0)],
    views: [],
  },
  {
    title: "A reader takes a snapshot",
    text: "Transaction 101 starts a long report at repeatable read and reads the price. Its snapshot says: count only what had committed before I started.",
    versions: [V1(0)],
    views: [{ who: "Report", xid: 101, sees: 100 }],
  },
  {
    title: "A writer updates, without waiting",
    text: "Transaction 102 changes the price to ₹120. PostgreSQL doesn't overwrite: it writes a new version (xmin = 102) and stamps the old one's xmax = 102. The report isn't blocked, and neither is the writer.",
    versions: [V1(102), V2],
    views: [
      { who: "Report", xid: 101, sees: 100, note: "102 hasn't committed" },
      { who: "Writer", xid: 102, sees: 120, note: "sees its own change" },
    ],
  },
  {
    title: "The writer commits",
    text: "A new transaction, 103, sees ₹120. The report still sees ₹100: 102 committed after its snapshot was taken. Two versions, two correct answers.",
    versions: [V1(102), V2],
    views: [
      { who: "Report", xid: 101, sees: 100, note: "snapshot from before 102" },
      { who: "New reader", xid: 103, sees: 120 },
    ],
  },
  {
    title: "VACUUM can't remove it yet",
    text: "The old version is dead to everyone except the report, which might still read it. VACUUM must leave it alone.",
    versions: [V1(102, "dead"), V2],
    views: [{ who: "Report", xid: 101, sees: 100, note: "still running" }],
    tone: "bad",
  },
  {
    title: "The report ends; VACUUM cleans up",
    text: "Nobody can see the ₹100 version any more. VACUUM removes it and marks the space reusable for future rows. The table file doesn't shrink.",
    versions: [V1(102, "removed"), V2],
    views: [{ who: "New reader", xid: 104, sees: 120 }],
    tone: "good",
  },
];
