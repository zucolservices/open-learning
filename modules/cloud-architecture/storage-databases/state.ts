export type Place = "std" | "ia" | "gir" | "deep" | "block" | "file";

/** Everything a learner can change in this module, saved for resume. */
export interface StorageState {
  [key: string]: unknown;
  placed: Record<string, Place>;
  lifecycle: boolean;
  managed: boolean;
  multiAz: boolean;
  oldVersion: boolean;
}

export const initialState: StorageState = {
  placed: { scans: "std", db: "std", docs: "std", backups: "std" },
  lifecycle: false,
  managed: false,
  multiAz: false,
  oldVersion: false,
};
