/**
 * The same order-repository suite run against three backends. Production runs PostgreSQL. The
 * results are scripted to show real, documented differences (an in-memory fake follows the test
 * author's assumptions; H2's PostgreSQL mode lacks some features such as ON CONFLICT), and the
 * timings are illustrative.
 */

export type Backend = "fake" | "h2" | "postgres";

export const BACKENDS: {
  id: Backend;
  label: string;
  detail: string;
  startMs: number;
  perTestMs: number;
}[] = [
  {
    id: "fake",
    label: "In-memory fake",
    detail: "A list in memory, written by the test author",
    startMs: 0,
    perTestMs: 1,
  },
  {
    id: "h2",
    label: "H2 in PostgreSQL mode",
    detail: "An in-memory database that imitates PostgreSQL",
    startMs: 300,
    perTestMs: 8,
  },
  {
    id: "postgres",
    label: "PostgreSQL in a container",
    detail: "The same database as production, thrown away afterwards",
    startMs: 2500,
    perTestMs: 15,
  },
];

export type Result = "pass" | "bug" | "false-alarm";

export const TESTS: {
  id: string;
  name: string;
  truth: string;
  results: Record<Backend, Result>;
  why: Record<Backend, string>;
}[] = [
  {
    id: "save",
    name: "saves an order and reads it back",
    truth: "Works in production.",
    results: { fake: "pass", h2: "pass", postgres: "pass" },
    why: { fake: "", h2: "", postgres: "" },
  },
  {
    id: "dup",
    name: "a second order with the same number is refused",
    truth:
      "Bug: the code doesn't handle the database's unique-constraint error, so the customer sees a crash.",
    results: { fake: "pass", h2: "bug", postgres: "bug" },
    why: {
      fake: "The fake has no unique constraint, so the duplicate is silently stored.",
      h2: "H2 enforces the constraint too, so the unhandled error shows up.",
      postgres: "The real constraint fires and the unhandled error shows up.",
    },
  },
  {
    id: "history",
    name: "order history shows amounts after the latest migration",
    truth: "Bug: a migration renamed total to amount_paise, but the query still selects total.",
    results: { fake: "pass", h2: "bug", postgres: "bug" },
    why: {
      fake: "The fake has no schema or migrations, so it never notices.",
      h2: "Running the migrations against H2 reveals the missing column.",
      postgres: "Running the migrations against the real database reveals the missing column.",
    },
  },
  {
    id: "upsert",
    name: "loyalty points are added with INSERT … ON CONFLICT",
    truth: "Works in production.",
    results: { fake: "pass", h2: "false-alarm", postgres: "pass" },
    why: {
      fake: "",
      h2: "H2's PostgreSQL mode doesn't support ON CONFLICT, so a correct query fails.",
      postgres: "",
    },
  },
];

export function totalMs(b: Backend): number {
  const x = BACKENDS.find((k) => k.id === b)!;
  return x.startMs + x.perTestMs * TESTS.length;
}
