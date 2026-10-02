export type Strategy = "forever" | "skip" | "retryDlq" | "retryTopics";
export type ErrorKind = "permanent" | "transient";

/** Everything a learner can change in this module, saved for resume. */
export interface DlqState {
  [key: string]: unknown;
  strategy: Strategy;
  error: ErrorKind;
  jitter: boolean;
}

export const initialState: DlqState = { strategy: "forever", error: "permanent", jitter: false };
