/**
 * A messy snippet, its formatted version, linter findings, and the review comments a colleague
 * left. Formatting and linting remove most comments; the ones about meaning remain.
 */

export const MESSY = [
  "function  applyCoupon(order,code){",
  "    var discount=0",
  '  if(code=="SAVE10"){ discount = 10 }',
  "      else if (code == 'HALF') {discount=order.total/2}",
  "  let unused = order.id",
  "return order.total-discount }",
];

export const FORMATTED = [
  "function applyCoupon(order, code) {",
  "  var discount = 0;",
  '  if (code == "SAVE10") {',
  "    discount = 10;",
  '  } else if (code == "HALF") {',
  "    discount = order.total / 2;",
  "  }",
  "  let unused = order.id;",
  "  return order.total - discount;",
  "}",
];

export const LINTED = [
  "function applyCoupon(order, code) {",
  "  let discount = 0;",
  '  if (code === "SAVE10") {',
  "    discount = 10;",
  '  } else if (code === "HALF") {',
  "    discount = order.total / 2;",
  "  }",
  "  return order.total - discount;",
  "}",
];

export const LINT: { rule: string; msg: string }[] = [
  { rule: "eqeqeq", msg: "Use === instead of == (line 3, 5)" },
  { rule: "no-var", msg: "Unexpected var, use let or const (line 2)" },
  { rule: "no-unused-vars", msg: "'unused' is assigned a value but never used (line 8)" },
];

export type Stage = "none" | "format" | "lint";

export const REVIEW: { text: string; fixedBy: Stage | null }[] = [
  { text: "Indentation is all over the place.", fixedBy: "format" },
  { text: "Missing semicolons.", fixedBy: "format" },
  { text: "Please use double quotes consistently.", fixedBy: "format" },
  { text: "Spaces around operators, please.", fixedBy: "format" },
  { text: "Use === here.", fixedBy: "lint" },
  { text: "unused is never used.", fixedBy: "lint" },
  {
    text: "What stops someone applying HALF to a ₹50,000 catering order? Should there be a cap?",
    fixedBy: null,
  },
  {
    text: "Coupon codes are hard-coded; should they come from the promotions table?",
    fixedBy: null,
  },
];
