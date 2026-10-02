import type { Liveness, Readiness } from "./state";

/**
 * One pod over 240 seconds, second by second. The app needs 60 s to start; the database is
 * down from 150 s to 190 s. Probes use Kubernetes defaults: period 10 s, failureThreshold 3,
 * initialDelaySeconds 0; the startup probe allows 30 × 10 s. Restarts back off 10, 20, 40… s.
 */
export const DURATION = 240;
export const START_S = 60;
export const DB_DOWN: [number, number] = [150, 190];
const PERIOD = 10;
const FAIL = 3;
const STARTUP_FAIL = 30;

export type Phase = "starting" | "up" | "backoff";

export interface Second {
  t: number;
  phase: Phase;
  ready: boolean; // receiving traffic
  serving: boolean; // could answer a request correctly
  restart: boolean;
}

export interface Result {
  timeline: Second[];
  restarts: number;
  errorSeconds: number;
  servedSeconds: number;
}

export function simulate(liveness: Liveness, startup: boolean, readiness: Readiness): Result {
  const out: Second[] = [];
  let phase: Phase = "starting";
  let since = 0; // seconds since container start (or back-off start)
  let backoff = 10;
  let restarts = 0;
  let startupDone = !startup;
  let livFails = 0;
  let readyFails = 0;
  let ready = readiness === "none";
  let startupFails = 0;
  for (let t = 0; t < DURATION; t++) {
    const dbUp = t < DB_DOWN[0] || t >= DB_DOWN[1];
    let restart = false;
    if (phase === "backoff") {
      if (since >= backoff) {
        phase = "starting";
        since = 0;
        backoff = Math.min(300, backoff * 2);
        startupDone = !startup;
        livFails = 0;
        readyFails = 0;
        startupFails = 0;
        ready = readiness === "none";
      }
    } else if (phase === "starting" && since >= START_S) {
      phase = "up";
    }
    const appUp = phase === "up";
    const probeTick = phase !== "backoff" && since % PERIOD === 0;
    if (probeTick) {
      if (!startupDone) {
        if (appUp) startupDone = true;
        else if (++startupFails >= STARTUP_FAIL) restart = true;
      } else {
        if (liveness !== "none") {
          const ok = appUp && (liveness === "app" || dbUp);
          livFails = ok ? 0 : livFails + 1;
          if (livFails >= FAIL) restart = true;
        }
        if (readiness !== "none") {
          const ok = appUp && (readiness === "app" || dbUp);
          if (ok) {
            ready = true;
            readyFails = 0;
          } else if (++readyFails >= FAIL || !appUp) {
            ready = false;
          }
        }
      }
    }
    if (restart) {
      restarts += 1;
      phase = "backoff";
      since = 0;
      ready = false;
    }
    const isReady = phase !== "backoff" && ready && (readiness !== "none" ? startupDone : true);
    out.push({ t, phase, ready: isReady, serving: phase === "up" && dbUp, restart });
    since += 1;
  }
  const errorSeconds = out.filter((s) => s.ready && !s.serving).length;
  const servedSeconds = out.filter((s) => s.ready && s.serving).length;
  return { timeline: out, restarts, errorSeconds, servedSeconds };
}
