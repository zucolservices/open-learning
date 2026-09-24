/** Everything a learner can change in this module, saved for resume. */
export interface MaintenanceState {
  [key: string]: unknown;
  phoneView: "all" | "visible";
  compact: boolean;
  retention: "never" | "7" | "30" | "90";
  orphans: boolean;
  job: "compact" | "versions" | "orphans" | "metadata";
}

export const initialState: MaintenanceState = {
  phoneView: "visible",
  compact: false,
  retention: "never",
  orphans: false,
  job: "compact",
};
