/**
 * A consumer-driven contract between a made-up kitchen display (consumer) and an orders API
 * (provider). The provider team proposes changes; we work out which break the consumer, and what
 * each way of checking would have said.
 */

export const USED = ["id", "status", "items[].name"];

export type ChangeId =
  "rename-status" | "drop-legacy" | "add-eta" | "rename-name" | "status-number";

export const CHANGES: { id: ChangeId; label: string; breaks: boolean; schemaFlags: boolean }[] = [
  { id: "add-eta", label: "Add a new field, eta", breaks: false, schemaFlags: false },
  {
    id: "drop-legacy",
    label: "Remove legacyCode (the display never reads it)",
    breaks: false,
    schemaFlags: true,
  },
  { id: "rename-status", label: "Rename status to state", breaks: true, schemaFlags: true },
  {
    id: "rename-name",
    label: "Rename items[].name to items[].title",
    breaks: true,
    schemaFlags: true,
  },
  {
    id: "status-number",
    label: "Send status as a number (2) instead of text (“cooking”)",
    breaks: true,
    schemaFlags: true,
  },
];

export type Mode = "none" | "schema" | "contract";

export const MODES: { id: Mode; label: string }[] = [
  { id: "none", label: "None" },
  { id: "schema", label: "Schema" },
  { id: "contract", label: "Contract" },
];

export interface Verdict {
  where: "build" | "production" | "none";
  text: string;
}

export function verdict(c: (typeof CHANGES)[number], mode: Mode): Verdict {
  if (mode === "contract") {
    return c.breaks
      ? {
          where: "build",
          text: "Provider verification fails before deploy: the display's contract needs this field as it was.",
        }
      : {
          where: "none",
          text: "Verification passes: the display doesn't depend on it. Safe to ship.",
        };
  }
  if (mode === "schema") {
    if (c.breaks)
      return { where: "build", text: "The schema diff flags a breaking change before deploy." };
    return c.schemaFlags
      ? {
          where: "build",
          text: "Flagged as breaking, though no consumer uses it: a false alarm that blocks a safe clean-up.",
        }
      : { where: "none", text: "Additive change: passes." };
  }
  return c.breaks
    ? {
        where: "production",
        text: "Ships. The kitchen display breaks in production during dinner service.",
      }
    : { where: "none", text: "Ships, and nothing breaks, but only by luck." };
}
