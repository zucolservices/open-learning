/** Everything a learner can change in this module, saved for resume. */
export interface DeltaState {
  [key: string]: unknown;
  ledgerLine: number;
  explorerSel?: string;
  anatomyCommit: string;
  anatomyAction: number;
  version: number;
  restoreTarget?: number;
  restored: boolean;
  commitCount: number;
  checkpoints: boolean;
  concMode: "append" | "conflict";
  concStep: number;
  retentionDays: number;
  vacuumed: boolean;
  dvMode: "cow" | "dv";
}

export const initialState: DeltaState = {
  ledgerLine: 4,
  anatomyCommit: "2",
  anatomyAction: 0,
  version: 0,
  restored: false,
  commitCount: 24,
  checkpoints: true,
  concMode: "append",
  concStep: 0,
  retentionDays: 7,
  vacuumed: false,
  dvMode: "cow",
};
