"use client";

import { motion } from "motion/react";
import { Car, CarTaxiFront, KeyRound } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TRAFFIC, monthlyCost } from "./prices";
import type { ComputeState } from "./state";

type Model = ComputeState["model"];

/* 1 ─ Lease, car-share or taxi ------------------------------------------------------------------- */

const RIDES: [typeof Car, string, string, string][] = [
  [
    KeyRound,
    "A leased car",
    "Yours all month, ready whenever you are. You fill it, service it and pay even when it's parked.",
    "A virtual machine",
  ],
  [
    Car,
    "A car-share",
    "Quicker to pick up and someone else services it, but you still drive and plan the trip.",
    "A container",
  ],
  [
    CarTaxiFront,
    "A taxi",
    "Pay per ride and nothing in between. Sometimes you wait for one to arrive.",
    "A function",
  ],
];

export function CarOrTaxi() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Lease, car-share or taxi"
      stage={
        <div className="grid flex-1 content-center gap-3 md:grid-cols-3">
          {RIDES.map(([Icon, t, d, m], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent size-5" />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
              <span className="bg-accent-soft mt-auto self-start rounded-full px-2.5 py-0.5 text-[11px]">
                {m}
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Getting around a city, you can lease a car, use a car-share, or take taxis. None is always
        best: it depends on how often you travel.
      </p>
      <p>
        Running software in the cloud has the same three choices. This module runs one small web app
        all three ways and compares what you manage, how fast it starts, and what it costs.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three ways to run an app ---------------------------------------------------------------- */

const STACKS: Record<
  Model,
  { layers: [string, boolean][]; start: string; note: string; names: string }
> = {
  vm: {
    layers: [
      ["Your app", true],
      ["Runtime and libraries", true],
      ["Guest operating system", true],
      ["Hypervisor", false],
      ["Physical server", false],
    ],
    start: "A new one can take a few minutes to be ready.",
    note: "A whole computer, carved out of a physical one by a hypervisor. You patch its operating system.",
    names: "Amazon EC2 · Azure Virtual Machines · Google Compute Engine",
  },
  container: {
    layers: [
      ["Your app", true],
      ["Runtime and libraries (your image)", true],
      ["Container runtime", false],
      ["Host operating system (shared kernel)", false],
      ["Physical or virtual server", false],
    ],
    start: "Starts in seconds.",
    note: "Your app and its libraries packed into an image. Containers on a host share its kernel, so they're light. You own the image and keep it patched.",
    names:
      "AWS ECS on Fargate · Google Cloud Run · Azure Container Apps (Kubernetes: EKS, GKE, AKS)",
  },
  function: {
    layers: [
      ["Your function's code", true],
      ["Language runtime", false],
      ["Isolated micro-VM", false],
      ["Host operating system", false],
      ["Physical server", false],
    ],
    start:
      "Warm: instant. Cold start: from under 100 ms to over a second, on under 1% of calls (AWS).",
    note: "Just your code, run when an event arrives, billed per millisecond. AWS Lambda runs each in a tiny Firecracker micro-VM. Limits apply: Lambda stops a run after 15 minutes.",
    names: "AWS Lambda · Google Cloud Run functions · Azure Functions",
  },
};

const MODELS: [Model, string][] = [
  ["vm", "Virtual machine"],
  ["container", "Container"],
  ["function", "Function"],
];

export function ThreeWays() {
  const [s, set] = useSceneState<ComputeState>();
  const st = STACKS[s.model];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three ways to run an app"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.model}
            options={MODELS}
            onChange={(v) => set({ model: v })}
          />
          <div className="flex flex-col gap-1">
            {st.layers.map(([l, yours], i) => (
              <motion.div
                key={`${s.model}-${l}`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2 text-xs",
                  yours
                    ? "border-accent bg-accent-soft font-medium"
                    : "border-line bg-surface-2 text-muted",
                )}
              >
                {l}
                <span className="text-[10px] font-normal">{yours ? "You" : "Provider"}</span>
              </motion.div>
            ))}
          </div>
          <motion.div
            key={s.model}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface flex flex-col gap-1 rounded-lg border px-3 py-2 text-xs"
          >
            <p>{st.note}</p>
            <p>
              <span className="font-medium">Start-up: </span>
              {st.start}
            </p>
            <p className="text-muted text-[11px]">{st.names}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A <Term id="virtual-machine">virtual machine</Term> is a whole computer in software. A{" "}
        <Term id="container">container</Term> packs just your app and its libraries, sharing the
        host&apos;s operating system. A <Term id="serverless-function">function</Term> is only your
        code; the provider starts it when it&apos;s needed.
      </p>
      <p>
        When a function hasn&apos;t run for a while, the next call waits while the provider gets a
        fresh copy ready: a <Term id="cold-start">cold start</Term>. Each provider offers ways to
        keep copies warm, for a price.
      </p>
      <p>
        Names change: Google&apos;s Cloud Functions became Cloud Run functions in 2024, and AWS App
        Runner stopped taking new customers in April 2026.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Same app, same traffic ⭐ (real list prices) ------------------------------------------------ */

const usd = (v: number) => `$${v.toFixed(2)}`;

export function SameApp() {
  const [s, set] = useSceneState<ComputeState>();
  const t = TRAFFIC.find((x) => x[0] === s.traffic)!;
  const c = monthlyCost(t[3]);
  const rows: [Model, string, number, string][] = [
    ["vm", "One small virtual machine, always on", c.vm, "EC2 t4g.small, 730 hours"],
    [
      "container",
      "One small container, always on",
      c.container,
      "Fargate, 0.25 vCPU and 0.5 GB, 730 hours",
    ],
    ["function", "A function, run per request", c.fn, "Lambda, 512 MB, 100 ms per request"],
  ];
  const max = Math.max(...rows.map((r) => r[2]));
  const best = rows.reduce((a, b) => (b[2] < a[2] ? b : a));
  return (
    <StepLayout
      eyebrow="Simulation · AWS list prices, 2 Oct 2026"
      title="Same app, same traffic"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.traffic}
            options={TRAFFIC.map(([k, n]) => [k, n] as [ComputeState["traffic"], string])}
            onChange={(v) => set({ traffic: v })}
          />
          <p className="text-muted text-xs">
            {t[2]} {t[3].toLocaleString("en-IN")} requests a month.
          </p>
          <div className="flex flex-col gap-2">
            {rows.map(([k, n, v, how]) => (
              <div
                key={k}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  k === best[0] ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="font-medium">{n}</span>
                  <span className="font-mono text-sm">{usd(v)} / month</span>
                </div>
                <div className="bg-surface-2 mt-1.5 h-2 overflow-hidden rounded">
                  <motion.div
                    className="bg-accent h-full"
                    animate={{ width: `${Math.max(1, (v / max) * 100)}%` }}
                  />
                </div>
                <p className="text-muted mt-1 text-[10px]">{how}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            US East list prices from AWS&apos;s price list, before free tiers and tax. Assumes one
            small server copes with all three traffic levels. Google Cloud Run and Azure Container
            Apps charge per second of use in a similar way, and can scale containers to zero.
          </p>
        </div>
      }
    >
      <p>
        The same small app, three ways, priced with real list prices. Switch the traffic and watch
        which wins.
      </p>
      <p>
        A rarely used form costs about a cent a month as a function, against about $12 for a server
        that sits waiting. For the office-hours app the function still wins. For a busy API running
        day and night, it flips: per-request billing adds up to over four times the cost of a server
        that&apos;s busy anyway.
      </p>
      <p>
        Cost isn&apos;t everything. A rarely used function will often start cold, and a server you
        rent is also a server you must patch. Containers that scale to zero, like Cloud Run and
        Azure Container Apps, sit in between.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which fits? ------------------------------------------------------------------------------ */

export function BestFit() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which fits?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="compute-fit"
            prompt="Which way of running fits each job best?"
            categories={[
              { id: "vm", label: "Virtual machine" },
              { id: "container", label: "Container" },
              { id: "function", label: "Function" },
            ]}
            items={[
              {
                id: "legacy",
                label: "An old application that needs a particular operating system set up by hand",
                category: "vm",
                why: "It needs control of the whole operating system, which only a virtual machine gives you.",
              },
              {
                id: "thumb",
                label: "Making a thumbnail each time someone uploads a photo",
                category: "function",
                why: "Short, triggered by an event, idle in between: exactly what functions are for.",
              },
              {
                id: "api",
                label: "A web API with steady traffic, already packaged with Docker",
                category: "container",
                why: "It's already an image, runs all day, and moves easily between clouds.",
              },
              {
                id: "video",
                label: "Encoding a three-hour video recording",
                category: "container",
                why: "Too long for a function (Lambda stops at 15 minutes); a container job runs as long as it needs.",
              },
              {
                id: "nightly",
                label: "A two-minute report that runs once a night",
                category: "function",
                why: "You'd pay for a server all day to use it for two minutes.",
              },
              {
                id: "db",
                label: "A database you must tune at the operating-system level",
                category: "vm",
                why: "Deep tuning needs the whole machine (or a managed database service, module 16).",
              },
            ]}
            explanation="Ask how often it runs, how long each run takes, and how much of the machine you need to control. Many systems use all three."
          />
        </div>
      }
    >
      <p>Six jobs. Match each to the way of running it that fits best.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Three levels", "Whole machine, packed app, or just code: less to manage each step."],
  ["Start-up differs", "Minutes for a VM, seconds for a container, a cold start for a function."],
  ["Traffic decides cost", "Per-request is cheapest when idle, dearest when always busy."],
  ["Mix them", "Most systems use all three for different jobs."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Next: adding and removing servers automatically as traffic changes, and spreading requests
        across them.
      </p>
    </StepLayout>
  );
}
