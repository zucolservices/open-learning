/** Everything a learner can change in this module, saved for resume. */
export interface SvcState {
  [key: string]: unknown;
  selectorVersion: "any" | "v1" | "v2";
  svcType: string;
  fromNs: "shop" | "admin";
  lookup: string;
}

export const initialState: SvcState = {
  selectorVersion: "any",
  svcType: "ClusterIP",
  fromNs: "shop",
  lookup: "payments",
};
