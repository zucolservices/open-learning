/** Everything a learner can change in this module, saved for resume. */
export interface MmState {
  [key: string]: unknown;
  /** Image-to-tokens walkthrough frame. */
  frame: number;
  /** Selected picture in the CLIP and SmolVLM steps. */
  picture: string;
  /** Image-cost calculator. */
  width: number;
  height: number;
  /** Pipelines reference frame. */
  pipe: number;
}

export const initialState: MmState = {
  frame: 0,
  picture: "bus",
  width: 1024,
  height: 768,
  pipe: 0,
};
