/** Everything a learner can change in this module, saved for resume. */
export interface NetState {
  [key: string]: unknown;
  probe: string;
  vpc: string;
  /** Prefix length chosen for each subnet slot, or 0 if not added yet. */
  slots: Record<string, number>;
  pubRoute: "none" | "igw" | "nat";
  privRoute: "none" | "igw" | "nat";
}

export const initialState: NetState = {
  probe: "10.0.0.0/24",
  vpc: "10.0.0.0/16",
  slots: {},
  pubRoute: "none",
  privRoute: "none",
};
