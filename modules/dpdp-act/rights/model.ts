/**
 * Answering a rights request end to end at a made-up app (SabziBox). Access: s.11. Correction and
 * erasure: s.12, with refusal only where data is still needed for the purpose or a law requires it.
 * Rule 8(3) keeps processing logs at least a year. Backups: the law is silent; suppress and let
 * them rotate out is a common, defensible approach.
 */

export type Kind = "access" | "erase";
export type Action = "erase" | "keep" | "rotate";

export const ACTION_LABEL: Record<Action, string> = {
  erase: "Erase now",
  keep: "Keep, say why",
  rotate: "Erase as backups rotate",
};

export interface Sys {
  id: string;
  name: string;
  holds: string;
  best: Action;
  why: string;
  shared?: string;
}

export const SYSTEMS: Sys[] = [
  {
    id: "profile",
    name: "Account and marketing profile",
    holds: "Name, phone, preferences",
    best: "erase",
    why: "Only served purposes that end with the account.",
  },
  {
    id: "order",
    name: "Open order",
    holds: "An order paid for yesterday, not yet delivered",
    best: "keep",
    why: "Still needed for the purpose: deliver what was paid for. Erase after.",
  },
  {
    id: "invoices",
    name: "Invoices",
    holds: "Tax invoices for past orders",
    best: "keep",
    why: "GST law requires keeping them.",
  },
  {
    id: "logs",
    name: "Processing logs",
    holds: "Last month's request logs",
    best: "keep",
    why: "Rule 8(3): kept at least a year from processing.",
  },
  {
    id: "sms",
    name: "SMS vendor",
    holds: "Phone number on marketing lists",
    best: "erase",
    why: "You must cause your processor to erase.",
    shared: "SMS vendor (processor): phone number",
  },
  {
    id: "support",
    name: "Help-desk vendor",
    holds: "Two old support tickets",
    best: "erase",
    why: "No remaining purpose; the vendor erases on instruction.",
    shared: "Help-desk vendor (processor): name, phone, ticket text",
  },
  {
    id: "backup",
    name: "Backups",
    holds: "35 days of snapshots",
    best: "rotate",
    why: "Suppress now so it's never restored into use; snapshots age out within 35 days.",
  },
];

export const VERIFY: { id: string; label: string; ok: boolean; why: string }[] = [
  {
    id: "otp",
    label: "A one-time code to the registered mobile number",
    ok: true,
    why: "Uses an identifier you already hold.",
  },
  {
    id: "aadhaar",
    label: "Ask them to upload an Aadhaar card",
    ok: false,
    why: "Collects more personal data than you need to verify.",
  },
  {
    id: "any",
    label: "Accept the request from any email address",
    ok: false,
    why: "Anyone could ask for someone else's data.",
  },
];
