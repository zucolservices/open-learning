/** Crash and freeze reports from version 2.5 at a 5% rollout, and what to send with them (illustrative). */

export interface Issue {
  id: string;
  title: string;
  stats: string;
  tag: string;
  rank: number;
  why: string;
}

export const ISSUES: Issue[] = [
  {
    id: "settings",
    title: "Crash when rotating the settings screen",
    stats: "0.02% of users · for months",
    tag: "Stable",
    rank: 4,
    why: "Real, but rare and old. Schedule it.",
  },
  {
    id: "checkout",
    title: "Crash when tapping Pay",
    stats: "2.1% of 2.5 users · new in 2.5",
    tag: "New",
    rank: 2,
    why: "New, widespread and blocks payment. Halt the rollout and fix it now.",
  },
  {
    id: "image",
    title: "Non-fatal: a dish image failed to load and a placeholder was shown",
    stats: "3% of sessions · handled",
    tag: "Non-fatal",
    rank: 5,
    why: "Already handled gracefully; worth watching, not urgent.",
  },
  {
    id: "anr",
    title: "App not responding at launch on one budget phone model",
    stats: "9% of that model's users · regressed",
    tag: "Regressed",
    rank: 3,
    why: "Above Google Play's 8% per-model threshold, which can bring a warning for users of that phone.",
  },
  {
    id: "symbols",
    title: "A spike of crashes with unreadable stack traces",
    stats: "1.4% of users · new in 2.5",
    tag: "No symbols",
    rank: 1,
    why: "First, upload the missing symbol files (dSYMs, mapping files). Until then nobody can tell what this crash is; it might be the worst one.",
  },
];

export const ATTACH: { id: string; label: string; ok: boolean; why: string }[] = [
  {
    id: "screens",
    label: "The last few screens visited",
    ok: true,
    why: "Breadcrumbs explain how the crash happened.",
  },
  {
    id: "version",
    label: "App version, OS version and device model",
    ok: true,
    why: "Essential for grouping and reproducing.",
  },
  {
    id: "email",
    label: "The customer's email address",
    ok: false,
    why: "Personal data you don't need to fix a crash.",
  },
  {
    id: "address",
    label: "The full basket and delivery address",
    ok: false,
    why: "Far more than needed, and sensitive.",
  },
  {
    id: "orderid",
    label: "A random order reference",
    ok: true,
    why: "Lets support match a report without personal details.",
  },
];
