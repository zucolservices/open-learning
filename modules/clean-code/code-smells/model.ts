/**
 * A made-up café order module with six smells from Fowler and Beck's catalogue (Refactoring,
 * 2nd ed.), and the refactoring that addresses each.
 */

export const CODE = [
  "let config = { gst: 0.05 };                       // changed by three modules",
  "",
  "function proc2(name, phone, street, city, pin, items, coupon) {",
  "  const order = { name, phone, street, city, pin, items, coupon };",
  "  order.total = totalOf(items);",
  "  return order;",
  "}",
  "",
  "function totalOf(items) {",
  '  return items.reduce((t, i) => t + Number(i.price.replace("₹", "")), 0);',
  "}",
  "",
  "function loyaltyTier(order) {",
  "  const c = order.customer;",
  '  return c.visits > 50 && c.spend > 20000 ? "gold" : c.visits > 10 ? "silver" : "none";',
  "}",
  "",
  "function deliveryFee(order) {",
  '  switch (order.type) { case "dine-in": return 0; case "takeaway": return 0; case "delivery": return 40; }',
  "}",
  "function prepTime(order) {",
  '  switch (order.type) { case "dine-in": return 10; case "takeaway": return 8; case "delivery": return 15; }',
  "}",
];

export const REFACTORINGS = [
  "Rename Function",
  "Introduce Parameter Object",
  "Replace Primitive with Object",
  "Move Function",
  "Replace Conditional with Polymorphism",
  "Encapsulate Variable",
];

export const SMELLS: Record<number, { smell: string; fix: string; why: string }> = {
  0: {
    smell: "Global Data",
    fix: "Encapsulate Variable",
    why: "Anyone can change it from anywhere. Hide it behind a function so changes go through one place.",
  },
  2: {
    smell: "Mysterious Name + Long Parameter List",
    fix: "Introduce Parameter Object",
    why: "Seven arguments, three of which (street, city, pin) always travel together as an address. Group them, and rename proc2 to createOrder.",
  },
  9: {
    smell: "Primitive Obsession",
    fix: "Replace Primitive with Object",
    why: "Prices are strings with a rupee sign, parsed everywhere. A Money type parses once.",
  },
  13: {
    smell: "Feature Envy",
    fix: "Move Function",
    why: "loyaltyTier only uses the customer's data. It belongs on the customer.",
  },
  18: {
    smell: "Repeated Switches",
    fix: "Replace Conditional with Polymorphism",
    why: "The same switch on order.type appears twice, and a new order type means editing both. One object per order type keeps each type's rules together.",
  },
};
