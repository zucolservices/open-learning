import type { Problem } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AudioState {
  [key: string]: unknown;
  problems: Problem[];
  fixes: string[];
}

export const initialState: AudioState = { problems: ["noise", "echo"], fixes: [] };
