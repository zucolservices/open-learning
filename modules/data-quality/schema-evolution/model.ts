/** Avro-style schema changes and what the compatibility modes say about them. */

export type Mode = "BACKWARD" | "FORWARD" | "FULL" | "NONE";
export const MODES: Mode[] = ["BACKWARD", "FORWARD", "FULL", "NONE"];

export const V1 = `{ "type": "record", "name": "Order",
  "fields": [
    { "name": "order_id", "type": "string" },
    { "name": "amount", "type": "double" },
    { "name": "channel", "type": "string", "default": "web" },
    { "name": "store_id", "type": "string" }
  ] }`;

export interface Change {
  id: string;
  label: string;
  diff: string;
  /** Can a consumer on the new schema read data written with the old one? */
  newReadsOld: boolean;
  /** Can a consumer still on the old schema read data written with the new one? */
  oldReadsNew: boolean;
  why: string;
}

export const CHANGES: Change[] = [
  {
    id: "add-default",
    label: "Add coupon, with a default",
    diff: `+ { "name": "coupon", "type": ["null", "string"], "default": null }`,
    newReadsOld: true,
    oldReadsNew: true,
    why: "Old records have no coupon, so new readers fill in null. Old readers simply ignore the extra field.",
  },
  {
    id: "add-required",
    label: "Add country, no default",
    diff: `+ { "name": "country", "type": "string" }`,
    newReadsOld: false,
    oldReadsNew: true,
    why: "A new reader meets an old record with no country and nothing to fill in. Old readers ignore it.",
  },
  {
    id: "drop-default",
    label: "Remove channel (it had a default)",
    diff: `- { "name": "channel", "type": "string", "default": "web" }`,
    newReadsOld: true,
    oldReadsNew: true,
    why: 'New readers skip channel in old records; old readers fill in "web" when it\'s missing.',
  },
  {
    id: "drop-required",
    label: "Remove store_id (no default)",
    diff: `- { "name": "store_id", "type": "string" }`,
    newReadsOld: true,
    oldReadsNew: false,
    why: "New readers skip it in old records, but an old reader expects store_id in new records and has no default.",
  },
  {
    id: "retype",
    label: "Change amount from double to string",
    diff: `~ { "name": "amount", "type": "string" }`,
    newReadsOld: false,
    oldReadsNew: false,
    why: "Neither side can turn the other's value into its own type. The usual fix is a new topic and a migration.",
  },
];

export function allowed(c: Change, m: Mode) {
  if (m === "NONE") return true;
  if (m === "BACKWARD") return c.newReadsOld;
  if (m === "FORWARD") return c.oldReadsNew;
  return c.newReadsOld && c.oldReadsNew;
}

export const UPGRADE: Record<Mode, string> = {
  BACKWARD: "Upgrade consumers first, then producers.",
  FORWARD: "Upgrade producers first, then consumers.",
  FULL: "Upgrade in any order.",
  NONE: "No checks: you coordinate every upgrade yourself.",
};
