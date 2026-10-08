/**
 * One withdrawal followed through a made-up app's systems (GharKaam). s.6(6): cease, and cause
 * processors to cease, within a reasonable time, unless processing is required or authorised by
 * law. s.6(5): earlier processing stays lawful; paid orders can still be fulfilled.
 */

export interface Hop {
  id: string;
  system: string;
  action: string;
  outcome: "stop" | "keep";
  why: string;
}

export const HOPS: Hop[] = [
  {
    id: "tap",
    system: "Privacy settings",
    action: "Asha taps “Withdraw” next to “Offers by SMS”.",
    outcome: "stop",
    why: "One tap to give, one tap to take back: comparable ease (s.6(4)).",
  },
  {
    id: "ledger",
    system: "Consent service",
    action: "Records the withdrawal with a timestamp and publishes a ‘consent changed’ event.",
    outcome: "stop",
    why: "Every system that relies on this consent must hear about it.",
  },
  {
    id: "campaign",
    system: "Marketing scheduler",
    action: "Drops Asha from tonight's campaign and future audiences.",
    outcome: "stop",
    why: "The purpose relied on consent, which is gone.",
  },
  {
    id: "sms",
    system: "SMS vendor (processor)",
    action: "Receives an API call to suppress Asha's number for marketing.",
    outcome: "stop",
    why: "The fiduciary must cause its processors to stop too (s.6(6)).",
  },
  {
    id: "orders",
    system: "Orders service",
    action: "Still sends the plumber booked and paid for yesterday.",
    outcome: "keep",
    why: "Withdrawal doesn't undo what was already agreed; the Act's own example says paid orders can be fulfilled.",
  },
  {
    id: "tax",
    system: "Invoices and accounts",
    action: "Keeps the invoice for the paid booking.",
    outcome: "keep",
    why: "Processing required or authorised by law, such as tax records, can continue.",
  },
  {
    id: "erase",
    system: "Marketing data",
    action: "Erases Asha's marketing profile, at GharKaam and at the vendor.",
    outcome: "stop",
    why: "Once consent is withdrawn, data kept only for that purpose must be erased (s.8(7)).",
  },
];

export const CM_FACTS: [string, string][] = [
  ["Who can be one", "A company incorporated in India, with a net worth of at least ₹2 crore."],
  ["Registered with", "The Data Protection Board. Registration opens in November 2026."],
  ["Works for", "The Data Principal, in a fiduciary capacity, not for the companies asking."],
  [
    "Can't read",
    "The personal data it helps share: the platform passes it through without reading it.",
  ],
  ["Must keep", "A record of consents given, denied or withdrawn, for at least seven years."],
  ["Mustn't", "Sub-contract its duties, or have conflicts of interest with fiduciaries."],
];

export const EXITS: { id: string; label: string; ok: boolean; why: string }[] = [
  {
    id: "toggle",
    label: "The same toggle in Settings, one tap",
    ok: true,
    why: "Same effort as giving consent.",
  },
  {
    id: "email",
    label: "Email the legal team and wait 30 days",
    ok: false,
    why: "Much harder than the one-tap yes.",
  },
  {
    id: "call",
    label: "Phone a call centre, weekdays 10 to 5",
    ok: false,
    why: "Not comparable to an in-app tap.",
  },
  {
    id: "cm",
    label: "A consent manager's dashboard, one tap",
    ok: true,
    why: "Equally easy, and works across apps (from May 2027).",
  },
];
