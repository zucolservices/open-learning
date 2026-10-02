export type Grant = "admin" | "edit" | "secrets" | "none" | "least";

/** Everything a learner can change in this module, saved for resume. */
export interface RbacState {
  [key: string]: unknown;
  grant: Grant;
  frame: number;
}

export const initialState: RbacState = { grant: "admin", frame: 0 };
