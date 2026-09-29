/** Made-up Kalpanagar circulars for the freshness exercise. Every rule and date is invented. */

export interface Circular {
  id: string;
  title: string;
  issued: string;
  effectiveFrom: string;
  department: string;
  text: string;
  /** Status once the index is synced after 1 September 2026. */
  statusNow: "current" | "superseded" | "withdrawn";
  /** Present in the source folder after the change? */
  inSource: boolean;
  /** Already in the index before the change? */
  indexedBefore: boolean;
}

export const CIRCULARS: Circular[] = [
  {
    id: "circ-09-2025",
    title: "Circular 9/2025: Bulk pickups",
    issued: "2025-03-10",
    effectiveFrom: "2025-04-01",
    department: "Solid waste",
    text: "Bulk pickups of garden waste and old furniture can be booked by calling your ward office on any working day.",
    statusNow: "withdrawn",
    inSource: false,
    indexedBefore: true,
  },
  {
    id: "circ-14-2026",
    title: "Circular 14/2026: Waste segregation",
    issued: "2026-06-02",
    effectiveFrom: "2026-06-10",
    department: "Solid waste",
    text: "Households must keep wet and dry waste separate. Handing over mixed waste attracts a fine of ₹200.",
    statusNow: "superseded",
    inSource: true,
    indexedBefore: true,
  },
  {
    id: "circ-22-2026",
    title: "Circular 22/2026: Revised fines and bulk pickups",
    issued: "2026-08-20",
    effectiveFrom: "2026-09-01",
    department: "Solid waste",
    text: "From 1 September 2026, the fine for handing over mixed waste rises to ₹500. Bulk pickups can now be booked only on the NMC citizen portal; ward offices no longer take phone bookings.",
    statusNow: "current",
    inSource: true,
    indexedBefore: false,
  },
];

export const QUESTIONS = [
  { q: "What is the fine for handing over mixed waste?", right: "500", wrong: "200" },
  {
    q: "How do I book a bulk pickup for old furniture?",
    right: "portal",
    wrong: "call your ward office|by calling",
  },
];
