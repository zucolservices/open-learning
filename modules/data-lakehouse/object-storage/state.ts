/** Everything a learner can change in this module, saved for resume. */
export interface StorageState {
  [key: string]: unknown;
  view: "console" | "raw";
  folderCreated: boolean;
  prefix: string;
  delimiter: boolean;
  listScale: number;
  renameMode: "s3" | "hns";
  renameSize: number;
  commitStep: number;
  putMode: "plain" | "conditional";
  raceStep: number;
  fileSizeIndex: number;
  objectAge: number;
}

export const initialState: StorageState = {
  view: "console",
  folderCreated: false,
  prefix: "sales/",
  delimiter: true,
  listScale: 2,
  renameMode: "s3",
  renameSize: 1,
  commitStep: 0,
  putMode: "plain",
  raceStep: 0,
  fileSizeIndex: 0,
  objectAge: 0,
};
