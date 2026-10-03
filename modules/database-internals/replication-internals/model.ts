/**
 * PostgreSQL's synchronous_commit levels, assuming a synchronous standby is configured
 * (synchronous_standby_names set; without it, only on and off differ). Latencies are illustrative.
 */

export type Level = "off" | "local" | "remote_write" | "on" | "remote_apply";

export const LEVELS: Level[] = ["off", "local", "remote_write", "on", "remote_apply"];

/** The journey of a commit record; each level waits until a stage is reached. */
export const STAGES = [
  "Primary: in memory",
  "Primary: flushed to disk",
  "Standby: received, written to OS",
  "Standby: flushed to disk",
  "Standby: applied, visible to queries",
];

export const WAITS_FOR: Record<Level, number> = {
  off: 0,
  local: 1,
  remote_write: 2,
  on: 3,
  remote_apply: 4,
};

/** Illustrative commit latency in milliseconds: a local fsync plus a nearby standby. */
export const LATENCY: Record<Level, number> = {
  off: 0.1,
  local: 1,
  remote_write: 2.5,
  on: 3.5,
  remote_apply: 4.5,
};

export interface Outcome {
  name: string;
  ok: boolean | "partly";
  text: string;
}

export function outcomes(lv: Level): Outcome[] {
  const w = WAITS_FOR[lv];
  return [
    {
      name: "The primary crashes just after saying OK",
      ok: w >= 2 ? true : w === 1 ? "partly" : false,
      text:
        w >= 2
          ? "The standby already has it; fail over and nothing is lost."
          : w === 1
            ? "Safe once the primary restarts, but if you fail over to the standby, it may not have the last commits."
            : "The last few commits (up to three times wal_writer_delay) may vanish, as if they'd been rolled back.",
    },
    {
      name: "The primary is lost and the standby's machine crashes too",
      ok: w >= 3,
      text:
        w >= 3
          ? "The standby had flushed it to disk; it survives a reboot."
          : w === 2
            ? "The standby had only handed it to the operating system. An OS crash loses it."
            : "The standby may never have received it.",
    },
    {
      name: "The app reads from the standby right after commit",
      ok: w >= 4,
      text:
        w >= 4
          ? "The change was applied before the commit returned, so the read sees it."
          : "The standby may not have applied it yet: the read can return the old value.",
    },
  ];
}
