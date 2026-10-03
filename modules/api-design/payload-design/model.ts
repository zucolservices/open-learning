/** A payment response with six traps, each with what goes wrong and a fix (illustrative). */

// Computed live in the browser, so the learner sees real JavaScript behaviour.
export const FLOAT_SUM = String(0.1 + 0.2);
export const BIG_ID_PARSED = String(JSON.parse('{"id":9007199254740993}').id);

export const TRAPS: {
  id: string;
  bad: string;
  good: string;
  label: string;
  problem: string;
}[] = [
  {
    id: "money",
    label: "Money as a decimal",
    bad: '"amount": 0.1',
    good: '"amount": 10,\n  "currency": "inr"',
    problem: `Floating-point can't store 0.1 exactly. Add ₹0.10 and ₹0.20 in JavaScript and you get ${FLOAT_SUM}. Send whole paise (the smallest unit) as an integer, with the currency code.`,
  },
  {
    id: "date",
    label: "An ambiguous date",
    bad: '"created": "03/10/2026 2:30 PM"',
    good: '"created": "2026-10-03T14:30:00+05:30"',
    problem:
      "3 October or 10 March? Which time zone? RFC 3339 timestamps put the year first and say the offset from UTC.",
  },
  {
    id: "id",
    label: "A huge number as an ID",
    bad: '"id": 9007199254740993',
    good: '"id": "pay_9007199254740993"',
    problem: `JavaScript numbers stop being exact above 9,007,199,254,740,991. Parse this ID in a browser and you get ${BIG_ID_PARSED}: a different payment. Send IDs as strings.`,
  },
  {
    id: "status",
    label: "A magic number",
    bad: '"status": 2',
    good: '"status": "succeeded"',
    problem:
      "Is 2 success or failure? Every client needs a lookup table. Use readable values, and tell clients to expect new ones.",
  },
  {
    id: "bool",
    label: "A boolean as text",
    bad: '"refunded": "false"',
    good: '"refunded": false',
    problem:
      'The text "false" is a non-empty string, which many languages treat as true. Use JSON\'s real true and false.',
  },
  {
    id: "names",
    label: "Mixed naming",
    bad: '"PayerName": "Asha",\n  "payer_vpa": "asha@upi"',
    good: '"payer_name": "Asha",\n  "payer_vpa": "asha@upi"',
    problem:
      "Three styles in one object means guessing every field name. Pick one convention for the whole API.",
  },
];
