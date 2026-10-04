import type { Ring } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface EaState {
  [key: string]: unknown;
  level: number;
  rings: Record<string, Ring>;
}

export const initialState: EaState = {
  level: 0,
  rings: {
    pg: "adopt",
    kafka: "trial",
    temporal: "assess",
    agent: "assess",
    esb: "caution",
    mesh: "assess",
  },
};
