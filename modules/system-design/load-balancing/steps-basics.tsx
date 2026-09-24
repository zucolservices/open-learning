"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { simulate, type Algo } from "./sim";
import type { LbState } from "./state";

/* 1 ─ The host at the door ------------------------------------------------------------------------- */

const PATHS: Record<string, { pool: "web" | "api" | "img"; label: string }> = {
  "/menu": { pool: "web", label: "GET /menu" },
  "/api/orders": { pool: "api", label: "POST /api/orders" },
  "/images/latte.jpg": { pool: "img", label: "GET /images/latte.jpg" },
};

const POOLS = [
  { id: "web", label: "Web servers" },
  { id: "api", label: "API servers" },
  { id: "img", label: "Image servers" },
] as const;

export function HostAtTheDoor() {
  const [s, set] = useSceneState<LbState>();
  const l7 = s.layer === "l7";
  const target = PATHS[s.path].pool;
  return (
    <StepLayout
      eyebrow="The big idea"
      title="The host at the door"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.layer}
            options={[
              ["l4", "Layer 4: sees connections"],
              ["l7", "Layer 7: reads requests"],
            ]}
            onChange={(v) => set({ layer: v as LbState["layer"] })}
          />
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(PATHS).map(([p, x]) => (
              <button
                key={p}
                type="button"
                onClick={() => set({ path: p })}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-[11px]",
                  s.path === p
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface grid gap-3 rounded-xl border p-4">
            <div className="flex items-center justify-center gap-2">
              <span className="bg-surface-2 rounded-lg px-2 py-1 font-mono text-[11px]">
                {l7 ? PATHS[s.path].label : "TCP connection from 49.36.x.x"}
              </span>
              <span className="text-subtle">→</span>
              <span className="border-accent bg-accent-soft rounded-lg border px-2 py-1 text-xs font-semibold">
                Load balancer
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {POOLS.map((pool) => {
                const hit = l7 ? pool.id === target : true;
                return (
                  <motion.div
                    key={pool.id}
                    animate={{ opacity: hit ? 1 : 0.35 }}
                    className={cn(
                      "rounded-xl border p-2 text-center text-xs",
                      hit ? "border-viz-compute/60 bg-viz-compute/10" : "border-line",
                    )}
                  >
                    {l7 ? pool.label : "Servers"}
                    <div className="mt-1.5 flex justify-center gap-1">
                      {[0, 1].map((i) => (
                        <span key={i} className="bg-viz-compute/50 size-3 rounded-sm" />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={s.layer + s.path}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-muted text-center text-xs"
              >
                {l7
                  ? `It read the request, so it can send ${PATHS[s.path].label} to the ${POOLS.find((p) => p.id === target)!.label.toLowerCase()}, and handle encryption (TLS) itself.`
                  : "It only sees a connection (addresses and ports), so any server must be able to handle anything. Fast and simple."}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      }
    >
      <p>
        A restaurant host greets every guest at one door and shows each to a free table, so no
        waiter is swamped while another stands idle. A <Term id="load-balancer">load balancer</Term>{" "}
        does that for requests: one address in front of many servers.
      </p>
      <p>
        Some hosts only count heads; others read your booking and seat you by party type. Load
        balancers come in the same two kinds: layer 4 and layer 7. Switch between them and send
        different requests.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Round robin, or something smarter? ⭐ ------------------------------------------------------- */

const ALGOS: [Algo, string, string][] = [
  ["rr", "Round robin", "Each server in turn."],
  ["random", "Random", "Any server at random."],
  ["least", "Least connections", "The server with the fewest requests in progress."],
  ["p2c", "Power of two", "Pick two at random; use the less busy one."],
];

const LOADS = [0.5, 0.7, 0.85];

const fmtMs = (ms: number) =>
  ms >= 10_000
    ? `${(ms / 1000).toFixed(0)} s`
    : ms >= 1000
      ? `${(ms / 1000).toFixed(1)} s`
      : `${Math.round(ms)} ms`;

export function Algorithms() {
  const [s, set] = useSceneState<LbState>();
  const { algo, slow, dead, passive, load } = s;
  const r = useMemo(
    () => simulate({ algo, slow, dead, passive, activeCheckS: 30, load: LOADS[load] }),
    [algo, slow, dead, passive, load],
  );
  const maxShare = Math.max(...r.share);
  const meltdown = r.p99 > 5000;
  const verdict = meltdown
    ? "The slow server gets its equal share whether it can cope or not. Its queue grows without end, and the unlucky requests wait minutes."
    : s.dead && !s.passive && (s.algo === "least" || s.algo === "p2c")
      ? "The broken server fails instantly, so it always looks idle, and this algorithm sends it even more traffic. Every one of those requests fails until the health check notices."
      : s.dead && !s.passive
        ? "Requests keep going to the broken server until the health check removes it after 30 seconds."
        : s.dead && s.passive
          ? "Passive checks spotted five failures in a row and pulled the server within a fraction of a second."
          : s.slow
            ? "This algorithm notices the slow server is always busy and sends it less. The tail stays short."
            : "All servers are equal, so every algorithm copes. Try a slow server.";
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Round robin, or something smarter?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {ALGOS.map(([id, label, how]) => (
              <button
                key={id}
                type="button"
                onClick={() => set({ algo: id })}
                className={cn(
                  "rounded-xl border px-2.5 py-1.5 text-left transition",
                  s.algo === id ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                <span className="block text-xs font-semibold">{label}</span>
                <span className="text-muted block text-[10px] leading-snug">{how}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.slow}
                onChange={(e) => set({ slow: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Server 6 is 4× slower
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.dead}
                onChange={(e) => set({ dead: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Server 5 is broken
            </label>
            {s.dead && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s.passive}
                  onChange={(e) => set({ passive: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                Passive health checks
              </label>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Traffic</span>
            <Segmented
              size="sm"
              value={String(s.load)}
              options={LOADS.map(
                (l, i) => [String(i), `${Math.round(l * 100)}% of capacity`] as [string, string],
              )}
              onChange={(v) => set({ load: Number(v) })}
            />
          </div>

          <div className="border-line bg-surface grid grid-cols-6 items-end gap-2 rounded-xl border p-3">
            {r.share.map((n, i) => {
              const broken = s.dead && i === 4;
              const slow = s.slow && i === 5;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="flex h-24 w-full items-end">
                    <motion.div
                      initial={false}
                      animate={{ height: `${(n / maxShare) * 100}%` }}
                      className={cn(
                        "w-full rounded-t",
                        broken ? "bg-bad/70" : slow ? "bg-viz-compute" : "bg-viz-compute/50",
                      )}
                    />
                  </div>
                  <span className="text-muted text-[10px]">
                    {broken ? "broken" : slow ? "slow" : `server ${i + 1}`}
                  </span>
                  <span className="font-mono text-[9px]">
                    queue {r.maxQueue[i] > 999 ? "999+" : r.maxQueue[i]}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-subtle -mt-2 text-[10px]">
            Bars: share of 30,000 requests. &ldquo;queue&rdquo;: the longest line each server had.
          </p>

          <div className="grid grid-cols-3 gap-2">
            <Stat label="Typical (p50)" value={fmtMs(r.p50)} />
            <Stat label="Slowest 1% (p99)" value={fmtMs(r.p99)} bad={r.p99 > 1000} />
            <Stat
              label="Failed requests"
              value={r.errors.toLocaleString("en-US")}
              bad={r.errors > 50}
            />
          </div>
          <motion.p
            key={verdict}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              meltdown || (s.dead && r.errors > 50)
                ? "border-bad/40 bg-bad/10"
                : "border-line bg-surface",
            )}
          >
            {verdict}
          </motion.p>
          <details className="text-muted text-xs">
            <summary className="cursor-pointer">How this simulation works</summary>
            <p className="mt-2">
              30,000 requests arrive at random; six servers each handle one at a time (20 ms on
              average, 80 ms for the slow one). A broken server fails every request instantly;
              active health checks remove it after 30 s; passive checks after five failures in a
              row. Seeded, so results are repeatable.
            </p>
          </details>
        </div>
      }
    >
      <p>
        How the load balancer picks a server matters most when servers aren&apos;t equal. Try each
        algorithm with healthy servers, then with a slow one, then with a broken one.
      </p>
      <p className="text-muted text-sm">
        &ldquo;Power of two choices&rdquo; is a famous result (Azar and colleagues, 1994;
        Mitzenmacher for servers with queues): checking just two random servers and taking the less
        busy one is exponentially better than one random pick, and three barely beats two.
        Envoy&apos;s least-request policy uses it. Most load balancers default to round robin,
        though; the smarter options must be switched on.
      </p>
    </StepLayout>
  );
}

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 3 ─ Checkpoint --------------------------------------------------------------------------------- */

export function SlowServerCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="One slow server"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="slow-server"
            prompt="One of eight servers has a failing disk and answers four times slower than the rest. The load balancer uses round robin. What happens, and what helps?"
            options={[
              {
                id: "least",
                label:
                  "It still gets 1 in 8 requests, its queue grows, and the tail explodes. Least connections or power-of-two choices would send it less",
                correct: true,
                feedback:
                  "Right. Algorithms that look at how busy each server is route around a slow one automatically.",
              },
              {
                id: "fine",
                label: "Round robin is fair, so each server gets exactly its share: no problem",
                feedback:
                  "Equal shares are the problem: a slow server can't handle an equal share.",
              },
              {
                id: "random",
                label: "Switch to random, which avoids patterns",
                feedback:
                  "Random gives the slow server the same share on average, with extra variation.",
              },
              {
                id: "health",
                label: "The health check will remove it",
                feedback:
                  "Health checks usually test 'does it answer?'. A slow server answers, so it stays in.",
              },
            ]}
            explanation="Slow is harder to catch than dead. Balancing on in-flight requests, plus outlier detection, handles both."
          />
        </div>
      }
    >
      <p>From the simulation.</p>
    </StepLayout>
  );
}
