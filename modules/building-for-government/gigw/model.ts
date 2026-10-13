/** Audit findings for a made-up department's website, each tied to a GIGW 3.0 checkpoint. */

export interface Finding {
  id: string;
  ref: string;
  problem: string;
  fix: string;
}

export const FINDINGS: Finding[] = [
  {
    id: "domain",
    ref: "5.1.21",
    problem: "The site runs on a .com address a vendor registered.",
    fix: "Move it to a gov.in address",
  },
  {
    id: "owner",
    ref: "5.1.1–5.1.2",
    problem: "Nothing shows which department owns the site.",
    fix: "Show the department's logo and ownership on every page",
  },
  {
    id: "updated",
    ref: "5.1.5",
    problem: "The homepage doesn't say when it was last updated.",
    fix: "Show the last updated or reviewed date",
  },
  {
    id: "language",
    ref: "5.4.10",
    problem: "English only, with no way to switch language.",
    fix: "Add a bilingual version with a clear language switcher, in Unicode",
  },
  {
    id: "scans",
    ref: "5.4.9",
    problem: "Notices are scanned images a screen reader can't read.",
    fix: "Publish accessible versions of every scanned document",
  },
  {
    id: "alt",
    ref: "5.2 (WCAG 1.1.1)",
    problem: "Photos and icons have no text alternatives.",
    fix: "Add text alternatives to meaningful images",
  },
  {
    id: "construction",
    ref: "5.4.8",
    problem: "The Services page says “Under construction”.",
    fix: "Remove placeholder pages until they're ready",
  },
  {
    id: "contact",
    ref: "5.1.10–5.1.11",
    problem: "No contact details or feedback form.",
    fix: "Add Contact us and a feedback mechanism",
  },
  {
    id: "audit",
    ref: "5.3.1",
    problem: "The site went live without a security audit.",
    fix: "Get a “safe to host” security audit before production",
  },
];
