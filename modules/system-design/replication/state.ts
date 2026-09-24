/** Everything a learner can change in this module, saved for resume. */
export interface ReplicationState {
  [key: string]: unknown;
  lag: number;
  readStrategy: "any" | "sticky" | "leader" | "wait";
  mode: "async" | "semi" | "sync";
  remote: boolean;
  failFrame: number;
  fencing: boolean;
  topo: "single" | "multi" | "leaderless";
}

export const initialState: ReplicationState = {
  lag: 1,
  readStrategy: "any",
  mode: "async",
  remote: false,
  failFrame: 0,
  fencing: false,
  topo: "single",
};
