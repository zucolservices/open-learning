/** A home-loan event storm: the events in order, plus the other stickies around them (illustrative). */

export const EVENTS = [
  "Loan application submitted",
  "Documents uploaded",
  "Credit check completed",
  "Property valued",
  "Loan approved",
  "Offer letter sent",
  "Offer accepted",
  "Loan disbursed",
];

export type Layer = "actor" | "command" | "policy" | "external" | "read" | "hotspot";

export const LAYERS: Record<Layer, { name: string; cls: string }> = {
  actor: { name: "Actors", cls: "border-tier-gold bg-tier-gold/15" },
  command: { name: "Commands", cls: "border-viz-data bg-viz-data/15" },
  policy: { name: "Policies", cls: "border-viz-meta bg-viz-meta/15" },
  external: { name: "External systems", cls: "border-viz-remove bg-viz-remove/15" },
  read: { name: "Read models", cls: "border-viz-add bg-viz-add/15" },
  hotspot: { name: "Hot spots", cls: "border-bad border-dashed bg-bad/10" },
};

/** Extra stickies, keyed by the index of the event they sit beside. */
export const EXTRAS: { at: number; layer: Layer; text: string }[] = [
  { at: 0, layer: "actor", text: "Applicant" },
  { at: 0, layer: "command", text: "Submit application" },
  { at: 2, layer: "policy", text: "Whenever documents are uploaded, run a credit check" },
  { at: 2, layer: "external", text: "Credit bureau" },
  { at: 3, layer: "external", text: "Valuer firm" },
  { at: 3, layer: "hotspot", text: "Valuations take 9 days. Why?" },
  { at: 4, layer: "actor", text: "Underwriter" },
  { at: 4, layer: "command", text: "Approve loan" },
  { at: 4, layer: "read", text: "Applicant summary" },
  { at: 5, layer: "policy", text: "Whenever a loan is approved, send an offer letter" },
  { at: 7, layer: "external", text: "Payments system" },
  { at: 7, layer: "hotspot", text: "Who checks the seller's bank account?" },
];
