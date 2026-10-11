import type { GlossaryEntry } from "./types";

/** Testing track glossary. `module` slugs refer to this track. */
export const testingTrack = {
  test: {
    term: "Test",
    definition:
      "A small piece of code that runs part of your program and checks the result matches what you expect. It passes or fails automatically.",
    module: "why-test",
  },
  "test-runner": {
    term: "Test runner",
    definition:
      "The tool that finds your tests, runs them and reports which passed and which failed, such as JUnit, pytest, Jest, Vitest or Go's go test.",
    module: "why-test",
  },
  "test-suite": {
    term: "Test suite",
    definition: "All the tests for a project, or a group of them run together.",
    module: "why-test",
  },
  regression: {
    term: "Regression",
    definition:
      "A bug in something that used to work, often brought back by a later change. Tests that guard against it are called regression tests.",
    module: "why-test",
  },
  "arrange-act-assert": {
    term: "Arrange, act, assert",
    definition:
      "The usual three-part shape of a test: set up the situation, do the one thing being tested, then check the result. Also written given, when, then.",
    module: "anatomy",
  },
  "equivalence-partition": {
    term: "Equivalence partition",
    definition:
      "A group of inputs the code should treat the same way, such as every order under ₹500. Testing one value from the group stands for the rest.",
    module: "choosing-cases",
  },
  "boundary-value": {
    term: "Boundary value",
    definition:
      "An input right at the edge between two partitions, like ₹499.99 and ₹500. Off-by-one mistakes show up there, so boundary value analysis tests both sides of each edge.",
    module: "choosing-cases",
  },
  "unit-test": {
    term: "Unit test",
    definition:
      "A fast test of one small piece of code, such as a function or class, on its own, without databases, networks or other slow parts.",
    module: "test-shapes",
  },
  "integration-test": {
    term: "Integration test",
    definition:
      "A test that checks pieces work together, often your code with a real database, queue or file system.",
    module: "test-shapes",
  },
  "end-to-end-test": {
    term: "End-to-end test",
    definition:
      "A test that drives the whole application the way a user would, usually through a real browser or device. Realistic but slow and fragile.",
    module: "test-shapes",
  },
  "test-double": {
    term: "Test double",
    definition:
      "A stand-in used in a test in place of a real dependency, such as a payment service or the clock. Kinds include dummies, stubs, spies, mocks and fakes.",
    module: "test-doubles",
  },
  mock: {
    term: "Mock",
    definition:
      "A test double set up with expectations about the calls it should receive, which fails the test if they don't happen. Often used loosely for any test double.",
    module: "test-doubles",
  },
  stub: {
    term: "Stub",
    definition:
      "A test double that returns canned answers, such as a payment service that always declines.",
    module: "test-doubles",
  },
  tdd: {
    term: "Test-driven development (TDD)",
    definition:
      "Writing a failing test before the code that makes it pass, then tidying up, in small repeated loops: red, green, refactor.",
    module: "tdd",
  },
  fixture: {
    term: "Fixture",
    definition:
      "The fixed setup a test relies on, such as sample data or objects created before it runs. Shared fixtures that tests change make results depend on run order.",
    module: "readable-tests",
  },
  "contract-test": {
    term: "Contract test",
    definition:
      "A test that checks two services still agree on how they talk. In consumer-driven contracts, the consumer records what it needs from an API and the provider verifies every change against it.",
    module: "contract-tests",
  },
  "visual-regression": {
    term: "Visual regression test",
    definition:
      "A test that compares a screenshot of the page with an approved one and flags any difference for a person to judge.",
    module: "ui-tests",
  },
  accessibility: {
    term: "Accessibility",
    definition:
      "Making software usable by everyone, including people who use screen readers, keyboards only, or magnification. Clear labels and correct roles are the basics.",
    module: "ui-tests",
  },
  "flaky-test": {
    term: "Flaky test",
    definition:
      "A test that sometimes passes and sometimes fails without any change to the code, usually because of timing, shared data, test order or randomness.",
    module: "flaky-tests",
  },
  "code-coverage": {
    term: "Code coverage",
    definition:
      "A measure of which parts of the code ran while the tests ran: lines, branches or conditions. It shows what was executed, not what was checked.",
    module: "coverage",
  },
  "mutation-testing": {
    term: "Mutation testing",
    definition:
      "Checking how good tests are by planting small bugs (mutants) in the code and seeing whether any test fails. A mutant no test catches reveals a gap.",
    module: "mutation-testing",
  },
  "test-data-builder": {
    term: "Test data builder",
    definition:
      "A helper that creates test objects with sensible defaults, so each test changes only the values it cares about, such as aCustomer().student().build().",
    module: "test-data",
  },
  "property-based-testing": {
    term: "Property-based testing",
    definition:
      "Testing by stating a rule that should hold for every input and letting a tool try many random inputs to break it, then shrink any failure to the smallest example.",
    module: "property-based",
  },
  fuzzing: {
    term: "Fuzzing",
    definition:
      "Feeding huge numbers of random or malformed inputs to a program to find crashes and memory errors, usually guided by which code each input reaches.",
    module: "property-based",
  },
} satisfies Record<string, GlossaryEntry>;
