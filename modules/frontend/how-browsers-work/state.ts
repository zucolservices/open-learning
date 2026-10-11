import type { ScriptMode } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PipeState {
  [key: string]: unknown;
  change: string | null;
  tried: string[];
  script: ScriptMode;
}

export const initialState: PipeState = { change: null, tried: [], script: "blocking" };
