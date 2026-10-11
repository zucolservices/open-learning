/**
 * A cryptic failing test and five fixes that make it readable. The test and the bug (a missing
 * ₹100 cap on a loyalty discount) are made up; each fix changes the code shown and the failure
 * message a developer would see.
 */

export type Fix = "name" | "builder" | "assert" | "shared" | "logic";

export const FIXES: { id: Fix; label: string; why: string }[] = [
  {
    id: "name",
    label: "Name it after the behaviour",
    why: "“test2” says nothing. The name is the first line of every failure report.",
  },
  {
    id: "builder",
    label: "Replace magic arguments with named setup",
    why: "mk(1, true, 3): which number is the loyalty years? Named setup says so.",
  },
  {
    id: "logic",
    label: "Write the expected value, don't compute it",
    why: "Logic in a test can share the bug it's meant to catch.",
  },
  {
    id: "shared",
    label: "Stop sharing a mutable fixture",
    why: "Another test changed the shared order total, so this one failed depending on run order. (A shared setup like this is a fixture.)",
  },
  {
    id: "assert",
    label: "One specific assertion",
    why: "A combined true/false check can only say “expected true”.",
  },
];

export function testCode(f: Fix[]): string[] {
  const has = (x: Fix) => f.includes(x);
  const lines: string[] = [];
  if (!has("shared")) lines.push("let order = sharedOrder; // also used by 6 other tests");
  lines.push(
    has("name") ? 'test("loyalty discount is capped at ₹100", () => {' : 'test("test2", () => {',
  );
  lines.push(
    has("builder")
      ? "  const customer = aCustomer().withLoyaltyYears(3).build();"
      : "  const c = mk(1, true, 3);",
  );
  if (has("shared")) lines.push("  const order = anOrder().withTotal(4000).build();");
  lines.push(`  const discount = loyaltyDiscount(${has("builder") ? "customer" : "c"}, order);`);
  if (!has("logic")) lines.push("  const max = Math.min(order.total * 0.03, 100);");
  if (has("assert")) lines.push(`  expect(discount).toBe(${has("logic") ? "100" : "max"});`);
  else
    lines.push(`  expect(discount > 0 && discount <= ${has("logic") ? "100" : "max"}).toBe(true);`);
  lines.push("});");
  return lines;
}

export function failure(f: Fix[]): string[] {
  const has = (x: Fix) => f.includes(x);
  const out = [has("name") ? "✕ loyalty discount is capped at ₹100" : "✕ test2"];
  if (!has("shared")) out.push("(passes when run alone; fails after “refund test”)");
  out.push(has("assert") ? `Expected: 100` : "Expected: true");
  out.push(has("assert") ? `Received: 120` : "Received: false");
  return out;
}

export const BUG_OPTIONS = [
  { id: "cap", label: "The ₹100 cap isn't applied: 3% of ₹4,000 is ₹120", correct: true },
  { id: "rate", label: "The discount rate is wrong" },
  { id: "years", label: "Loyalty years aren't counted" },
  { id: "flaky", label: "The test is flaky and should be retried" },
];
