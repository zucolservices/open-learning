/** Everything a learner can change in this module, saved for resume. */
export interface PartState {
  [key: string]: unknown;
  partitions: number;
  slots: number;
  op: "coalesce" | "repartition";
}

export const initialState: PartState = { partitions: 8, slots: 32, op: "coalesce" };
