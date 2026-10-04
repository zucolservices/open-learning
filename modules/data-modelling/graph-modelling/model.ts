/** A small fraud graph: accounts linked through shared phones, devices and addresses. Made up. */

export interface GNode {
  id: string;
  kind: "account" | "phone" | "device" | "address";
  x: number;
  y: number;
  label: string;
}

export const NODES: GNode[] = [
  { id: "A1", kind: "account", x: 40, y: 60, label: "A1 (flagged)" },
  { id: "P1", kind: "phone", x: 110, y: 30, label: "phone …4410" },
  { id: "A2", kind: "account", x: 180, y: 60, label: "A2" },
  { id: "D1", kind: "device", x: 240, y: 120, label: "device 7f3c" },
  { id: "A3", kind: "account", x: 180, y: 170, label: "A3" },
  { id: "AD1", kind: "address", x: 110, y: 210, label: "12 Lake Rd" },
  { id: "A4", kind: "account", x: 40, y: 170, label: "A4" },
  { id: "A5", kind: "account", x: 300, y: 30, label: "A5" },
  { id: "AD2", kind: "address", x: 360, y: 80, label: "4 Hill St" },
  { id: "A6", kind: "account", x: 330, y: 160, label: "A6" },
];

export const EDGES: [string, string, string][] = [
  ["A1", "P1", "USES_PHONE"],
  ["A2", "P1", "USES_PHONE"],
  ["A2", "D1", "USES_DEVICE"],
  ["A3", "D1", "USES_DEVICE"],
  ["A3", "AD1", "LIVES_AT"],
  ["A4", "AD1", "LIVES_AT"],
  ["A5", "AD2", "LIVES_AT"],
  ["A6", "AD2", "LIVES_AT"],
];

/** Accounts reachable from A1 within `hops` account-to-account steps (through one shared identifier per step). */
export function reach(hops: number) {
  const accounts = new Set(["A1"]);
  const ids = new Set<string>();
  let frontier = ["A1"];
  for (let h = 0; h < hops; h++) {
    const next: string[] = [];
    for (const a of frontier) {
      for (const [x, y] of EDGES) {
        if (x !== a) continue;
        ids.add(y);
        for (const [x2, y2] of EDGES)
          if (y2 === y && !accounts.has(x2)) {
            accounts.add(x2);
            next.push(x2);
          }
      }
    }
    frontier = next;
  }
  return { accounts, ids };
}

export function cypher(hops: number) {
  return `MATCH (flagged:Account {id: 'A1'})
      -[:USES_PHONE|USES_DEVICE|LIVES_AT*1..${hops * 2}]-(other:Account)
RETURN DISTINCT other.id`;
}

export function sql(hops: number) {
  const parts: string[] = [
    "SELECT DISTINCT a" + hops + ".account_id",
    "FROM account_identifier a0",
  ];
  for (let h = 1; h <= hops; h++) {
    parts.push(`JOIN account_identifier s${h} ON s${h}.identifier = a${h - 1}.identifier`);
    parts.push(`JOIN account_identifier a${h} ON a${h}.account_id = s${h}.account_id`);
  }
  parts.push("WHERE a0.account_id = 'A1'");
  return parts.join("\n");
}

export const PG = `(:Person {name: 'Asha'})
   -[:KNOWS {since: 2019}]->
(:Person {name: 'Ben'})`;

export const RDF = `<ex:asha> <ex:name>  "Asha" .
<ex:ben>  <ex:name>  "Ben" .
<ex:asha> <ex:knows> <ex:ben> .
# "since 2019" is a fact about the triple itself:
# RDF 1.2 (a Candidate Recommendation) adds triple terms for this.`;
