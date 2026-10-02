/** Everything a learner can change in this module, saved for resume. */
export interface IamState {
  [key: string]: unknown;
  cloud: "aws" | "azure" | "gcp";
  request: string;
  boundary: boolean;
  readAction: number;
  readResource: number;
  writeAction: number;
  writeResource: number;
}

export const initialState: IamState = {
  cloud: "aws",
  request: "read-report",
  boundary: false,
  readAction: 0,
  readResource: 0,
  writeAction: 0,
  writeResource: 0,
};
