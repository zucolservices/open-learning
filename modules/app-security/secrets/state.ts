import type { Home, Stage } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SecretsState {
  [key: string]: unknown;
  stage: Stage;
  home: Home;
}

export const initialState: SecretsState = { stage: "Find it", home: "repo" };
