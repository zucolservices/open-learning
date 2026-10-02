/**
 * Four builds of the same app over ten days (illustrative timings). The package.json asks for
 * colors "^1.4.0"; on day 8 colors 1.4.1 is published (the real 8 January 2022 sabotage, which
 * made the library loop forever). The hosted runner image also moves to a newer Node on day 8.
 */

export type Deps = "range" | "lock";
export type Tool = "any" | "pinned";
export type Cache = "none" | "deps" | "deps+build";

export interface Run {
  day: number;
  label: string;
  /** Did this run change the lockfile (a deliberate dependency upgrade)? */
  lockChanged: boolean;
  /** Did source code change since the previous run? */
  codeChanged: boolean;
}

export const RUNS: Run[] = [
  { day: 1, label: "Day 1 · first build", lockChanged: false, codeChanged: true },
  { day: 2, label: "Day 2 · small code change", lockChanged: false, codeChanged: true },
  { day: 3, label: "Day 3 · docs-only change", lockChanged: false, codeChanged: false },
  { day: 9, label: "Day 9 · small code change", lockChanged: false, codeChanged: true },
  {
    day: 10,
    label: "Day 10 · another library upgraded on purpose",
    lockChanged: true,
    codeChanged: true,
  },
];

/** Illustrative minutes for each phase. */
const T = {
  boot: 0.5,
  installCold: 3,
  installWarm: 0.4,
  build: 4,
  buildCached: 0.3,
  /** A build that changed a few files reuses most cached work. */
  buildPartial: 1.2,
  test: 2,
};

export interface RunResult {
  run: Run;
  colors: string;
  node: string;
  installHit: boolean;
  buildHit: "full" | "partial" | "none";
  minutes: number;
  outcome: "pass" | "hang";
  /** Same colors version and toolchain as day 1? */
  sameAsDay1: boolean;
}

export function simulate(deps: Deps, tool: Tool, cache: Cache): RunResult[] {
  return RUNS.map((run, i) => {
    // Ranges pick the newest match at install time; a lockfile keeps colors at 1.4.0.
    const colors = deps === "range" && run.day >= 8 ? "1.4.1" : "1.4.0";
    const node = tool === "any" ? (run.day >= 8 ? "26" : "24") : "24";
    const first = i === 0;
    const lockSame = deps === "lock" && !run.lockChanged;
    const installHit = cache !== "none" && !first && lockSame;
    let buildHit: RunResult["buildHit"] = "none";
    if (cache === "deps+build" && !first && lockSame && node === "24") {
      buildHit = run.codeChanged ? "partial" : "full";
    }
    const outcome = colors === "1.4.1" ? "hang" : "pass";
    const build =
      buildHit === "full" ? T.buildCached : buildHit === "partial" ? T.buildPartial : T.build;
    // A hanging build runs until the job's time limit; we stop the clock at 60 minutes.
    const minutes =
      outcome === "hang"
        ? 60
        : T.boot + (installHit ? T.installWarm : T.installCold) + build + T.test;
    return {
      run,
      colors,
      node,
      installHit,
      buildHit,
      minutes,
      outcome,
      sameAsDay1: colors === "1.4.0" && node === "24",
    };
  });
}

export function fmtMin(m: number): string {
  if (m >= 60) return "60 min, timed out";
  const s = Math.round(m * 60);
  return s >= 60 ? `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s` : `${s} s`;
}

/** Lockfiles across ecosystems. */
export const ECOSYSTEMS: {
  id: string;
  name: string;
  file: string;
  install: string;
  note: string;
}[] = [
  {
    id: "npm",
    name: "npm",
    file: "package-lock.json",
    install: "npm ci",
    note: "npm ci needs the lockfile, fails if it doesn't match package.json and installs exactly what it lists.",
  },
  {
    id: "pnpm",
    name: "pnpm / Yarn",
    file: "pnpm-lock.yaml · yarn.lock",
    install: "pnpm install --frozen-lockfile",
    note: "Both refuse to change the lockfile in CI when asked to treat it as frozen.",
  },
  {
    id: "python",
    name: "Python",
    file: "uv.lock · poetry.lock · pylock.toml",
    install: "uv sync --locked",
    note: "pylock.toml is the standard format from PEP 751, accepted in March 2025; pip can also check hashes with --require-hashes.",
  },
  {
    id: "go",
    name: "Go",
    file: "go.mod + go.sum",
    install: "go build",
    note: "go.mod already fixes versions (minimal version selection); go.sum holds checksums so a changed download is caught.",
  },
  {
    id: "rust",
    name: "Rust",
    file: "Cargo.lock",
    install: "cargo build --locked",
    note: "--locked makes the build fail rather than update Cargo.lock.",
  },
  {
    id: "jvm",
    name: "Java / .NET",
    file: "gradle.lockfile · packages.lock.json",
    install: "opt in",
    note: "Gradle and .NET locking must be switched on; Maven has no built-in lockfile, so pin exact versions.",
  },
];
