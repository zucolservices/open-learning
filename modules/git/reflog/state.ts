import type { Repo } from "../_shared/repo";
import { startRepo, type Entry } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ReflogState {
  [key: string]: unknown;
  repo: Repo;
  log: Entry[];
  stage: "before" | "lost" | "saved";
  savedFrom: string;
}

const s0 = startRepo();
export const initialState: ReflogState = {
  repo: s0.repo,
  log: s0.log,
  stage: "before",
  savedFrom: "",
};
