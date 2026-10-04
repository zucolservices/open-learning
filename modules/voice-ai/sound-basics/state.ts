import type { Bits, Rate } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SoundState {
  [key: string]: unknown;
  rate: Rate;
  bits: Bits;
}

export const initialState: SoundState = { rate: 44100, bits: 16 };
