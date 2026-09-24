/** Everything a learner can change in this module, saved for resume. */
export interface AcidState {
  [key: string]: unknown;
  letter: "A" | "C" | "I" | "D";
  withPromise: boolean;
  opA: string;
  opB: string;
  level: "serializable" | "writeserializable";
  labStep: number;
  skewStep: number;
  skewLevel: "serializable" | "writeserializable";
  store: "s3" | "adls" | "gcs";
  format: "delta" | "iceberg" | "hudi";
}

export const initialState: AcidState = {
  letter: "A",
  withPromise: false,
  opA: "insert",
  opB: "insert",
  level: "writeserializable",
  labStep: 0,
  skewStep: 0,
  skewLevel: "writeserializable",
  store: "s3",
  format: "delta",
};
