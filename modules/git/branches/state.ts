import { commit, init, type Repo } from "../_shared/repo";

/** Everything a learner can change in this module, saved for resume. */
export interface BranchState {
  [key: string]: unknown;
  repo: Repo;
  n: number;
  dflt: "master" | "main";
}

export const initialState: BranchState = {
  repo: commit(commit(init("First menu"), "Add prices"), "Fix typo"),
  n: 0,
  dflt: "master",
};
