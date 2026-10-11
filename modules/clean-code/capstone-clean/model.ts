/**
 * The capstone: a tangled, made-up order-total function, the problems a reader should spot, and a
 * sequence of refactorings. Every stage really runs against the same characterisation tests.
 */

type Item = { price: number; qty: number; category: number };
type Order = { items: Item[] };

export const ORIGINAL = [
  "function proc(o, f) {",
  "  let t = 0;",
  "  try {",
  "    for (const i of o.items) {",
  "      if (i.qty > 0) {",
  "        if (i.category != 3) {",
  "          t += i.price * i.qty * 1.05;",
  "        } else {",
  "          t += i.price * i.qty;",
  "        }",
  "      }",
  "    }",
  "  } catch (e) {}",
  "  if (f) t = t * 0.9;",
  "  return Math.round(t * 100) / 100;",
  "}",
];

export const PROBLEMS: Record<number, string> = {
  0: "Mysterious names and a flag argument: what are proc, o and f?",
  4: "Deep nesting: the real work sits four levels in.",
  5: "Magic number: what is category 3? (gift cards)",
  6: "Magic number 1.05, and price × qty written twice.",
  12: "Swallowed error: any failure silently returns a wrong total.",
};
export const PROBLEM_LINES: Record<number, number> = {
  0: 0,
  4: 4,
  5: 5,
  6: 6,
  8: 6,
  12: 12,
  13: 0,
};

type Fn = (o: Order, student?: boolean) => number;
const r2 = (x: number) => Math.round(x * 100) / 100;

const original: Fn = (o, f) => {
  let t = 0;
  try {
    for (const i of o.items) {
      if (i.qty > 0) {
        if (i.category != 3) t += i.price * i.qty * 1.05;
        else t += i.price * i.qty;
      }
    }
  } catch {
    /* swallowed */
  }
  if (f) t = t * 0.9;
  return r2(t);
};

const clean: Fn = (o, student) => {
  const lineTotal = (i: Item) => i.price * i.qty * (i.category === 3 ? 1 : 1.05);
  const sum = o.items.filter((i) => i.qty > 0).reduce((t, i) => t + lineTotal(i), 0);
  return r2(student ? sum * 0.9 : sum);
};

export const STAGES: { move: string; behaviour?: boolean; code: string[]; fn: Fn }[] = [
  { move: "Start: pin behaviour with tests", code: ORIGINAL, fn: original },
  {
    move: "Rename and name the constants",
    fn: original,
    code: [
      "const GIFT_CARD = 3;",
      "const GST = 0.05;",
      "const STUDENT_DISCOUNT = 0.1;",
      "",
      "function orderTotal(order, isStudent) {",
      "  let total = 0;",
      "  try {",
      "    for (const item of order.items) {",
      "      if (item.qty > 0) {",
      "        if (item.category !== GIFT_CARD) total += item.price * item.qty * (1 + GST);",
      "        else total += item.price * item.qty;",
      "      }",
      "    }",
      "  } catch (e) {}",
      "  if (isStudent) total = total * (1 - STUDENT_DISCOUNT);",
      "  return Math.round(total * 100) / 100;",
      "}",
    ],
  },
  {
    move: "Extract lineTotal, flatten with a filter",
    fn: original,
    code: [
      "function orderTotal(order, isStudent) {",
      "  let total = 0;",
      "  try {",
      "    total = order.items",
      "      .filter((item) => item.qty > 0)",
      "      .reduce((sum, item) => sum + lineTotal(item), 0);",
      "  } catch (e) {}",
      "  if (isStudent) total = total * (1 - STUDENT_DISCOUNT);",
      "  return roundToPaise(total);",
      "}",
      "",
      "const lineTotal = (item) =>",
      "  item.price * item.qty * (item.category === GIFT_CARD ? 1 : 1 + GST);",
    ],
  },
  {
    move: "Stop swallowing errors (a behaviour change, in its own commit)",
    behaviour: true,
    fn: clean,
    code: [
      "function orderTotal(order, isStudent) {",
      "  const total = order.items",
      "    .filter((item) => item.qty > 0)",
      "    .reduce((sum, item) => sum + lineTotal(item), 0);",
      "  return roundToPaise(isStudent ? total * (1 - STUDENT_DISCOUNT) : total);",
      "}",
    ],
  },
  {
    move: "Replace the flag with a named option",
    fn: clean,
    code: [
      "function orderTotal(order, { student = false } = {}) {",
      "  const total = order.items",
      "    .filter((item) => item.qty > 0)",
      "    .reduce((sum, item) => sum + lineTotal(item), 0);",
      "  return roundToPaise(student ? total * (1 - STUDENT_DISCOUNT) : total);",
      "}",
      "",
      "orderTotal(order, { student: true }); // reads clearly at the call site",
    ],
  },
];

export const TESTS: { name: string; order: Order; student?: boolean; want: number }[] = [
  {
    name: "two chais with GST cost ₹252",
    order: { items: [{ price: 120, qty: 2, category: 1 }] },
    want: 252,
  },
  {
    name: "gift cards carry no GST",
    order: { items: [{ price: 500, qty: 1, category: 3 }] },
    want: 500,
  },
  {
    name: "zero-quantity lines are ignored",
    order: { items: [{ price: 120, qty: 0, category: 1 }] },
    want: 0,
  },
  {
    name: "students get 10% off",
    order: { items: [{ price: 120, qty: 1, category: 1 }] },
    student: true,
    want: 113.4,
  },
];

export const run = (fn: Fn) =>
  TESTS.map((t) => ({ name: t.name, ok: fn(t.order, t.student) === t.want }));

export const CHECKLIST: [string, string[]][] = [
  ["Foundations", ["Names that explain", "Functions that do one job", "Comments that say why"]],
  [
    "Shape and simplicity",
    ["Let tools format", "Build for today", "Beware the wrong abstraction", "Flatten nesting"],
  ],
  [
    "Design",
    [
      "Group what changes together",
      "Principles with judgement",
      "Compose, and own your boundaries",
    ],
  ],
  [
    "Errors and edges",
    ["Never swallow errors", "Make absence explicit", "Make illegal states unrepresentable"],
  ],
  [
    "Changing code",
    ["Smells point where to look", "Refactor in small steps", "Repay debt steadily"],
  ],
  [
    "Tools and teams",
    [
      "Trust analysers, protect the signal",
      "Read what assistants write",
      "Agree conventions, record decisions",
    ],
  ],
];
