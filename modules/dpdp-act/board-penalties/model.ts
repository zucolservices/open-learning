/**
 * The Schedule's caps and the s.33(2) factors. The Act gives no formula: the band shown is a
 * qualitative illustration of how factors push an outcome within the cap, never an amount.
 * Penalties need a "significant" breach found after an inquiry (s.33(1)); from May 2027.
 */

export const ITEMS: { id: string; label: string; cap: string; crore: number }[] = [
  { id: "1", label: "Weak security safeguards (s.8(5))", cap: "₹250 crore", crore: 250 },
  { id: "2", label: "Failing to notify a breach (s.8(6))", cap: "₹200 crore", crore: 200 },
  { id: "3", label: "Children's data duties (s.9)", cap: "₹200 crore", crore: 200 },
  { id: "4", label: "Significant Data Fiduciary duties (s.10)", cap: "₹150 crore", crore: 150 },
  { id: "7", label: "Any other provision, e.g. notice or rights", cap: "₹50 crore", crore: 50 },
  { id: "5", label: "A person's own duties (s.15)", cap: "₹10,000", crore: 0.0001 },
];

export type Lvl = 0 | 1 | 2;

export interface Factors {
  [key: string]: Lvl | boolean;
  gravity: Lvl;
  sensitive: Lvl;
  repeat: boolean;
  gain: boolean;
  mitigation: Lvl; // 0 none, 1 slow, 2 fast
}

export const FACTOR_DEFS: {
  id: keyof Factors;
  label: string;
  clause: string;
  kind: "lvl" | "bool";
  opts?: string[];
}[] = [
  {
    id: "gravity",
    label: "Nature, gravity and duration",
    clause: "33(2)(a)",
    kind: "lvl",
    opts: ["Minor", "Moderate", "Severe"],
  },
  {
    id: "sensitive",
    label: "Type of personal data",
    clause: "33(2)(b)",
    kind: "lvl",
    opts: ["Basic", "Financial", "Health or children's"],
  },
  { id: "repeat", label: "Happened before", clause: "33(2)(c)", kind: "bool" },
  { id: "gain", label: "Gained money or avoided a loss", clause: "33(2)(d)", kind: "bool" },
  {
    id: "mitigation",
    label: "Mitigation",
    clause: "33(2)(e)",
    kind: "lvl",
    opts: ["None", "Slow", "Fast and effective"],
  },
];

/** 0..1 position within the cap, purely illustrative. */
export function band(f: Factors): number {
  let x =
    0.15 +
    0.17 * f.gravity +
    0.12 * f.sensitive +
    (f.repeat ? 0.15 : 0) +
    (f.gain ? 0.1 : 0) -
    0.1 * f.mitigation;
  x = Math.min(0.95, Math.max(0.05, x));
  return Math.round(x * 100) / 100;
}

export const TOOLKIT: [string, string][] = [
  [
    "A digital office",
    "Complaints, hearings and orders online, without people appearing in person.",
  ],
  ["Civil-court powers", "Summon people, take evidence on affidavit, inspect data and documents."],
  ["Interim orders", "Urgent directions while an inquiry runs."],
  ["Mediation", "It can send a complaint to mediation if that might resolve it."],
  [
    "Voluntary undertakings",
    "A company can promise to fix things; if accepted, proceedings on those matters stop.",
  ],
  [
    "Blocking",
    "After penalties in two or more cases, it can advise the government to block a service in India. The government decides, after a hearing.",
  ],
];
