/** A made-up list of scholarship recipients, and the steps that make it safe to publish. */

export type Step = "drop" | "age" | "area" | "small" | "format";

export const STEPS: [Step, string, string][] = [
  ["drop", "Remove names and phone numbers", "Direct identifiers never belong in open data."],
  ["age", "Replace birth dates with age bands", "A full birth date narrows people down sharply."],
  [
    "area",
    "Replace villages with the district",
    "In a small village, a few facts point to one person.",
  ],
  ["small", "Hide counts below five", "Tiny groups give individuals away even in totals."],
  ["format", "Publish as CSV with an open licence", "Usable by anyone, not a scanned PDF."],
];

export const ROWS = [
  {
    name: "R. Kumar",
    phone: "98xxxxxx12",
    dob: "14-02-2007",
    age: "18–20",
    village: "Hirapur",
    district: "Kalpanagar North",
    gender: "M",
    amount: 12000,
  },
  {
    name: "S. Bano",
    phone: "97xxxxxx45",
    dob: "03-09-2006",
    age: "18–20",
    village: "Hirapur",
    district: "Kalpanagar North",
    gender: "F",
    amount: 12000,
  },
  {
    name: "P. Naik",
    phone: "99xxxxxx08",
    dob: "22-11-2005",
    age: "18–20",
    village: "Devgaon",
    district: "Kalpanagar North",
    gender: "F",
    amount: 15000,
  },
];

export function risk(on: Set<Step>) {
  if (!on.has("drop")) return { level: 3, text: "Anyone can read who got what, and call them." };
  if (!on.has("age") && !on.has("area"))
    return {
      level: 2,
      text: "Birth date, village and gender together single out most people: in a famous US study, ZIP code, birth date and sex identified about 87% of Americans.",
    };
  if (!on.has("age") || !on.has("area"))
    return {
      level: 2,
      text: on.has("age")
        ? "The village is still there: in a small village, age band and gender can point to one person."
        : "Full birth dates are still there: with the district and gender, they single out many people.",
    };
  if (!on.has("small"))
    return {
      level: 1,
      text: "Better, but a group of two in one district and age band can still give people away.",
    };
  return {
    level: 0,
    text: "Low risk: no direct identifiers, broad categories and no tiny groups.",
  };
}
