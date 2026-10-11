/**
 * The same loyalty-points rule written three ways, each with a different planted bug, so finding
 * one doesn't give away the next. The café and its rules are made up.
 */

export interface Version {
  id: "a" | "b" | "c";
  label: string;
  report: string;
  lines: string[];
  bug: number[];
  explain: string;
}

export const RULES =
  "1 point per ₹10 spent, rounded down per line. Gift cards earn nothing. Double points on Sundays.";

export const VERSIONS: Version[] = [
  {
    id: "a",
    label: "Version A",
    report: "Saturday orders are getting double points.",
    lines: [
      "function p(o) {",
      "  let r = 0;",
      "  for (let i = 0; i < o.l.length; i++) {",
      "    if (o.l[i].c != 3) {",
      "      r += Math.floor((o.l[i].q * o.l[i].p) / 10);",
      "    }",
      "  }",
      "  if (new Date(o.t).getDay() % 6 == 0) r *= 2;",
      "  return r;",
      "}",
    ],
    bug: [7],
    explain: "getDay() % 6 == 0 is true for Sunday (0) and Saturday (6).",
  },
  {
    id: "b",
    label: "Version B",
    report: "Gift cards are earning points.",
    lines: [
      "// calculate the points",
      "function calc(data, flag) {",
      "  let total = 0; // the total",
      "  // loop over the lines",
      "  for (const x of data.items) {",
      "    // skip gift cards",
      '    if (x.type === "giftcard" && flag) continue;',
      "    total += Math.floor((x.qty * x.price) / 10);",
      "  }",
      "  // double on sundays",
      "  if (new Date(data.date).getDay() === 0) total = total * 2;",
      "  return total;",
      "}",
    ],
    bug: [6],
    explain:
      "Gift cards are only skipped when a mysterious flag is true, and the comment doesn't say so.",
  },
  {
    id: "c",
    label: "Version C",
    report: "Customers are getting a tenth of the points they should.",
    lines: [
      "const RUPEES_PER_POINT = 100;",
      "",
      "function loyaltyPoints(order) {",
      "  const earning = order.lines.filter((line) => !line.isGiftCard);",
      "  const points = sum(earning.map(pointsForLine));",
      "  return isSunday(order.placedAt) ? points * 2 : points;",
      "}",
      "",
      "function pointsForLine(line) {",
      "  return Math.floor((line.qty * line.price) / RUPEES_PER_POINT);",
      "}",
    ],
    bug: [0, 9],
    explain:
      "RUPEES_PER_POINT should be 10. The named constant puts the rule in one obvious place.",
  },
];
