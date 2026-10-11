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
} satisfies Record<string, GlossaryEntry>;
