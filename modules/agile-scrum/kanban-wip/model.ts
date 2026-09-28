/**
 * A small Kanban board, day by day: To do → Develop (3 developers) → Test (1 tester, the
 * bottleneck) → Done. Work is "started" when pulled into Develop and "finished" when it reaches
 * Done. WIP limits cap Develop and Test. Spreading people across more items costs some switching
 * time. Illustrative numbers, fixed random seed.
 */

export const DAYS = 60;
export const WARMUP = 20;
const DEVS = 3;
const TESTERS = 1;
const SWITCH = 0.15; // efficiency lost per extra item per person

export interface Item {
  id: number;
  arrive: number;
  start?: number;
  devLeft: number;
  testLeft: number;
  devDone?: number;
  testStart?: number;
  finish?: number;
}

export interface DayState {
  todo: number[];
  dev: number[];
  test: number[];
  done: number[];
}

export interface Result {
  days: DayState[];
  items: Item[];
  throughput: number;
  avgWip: number;
  avgCycle: number;
  littles: number;
  oldestAge: number;
  finished: number;
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function work(active: Item[], people: number, key: "devLeft" | "testLeft") {
  if (!active.length) return;
  const perPerson = active.length / people;
  const eff = Math.max(0.5, 1 / (1 + SWITCH * Math.max(0, perPerson - 1)));
  const each = Math.min(1, people / active.length) * eff;
  for (const it of active) it[key] = Math.max(0, it[key] - each);
}

/** Optional changes used by the struggling-team capstone; the defaults are this module's board. */
export interface BoardOptions {
  testers?: number; // effective testing capacity (developers helping to test raises it)
  size?: number; // multiplier on each item's work (splitting stories makes items smaller)
  bursts?: boolean; // extra side requests every tenth day
}

export function simulate(devLimit: number, testLimit: number, opts: BoardOptions = {}): Result {
  const { testers = TESTERS, size = 1, bursts = true } = opts;
  const r = rng(7);
  const items: Item[] = [];
  const days: DayState[] = [];
  let next = 0;
  for (let d = 0; d < DAYS; d++) {
    const arrivals = 1 + (bursts && d % 10 === 0 ? 1 : 0);
    for (let k = 0; k < arrivals; k++)
      items.push({
        id: next++,
        arrive: d,
        devLeft: (2 + r() * 2.2) * size,
        testLeft: (0.6 + r() * 0.8) * size,
      });
    const inDev = () => items.filter((i) => i.start !== undefined && i.testStart === undefined);
    const inTest = () => items.filter((i) => i.testStart !== undefined && i.finish === undefined);
    // Pull into Develop (start) while under the limit.
    for (const it of items.filter((i) => i.start === undefined)) {
      if (inDev().length >= devLimit) break;
      it.start = d;
    }
    // Pull finished development into Test while under the limit.
    for (const it of inDev()
      .filter((i) => i.devLeft <= 0)
      .sort((a, b) => a.devDone! - b.devDone!)) {
      if (inTest().length >= testLimit) break;
      it.testStart = d;
    }
    work(
      inDev().filter((i) => i.devLeft > 0),
      DEVS,
      "devLeft",
    );
    for (const it of inDev()) if (it.devLeft <= 0 && it.devDone === undefined) it.devDone = d;
    work(inTest(), testers, "testLeft");
    for (const it of inTest()) if (it.testLeft <= 0) it.finish = d;
    days.push({
      todo: items.filter((i) => i.start === undefined).map((i) => i.id),
      dev: inDev().map((i) => i.id),
      test: inTest().map((i) => i.id),
      done: items.filter((i) => i.finish !== undefined).map((i) => i.id),
    });
  }
  const window = DAYS - WARMUP;
  const fin = items.filter((i) => i.finish !== undefined && i.finish >= WARMUP);
  const throughput = fin.length / window;
  const avgWip = days.slice(WARMUP).reduce((a, s) => a + s.dev.length + s.test.length, 0) / window;
  const avgCycle = fin.length
    ? fin.reduce((a, i) => a + (i.finish! - i.start! + 1), 0) / fin.length
    : 0;
  const last = days[DAYS - 1];
  const oldestAge = Math.max(
    0,
    ...[...last.dev, ...last.test].map((id) => DAYS - 1 - items[id].start! + 1),
  );
  return {
    days,
    items,
    throughput,
    avgWip,
    avgCycle,
    littles: throughput ? avgWip / throughput : 0,
    oldestAge,
    finished: fin.length,
  };
}
