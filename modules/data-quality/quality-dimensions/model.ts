/** A customer table with seven planted defects, one or more per dimension. Made-up data. */

export type Dim =
  "completeness" | "uniqueness" | "validity" | "accuracy" | "timeliness" | "consistency";

export const DIMS: Record<
  Dim,
  { label: string; question: string; measure: string; example: string }
> = {
  completeness: {
    label: "Completeness",
    question: "Is everything that should be there, there?",
    measure: "% of required values not blank",
    example: "294 of 300 students have an emergency contact: 294 / 300 = 98%.",
  },
  uniqueness: {
    label: "Uniqueness",
    question: "Is each thing recorded only once?",
    measure: "real-world count ÷ record count",
    example: "500 real students, 520 records: 500 / 520 = 96.2%.",
  },
  validity: {
    label: "Validity",
    question: "Does it follow the rules: format, type, range?",
    measure: "% of values matching the definition",
    example: "Class IDs must look like AAA99; an age at entry must be 4 to 11.",
  },
  accuracy: {
    label: "Accuracy",
    question: "Is it actually true?",
    measure: "% matching the real thing or a trusted reference",
    example: "A US date read as a European one is valid but not accurate.",
  },
  timeliness: {
    label: "Timeliness",
    question: "Is it up to date enough, when it's needed?",
    measure: "time from the real event to the data",
    example: "A change given on 1 June, entered on 4 June, breaks a 2-day target.",
  },
  consistency: {
    label: "Consistency",
    question: "Do two copies of the same thing agree?",
    measure: "% agreement between representations",
    example: "Date of birth matches in the school register and the student database.",
  },
};

export const ROWS: string[][] = [
  ["C-01", "Asha Rao", "asha@example.com", "411001", "34", "2026-09-12"],
  ["C-02", "Ben Mathew", "ben@example.com", "682001", "41", "2026-08-30"],
  ["C-03", "Chitra Nair", "", "560001", "29", "2026-09-20"],
  ["C-04", "Dev Mehta", "dev@example.com", "40O0O1", "52", "2026-07-02"],
  ["C-05", "asha rao", "asha@example.com", "411001", "34", "2026-09-01"],
  ["C-06", "Esha Gupta", "esha@example.com", "110001", "214", "2026-09-15"],
  ["C-07", "Farhan Ali", "farhan@example.com", "500001", "38", "2023-01-10"],
  ["C-08", "Gita Iyer", "gita@example.com", "600001", "45", "2026-09-28"],
];
export const HEAD = ["id", "name", "email", "pincode", "age", "last_verified"];

export const DEFECTS: {
  id: string;
  cell: [number, number];
  label: string;
  dim: Dim;
  why: string;
}[] = [
  {
    id: "email",
    cell: [2, 2],
    label: "C-03 has no email address",
    dim: "completeness",
    why: "A required value is missing.",
  },
  {
    id: "dup",
    cell: [4, 1],
    label: "C-05 looks like C-01 again",
    dim: "uniqueness",
    why: "Same person, same email and pincode, recorded twice.",
  },
  {
    id: "pin",
    cell: [3, 3],
    label: "C-04's pincode is 40O0O1",
    dim: "validity",
    why: "Letter O instead of zero: pincodes are six digits.",
  },
  {
    id: "age",
    cell: [5, 4],
    label: "C-06 is 214 years old",
    dim: "validity",
    why: "Outside any possible range for age.",
  },
  {
    id: "stale",
    cell: [6, 5],
    label: "C-07 was last checked in January 2023",
    dim: "timeliness",
    why: "Nearly four years old; the address may have changed.",
  },
  {
    id: "billing",
    cell: [7, 3],
    label: "Billing has Gita at pincode 600028, the CRM says 600001",
    dim: "consistency",
    why: "Two copies of the same fact disagree.",
  },
  {
    id: "kyc",
    cell: [1, 4],
    label: "Ben's ID card shows he is 47, not 41",
    dim: "accuracy",
    why: "Valid and plausible, but not true; only an outside reference reveals it.",
  },
];
