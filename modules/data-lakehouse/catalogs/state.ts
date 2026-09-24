/** Everything a learner can change in this module, saved for resume. */
export interface CatalogState {
  [key: string]: unknown;
  withCatalog: boolean;
  moved: boolean;
  trino: "catalog" | "path";
  duckdb: "catalog" | "path";
  commits: number;
  inspect: string;
  restStep: number;
  restConflict: boolean;
  landscapeFilter: "all" | "rest" | "oss";
  branchStep: number;
}

export const initialState: CatalogState = {
  withCatalog: false,
  moved: false,
  trino: "path",
  duckdb: "path",
  commits: 0,
  inspect: "table",
  restStep: 0,
  restConflict: false,
  landscapeFilter: "all",
  branchStep: 0,
};
