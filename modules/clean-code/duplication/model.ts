/**
 * The life of a shared receipt function at a made-up café: merged from three look-alikes, then
 * bent by each caller's new needs, then split back into the right pieces. Line counts are taken
 * from the snippets shown.
 */

export interface Stage {
  title: string;
  note: string;
  code: string[];
  flags: number;
  blast: string;
}

export const STAGES: Stage[] = [
  {
    title: "Three look-alike functions",
    note: "Dine-in, takeaway and delivery receipts look almost the same. Tempting to merge.",
    flags: 0,
    blast: "A change to delivery touches only delivery.",
    code: [
      "function dineInReceipt(o)   { return header(o) + lines(o) + total(o); }",
      "function takeawayReceipt(o) { return header(o) + lines(o) + total(o); }",
      "function deliveryReceipt(o) { return header(o) + lines(o) + total(o); }",
    ],
  },
  {
    title: "Merged into one",
    note: "DRY! One function, three callers. It feels great.",
    flags: 0,
    blast: "A change for one kind of order now runs for all three.",
    code: ["function receipt(o) {", "  return header(o) + lines(o) + total(o);", "}"],
  },
  {
    title: "Delivery needs a fee line",
    note: "Easiest fix: a flag.",
    flags: 1,
    blast: "Every caller must now pass isDelivery.",
    code: [
      "function receipt(o, isDelivery) {",
      "  let r = header(o) + lines(o);",
      "  if (isDelivery) r += feeLine(o);",
      "  return r + total(o);",
      "}",
    ],
  },
  {
    title: "Takeaway: packaging charge, no table number",
    note: "Another flag, and now the header needs to know too.",
    flags: 2,
    blast: "Changing the header for takeaway can break dine-in.",
    code: [
      "function receipt(o, isDelivery, isTakeaway) {",
      "  let r = isTakeaway ? headerNoTable(o) : header(o);",
      "  r += lines(o);",
      "  if (isTakeaway) r += packagingLine(o);",
      "  if (isDelivery) r += feeLine(o);",
      "  return r + total(o);",
      "}",
    ],
  },
  {
    title: "Dine-in: service charge on weekends",
    note: "A third flag, a date check, and combinations nobody tested (takeaway and delivery at once?).",
    flags: 3,
    blast: "Every change risks all three receipts. Callers pass true/false soup.",
    code: [
      "function receipt(o, isDelivery, isTakeaway, isDineIn) {",
      "  let r = isTakeaway ? headerNoTable(o) : header(o);",
      "  r += lines(o);",
      "  if (isTakeaway) r += packagingLine(o);",
      "  if (isDelivery) r += feeLine(o);",
      "  if (isDineIn && isWeekend(o.date)) r += serviceLine(o);",
      "  return r + total(o);",
      "}",
      "",
      "receipt(order, false, false, true); // which one is this?",
    ],
  },
  {
    title: "Undo the wrong abstraction",
    note: "Inline the shared function back into each caller, then keep only the pieces that really are shared.",
    flags: 0,
    blast: "Each receipt changes on its own again, and still shares the true building blocks.",
    code: [
      "function dineInReceipt(o) {",
      '  return header(o) + lines(o) + (isWeekend(o.date) ? serviceLine(o) : "") + total(o);',
      "}",
      "function takeawayReceipt(o) {",
      "  return headerNoTable(o) + lines(o) + packagingLine(o) + total(o);",
      "}",
      "function deliveryReceipt(o) {",
      "  return header(o) + lines(o) + feeLine(o) + total(o);",
      "}",
    ],
  },
];
