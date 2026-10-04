/** Candidate pairs from a CRM and a billing system, with the truth and per-field agreement. Illustrative. */

export type Agree = "same" | "close" | "differ" | "missing";
export type Field = "name" | "email" | "phone" | "postcode" | "dob";
export const FIELDS: Field[] = ["name", "email", "phone", "postcode", "dob"];

export interface Pair {
  id: string;
  a: string;
  b: string;
  agree: Record<Field, Agree>;
  same: boolean;
  note: string;
}

export const PAIRS: Pair[] = [
  {
    id: "p1",
    a: "Asha Rao",
    b: "A. Rao",
    agree: { name: "close", email: "same", phone: "same", postcode: "same", dob: "same" },
    same: true,
    note: "Same person; billing stores initials.",
  },
  {
    id: "p2",
    a: "John Smith · SW1A",
    b: "John Smith · M1",
    agree: { name: "same", email: "differ", phone: "differ", postcode: "differ", dob: "differ" },
    same: false,
    note: "Two different John Smiths.",
  },
  {
    id: "p3",
    a: "Priya Nair",
    b: "Priya Nair-Menon",
    agree: { name: "close", email: "same", phone: "differ", postcode: "differ", dob: "same" },
    same: true,
    note: "Same person: new surname, moved house.",
  },
  {
    id: "p4",
    a: "Mohammed Khan",
    b: "Mohamed Khan",
    agree: { name: "close", email: "differ", phone: "same", postcode: "same", dob: "same" },
    same: true,
    note: "Same person, spelled differently, new email.",
  },
  {
    id: "p5",
    a: "Sam Taylor (b. 1961)",
    b: "Sam Taylor (b. 1994)",
    agree: { name: "same", email: "differ", phone: "same", postcode: "same", dob: "differ" },
    same: false,
    note: "Father and son: same house, same landline.",
  },
  {
    id: "p6",
    a: "Elena Garcia",
    b: "Elena García",
    agree: { name: "close", email: "same", phone: "missing", postcode: "same", dob: "same" },
    same: true,
    note: "Same person; one system dropped the accent.",
  },
  {
    id: "p7",
    a: "Wei Li",
    b: "Li Wei",
    agree: { name: "close", email: "missing", phone: "same", postcode: "same", dob: "same" },
    same: true,
    note: "Same person; name order differs.",
  },
  {
    id: "p8",
    a: "David Lee",
    b: "Daniel Lee",
    agree: { name: "close", email: "differ", phone: "differ", postcode: "same", dob: "differ" },
    same: false,
    note: "Neighbours with similar names.",
  },
];

/** Match weights (roughly log2 of m/u): rare agreements count a lot, common ones a little. */
export const WEIGHTS: Record<Field, Record<Agree, number>> = {
  name: { same: 4, close: 2, differ: -3, missing: 0 },
  email: { same: 10, close: 4, differ: -2, missing: 0 },
  phone: { same: 6, close: 2, differ: -2, missing: 0 },
  postcode: { same: 2, close: 1, differ: -1, missing: 0 },
  dob: { same: 6, close: 1, differ: -6, missing: 0 },
};

export type Rule = "email" | "namepost" | "weighted";

export function classify(p: Pair, rule: Rule, lo: number, hi: number) {
  if (rule === "email") return p.agree.email === "same" ? "match" : "non";
  if (rule === "namepost")
    return p.agree.name === "same" && p.agree.postcode === "same" ? "match" : "non";
  const w = weight(p);
  return w >= hi ? "match" : w >= lo ? "review" : "non";
}

export const weight = (p: Pair) => FIELDS.reduce((s, f) => s + WEIGHTS[f][p.agree[f]], 0);

/** Survivorship for Asha Rao's two records. */
export const SURVIVE: {
  field: string;
  crm: string;
  billing: string;
  crmDate: string;
  billingDate: string;
}[] = [
  { field: "name", crm: "Asha Rao", billing: "A. Rao", crmDate: "2023", billingDate: "2026" },
  {
    field: "email",
    crm: "asha@old-mail.example",
    billing: "asha.rao@example.com",
    crmDate: "2023",
    billingDate: "2026",
  },
  {
    field: "address",
    crm: "12 Park Rd",
    billing: "4 Hill St",
    crmDate: "2023",
    billingDate: "2026",
  },
];
export type SRule = "recent" | "complete" | "crm";
export const SRULES: { id: SRule; label: string }[] = [
  { id: "recent", label: "Most recent" },
  { id: "complete", label: "Most complete" },
  { id: "crm", label: "Trust CRM" },
];
export function survive(row: (typeof SURVIVE)[number], r: SRule) {
  if (r === "recent") return row.billingDate > row.crmDate ? row.billing : row.crm;
  if (r === "complete") return row.crm.length >= row.billing.length ? row.crm : row.billing;
  return row.crm;
}
