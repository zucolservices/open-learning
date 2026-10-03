/** Paging through a list of orders, newest first, while it changes (illustrative). */

export type Mode = "offset" | "cursor";
export type Change = "none" | "insert" | "delete";

export const SIZE = 5;
export const INITIAL = Array.from({ length: 20 }, (_, i) => 120 - i); // order numbers, newest first

export const CHANGES: Record<Change, { label: string; note: string }> = {
  none: { label: "Nothing changes", note: "The list is the same when page 2 is fetched." },
  insert: {
    label: "3 new orders arrive",
    note: "Orders 121–123 are placed while you read page 1.",
  },
  delete: {
    label: "2 orders are cancelled",
    note: "Orders 119 and 117, both on page 1, are deleted.",
  },
};

export function after(change: Change): number[] {
  if (change === "insert") return [123, 122, 121, ...INITIAL];
  if (change === "delete") return INITIAL.filter((n) => n !== 119 && n !== 117);
  return INITIAL;
}

export const PAGE1 = INITIAL.slice(0, SIZE);

export function page2(mode: Mode, change: Change): number[] {
  const list = after(change);
  if (mode === "offset") return list.slice(SIZE, SIZE * 2);
  const last = PAGE1[PAGE1.length - 1];
  return list.filter((n) => n < last).slice(0, SIZE);
}

/** Orders older than page 1 that page 2 should have started with but jumped over. */
export function skipped(mode: Mode, change: Change): number[] {
  const p2 = page2(mode, change);
  const last = PAGE1[PAGE1.length - 1];
  return after(change).filter((n) => n < last && n > Math.max(...p2));
}

export function request(mode: Mode, page: 1 | 2): string {
  if (mode === "offset")
    return page === 1 ? "GET /orders?limit=5&offset=0" : "GET /orders?limit=5&offset=5";
  return page === 1
    ? "GET /orders?limit=5"
    : `GET /orders?limit=5&starting_after=ord_${PAGE1[PAGE1.length - 1]}`;
}
