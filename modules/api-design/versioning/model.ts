/** Proposed changes to a members API: ship each in v1 or save it for v2 (illustrative). */

export type Where = "v1" | "v2";

export const CHANGES: { id: string; label: string; breaking: boolean; why: string }[] = [
  {
    id: "field",
    label: "Add a membership_level field to responses",
    breaking: false,
    why: "Tolerant clients ignore fields they don't know.",
  },
  {
    id: "endpoint",
    label: "Add GET /members/{id}/fines",
    breaking: false,
    why: "A new address breaks nobody.",
  },
  {
    id: "optional",
    label: "Accept an optional nickname when creating a member",
    breaking: false,
    why: "Old clients just don't send it.",
  },
  {
    id: "rename",
    label: "Rename phone to phone_number",
    breaking: true,
    why: "Every client reading phone gets nothing.",
  },
  {
    id: "remove",
    label: "Remove the fax field",
    breaking: true,
    why: "Someone, somewhere, still reads it.",
  },
  {
    id: "required",
    label: "Make date_of_birth required on create",
    breaking: true,
    why: "Old clients don't send it, so their requests start failing.",
  },
  {
    id: "type",
    label: "Change member id from a number to a string",
    breaking: true,
    why: "Typed clients fail to parse the response.",
  },
  {
    id: "validation",
    label: "Limit names to 50 characters instead of 100",
    breaking: true,
    why: "Stricter validation rejects requests that worked yesterday.",
  },
  {
    id: "default",
    label: "Change the default page size from 50 to 10",
    breaking: true,
    why: "Clients relying on the default suddenly see a fifth of the data.",
  },
];

export function outcome(where: Record<string, Where | undefined>) {
  let broken = 0;
  let wasted = 0;
  const notes: string[] = [];
  for (const c of CHANGES) {
    const w = where[c.id];
    if (!w) continue;
    if (w === "v1" && c.breaking) {
      broken++;
      notes.push(c.label);
    }
    if (w === "v2" && !c.breaking) wasted++;
  }
  return { broken, wasted, notes };
}
