import type { Stage } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface FormatState {
  [key: string]: unknown;
  stage: Stage;
  lang: "js" | "py" | "go" | "rust" | "java";
}

export const initialState: FormatState = { stage: "none", lang: "js" };
