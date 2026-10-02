/** Everything a learner can change in this module, saved for resume. */
export interface DeployState {
  [key: string]: unknown;
  strategy: "RollingUpdate" | "Recreate";
  surge: number;
  unavailable: number;
  broken: boolean;
}

export const initialState: DeployState = {
  strategy: "RollingUpdate",
  surge: 3,
  unavailable: 2,
  broken: false,
};
