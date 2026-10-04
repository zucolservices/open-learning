import type { TestId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface TestState {
  [key: string]: unknown;
  attached: TestId[];
  load: "clean" | "bad";
  ran: boolean;
  severity: "error" | "warn";
}

export const initialState: TestState = {
  attached: ["pk_unique"],
  load: "bad",
  ran: false,
  severity: "error",
};
