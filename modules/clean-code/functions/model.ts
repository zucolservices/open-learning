/**
 * One long, made-up placeOrder function split into five blocks. The learner extracts blocks into
 * named functions; the code is rebuilt so the top level reads as a list of steps.
 */

export interface Block {
  id: string;
  lines: string[];
  names: { name: string; good: boolean; note: string }[];
  args: string;
}

export const BLOCKS: Block[] = [
  {
    id: "validate",
    args: "order",
    lines: [
      '  if (!order.items.length) throw new Error("Empty order");',
      "  for (const item of order.items) {",
      '    if (item.qty <= 0) throw new Error("Bad quantity");',
      "  }",
    ],
    names: [
      { name: "validateOrder", good: true, note: "Says what it checks." },
      { name: "doChecks", good: false, note: "Which checks?" },
      { name: "step1", good: false, note: "Names the position, not the purpose." },
    ],
  },
  {
    id: "price",
    args: "order",
    lines: [
      "  let total = 0;",
      "  for (const item of order.items) total += item.price * item.qty;",
      "  if (order.customer.isStudent) total = total * 0.9;",
      "  total = Math.round(total * 1.05 * 100) / 100;",
    ],
    names: [
      { name: "calc", good: false, note: "Calculate what?" },
      {
        name: "priceWithDiscountAndGst",
        good: true,
        note: "Long, but honest about what it includes.",
      },
      { name: "getTotal", good: true, note: "Fine, if the team knows the total includes GST." },
    ],
  },
  {
    id: "save",
    args: "order, total",
    lines: [
      '  const id = db.nextId("orders");',
      '  db.insert("orders", { id, ...order, total, status: "PLACED" });',
    ],
    names: [
      { name: "saveOrder", good: true, note: "Clear." },
      { name: "handle", good: false, note: "Handles everything and nothing." },
      { name: "process", good: false, note: "Too broad." },
    ],
  },
  {
    id: "notify",
    args: "order, total",
    lines: [
      "  const body = `Thanks ${order.customer.name}! You paid ₹${total}.`;",
      '  mailer.send(order.customer.email, "Your order", body);',
    ],
    names: [
      { name: "sendReceipt", good: true, note: "And now the SMS change has an obvious home." },
      {
        name: "email",
        good: false,
        note: "A noun for an action, and ties the name to one channel.",
      },
      { name: "after", good: false, note: "After what?" },
    ],
  },
];

export function render(extracted: Record<string, number>): string[] {
  const out: string[] = ["function placeOrder(order) {"];
  for (const b of BLOCKS) {
    const n = extracted[b.id];
    if (n === undefined) out.push(...b.lines);
    else if (b.id === "price") out.push(`  const total = ${b.names[n].name}(${b.args});`);
    else out.push(`  ${b.names[n].name}(${b.args});`);
  }
  out.push("}");
  for (const b of BLOCKS) {
    const n = extracted[b.id];
    if (n === undefined) continue;
    out.push(
      "",
      `function ${b.names[n].name}(${b.args}) {`,
      ...b.lines,
      b.id === "price" ? "  return total;" : "",
      "}",
    );
  }
  return out.filter((l, i, a) => !(l === "" && a[i + 1] === "}"));
}
