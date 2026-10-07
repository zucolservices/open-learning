import type { Ctl, Req, Who } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface AcState {
  [key: string]: unknown;
  on: Ctl[];
  who: Who;
  req: Req;
  model: number;
}

export const initialState: AcState = { on: ["login"], who: "ravi", req: "next", model: 0 };
