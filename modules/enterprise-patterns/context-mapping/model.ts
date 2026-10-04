/** The insurer's context map: nodes, and one edge per relationship pattern (illustrative). */

export const NODES: Record<
  string,
  { label: string; x: number; y: number; mud?: boolean; external?: boolean }
> = {
  policy: { label: "Policy admin (legacy)", x: 200, y: 110, mud: true },
  claims: { label: "Claims", x: 330, y: 50 },
  billing: { label: "Billing", x: 330, y: 170 },
  sales: { label: "Sales", x: 70, y: 50 },
  gateway: { label: "Payment gateway", x: 360, y: 250, external: true },
  agents: { label: "Agent portals", x: 70, y: 170 },
  marketing: { label: "Marketing analytics", x: 70, y: 250 },
  money: { label: "", x: 330, y: 110 },
};

export type Pattern =
  | "partnership"
  | "shared-kernel"
  | "customer-supplier"
  | "conformist"
  | "acl"
  | "open-host"
  | "separate-ways"
  | "mud";

export const PATTERNS: Record<
  Pattern,
  { name: string; edge: [string, string] | null; story: string; evans: string; adapts: string }
> = {
  partnership: {
    name: "Partnership",
    edge: ["claims", "billing"],
    story:
      "Claims and Billing launch a new cashless-claims feature together; one fails, both fail.",
    evans:
      "Forge a partnership between the teams… Institute a process for coordinated planning of development and joint management of integration.",
    adapts: "Both, together",
  },
  "shared-kernel": {
    name: "Shared kernel",
    edge: ["claims", "billing"],
    story: "Claims and Billing share one small Money type (amount plus currency) and its code.",
    evans:
      "Designate with an explicit boundary some subset of the domain model that the teams agree to share. Keep this kernel small.",
    adapts: "Both, by agreement",
  },
  "customer-supplier": {
    name: "Customer/supplier",
    edge: ["policy", "sales"],
    story: "Sales (downstream) needs new fields from Policy admin (upstream), which plans them in.",
    evans:
      "Establish a clear customer/supplier relationship between the two teams, meaning downstream priorities factor into upstream planning.",
    adapts: "Upstream plans for downstream",
  },
  conformist: {
    name: "Conformist",
    edge: ["gateway", "billing"],
    story:
      "The payment gateway won't change its API for one customer, so Billing uses its model as is.",
    evans:
      "Eliminate the complexity of translation between bounded contexts by slavishly adhering to the model of the upstream team.",
    adapts: "Downstream accepts upstream's model",
  },
  acl: {
    name: "Anticorruption layer",
    edge: ["policy", "claims"],
    story:
      "Claims talks to the legacy policy system through a layer that translates its messy model into Claims's own.",
    evans:
      "As a downstream client, create an isolating layer to provide your system with functionality of the upstream system in terms of your own domain model.",
    adapts: "Downstream translates, protecting itself",
  },
  "open-host": {
    name: "Open-host service + published language",
    edge: ["policy", "agents"],
    story:
      "Policy admin offers one documented API in an industry data format that all agent portals use.",
    evans:
      "Define a protocol that gives access to your subsystem as a set of services. Open the protocol so that all who need to integrate with you can use it.",
    adapts: "Upstream offers one protocol for all",
  },
  "separate-ways": {
    name: "Separate ways",
    edge: null,
    story:
      "Marketing analytics and Claims have nothing they need from each other. No integration at all.",
    evans:
      "Declare a bounded context to have no connection to the others at all, allowing developers to find simple, specialized solutions within this small scope.",
    adapts: "Nobody: no link",
  },
  mud: {
    name: "Big ball of mud",
    edge: null,
    story:
      "The legacy policy system has no clear internal model. Fence it off and don't try to model inside it.",
    evans:
      "Draw a boundary around the entire mess and designate it a big ball of mud. Do not try to apply sophisticated modeling within this context.",
    adapts: "Everyone, carefully",
  },
};
