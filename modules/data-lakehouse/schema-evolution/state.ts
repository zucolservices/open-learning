/** Everything a learner can change in this module, saved for resume. */
export interface SchemaState {
  [key: string]: unknown;
  deskMode: "folder" | "table";
  evolve: boolean;
  clues: string[];
  diagnosis?: string;
  replay: "hive" | "ids";
  change: "add" | "drop" | "rename" | "reorder" | "widen";
  semi: "string" | "struct" | "variant";
}

export const initialState: SchemaState = {
  deskMode: "folder",
  evolve: false,
  clues: [],
  replay: "hive",
  change: "add",
  semi: "string",
};
