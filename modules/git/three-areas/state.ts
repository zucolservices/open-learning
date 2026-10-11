import { START, type FileState } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AreasState {
  [key: string]: unknown;
  files: FileState[];
  commits: number;
  log: string[];
  split: number;
}

export const initialState: AreasState = { files: START, commits: 1, log: [], split: 0 };
