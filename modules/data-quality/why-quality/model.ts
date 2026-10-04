/** Rule-of-ten and 1-10-100 arithmetic, plus real incidents. Costs are rules of thumb, not measurements. */

/** Redman's "rule of ten": a unit of work costs 10x when its data is flawed. */
export function ruleOfTen(flawedOutOf100: number) {
  const perfect = 100 - flawedOutOf100;
  return { perfect, flawed: flawedOutOf100, cost: perfect * 1 + flawedOutOf100 * 10 };
}

export const STAGES: { id: string; label: string; cost: number; note: string }[] = [
  {
    id: "entry",
    label: "At entry",
    cost: 1,
    note: "A form refuses the value, or a check flags it as it arrives.",
  },
  {
    id: "later",
    label: "Later, inside the company",
    cost: 10,
    note: "Someone notices in a report, traces it back and corrects it: hours of work.",
  },
  {
    id: "never",
    label: "Never, until it hurts",
    cost: 100,
    note: "A customer is billed wrongly, a model learns from it, or a decision is made on it.",
  },
];

export const INCIDENTS: { who: string; when: string; what: string; check: string }[] = [
  {
    who: "Samsung Securities",
    when: "April 2018",
    what: "An employee typed 1,000 shares instead of 1,000 won per share as a dividend, creating 2.8 billion shares that only existed on paper, worth about 112 trillion won. The stock fell about 12% that day.",
    check: "A validity check: a dividend can't create more shares than the company has.",
  },
  {
    who: "Unity Software",
    when: "May 2022",
    what: "Unity said it had ingested bad data from a large customer, which, with a platform fault, damaged its ad-targeting tool. It estimated a revenue impact of about $110 million for 2022; its shares fell about 37% the next day.",
    check: "Checks and monitoring on data before it trains a model (module 19).",
  },
  {
    who: "Equifax",
    when: "March–April 2022",
    what: "A coding issue on a legacy server miscalculated credit scores for three weeks. Equifax said fewer than 300,000 people saw their score shift by 25 points or more.",
    check: "Monitoring the output: a sudden shift in a score's distribution (module 12).",
  },
];

export const USES: { data: string; uses: [string, boolean, string][] }[] = [
  {
    data: "Customer addresses with the district but no house number",
    uses: [
      ["Sales by region", true, "District is all you need."],
      ["Delivering parcels", false, "The courier needs the exact address."],
    ],
  },
  {
    data: "Sales figures refreshed once a day, overnight",
    uses: [
      ["Monthly board report", true, "Yesterday's figures are fine."],
      ["Stopping fraud as it happens", false, "A day late is far too late."],
    ],
  },
  {
    data: "Ages rounded to the nearest 5 years",
    uses: [
      ["Marketing segments", true, "Bands are what marketing uses anyway."],
      ["Checking someone is over 18", false, "17 and 18 both round to 20 or 15."],
    ],
  },
];
