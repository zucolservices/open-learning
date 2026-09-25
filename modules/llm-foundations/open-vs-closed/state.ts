/** Everything a learner can change in this module, saved for resume. */
export interface OpenState {
  [key: string]: unknown;
  /** Restaurant / recipe / cookbook frame. */
  frame: number;
  /** Selected model family in the licence explorer. */
  family: string;
  /** Requirements switched on in the hosting matcher. */
  reqs: string[];
}

export const initialState: OpenState = { frame: 0, family: "closed", reqs: ["quality"] };
