/**
 * A toy model of undone work (illustrative; Fowler notes these costs can't be measured objectively).
 * Each DoD item costs a little effort now; skipping it leaves undone work behind. Undone work
 * ("debt") drags on capacity every Sprint after, like interest.
 */

export const CAPACITY = 40;
export const SPRINTS = 12;
const INTEREST = 0.15; // capacity lost per Sprint for each point of undone work
const REPAY = 0.3; // share of capacity spent repaying once the team decides to fix it

export interface DodItem {
  id: string;
  label: string;
  cost: number; // extra effort per point when included
  leftover: number; // undone work per point when skipped
}

export const ITEMS: DodItem[] = [
  { id: "review", label: "Code reviewed by a teammate", cost: 0.06, leftover: 0.1 },
  { id: "tests", label: "Automated tests written and passing", cost: 0.14, leftover: 0.2 },
  { id: "merged", label: "Merged and integrated with everyone's work", cost: 0.04, leftover: 0.1 },
  { id: "criteria", label: "Acceptance criteria checked", cost: 0.04, leftover: 0.05 },
  { id: "checks", label: "Security and accessibility checks passed", cost: 0.07, leftover: 0.1 },
];

export const ALL = ITEMS.map((i) => i.id);

export interface SprintResult {
  delivered: number;
  debt: number;
}

/** `fixAt`: from this Sprint index on, adopt the full DoD and spend part of capacity repaying. */
export function simulate(dod: string[], fixAt: number | null = null): SprintResult[] {
  let debt = 0;
  const out: SprintResult[] = [];
  for (let s = 0; s < SPRINTS; s++) {
    const cur = fixAt !== null && s >= fixAt ? ALL : dod;
    const cost = ITEMS.filter((i) => cur.includes(i.id)).reduce((a, i) => a + i.cost, 0);
    const left = ITEMS.filter((i) => !cur.includes(i.id)).reduce((a, i) => a + i.leftover, 0);
    let cap = CAPACITY - Math.min(CAPACITY, INTEREST * debt);
    let repay = 0;
    if (fixAt !== null && s >= fixAt && debt > 0) {
      repay = Math.min(debt, REPAY * cap);
      cap -= repay;
    }
    const delivered = cap / (1 + cost);
    debt += left * delivered - repay;
    out.push({ delivered, debt });
  }
  return out;
}
