/** Everything a learner can change in this module, saved for resume. */
export interface ParquetState {
  [key: string]: unknown;
  readStep: number;
  threshold: number;
  sorted: boolean;
  columns: string[];
  encodeColumn: "status" | "order_id" | "amount";
  codec: "none" | "snappy" | "lz4" | "zstd" | "gzip";
  nestedStep: number;
}

export const initialState: ParquetState = {
  readStep: 0,
  threshold: 400,
  sorted: false,
  columns: ["amount"],
  encodeColumn: "status",
  codec: "snappy",
  nestedStep: 0,
};
