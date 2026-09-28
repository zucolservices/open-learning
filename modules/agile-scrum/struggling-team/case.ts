/**
 * The struggling team's evidence and the changes a learner can try. Flow data comes from the
 * Kanban board simulation in module 13 (`../kanban-wip/model`), so the charts behave like a real
 * system. Team, notes and quotes are illustrative.
 */
import { DAYS, simulate, type BoardOptions, type Result } from "../kanban-wip/model";

export const BEFORE = simulate(99, 99);
const last = BEFORE.days[DAYS - 1];
export const BOARD = {
  todo: last.todo.length,
  dev: last.dev.length,
  test: last.test.length,
  done: last.done.length,
  oldest: BEFORE.oldestAge,
};

export interface Change {
  id: string;
  label: string;
  note: string;
  apply?: (o: { dev: number; test: number; opts: BoardOptions }) => void;
}

export const CHANGES: Change[] = [
  {
    id: "wip",
    label: "WIP limits: at most 5 items in Develop, 2 in Test",
    note: "Stop starting, start finishing: new work waits until something moves on.",
    apply: (o) => {
      o.dev = 5;
      o.test = 2;
    },
  },
  {
    id: "swarm",
    label: "Developers help with testing when Test is full",
    note: "The whole team owns quality; the lone tester stops being the only way through.",
    apply: (o) => {
      o.opts.testers = 1.6;
    },
  },
  {
    id: "split",
    label: "Split big stories into thinner slices",
    note: "Smaller items flow faster and get feedback sooner.",
    apply: (o) => {
      o.opts.size = 0.7;
    },
  },
  {
    id: "route",
    label: "Route side requests through the Product Owner",
    note: "Fewer surprise arrivals; the PO decides what matters most.",
    apply: (o) => {
      o.opts.bursts = false;
    },
  },
  {
    id: "safety",
    label: "Run retros with the Prime Directive; the manager joins only for the last part",
    note: "Helps people raise problems. Not part of the flow model, but it's how the other problems get heard.",
  },
  {
    id: "overtime",
    label: "Everyone works late until the backlog is cleared",
    note: "Not modelled as a gain: long hours cut output per hour and add mistakes, and the pile-up returns.",
  },
  {
    id: "tool",
    label: "Move to a better project-management tool",
    note: "Not modelled: the same habits would follow into any tool.",
  },
];

export const MAX_CHANGES = 3;

export function after(ids: string[]): Result {
  const o = { dev: 99, test: 99, opts: {} as BoardOptions };
  for (const c of CHANGES) if (ids.includes(c.id)) c.apply?.(o);
  return simulate(o.dev, o.test, o.opts);
}
