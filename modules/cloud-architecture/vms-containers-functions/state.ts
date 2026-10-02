/** Everything a learner can change in this module, saved for resume. */
export interface ComputeState {
  [key: string]: unknown;
  model: "vm" | "container" | "function";
  traffic: "rare" | "office" | "busy";
}

export const initialState: ComputeState = { model: "vm", traffic: "office" };
