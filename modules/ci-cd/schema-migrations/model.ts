/** Renaming customer_name to full_name during a rolling deploy: two ways (illustrative app). */

export type Way = "naive" | "expand";

export interface Frame {
  title: string;
  text: string;
  /** Columns in the orders table and whether each still holds current data. */
  columns: { name: string; state: "live" | "filling" | "stale" | "gone" }[];
  /** Pods running each version: [old, new]. */
  pods: { old: number; neu: number; oldLabel: string; newLabel: string };
  /** Errors from old pods? */
  oldBroken?: boolean;
  sql?: string;
  rollback: "safe" | "unsafe";
  tone?: "good" | "bad";
}

export const FRAMES: Record<Way, Frame[]> = {
  naive: [
    {
      title: "Before: v1 everywhere",
      text: "Four pods run v1, which reads and writes customer_name.",
      columns: [{ name: "customer_name", state: "live" }],
      pods: { old: 4, neu: 0, oldLabel: "v1", newLabel: "v2" },
      rollback: "safe",
    },
    {
      title: "The migration runs first",
      text: "The deploy job renames the column so v2 can use full_name. It takes a fraction of a second.",
      columns: [{ name: "full_name", state: "live" }],
      pods: { old: 4, neu: 0, oldLabel: "v1", newLabel: "v2" },
      sql: "ALTER TABLE orders RENAME COLUMN customer_name TO full_name;",
      oldBroken: true,
      rollback: "unsafe",
      tone: "bad",
    },
    {
      title: "Old pods break mid-rollout",
      text: 'The rolling update replaces pods one at a time. Every request that reaches a v1 pod fails with: column "customer_name" does not exist.',
      columns: [{ name: "full_name", state: "live" }],
      pods: { old: 2, neu: 2, oldLabel: "v1", newLabel: "v2" },
      oldBroken: true,
      rollback: "unsafe",
      tone: "bad",
    },
    {
      title: "And you can't roll back",
      text: "Rolling the app back to v1 makes it worse: every pod is v1 now, and none can find customer_name. You need another migration, under pressure.",
      columns: [{ name: "full_name", state: "live" }],
      pods: { old: 4, neu: 0, oldLabel: "v1", newLabel: "v2" },
      oldBroken: true,
      rollback: "unsafe",
      tone: "bad",
    },
  ],
  expand: [
    {
      title: "Release A: expand",
      text: "Add the new column, empty and nullable. v1 doesn't know it exists, so nothing breaks.",
      columns: [
        { name: "customer_name", state: "live" },
        { name: "full_name", state: "filling" },
      ],
      pods: { old: 4, neu: 0, oldLabel: "v1", newLabel: "v1" },
      sql: "SET lock_timeout = '5s';\nALTER TABLE orders ADD COLUMN full_name text;",
      rollback: "safe",
    },
    {
      title: "Release B: write both, backfill",
      text: "v2 writes every name to both columns and still reads the old one. A background job copies existing rows across in batches of 10,000, pausing between batches.",
      columns: [
        { name: "customer_name", state: "live" },
        { name: "full_name", state: "filling" },
      ],
      pods: { old: 2, neu: 2, oldLabel: "v1", newLabel: "v2" },
      sql: "UPDATE orders SET full_name = customer_name\nWHERE id BETWEEN $1 AND $2 AND full_name IS NULL;",
      rollback: "safe",
    },
    {
      title: "Release C: read the new column",
      text: "With every row copied, v3 reads full_name but keeps writing both, so v2 (or a rollback to it) still works.",
      columns: [
        { name: "customer_name", state: "live" },
        { name: "full_name", state: "live" },
      ],
      pods: { old: 0, neu: 4, oldLabel: "v2", newLabel: "v3" },
      rollback: "safe",
    },
    {
      title: "Release D: stop writing the old column",
      text: "v4 only touches full_name. customer_name goes stale, but it's still there if you need to go back one release.",
      columns: [
        { name: "customer_name", state: "stale" },
        { name: "full_name", state: "live" },
      ],
      pods: { old: 0, neu: 4, oldLabel: "v3", newLabel: "v4" },
      rollback: "safe",
    },
    {
      title: "Release E: contract",
      text: "Days later, once nothing reads it, drop the old column. This is the one step you can't undo, so from here you fix forward.",
      columns: [
        { name: "customer_name", state: "gone" },
        { name: "full_name", state: "live" },
      ],
      pods: { old: 0, neu: 4, oldLabel: "v4", newLabel: "v4" },
      sql: "ALTER TABLE orders DROP COLUMN customer_name;",
      rollback: "unsafe",
      tone: "good",
    },
  ],
};

/**
 * Lock-queue model (illustrative). A 20-second report query holds a shared lock. At second 2 an
 * ALTER TABLE asks for an ACCESS EXCLUSIVE lock and waits; every later query on the table queues
 * behind it. With lock_timeout the ALTER gives up and the queue drains.
 */
export function lockQueue(
  timeout: number | null,
): { second: number; queued: number; blocked: boolean }[] {
  const PER_SECOND = 50;
  const out: { second: number; queued: number; blocked: boolean }[] = [];
  let queued = 0;
  for (let t = 0; t < 30; t++) {
    const waiting = t >= 2 && t < 20 && (timeout === null || t < 2 + timeout);
    if (waiting) queued += PER_SECOND;
    else queued = 0;
    out.push({ second: t, queued, blocked: waiting });
  }
  return out;
}
