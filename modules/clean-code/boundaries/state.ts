import type { Provider } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface BoundState {
  [key: string]: unknown;
  port: boolean;
  provider: Provider;
  switched: boolean;
}

export const initialState: BoundState = { port: false, provider: "acme", switched: false };
