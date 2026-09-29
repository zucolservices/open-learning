/** Everything a learner can change in this module, saved for resume. */
export interface ParsingState {
  [key: string]: unknown;
  doc: "two" | "table" | "scan";
  diag: Record<string, string>;
  fixed: Record<string, boolean>;
  ocr: "none" | "eng" | "hin";
  tool: string;
  read: "across" | "down";
}

export const initialState: ParsingState = {
  doc: "two",
  diag: {},
  fixed: {},
  ocr: "none",
  tool: "",
  read: "across",
};
