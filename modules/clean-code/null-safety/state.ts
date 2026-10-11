import type { Stage } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface NullState {
  [key: string]: unknown;
  stage: Stage;
  ran: boolean;
  lang: "ts" | "kotlin" | "rust" | "java";
}

export const initialState: NullState = { stage: "loose", ran: false, lang: "ts" };
