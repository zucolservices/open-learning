/**
 * Avro schema resolution for one proposed change to a payment schema.
 * "backward": a consumer on the NEW schema can read data written with the OLD one.
 * "forward":  a consumer on the OLD schema can read data written with the NEW one.
 */
import type { Change, Mode } from "./state";

export const V1 = `{ "type": "record", "name": "Payment",
  "fields": [
    { "name": "id",       "type": "string" },
    { "name": "amount",   "type": "int" },
    { "name": "currency", "type": "string" }
  ] }`;

export const CHANGES: Record<
  Change,
  { label: string; v2: string; backward: [boolean, string]; forward: [boolean, string] }
> = {
  addNoDefault: {
    label: "Add upi_ref (no default)",
    v2: `+ { "name": "upi_ref", "type": "string" }`,
    backward: [
      false,
      "Old records have no upi_ref and the new schema gives no default: the reader fails.",
    ],
    forward: [true, "Old readers simply ignore the field they don't know."],
  },
  addDefault: {
    label: "Add upi_ref, default null",
    v2: `+ { "name": "upi_ref", "type": ["null", "string"], "default": null }`,
    backward: [true, "Old records get the default, null."],
    forward: [true, "Old readers ignore the new field."],
  },
  remove: {
    label: "Remove currency",
    v2: `- { "name": "currency", "type": "string" }`,
    backward: [true, "The new reader ignores currency in old records."],
    forward: [
      false,
      "Old readers expect currency and it has no default: they fail on new records.",
    ],
  },
  rename: {
    label: "Rename amount → amount_paise",
    v2: `~ { "name": "amount_paise", "type": "int" }`,
    backward: [
      false,
      "To Avro a rename is a removal plus an addition with no default: new readers find no amount_paise in old records.",
    ],
    forward: [false, "Old readers find no amount in new records."],
  },
  renameAlias: {
    label: "Rename, with an alias",
    v2: `~ { "name": "amount_paise", "type": "int", "aliases": ["amount"] }`,
    backward: [true, "The new reader's alias matches the old field name."],
    forward: [false, "Old readers have no alias for amount_paise."],
  },
  widen: {
    label: "Widen amount: int → long",
    v2: `~ { "name": "amount", "type": "long" }`,
    backward: [true, "Avro promotes int to long when reading."],
    forward: [false, "An old reader expecting int can't read a long."],
  },
  retype: {
    label: "Change amount: int → string",
    v2: `~ { "name": "amount", "type": "string" }`,
    backward: [false, "No promotion from int to string."],
    forward: [false, "No promotion from string to int."],
  },
};

export function allowed(c: Change, mode: Mode): boolean {
  const { backward, forward } = CHANGES[c];
  if (mode === "NONE") return true;
  if (mode === "BACKWARD") return backward[0];
  if (mode === "FORWARD") return forward[0];
  return backward[0] && forward[0];
}
