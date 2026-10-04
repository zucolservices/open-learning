import type { ApproachId, LayerId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface PlatformsState {
  [key: string]: unknown;
  approach: ApproachId;
  layer: LayerId | null;
}

export const initialState: PlatformsState = { approach: "specialist", layer: null };
