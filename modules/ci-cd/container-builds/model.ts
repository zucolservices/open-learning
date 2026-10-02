/**
 * Dockerfile simulator (illustrative sizes on disk and seconds). The learner picks the
 * instruction order, single- or multi-stage, the runtime base image and .dockerignore, then
 * makes a change and sees which steps rebuild and how big the final image is.
 */

export type Base = "full" | "slim" | "alpine" | "distroless";
export type Change = "code" | "deps";

export interface Opts {
  goodOrder: boolean;
  multi: boolean;
  base: Base;
  ignore: boolean;
  change: Change;
}

/** Approximate size on disk of each Node.js 24 base image (compressed sizes are much smaller). */
export const BASES: Record<Base, { image: string; mb: number; label: string }> = {
  full: { image: "node:24", mb: 1100, label: "node:24 (full Debian)" },
  slim: { image: "node:24-slim", mb: 230, label: "node:24-slim" },
  alpine: { image: "node:24-alpine", mb: 165, label: "node:24-alpine" },
  distroless: {
    image: "gcr.io/distroless/nodejs24-debian13:nonroot",
    mb: 150,
    label: "distroless (no shell, no npm)",
  },
};

const MB = { devDeps: 350, prodDeps: 120, src: 5, dist: 8, git: 60, localModules: 350 };
const SEC = { install: 90, prodInstall: 40, build: 40, copy: 2, meta: 0 };

export interface Line {
  text: string;
  stage?: string;
  /** Seconds this step takes when it runs. */
  seconds: number;
  /** MB this step adds to its stage. */
  mb: number;
  cached: boolean;
  /** Part of the final image? */
  final: boolean;
}

export interface Result {
  lines: Line[];
  seconds: number;
  finalMb: number;
  contextMb: number;
}

export function simulate(o: Opts): Result {
  const contextMb = MB.src + 1 + (o.ignore ? 0 : MB.git + MB.localModules);
  const junk = o.ignore ? 0 : MB.git + MB.localModules;
  const codeChanged = true; // every scenario edits something under COPY . .
  const depsChanged = o.change === "deps";
  const lines: Line[] = [];
  const buildBase = o.multi ? "node:24" : BASES[o.base].image;
  const buildBaseMb = o.multi ? BASES.full.mb : BASES[o.base].mb;
  const bStage = o.multi ? "build" : undefined;

  lines.push({
    text: `FROM ${buildBase}${o.multi ? " AS build" : ""}`,
    stage: bStage,
    seconds: 0,
    mb: buildBaseMb,
    cached: true,
    final: !o.multi,
  });
  lines.push({
    text: "WORKDIR /app",
    stage: bStage,
    seconds: 0,
    mb: 0,
    cached: true,
    final: !o.multi,
  });
  if (o.goodOrder) {
    lines.push({
      text: "COPY package.json package-lock.json ./",
      stage: bStage,
      seconds: SEC.copy,
      mb: 1,
      cached: !depsChanged,
      final: !o.multi,
    });
    lines.push({
      text: "RUN npm ci",
      stage: bStage,
      seconds: SEC.install,
      mb: MB.devDeps,
      cached: !depsChanged,
      final: !o.multi,
    });
    lines.push({
      text: "COPY . .",
      stage: bStage,
      seconds: SEC.copy,
      mb: MB.src + junk,
      cached: !codeChanged,
      final: !o.multi,
    });
  } else {
    lines.push({
      text: "COPY . .",
      stage: bStage,
      seconds: SEC.copy,
      mb: MB.src + junk,
      cached: !codeChanged,
      final: !o.multi,
    });
    lines.push({
      text: "RUN npm ci",
      stage: bStage,
      seconds: SEC.install,
      mb: MB.devDeps,
      cached: false,
      final: !o.multi,
    });
  }
  lines.push({
    text: "RUN npm run build",
    stage: bStage,
    seconds: SEC.build,
    mb: MB.dist,
    cached: false,
    final: !o.multi,
  });
  if (o.multi) {
    lines.push({
      text: o.base === "distroless" ? "FROM node:24-slim AS deps" : `FROM ${BASES[o.base].image}`,
      stage: o.base === "distroless" ? "deps" : "runtime",
      seconds: 0,
      mb: o.base === "distroless" ? BASES.slim.mb : BASES[o.base].mb,
      cached: true,
      final: o.base !== "distroless",
    });
    lines.push({
      text: "WORKDIR /app",
      stage: o.base === "distroless" ? "deps" : "runtime",
      seconds: 0,
      mb: 0,
      cached: true,
      final: o.base !== "distroless",
    });
    lines.push({
      text: "COPY package.json package-lock.json ./",
      stage: o.base === "distroless" ? "deps" : "runtime",
      seconds: SEC.copy,
      mb: 1,
      cached: !depsChanged,
      final: o.base !== "distroless",
    });
    lines.push({
      text: "RUN npm ci --omit=dev",
      stage: o.base === "distroless" ? "deps" : "runtime",
      seconds: SEC.prodInstall,
      mb: MB.prodDeps,
      cached: !depsChanged,
      final: o.base !== "distroless",
    });
    if (o.base === "distroless") {
      lines.push({
        text: `FROM ${BASES.distroless.image}`,
        stage: "runtime",
        seconds: 0,
        mb: BASES.distroless.mb,
        cached: true,
        final: true,
      });
      lines.push({
        text: "COPY --from=deps /app/node_modules ./node_modules",
        stage: "runtime",
        seconds: SEC.copy,
        mb: MB.prodDeps,
        cached: !depsChanged,
        final: true,
      });
    }
    lines.push({
      text: "COPY --from=build /app/dist ./dist",
      stage: "runtime",
      seconds: SEC.copy,
      mb: MB.dist,
      cached: false,
      final: true,
    });
    if (o.base !== "distroless") {
      lines.push({
        text: "USER node",
        stage: "runtime",
        seconds: 0,
        mb: 0,
        cached: true,
        final: true,
      });
    }
  }
  lines.push({
    text:
      o.base === "distroless" && o.multi
        ? 'CMD ["dist/server.js"]'
        : 'CMD ["node", "dist/server.js"]',
    stage: o.multi ? "runtime" : undefined,
    seconds: 0,
    mb: 0,
    cached: true,
    final: true,
  });
  const upload = contextMb / 50;
  const seconds = upload + lines.filter((l) => !l.cached).reduce((t, l) => t + l.seconds, 0);
  const finalMb = lines.filter((l) => l.final).reduce((t, l) => t + l.mb, 0);
  return { lines, seconds, finalMb, contextMb };
}
