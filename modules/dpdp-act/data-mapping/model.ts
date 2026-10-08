/**
 * A made-up grocery app, SabziBox, and the places its personal data hides. Each system holds a
 * finding that only shows up when you inspect it; together they make the data map.
 */

export interface System {
  id: string;
  name: string;
  kind: "core" | "tool" | "copy";
  /** What the team believes is in it. */
  believed: string;
  /** What inspecting it reveals. */
  found: string;
  data: string;
  purpose: string;
  keep: string;
  vendor?: string;
}

export const SYSTEMS: System[] = [
  {
    id: "db",
    name: "Orders database",
    kind: "core",
    believed: "Customers and orders",
    found: "As expected: names, phone numbers, addresses, order history.",
    data: "Name, phone, address, orders",
    purpose: "Deliver orders",
    keep: "While the account is active",
  },
  {
    id: "logs",
    name: "API logs",
    kind: "core",
    believed: "Just errors and timings",
    found: "Phone numbers inside request URLs, and full addresses in debug lines.",
    data: "Phone, address",
    purpose: "Debugging, security",
    keep: "One year (to be masked)",
  },
  {
    id: "sdk",
    name: "Analytics SDK",
    kind: "tool",
    believed: "Anonymous screen counts",
    found: "A device ID, precise location and the logged-in email on every event.",
    data: "Device ID, location, email",
    purpose: "Product analytics",
    keep: "Vendor default: 2 years",
    vendor: "Analytics vendor",
  },
  {
    id: "support",
    name: "Support desk",
    kind: "tool",
    believed: "Ticket text",
    found: "Photos of Aadhaar cards that customers attached to prove their address.",
    data: "Name, phone, Aadhaar images",
    purpose: "Customer support",
    keep: "Never deleted so far",
    vendor: "Help-desk vendor",
  },
  {
    id: "warehouse",
    name: "Data warehouse",
    kind: "copy",
    believed: "Aggregated sales",
    found: "A nightly full copy of the customers table, joined to orders.",
    data: "Everything in the orders database",
    purpose: "Reporting",
    keep: "Forever, by default",
  },
  {
    id: "staging",
    name: "Staging database",
    kind: "copy",
    believed: "Test data",
    found: "Last month's production snapshot, copied for a bug hunt and never cleaned.",
    data: "Real customer records",
    purpose: "None any more",
    keep: "Should be deleted",
  },
  {
    id: "sheet",
    name: "Shared spreadsheet",
    kind: "copy",
    believed: "Not on anyone's list",
    found: "A marketing export of 40,000 phone numbers on a shared drive, link-viewable.",
    data: "Name, phone",
    purpose: "A one-off SMS campaign",
    keep: "Should be deleted",
  },
  {
    id: "backup",
    name: "Backups",
    kind: "copy",
    believed: "Disaster recovery",
    found:
      "35 days of database snapshots, including customers who have since deleted their accounts.",
    data: "Everything, including deleted users",
    purpose: "Recovery",
    keep: "35 days, then rotated",
  },
];

export type IdKind = "aadhaar" | "pan" | "passport" | "voter" | "gstin" | "upi";

export const ID_LABEL: Record<IdKind, string> = {
  aadhaar: "Aadhaar",
  pan: "PAN",
  passport: "Indian passport",
  voter: "Voter ID",
  gstin: "GSTIN",
  upi: "UPI ID",
};

/** Built-in detectors per tool for Indian identifiers, from vendor docs (October 2026). */
export const TOOLS: { id: string; name: string; who: string; covers: IdKind[]; note: string }[] = [
  {
    id: "macie",
    name: "Amazon Macie",
    who: "AWS · files in S3",
    covers: ["aadhaar", "pan"],
    note: "Needs a nearby keyword such as 'Aadhaar' to flag a number.",
  },
  {
    id: "sdp",
    name: "Sensitive Data Protection",
    who: "Google Cloud · BigQuery, storage, Cloud SQL",
    covers: ["aadhaar", "pan", "passport", "gstin"],
    note: "Formerly Cloud DLP; can also inspect images.",
  },
  {
    id: "purview",
    name: "Microsoft Purview",
    who: "Azure and Microsoft 365",
    covers: ["aadhaar", "pan", "voter", "gstin"],
    note: "Sensitive information types for DLP and its data map.",
  },
  {
    id: "presidio",
    name: "Presidio",
    who: "Open source",
    covers: ["aadhaar", "pan", "passport", "voter", "gstin"],
    note: "Now community-run. Its India recognisers are switched off by default.",
  },
];
