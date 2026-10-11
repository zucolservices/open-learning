/** Everything a learner can change in this module, saved for resume. */
export interface StashState {
  [key: string]: unknown;
  way: "stash" | "worktree";
  frame: number;
}

export const initialState: StashState = { way: "stash", frame: 0 };
