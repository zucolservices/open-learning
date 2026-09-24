/** Everything a learner can change in this module, saved for resume. */
export interface ShowdownState {
  [key: string]: unknown;
  recap: "delta" | "iceberg" | "hudi";
  ops: number; // operations run in the side-by-side simulation (0–3)
  deltaDv: boolean;
  icebergMode: "cow" | "mor";
  hudiType: "cow" | "mor";
  feature: string;
  interop: "uniform" | "xtable";
  answers: Record<string, string>; // branching scenario: question id → option id
}

export const initialState: ShowdownState = {
  recap: "delta",
  ops: 0,
  deltaDv: true,
  icebergMode: "cow",
  hudiType: "cow",
  feature: "time-travel",
  interop: "uniform",
  answers: {},
};
