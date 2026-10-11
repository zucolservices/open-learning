/** Everything a learner can change in this module, saved for resume. */
export interface LoopState {
  [key: string]: unknown;
  guess: string | null;
  frame: number;
  chunked: boolean;
}

export const initialState: LoopState = { guess: null, frame: 0, chunked: false };
