/**
 * The five SOLID principles applied to a made-up café's staff pay code. For each, a before and
 * after, when it helps, when it's ceremony, and a scenario where the learner decides if it's worth it.
 */

export interface Principle {
  letter: string;
  name: string;
  short: string;
  before: string[];
  after: string[];
  helps: string;
  ceremony: string;
  scenario: string;
  worth: boolean;
  why: string;
}

export const PRINCIPLES: Principle[] = [
  {
    letter: "S",
    name: "Single responsibility",
    short: "A module should be responsible to one, and only one, group of people.",
    before: [
      "class Staff {",
      "  pay()        // rules from the accountant",
      "  rotaHours()  // rules from the manager",
      "  // both use a shared regularHours() helper",
      "}",
    ],
    after: ["class PayCalculator { pay(staff) }", "class RotaReport    { hours(staff) }"],
    helps: "Two groups ask for changes to the same code for different reasons.",
    ceremony: "Splitting every class into one-method pieces “just in case”.",
    scenario:
      "The accountant changes how overtime counts, and the manager's rota report breaks, because both used the same helper.",
    worth: true,
    why: "Two different people's rules were tangled together. Separating them stops one change breaking the other.",
  },
  {
    letter: "O",
    name: "Open–closed",
    short: "Open for extension, closed for modification.",
    before: [
      "function pay(staff) {",
      "  switch (staff.type) {",
      '    case "hourly":   return staff.hours * staff.rate;',
      '    case "salaried": return staff.salary / 12;',
      "  }",
      "}",
    ],
    after: [
      "interface PayRule { pay(staff) }",
      "class Hourly   implements PayRule { … }",
      "class Salaried implements PayRule { … }",
    ],
    helps:
      "New variants arrive often, maybe from other teams, and editing the core each time is risky.",
    ceremony: "Two variants that have been stable for years.",
    scenario: "The café has had the same two pay types for six years. Nobody expects a third.",
    worth: false,
    why: "A two-case switch is simpler. Introduce pay rules when a third type actually turns up.",
  },
  {
    letter: "L",
    name: "Liskov substitution",
    short: "A subtype must work wherever its parent type is expected.",
    before: [
      "class Staff     { canCloseUp() { return true; } }",
      "class Trainee extends Staff {",
      '  canCloseUp() { throw new Error("not allowed"); }',
      "}",
    ],
    after: [
      "class Staff { canCloseUp() { return this.closeUpTrained; } }",
      "// trainees are Staff with closeUpTrained = false",
    ],
    helps: "Always: code that handles Staff shouldn't need to know which kind it got.",
    ceremony: "Rarely; this one is about correctness.",
    scenario:
      "The closing-shift scheduler crashes whenever it picks a trainee, because Trainee throws where Staff returns a value.",
    worth: true,
    why: "A subtype that breaks its parent's promises makes every caller fragile.",
  },
  {
    letter: "I",
    name: "Interface segregation",
    short: "Don't force code to depend on methods it doesn't use.",
    before: [
      "interface Worker {",
      "  cook(); serve(); driveVan();",
      "}",
      'class Rider implements Worker { cook() { throw "no" } … }',
    ],
    after: [
      "interface Cook   { cook() }",
      "interface Server { serve() }",
      "interface Driver { driveVan() }",
    ],
    helps: "Many different implementers each need a small part of a big interface.",
    ceremony: "One interface with one implementation.",
    scenario: "Delivery riders must implement cook() and serve(), which just throw errors.",
    worth: true,
    why: "Small, focused interfaces mean nobody fakes methods they can't support.",
  },
  {
    letter: "D",
    name: "Dependency inversion",
    short: "Depend on abstractions you own, not on concrete details.",
    before: ["class Payroll {", "  run() { new BankApi(SECRET).transfer(…) }", "}"],
    after: [
      "interface PaymentGateway { transfer(to, amount) }",
      "class Payroll {",
      "  constructor(gateway) { this.gateway = gateway; }",
      "}",
    ],
    helps: "You need to test without real side effects, or might swap the provider.",
    ceremony: "Wrapping every standard-library call in an interface.",
    scenario: "You want to test payroll without moving real money.",
    worth: true,
    why: "Passing the gateway in lets tests use a fake, and the bank becomes a detail.",
  },
];
