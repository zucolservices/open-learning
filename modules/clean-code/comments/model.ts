/**
 * A made-up checkout file with seven comments of different kinds, and the same file after the code
 * is fixed so that most comments become unnecessary.
 */

export type Kind = "helpful" | "redundant" | "lying" | "name";

export const KINDS: { id: Kind; label: string }[] = [
  { id: "helpful", label: "Helpful" },
  { id: "redundant", label: "Repeats the code" },
  { id: "lying", label: "Lies" },
  { id: "name", label: "Should be a name" },
];

export const BEFORE: { text: string; comment?: { kind: Kind; why: string } }[] = [
  {
    text: "/** Total in rupees, including GST. Throws if the basket is empty. */",
    comment: {
      kind: "helpful",
      why: "Tells callers what they get and when it fails, without reading the body.",
    },
  },
  { text: "function total(basket, c) {" },
  { text: '  if (!basket.length) throw new Error("Empty basket");' },
  { text: "  let t = 0;" },
  {
    text: "  // loop over the items",
    comment: { kind: "redundant", why: "The for loop already says this." },
  },
  { text: "  for (let i = 0; i < basket.length; i++) {" },
  { text: "    t += basket[i].price * basket[i].qty;" },
  { text: "  }" },
  {
    text: "  // student discount: 15%",
    comment: {
      kind: "lying",
      why: "The code takes 10% off. Which is right? Now the reader must find out.",
    },
  },
  { text: "  if (c.student) t = t * 0.9;" },
  {
    text: "  // check if the customer gets loyalty points",
    comment: {
      kind: "name",
      why: "Wrap the condition in a function called earnsLoyaltyPoints and the comment is redundant.",
    },
  },
  { text: "  if (c.years > 2 && !c.blocked) addPoints(c, t);" },
  {
    text: "  // Restaurant GST is 5% with no input tax credit. Ask finance before changing.",
    comment: {
      kind: "helpful",
      why: "Explains a rule and warns the next person: things code can't say.",
    },
  },
  { text: "  return Math.round(t * 1.05 * 100) / 100;" },
  { text: "}" },
];

export const AFTER = [
  "const RESTAURANT_GST = 0.05; // No input tax credit. Ask finance before changing.",
  "const STUDENT_DISCOUNT = 0.1;",
  "",
  "/** Total in rupees, including GST. Throws if the basket is empty. */",
  "function total(basket, customer) {",
  '  if (!basket.length) throw new Error("Empty basket");',
  "  let amount = sum(basket.map((item) => item.price * item.qty));",
  "  if (customer.isStudent) amount *= 1 - STUDENT_DISCOUNT;",
  "  if (earnsLoyaltyPoints(customer)) addPoints(customer, amount);",
  "  return roundToPaise(amount * (1 + RESTAURANT_GST));",
  "}",
];
