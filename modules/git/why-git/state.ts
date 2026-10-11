/** Everything a learner can change in this module, saved for resume. */
export interface WhyGitState {
  [key: string]: unknown;
  mode: "folder" | "git";
  day: number;
  model: "central" | "distributed";
  offline: boolean;
}

export const initialState: WhyGitState = {
  mode: "folder",
  day: 0,
  model: "central",
  offline: false,
};
