import type { Arch, Task } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MultiState {
  [key: string]: unknown;
  task: Task;
  arch: Arch;
  n: number;
  style: "tool" | "handoff";
}

export const initialState: MultiState = { task: "research", arch: "single", n: 3, style: "tool" };
