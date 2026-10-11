/**
 * A tiny test runner that really runs in the browser, for the Testing track. Tests are plain
 * functions that throw when an expectation fails, like Jest, Vitest, pytest or JUnit assertions.
 * Each test takes the implementation under test, so the same suite can run against a correct
 * version and against buggy ones.
 */

export class AssertionError extends Error {}

export function fmt(v: unknown): string {
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "number")
    return Number.isInteger(v) ? String(v) : String(Math.round(v * 1000) / 1000);
  if (v === undefined) return "undefined";
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (!Object.is(actual, expected))
        throw new AssertionError(`expected ${fmt(expected)}, received ${fmt(actual)}`);
    },
    toEqual(expected: T) {
      if (JSON.stringify(actual) !== JSON.stringify(expected))
        throw new AssertionError(`expected ${fmt(expected)}, received ${fmt(actual)}`);
    },
    toBeCloseTo(expected: number, digits = 2) {
      if (typeof actual !== "number" || Math.abs(actual - expected) >= 10 ** -digits / 2)
        throw new AssertionError(`expected about ${fmt(expected)}, received ${fmt(actual)}`);
    },
    toBeTruthy() {
      if (!actual) throw new AssertionError(`expected a truthy value, received ${fmt(actual)}`);
    },
    toThrow() {
      if (typeof actual !== "function") throw new AssertionError("expected a function");
      try {
        (actual as () => unknown)();
      } catch {
        return;
      }
      throw new AssertionError("expected it to throw, but it returned normally");
    },
  };
}

export interface Test<I> {
  name: string;
  /** The test as a reader would see it in a test file. */
  code?: string;
  run(impl: I): void;
}

export interface Outcome {
  name: string;
  ok: boolean;
  message?: string;
}

export function runTests<I>(tests: Test<I>[], impl: I): Outcome[] {
  return tests.map((t) => {
    try {
      t.run(impl);
      return { name: t.name, ok: true };
    } catch (e) {
      const message =
        e instanceof AssertionError ? e.message : `threw ${(e as Error).message ?? e}`;
      return { name: t.name, ok: false, message };
    }
  });
}
