/** Everything a learner can change in this module, saved for resume. */
export interface GcpState {
  [key: string]: unknown;
  picks: Record<string, string>;
  active: string;
  tableKind: "managed" | "open";
  action: string;
  cost: Record<string, number>;
  editions: boolean;
}

export const initialState: GcpState = {
  picks: {},
  active: "ingest-db",
  tableKind: "managed",
  action: "",
  cost: { storedTB: 1, scannedTiB: 1, slots: 1, cdcGiB: 1, pubsubTiB: 0, dcu: 1 },
  editions: false,
};
