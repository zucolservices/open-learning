import { BAD_DESIGN, type Design } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ConsentState {
  [key: string]: unknown;
  design: Design;
  example: "telemedicine" | "insurance";
}

export const initialState: ConsentState = { design: BAD_DESIGN, example: "telemedicine" };
