/**
 * Four tests that rely on a big shared fixture file, each convertible to a test data builder, and
 * two changes someone might make to the shared file. The café and its customers are made up.
 */

export const TESTS: {
  id: string;
  name: string;
  fixture: string[];
  builder: string[];
  needs: string[];
}[] = [
  {
    id: "student",
    name: "students get 10% off",
    fixture: [
      "const customer = fixtures.customers[7]; // a student, apparently",
      "expect(price(customer, 120)).toBe(108);",
    ],
    builder: [
      "const customer = aCustomer().student().build();",
      "expect(price(customer, 120)).toBe(108);",
    ],
    needs: ["c7-student"],
  },
  {
    id: "loyal",
    name: "loyalty discount is capped at ₹100",
    fixture: [
      "const customer = fixtures.customers[3];",
      "const order = fixtures.orders[12]; // ₹4,000?",
      "expect(loyaltyDiscount(customer, order)).toBe(100);",
    ],
    builder: [
      "const customer = aCustomer().withLoyaltyYears(3).build();",
      "const order = anOrder().withTotal(4000).build();",
      "expect(loyaltyDiscount(customer, order)).toBe(100);",
    ],
    needs: ["o12-total"],
  },
  {
    id: "blocked",
    name: "blocked customers can't order",
    fixture: [
      "const customer = fixtures.customers[7];",
      "customer.blocked = true; // changes the shared object!",
      "expect(() => placeOrder(customer)).toThrow();",
    ],
    builder: [
      "const customer = aCustomer().blocked().build();",
      "expect(() => placeOrder(customer)).toThrow();",
    ],
    needs: [],
  },
  {
    id: "birthday",
    name: "free dessert on your birthday",
    fixture: [
      "const customer = fixtures.customers[19]; // birthday is 11 Oct",
      'expect(offers(customer, OCT_11)).toContain("dessert");',
    ],
    builder: [
      'const customer = aCustomer().withBirthday("10-11").build();',
      'expect(offers(customer, OCT_11)).toContain("dessert");',
    ],
    needs: ["c19-birthday"],
  },
];

export const EVENTS: { id: string; label: string; breaks: string[] }[] = [
  {
    id: "c7",
    label: "A new test needs customer 7 to be a non-student, so someone edits the file",
    breaks: ["c7-student"],
  },
  { id: "order12", label: "Someone “tidies” order 12 down to ₹900", breaks: ["o12-total"] },
  { id: "parallel", label: "Run the tests in a different order", breaks: [] },
];

/** Which fixture-based tests break under the chosen events, and why. Builder tests never do. */
export function broken(converted: string[], events: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  const live = (id: string) => !converted.includes(id);
  if (events.includes("c7") && live("student")) out.student = "Customer 7 is no longer a student.";
  if (events.includes("order12") && live("loyal"))
    out.loyal = "Order 12 is now ₹900, so there's nothing to cap.";
  if (events.includes("parallel") && live("blocked") && live("student"))
    out.student =
      "Fails when it runs after “blocked customers”, which changed customer 7 in memory.";
  return out;
}

export const BUILDER = [
  "function aCustomer() {",
  '  const c = { name: "Test Customer", student: false,',
  '              loyaltyYears: 0, blocked: false, birthday: "01-01" };',
  "  return {",
  "    student() { c.student = true; return this; },",
  "    blocked() { c.blocked = true; return this; },",
  "    withLoyaltyYears(n) { c.loyaltyYears = n; return this; },",
  "    withBirthday(d) { c.birthday = d; return this; },",
  "    build: () => ({ ...c }),",
  "  };",
  "}",
];
