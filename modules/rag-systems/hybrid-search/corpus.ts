/**
 * A larger made-up store for hybrid search: the Kalpanagar help pages, the 2026 water rules,
 * three circulars, and the KMC forms list. Every rule, code and fee is invented.
 */
import { CORPUS } from "../_shared/corpus";
import { SECTIONS } from "../chunking/policy";
import { CIRCULARS } from "../metadata-freshness/circulars";

export interface Passage {
  id: string;
  title: string;
  text: string;
}

const FORMS: [string, string][] = [
  ["W-7", "Form W-7 is the application for a new domestic water connection."],
  [
    "W-12",
    "Form W-12 is the request to restore a disconnected water supply after arrears are paid.",
  ],
  ["W-17", "Form W-17 reports a faulty water meter and asks for a replacement."],
  ["T-3", "Form T-3 renews a trade licence for the coming financial year."],
  ["T-8", "Form T-8 transfers a trade licence to a new owner of the business."],
  ["B-2", "Form B-2 registers a birth that took place at home."],
];

export const PASSAGES: Passage[] = [
  ...CORPUS.flatMap((d) =>
    d.paras.map((t, i) => ({ id: `${d.id}-${i + 1}`, title: d.title, text: t })),
  ),
  ...SECTIONS.map(([h, b], i) => ({
    id: `rules-${i + 1}`,
    title: `Water Supply Rules 2026 · ${h}`,
    text: b,
  })),
  ...CIRCULARS.map((c) => ({ id: c.id, title: c.title, text: c.text })),
  ...FORMS.map(([code, t]) => ({ id: `form-${code}`, title: `KMC forms · ${code}`, text: t })),
];

export const QUERIES: { q: string; gold: string; note: string }[] = [
  { q: "Form W-12", gold: "form-W-12", note: "An exact code" },
  { q: "Circular 14/2026", gold: "circ-14-2026", note: "An exact number" },
  { q: "14/2026", gold: "circ-14-2026", note: "Just the number" },
  { q: "circular 9/2025", gold: "circ-09-2025", note: "An old circular's number" },
  { q: "when do they take away rubbish", gold: "waste-1", note: "Different words, same meaning" },
  { q: "कचरा कब उठाया जाता है", gold: "waste-1", note: "Another language" },
  {
    q: "Can hospitals have their water cut off for not paying?",
    gold: "rules-6",
    note: "A paraphrase",
  },
  { q: "How do I report a broken water meter?", gold: "form-W-17", note: "A paraphrase of a form" },
];
