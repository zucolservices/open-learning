/**
 * A made-up bill function refactored in six small, named steps (each a refactoring from Fowler's
 * catalogue), versus one big rewrite that slips in two behaviour changes. Every version really runs
 * against the same four tests.
 */

type Item = { price: number; qty: number };
type Order = { items: Item[]; student?: boolean };
type Bill = (o: Order) => number;

export interface Version {
  name: string;
  code: string[];
  fn: Bill;
}

const round2 = (x: number) => Math.round(x * 100) / 100;

export const SMALL: Version[] = [
  {
    name: "Start",
    code: [
      "function bill(o) {",
      "  let t = 0;",
      "  for (let i = 0; i < o.items.length; i++) { t = t + o.items[i].price * o.items[i].qty; }",
      "  if (o.student) t = t - t * 0.1;",
      "  t = t + t * 0.05;",
      "  return Math.round(t * 100) / 100;",
      "}",
    ],
    fn: (o) => {
      let t = 0;
      for (let i = 0; i < o.items.length; i++) t = t + o.items[i].price * o.items[i].qty;
      if (o.student) t = t - t * 0.1;
      t = t + t * 0.05;
      return Math.round(t * 100) / 100;
    },
  },
  {
    name: "Rename Variable",
    code: [
      "function bill(order) {",
      "  let total = 0;",
      "  for (let i = 0; i < order.items.length; i++) { total = total + order.items[i].price * order.items[i].qty; }",
      "  if (order.student) total = total - total * 0.1;",
      "  total = total + total * 0.05;",
      "  return Math.round(total * 100) / 100;",
      "}",
    ],
    fn: (o) => {
      let total = 0;
      for (let i = 0; i < o.items.length; i++) total = total + o.items[i].price * o.items[i].qty;
      if (o.student) total = total - total * 0.1;
      total = total + total * 0.05;
      return Math.round(total * 100) / 100;
    },
  },
  {
    name: "Replace Loop with Pipeline",
    code: [
      "function bill(order) {",
      "  let total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);",
      "  if (order.student) total = total - total * 0.1;",
      "  total = total + total * 0.05;",
      "  return Math.round(total * 100) / 100;",
      "}",
    ],
    fn: (o) => {
      let total = o.items.reduce((s, i) => s + i.price * i.qty, 0);
      if (o.student) total = total - total * 0.1;
      total = total + total * 0.05;
      return Math.round(total * 100) / 100;
    },
  },
  {
    name: "Replace Magic Literal",
    code: [
      "const STUDENT_DISCOUNT = 0.1;",
      "const GST = 0.05;",
      "",
      "function bill(order) {",
      "  let total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);",
      "  if (order.student) total = total * (1 - STUDENT_DISCOUNT);",
      "  total = total * (1 + GST);",
      "  return Math.round(total * 100) / 100;",
      "}",
    ],
    fn: (o) => {
      let total = o.items.reduce((s, i) => s + i.price * i.qty, 0);
      if (o.student) total = total * (1 - 0.1);
      total = total * (1 + 0.05);
      return Math.round(total * 100) / 100;
    },
  },
  {
    name: "Extract Function",
    code: [
      "function bill(order) {",
      "  const discounted = applyStudentDiscount(order, subtotal(order));",
      "  return roundToPaise(discounted * (1 + GST));",
      "}",
      "",
      "const subtotal = (order) => order.items.reduce((sum, item) => sum + item.price * item.qty, 0);",
      "const applyStudentDiscount = (order, amount) => (order.student ? amount * (1 - STUDENT_DISCOUNT) : amount);",
      "const roundToPaise = (x) => Math.round(x * 100) / 100;",
    ],
    fn: (o) => {
      const sub = o.items.reduce((s, i) => s + i.price * i.qty, 0);
      const d = o.student ? sub * (1 - 0.1) : sub;
      return round2(d * (1 + 0.05));
    },
  },
];

export const LEAP: Version = {
  name: "Big rewrite",
  code: [
    "const GST = 0.05;",
    "",
    "function bill({ items, student }) {",
    "  const sum = items.reduce((s, i) => s + i.price * i.qty, 0);",
    "  return (student ? sum - 10 : sum) * (1 + GST);",
    "}",
  ],
  fn: ({ items, student }) => {
    const sum = items.reduce((s, i) => s + i.price * i.qty, 0);
    return (student ? sum - 10 : sum) * (1 + 0.05);
  },
};

export const TESTS: { name: string; order: Order; want: number }[] = [
  { name: "two chais cost ₹252", order: { items: [{ price: 120, qty: 2 }] }, want: 252 },
  {
    name: "student chai costs ₹113.40",
    order: { items: [{ price: 120, qty: 1 }], student: true },
    want: 113.4,
  },
  { name: "empty order costs ₹0", order: { items: [] }, want: 0 },
  { name: "rounded to the paisa", order: { items: [{ price: 33.33, qty: 1 }] }, want: 35 },
];

export const runAll = (fn: Bill) =>
  TESTS.map((t) => ({ name: t.name, got: fn(t.order), ok: fn(t.order) === t.want, want: t.want }));
