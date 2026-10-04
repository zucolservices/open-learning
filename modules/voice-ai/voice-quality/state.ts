import type { PersonaId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface QualityState {
  [key: string]: unknown;
  personas: PersonaId[];
  v2: boolean;
  hangupsContained: boolean;
}

export const initialState: QualityState = { personas: ["calm"], v2: false, hangupsContained: true };
