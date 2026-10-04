/** One agent versus several, on two kinds of task. All numbers illustrative. */

export type Task = "research" | "coding";
export type Arch = "single" | "orchestrator" | "reviewers" | "swarm";

export const ARCHS: { id: Arch; label: string }[] = [
  { id: "single", label: "One agent" },
  { id: "orchestrator", label: "Lead + parallel workers" },
  { id: "reviewers", label: "One writer + reviewers" },
  { id: "swarm", label: "Free-form swarm" },
];

export function outcome(task: Task, arch: Arch, n: number) {
  if (task === "research") {
    if (arch === "single")
      return {
        time: 40,
        tokens: 4,
        quality: 68,
        conflicts: 0,
        note: "Thorough but slow: one search thread at a time.",
      };
    if (arch === "orchestrator")
      return {
        time: Math.round(40 / n + 6),
        tokens: 4 + 3 * n,
        quality: Math.round(68 + 22 * (1 - 1 / n)),
        conflicts: 0,
        note: "Workers search different angles in parallel and report back; the lead combines. A good fit.",
      };
    if (arch === "reviewers")
      return {
        time: 46,
        tokens: 7,
        quality: 74,
        conflicts: 0,
        note: "A reviewer catches gaps, but the searching is still one thread.",
      };
    return {
      time: 22,
      tokens: 26,
      quality: 66,
      conflicts: 3,
      note: "Agents chat, duplicate searches and argue; lots of tokens, little gain.",
    };
  }
  if (arch === "single")
    return {
      time: 30,
      tokens: 4,
      quality: 84,
      conflicts: 0,
      note: "One agent holds the whole design in its head: consistent.",
    };
  if (arch === "orchestrator")
    return {
      time: Math.round(30 / n + 8),
      tokens: 4 + 3 * n,
      quality: Math.max(30, 84 - 14 * (n - 1)),
      conflicts: n - 1,
      note:
        n > 1
          ? "Workers editing in parallel make clashing assumptions (different naming, duplicated helpers)."
          : "One worker is just one agent with extra overhead.",
    };
  if (arch === "reviewers")
    return {
      time: 35,
      tokens: 7,
      quality: 91,
      conflicts: 0,
      note: "Only one agent writes; reviewers add checks without clashing. Works well.",
    };
  return {
    time: 25,
    tokens: 28,
    quality: 48,
    conflicts: 5,
    note: "Everyone edits everything. Chaos.",
  };
}
