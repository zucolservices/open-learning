import type { Fix } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ErrorState {
  [key: string]: unknown;
  fixes: Fix[];
  lang: "js" | "go" | "rust" | "java";
}

export const initialState: ErrorState = { fixes: [], lang: "js" };
