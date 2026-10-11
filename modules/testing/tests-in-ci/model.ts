/**
 * A made-up pipeline and four common speed-ups. Stage durations (minutes) and the test-selection
 * share are illustrative; the scheduling is computed, so the chart always matches the numbers.
 */

export type Opt = "parallel" | "shard" | "cache" | "select";

export const OPTS: { id: Opt; label: string; detail: string; risk?: string }[] = [
  {
    id: "cache",
    label: "Cache dependencies and build output",
    detail: "Build drops from 4 to 1 minute when nothing it depends on changed.",
  },
  {
    id: "parallel",
    label: "Run independent stages at the same time",
    detail: "Lint, unit tests and the build don't need each other.",
  },
  {
    id: "shard",
    label: "Split slow suites across machines",
    detail: "Integration on 3 machines, end-to-end on 4 (plus a minute of start-up each).",
  },
  {
    id: "select",
    label: "On pull requests, run only tests affected by the change",
    detail:
      "About a third of integration and end-to-end tests run; the full suite runs after merging.",
    risk: "A small chance of missing a failure until the full run.",
  },
];

export interface Bar {
  stage: string;
  lane: number;
  start: number;
  end: number;
}

export function schedule(opts: Opt[]): {
  bars: Bar[];
  wall: number;
  machineMin: number;
  firstUnitFail: number;
} {
  const has = (o: Opt) => opts.includes(o);
  const sel = has("select") ? 1 / 3 : 1;
  const d = { lint: 1, unit: 6, build: has("cache") ? 1 : 4, integration: 12 * sel, e2e: 17 * sel };
  const bars: Bar[] = [];
  let lane = 0;
  if (!has("parallel")) {
    let t = 0;
    for (const s of ["lint", "unit", "build"] as const) {
      bars.push({ stage: s, lane: 0, start: t, end: t + d[s] });
      t += d[s];
    }
    lane = 1;
    const tail = (name: "integration" | "e2e", shards: number) => {
      const each = shards > 1 ? d[name] / shards + 1 : d[name];
      for (let k = 0; k < shards; k++)
        bars.push({ stage: name, lane: lane + k, start: t, end: t + each });
      lane += shards;
      t += each;
    };
    tail("integration", has("shard") ? 3 : 1);
    tail("e2e", has("shard") ? 4 : 1);
    return finish(bars, d.lint);
  }
  bars.push({ stage: "lint", lane: 0, start: 0, end: d.lint });
  bars.push({ stage: "unit", lane: 1, start: 0, end: d.unit });
  bars.push({ stage: "build", lane: 2, start: 0, end: d.build });
  lane = 3;
  const after = d.build;
  const par = (name: "integration" | "e2e", shards: number) => {
    const each = shards > 1 ? d[name] / shards + 1 : d[name];
    for (let k = 0; k < shards; k++)
      bars.push({ stage: name, lane: lane + k, start: after, end: after + each });
    lane += shards;
  };
  par("integration", has("shard") ? 3 : 1);
  par("e2e", has("shard") ? 4 : 1);
  return finish(bars, 0);
}

function finish(bars: Bar[], unitStart: number) {
  const wall = Math.max(...bars.map((b) => b.end));
  const machineMin = bars.reduce((t, b) => t + (b.end - b.start), 0);
  const unit = bars.find((b) => b.stage === "unit")!;
  return { bars, wall, machineMin, firstUnitFail: unitStart + (unit.end - unit.start) / 2 };
}
