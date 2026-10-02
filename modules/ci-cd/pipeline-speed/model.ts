/**
 * Pipeline speed model (illustrative minutes). A 45-minute pipeline runs every job one after
 * another on one machine. Each lever changes durations or ordering; the wall-clock time is the
 * longest chain of jobs that must wait for each other (the critical path).
 */

export interface Levers {
  cache: boolean;
  parallel: boolean;
  shard: boolean;
  timing: boolean;
  affected: boolean;
}

export const LEVERS: { id: keyof Levers; name: string; needs?: keyof Levers }[] = [
  { id: "cache", name: "Cache dependencies" },
  { id: "parallel", name: "Run independent jobs in parallel" },
  { id: "shard", name: "Split slow test suites over 4 machines", needs: "parallel" },
  { id: "timing", name: "Split by past timings, not file count", needs: "shard" },
  { id: "affected", name: "Only test what this change affects" },
];

/** Every job on its own machine pays this to start: boot, checkout, toolchain. */
export const SETUP = 1;
const INSTALL = 4;
const INSTALL_CACHED = 0.7;

export interface Bar {
  id: string;
  label: string;
  lane: number;
  start: number;
  setup: number;
  work: number;
  skipped?: boolean;
}

interface JobDef {
  id: string;
  label: string;
  work: number;
  after: string[];
  shardable?: boolean;
  /** Share of this suite a typical change can skip with change detection. */
  skippable?: number;
}

const JOBS: JobDef[] = [
  { id: "lint", label: "lint", work: 3, after: [] },
  { id: "unit", label: "unit tests", work: 6, after: [] },
  { id: "build", label: "build", work: 5, after: [] },
  {
    id: "integration",
    label: "integration tests",
    work: 12,
    after: ["build"],
    shardable: true,
    skippable: 0.5,
  },
  {
    id: "e2e",
    label: "end-to-end tests",
    work: 14,
    after: ["build"],
    shardable: true,
    skippable: 0.6,
  },
];

const SHARDS = 4;
/** Splitting by file count leaves shards uneven: the biggest gets this share of the suite. */
const UNEVEN = 0.42;

export interface Plan {
  bars: Bar[];
  minutes: number;
  /** Minutes of runner time paid for (what the bill counts). */
  runnerMinutes: number;
  /** When a lint mistake turns the pipeline red. */
  firstRed: number;
}

/** A lever only counts when the lever it builds on is on. */
export function effective(l: Levers): Levers {
  const shard = l.shard && l.parallel;
  return { ...l, shard, timing: l.timing && shard };
}

export function plan(levers: Levers): Plan {
  const l = effective(levers);
  const install = l.cache ? INSTALL_CACHED : INSTALL;
  const bars: Bar[] = [];
  if (!l.parallel) {
    // One machine: setup and install once, then every job in turn.
    let t = 0;
    bars.push({
      id: "setup",
      label: "setup + install",
      lane: 0,
      start: 0,
      setup: SETUP,
      work: install,
    });
    t = SETUP + install;
    let lintEnd = 0;
    for (const j of JOBS) {
      let work = j.work;
      if (l.affected && j.skippable) work *= 1 - j.skippable;
      bars.push({ id: j.id, label: j.label, lane: 0, start: t, setup: 0, work });
      t += work;
      if (j.id === "lint") lintEnd = t;
    }
    const minutes = t;
    return { bars, minutes, runnerMinutes: minutes, firstRed: lintEnd };
  }
  // Parallel: every job gets its own machine and pays setup + install.
  const end: Record<string, number> = {};
  let lane = 0;
  let runner = 0;
  for (const j of JOBS) {
    const start = Math.max(0, ...j.after.map((a) => end[a] ?? 0));
    let work = j.work;
    const skipped = l.affected && j.skippable ? j.skippable : 0;
    work *= 1 - skipped;
    if (l.shard && j.shardable) {
      const shares = l.timing
        ? Array(SHARDS).fill(1 / SHARDS)
        : [UNEVEN, 0.24, 0.2, 1 - UNEVEN - 0.24 - 0.2];
      let last = 0;
      shares.forEach((sh, k) => {
        const w = work * sh;
        bars.push({
          id: `${j.id}-${k}`,
          label: `${j.label} ${k + 1}/${SHARDS}`,
          lane: lane++,
          start,
          setup: SETUP + install,
          work: w,
        });
        runner += SETUP + install + w;
        last = Math.max(last, start + SETUP + install + w);
      });
      end[j.id] = last;
    } else {
      bars.push({ id: j.id, label: j.label, lane: lane++, start, setup: SETUP + install, work });
      runner += SETUP + install + work;
      end[j.id] = start + SETUP + install + work;
    }
  }
  const minutes = Math.max(...Object.values(end));
  return { bars, minutes, runnerMinutes: runner, firstRed: end.lint };
}

/** Step 3: one suite of `work` minutes split over n machines, each paying `overhead` to start. */
export function shardCurve(work: number, overhead: number, maxN: number) {
  return Array.from({ length: maxN }, (_, i) => {
    const n = i + 1;
    return { n, wall: overhead + work / n, paid: n * overhead + work };
  });
}
