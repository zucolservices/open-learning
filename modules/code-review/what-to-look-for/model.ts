/**
 * A made-up loyalty-points pull request, and eight comments a reviewer could leave, tagged with
 * the categories from Google's "What to look for in a code review".
 */

export const DIFF = [
  " export async function checkout(order, customer) {",
  "   await payments.charge(order);",
  "+  awardPoints(order, customer);",
  "   return receipt(order);",
  " }",
  "+",
  "+function awardPoints(order, customer) {",
  "+  let pts = Math.floor(order.total / 10)",
  '+  if (order.status = "PAID") {',
  "+    customer.points += pts",
  "+    db.save(customer)",
  "+  }",
  "+  return pts",
  "+}",
];

export type Cat =
  "Design" | "Functionality" | "Tests" | "Naming" | "Comments" | "Style" | "Good things";

export const COMMENTS: { id: string; cat: Cat; text: string; weight: number }[] = [
  {
    id: "design",
    cat: "Design",
    text: "Refunds never take these points back. Should awarding points happen when an order is confirmed paid, in the order-events handler, so refunds can reverse it?",
    weight: 5,
  },
  {
    id: "bug",
    cat: "Functionality",
    text: 'order.status = "PAID" assigns instead of comparing, so every order counts as paid.',
    weight: 5,
  },
  {
    id: "tests",
    cat: "Tests",
    text: "There's no test for an unpaid or refunded order; one would have caught the line above.",
    weight: 4,
  },
  { id: "name", cat: "Naming", text: "pts → points?", weight: 1 },
  {
    id: "why",
    cat: "Comments",
    text: "A short note on why it's one point per ₹10 would help the next reader.",
    weight: 2,
  },
  { id: "semi", cat: "Style", text: "Missing semicolons on three lines.", weight: 0 },
  { id: "brace", cat: "Style", text: "I'd put the opening brace on its own line.", weight: 0 },
  {
    id: "praise",
    cat: "Good things",
    text: "Nice that this returns the points, so the receipt can show them.",
    weight: 2,
  },
];

export const LIMIT = 4;
