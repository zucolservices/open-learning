/** A simplified PostgreSQL-style 8 kB slotted page (illustrative sizes). */

export const PAGE = 8192;
export const HEADER = 24;
export const POINTER = 4;
export const TUPLE_HEADER = 24; // 23 bytes on most machines, padded to 24

export type SlotState = "live" | "dead" | "unused";
export interface Slot {
  n: number; // slot number (1-based)
  size: number; // bytes the tuple occupies (0 when unused)
  state: SlotState;
  label: string;
}

export type Op = "insert" | "insertWide" | "update" | "delete" | "vacuum" | "reset";

export const START: Slot[] = [
  { n: 1, size: TUPLE_HEADER + 76, state: "live", label: "ord_1" },
  { n: 2, size: TUPLE_HEADER + 76, state: "live", label: "ord_2" },
  { n: 3, size: TUPLE_HEADER + 76, state: "live", label: "ord_3" },
];

export function used(slots: Slot[]): {
  pointers: number;
  tuples: number;
  free: number;
  dead: number;
} {
  const pointers = slots.length * POINTER;
  const tuples = slots.reduce((n, s) => n + s.size, 0);
  const dead = slots.filter((s) => s.state === "dead").reduce((n, s) => n + s.size, 0);
  return { pointers, tuples, free: PAGE - HEADER - pointers - tuples, dead };
}

function nextLabel(slots: Slot[]): string {
  const nums = slots
    .map((s) => parseInt(s.label.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  return `ord_${Math.max(3, ...nums) + 1}`;
}

function place(slots: Slot[], size: number, label: string): Slot[] {
  const reuse = slots.find((s) => s.state === "unused");
  if (reuse) return slots.map((s) => (s === reuse ? { ...s, size, state: "live", label } : s));
  return [...slots, { n: slots.length + 1, size, state: "live", label }];
}

export function apply(slots: Slot[], op: Op): { slots: Slot[]; note: string } {
  const u = used(slots);
  if (op === "reset") {
    return { slots: START, note: "A fresh page with three orders." };
  }
  if (op === "insert" || op === "insertWide") {
    const wide = op === "insertWide";
    // A wide row is TOASTed: the big value moves out of line, leaving a small pointer in the page.
    const size = wide ? TUPLE_HEADER + 100 : TUPLE_HEADER + 76;
    if (u.free < size + POINTER)
      return {
        slots,
        note: "No room left: the row goes to another page, and the free space map remembers this one is full.",
      };
    const label = nextLabel(slots);
    return {
      slots: place(slots, size, label),
      note: wide
        ? `${label} has a 6 kB note. Too wide to keep in the page, so it's compressed and moved out of line (TOAST); the page keeps a small pointer.`
        : `${label} is added at the end of the free space, and a new line pointer at the front points to it.`,
    };
  }
  if (op === "update") {
    const target = slots.find((s) => s.state === "live");
    if (!target) return { slots, note: "No live rows to update." };
    if (u.free < target.size + POINTER)
      return {
        slots,
        note: "No room for the new version on this page; it would go to another page.",
      };
    const marked = slots.map((s) => (s === target ? { ...s, state: "dead" as SlotState } : s));
    return {
      slots: place(marked, target.size, `${target.label}′`),
      note: `PostgreSQL doesn't overwrite ${target.label}: it writes a new version and marks the old one dead. Its address changes from (0,${target.n}).`,
    };
  }
  if (op === "delete") {
    const target = [...slots].reverse().find((s) => s.state === "live");
    if (!target) return { slots, note: "No live rows to delete." };
    return {
      slots: slots.map((s) => (s === target ? { ...s, state: "dead" } : s)),
      note: `${target.label} is only marked dead. Its bytes stay in the page until vacuum runs.`,
    };
  }
  // vacuum
  if (!slots.some((s) => s.state === "dead")) return { slots, note: "Nothing to clean up." };
  return {
    slots: slots.map((s) =>
      s.state === "dead" ? { ...s, size: 0, state: "unused", label: "" } : s,
    ),
    note: `Vacuum frees ${u.dead} bytes of dead rows and compacts the page. Their line pointers stay, marked unused, ready to be reused.`,
  };
}
