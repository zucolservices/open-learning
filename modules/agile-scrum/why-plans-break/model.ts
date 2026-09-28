/**
 * "Learn early or learn late": a year-long build of a citizen portal with six features. Each
 * feature hides a surprise that only real users reveal, and only once they can use it. Fixing a
 * surprise costs more the longer other work has been built on top of the mistake. Illustrative
 * numbers: the shape (later usually costs more) is well supported; the exact multipliers aren't.
 */

export const WEEKS = 52;
const FEEDBACK = 2; // weeks of real use before a surprise is noticed
const REWORK_BASE = 1; // weeks to fix a surprise found straight away
const REWORK_PER_WEEK = 0.15; // extra weeks of rework per week the mistake sat in the product

export interface Feature {
  id: string;
  built: number; // week the feature is finished
  label: string;
  surprise: string;
}

export const FEATURES: Feature[] = [
  {
    id: "login",
    built: 6,
    label: "Sign-in",
    surprise: "OTPs go to one shared family phone, so half the household can't sign in.",
  },
  {
    id: "apply",
    built: 14,
    label: "Application form",
    surprise: "Most people fill it in on a phone; the desktop-first form is unusable.",
  },
  {
    id: "language",
    built: 22,
    label: "Help text",
    surprise: "Many applicants want Kannada; the text was written only in English.",
  },
  {
    id: "upload",
    built: 30,
    label: "Document upload",
    surprise: "Photos of documents are too large to upload on a slow connection.",
  },
  {
    id: "status",
    built: 38,
    label: "Status tracking",
    surprise: "People want an SMS when the status changes, not a page to check.",
  },
  {
    id: "certificate",
    built: 46,
    label: "Certificate",
    surprise: "Offices need a printable copy with a verifiable QR code.",
  },
];

export const CADENCES: [number, string][] = [
  [52, "Once, at the end"],
  [13, "Every quarter"],
  [4, "Every month"],
  [2, "Every two weeks"],
];

export interface Found {
  feature: Feature;
  found: number; // week the surprise is noticed
  lag: number; // weeks the mistake sat in the product
  rework: number; // weeks to fix
  afterLaunch: boolean;
}

export interface Plan {
  releases: number[];
  found: Found[];
  firstValue: number;
  rework: number;
  overhead: number;
  afterLaunch: number;
}

export function simulate(every: number, automated: boolean): Plan {
  const releases: number[] = [];
  for (let w = every; w <= WEEKS; w += every) releases.push(w);
  if (releases[releases.length - 1] !== WEEKS) releases.push(WEEKS);
  const found = FEATURES.map((f) => {
    const release = releases.find((r) => r >= f.built)!;
    const week = release + FEEDBACK;
    const lag = week - f.built;
    return {
      feature: f,
      found: week,
      lag,
      rework: REWORK_BASE + REWORK_PER_WEEK * lag,
      afterLaunch: week > WEEKS,
    };
  });
  const perRelease = automated ? 0.05 : 0.25; // weeks of testing and deployment per release
  const firstShipped = releases.find((r) => r >= FEATURES[0].built)!;
  return {
    releases,
    found,
    firstValue: firstShipped,
    rework: found.reduce((a, x) => a + x.rework, 0),
    overhead: releases.length * perRelease,
    afterLaunch: found.filter((x) => x.found > WEEKS).length,
  };
}
