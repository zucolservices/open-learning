/** Everything a learner can change in this module, saved for resume. */
export interface AwsState {
  [key: string]: unknown;
  picks: Record<string, string>;
  active: string;
  cost: Record<string, number>;
  s3tables: boolean;
}

export const initialState: AwsState = {
  picks: {},
  active: "ingest-db",
  cost: { storedGB: 2, eventsGB: 1, queries: 1, scanGB: 1, etl: 1 },
  s3tables: true,
};
