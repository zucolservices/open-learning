/** Evolve a Protocol Buffers message and see how old clients read it (illustrative). */

export type Effect = "ok" | "degrades" | "broken";

export const BASE = `message Order {
  string id          = 1;
  int64  total_paise = 2;
  string status      = 3;
}`;

export const CHANGES: {
  id: string;
  label: string;
  proto: string;
  binary: Effect;
  json: Effect;
  binaryWhy: string;
  jsonWhy: string;
}[] = [
  {
    id: "add",
    label: "Add a field with a new number",
    proto: `message Order {
  string id          = 1;
  int64  total_paise = 2;
  string status      = 3;
  string coupon      = 4;   // new
}`,
    binary: "ok",
    json: "ok",
    binaryWhy: "Old code skips field 4 and carries it along as an unknown field.",
    jsonWhy: "Old clients ignore the unfamiliar coupon key.",
  },
  {
    id: "rename",
    label: "Rename status to state (same number)",
    proto: `message Order {
  string id          = 1;
  int64  total_paise = 2;
  string state       = 3;   // was status
}`,
    binary: "ok",
    json: "broken",
    binaryWhy: "The bytes only carry the number 3, so nothing changes on the wire.",
    jsonWhy: 'JSON uses names: old clients look for "status" and find nothing.',
  },
  {
    id: "renumber",
    label: "Give status a new number",
    proto: `message Order {
  string id          = 1;
  int64  total_paise = 2;
  string status      = 5;   // was 3
}`,
    binary: "broken",
    json: "ok",
    binaryWhy: "Old code expects field 3, never sees it, and shows an empty status.",
    jsonWhy: "The name is unchanged, so JSON readers don't notice.",
  },
  {
    id: "reuse",
    label: "Delete total_paise, reuse number 2 for a note",
    proto: `message Order {
  string id     = 1;
  string note   = 2;        // reused!
  string status = 3;
}`,
    binary: "broken",
    json: "degrades",
    binaryWhy:
      "Old code reads the note's bytes as if they were total_paise: garbage, or a parse failure.",
    jsonWhy: "total_paise disappears; JSON readers see it missing and default to 0.",
  },
  {
    id: "reserve",
    label: "Delete total_paise and reserve number 2",
    proto: `message Order {
  reserved 2;
  reserved "total_paise";
  string id     = 1;
  string status = 3;
}`,
    binary: "degrades",
    json: "degrades",
    binaryWhy:
      "Safe on the wire: old code just sees total_paise as 0. Whether 0 is acceptable is a contract question.",
    jsonWhy: "The key is missing, so old readers use their default.",
  },
];

export const WIRE: [string, string][] = [
  ["0a", "field 1, text"],
  ["06 6f 72 64 5f 39 34", '"ord_94"'],
  ["10", "field 2, number"],
  ["a8 b4 01", "23,080 (₹230.80)"],
  ["1a", "field 3, text"],
  ["06 70 6c 61 63 65 64", '"placed"'],
];
