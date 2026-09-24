/** Everything a learner can change in this module, saved for resume. */
export interface AzureState {
  [key: string]: unknown;
  picks: Record<string, string>;
  active: string;
  shortcut: boolean;
  cache: boolean;
  cost: Record<string, number>;
  reserved: boolean;
}

export const initialState: AzureState = {
  picks: {},
  active: "ingest-db",
  shortcut: false,
  cache: false,
  cost: { sku: 2, hours: 3, storedTB: 1, dbu: 1, tus: 0 },
  reserved: false,
};
