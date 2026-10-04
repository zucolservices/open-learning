/** Everything a learner can change in this module, saved for resume. */
export interface ClusterState {
  [key: string]: unknown;
  executors: number;
  cores: number;
  lose: boolean;
}

export const initialState: ClusterState = { executors: 2, cores: 2, lose: false };
