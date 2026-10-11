/**
 * A test-first walk through a made-up password-strength rule, one red-green-refactor step at a
 * time. Each stage carries the real function at that point, so the tests genuinely run.
 */

import { expect, runTests, type Outcome, type Test } from "../_shared/runner";

type Impl = (pw: string) => string;

export const TESTS: Test<Impl>[] = [
  {
    name: "an empty password is weak",
    code: 'expect(strength("")).toBe("weak")',
    run: (f) => expect(f("")).toBe("weak"),
  },
  {
    name: "12+ characters with a digit is strong",
    code: 'expect(strength("correcthorse7battery")).toBe("strong")',
    run: (f) => expect(f("correcthorse7battery")).toBe("strong"),
  },
  {
    name: "12+ characters without a digit is ok",
    code: 'expect(strength("correcthorsebattery")).toBe("ok")',
    run: (f) => expect(f("correcthorsebattery")).toBe("ok"),
  },
  {
    name: "short with a digit is still weak",
    code: 'expect(strength("cat7")).toBe("weak")',
    run: (f) => expect(f("cat7")).toBe("weak"),
  },
];

const missing: Impl = () => {
  throw new Error("strength is not defined");
};
const v1: Impl = () => "weak";
const v2: Impl = (pw) => (pw.length >= 12 ? "strong" : "weak");
const v3: Impl = (pw) => (pw.length < 12 ? "weak" : /\d/.test(pw) ? "strong" : "ok");

export type Phase = "list" | "red" | "green" | "refactor";

export interface Stage {
  phase: Phase;
  tests: number;
  impl: Impl;
  code: string[];
  note: string;
}

export const STAGES: Stage[] = [
  {
    phase: "list",
    tests: 0,
    impl: missing,
    code: ["// nothing yet"],
    note: "Start with a test list: the behaviours you want, in plain words. No code yet.",
  },
  {
    phase: "red",
    tests: 1,
    impl: missing,
    code: ["// nothing yet"],
    note: "Turn one item into a real test. It fails: the function doesn't even exist. Red.",
  },
  {
    phase: "green",
    tests: 1,
    impl: v1,
    code: ["function strength(pw) {", '  return "weak";', "}"],
    note: "Make it pass in the simplest way, even if it looks silly. Green.",
  },
  {
    phase: "red",
    tests: 2,
    impl: v1,
    code: ["function strength(pw) {", '  return "weak";', "}"],
    note: "The next test forces real logic: a long password with a digit should be strong.",
  },
  {
    phase: "green",
    tests: 2,
    impl: v2,
    code: [
      "function strength(pw) {",
      '  if (pw.length >= 12) return "strong";',
      '  return "weak";',
      "}",
    ],
    note: "Just enough code to pass both tests.",
  },
  {
    phase: "refactor",
    tests: 2,
    impl: v2,
    code: [
      "const MIN_LENGTH = 12;",
      "",
      "function strength(pw) {",
      '  if (pw.length >= MIN_LENGTH) return "strong";',
      '  return "weak";',
      "}",
    ],
    note: "Tidy up while green: name the magic number. Tests still pass, so behaviour is unchanged.",
  },
  {
    phase: "red",
    tests: 3,
    impl: v2,
    code: [
      "const MIN_LENGTH = 12;",
      "",
      "function strength(pw) {",
      '  if (pw.length >= MIN_LENGTH) return "strong";',
      '  return "weak";',
      "}",
    ],
    note: "Long but no digit should be only “ok”. Red again.",
  },
  {
    phase: "green",
    tests: 3,
    impl: v3,
    code: [
      "const MIN_LENGTH = 12;",
      "",
      "function strength(pw) {",
      '  if (pw.length < MIN_LENGTH) return "weak";',
      '  return /\\d/.test(pw) ? "strong" : "ok";',
      "}",
    ],
    note: "Green.",
  },
  {
    phase: "refactor",
    tests: 4,
    impl: v3,
    code: [
      "const MIN_LENGTH = 12;",
      "const hasDigit = (s) => /\\d/.test(s);",
      "",
      "function strength(pw) {",
      '  if (pw.length < MIN_LENGTH) return "weak";',
      '  return hasDigit(pw) ? "strong" : "ok";',
      "}",
    ],
    note: "Extract hasDigit for clarity, and add the last item on the list. It passes straight away: worth keeping, as it pins down a rule.",
  },
];

export const run = (st: Stage): Outcome[] => runTests(TESTS.slice(0, st.tests), st.impl);
