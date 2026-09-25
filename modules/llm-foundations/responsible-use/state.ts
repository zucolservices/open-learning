/** Everything a learner can change in this module, saved for resume. */
export interface ResponsibleState {
  [key: string]: unknown;
  /** Story walkthrough frame. */
  frame: number;
  /** Chosen option id per decision id. */
  choices: Record<string, string>;
  /** Which decision the scenario is showing. */
  at: number;
  /** Name-swap probe: model and case. */
  model: string;
  probeCase: string;
}

export const initialState: ResponsibleState = {
  frame: 0,
  choices: {},
  at: 0,
  model: "llama",
  probeCase: "clear",
};
