"use client";

import { motion } from "motion/react";
import { ArrowRight, MapPin, Server, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { DnsState } from "./state";

type Policy = DnsState["policy"];

/* 1 ─ The enquiry counter --------------------------------------------------------------------------- */

export function Enquiry() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The enquiry counter"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "“Where's the passport office?”",
              "The enquiry counter checks which branch is nearest and open, and writes its address on a slip.",
            ],
            [
              "The slip says “valid for one hour”",
              "People keep using the slip for that long, even if the branch shuts in the meantime.",
            ],
            [
              "Branch closes",
              "New visitors are sent elsewhere at once. People with old slips still turn up at the closed door until their slip runs out.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
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
        <Term id="dns">DNS</Term> is the internet&apos;s enquiry counter: it turns a name like
        portal.example.gov.in into an address. Cloud DNS services can give different answers to
        different people, sending each to the nearest or healthiest region.
      </p>
      <p>
        The catch is the slip. Every answer carries a <Term id="ttl">TTL</Term> (time to live)
        saying how long it may be reused, so changes take time to reach everyone. The System Design
        track explains DNS itself; this module is about steering traffic with it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Send users to a region ⭐ ---------------------------------------------------------------------- */

const USERS = ["Delhi", "Chennai", "Singapore"] as const;
const REGIONS = ["Mumbai", "Hyderabad", "Singapore"] as const;
type Region = (typeof REGIONS)[number];

/** Made-up round-trip times in milliseconds, for illustration. */
const RTT: Record<(typeof USERS)[number], Record<Region, number>> = {
  Delhi: { Mumbai: 28, Hyderabad: 32, Singapore: 75 },
  Chennai: { Mumbai: 26, Hyderabad: 18, Singapore: 45 },
  Singapore: { Mumbai: 62, Hyderabad: 58, Singapore: 4 },
};

const POLICIES: [Policy, string, string][] = [
  ["simple", "Simple", "One answer for everyone: Mumbai."],
  ["latency", "Latency", "Each user gets the region with the lowest measured latency."],
  ["failover", "Failover", "Mumbai is primary; Hyderabad only if Mumbai is unhealthy."],
  [
    "weighted",
    "Weighted",
    "80% of answers say Mumbai, 20% Hyderabad (for example, a new version).",
  ],
];

function answer(
  p: Policy,
  user: (typeof USERS)[number],
  down: boolean,
): { region: Region | "80/20"; ok: boolean } {
  const healthy = REGIONS.filter((r) => !(down && r === "Mumbai"));
  if (p === "simple") return { region: "Mumbai", ok: !down };
  if (p === "failover") return { region: down ? "Hyderabad" : "Mumbai", ok: true };
  if (p === "weighted")
    return down ? { region: "Hyderabad", ok: true } : { region: "80/20", ok: true };
  const best = [...healthy].sort((a, b) => RTT[user][a] - RTT[user][b])[0];
  return { region: best, ok: true };
}

export function RouteUsers() {
  const [s, set] = useSceneState<DnsState>();
  const about = POLICIES.find((p) => p[0] === s.policy)!;
  return (
    <StepLayout
      eyebrow="Simulation · illustrative latencies"
      title="Send users to a region"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.policy}
            options={POLICIES.map(([k, n]) => [k, n] as [Policy, string])}
            onChange={(v) => set({ policy: v })}
          />
          <p className="text-muted text-xs">{about[2]}</p>
          <div className="flex flex-col gap-2">
            {USERS.map((u) => {
              const a = answer(s.policy, u, s.mumbaiDown);
              const ms = a.region === "80/20" || !a.ok ? null : RTT[u][a.region];
              return (
                <motion.div
                  key={`${u}-${s.policy}-${s.mumbaiDown}`}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                    a.ok ? "border-line bg-surface" : "border-bad bg-bad/10",
                  )}
                >
                  <MapPin className="text-accent size-4 shrink-0" />
                  <span className="w-20 font-medium">{u}</span>
                  <ArrowRight className="text-muted size-3.5" />
                  <span className="flex-1">
                    {a.region === "80/20" ? "Mumbai (80%) or Hyderabad (20%)" : a.region}
                    {ms !== null && <span className="text-muted"> · about {ms} ms</span>}
                  </span>
                  {!a.ok && (
                    <span className="text-bad flex items-center gap-1">
                      <X className="size-3.5" /> down
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => {
              const down = s.mumbaiDown && r === "Mumbai";
              return (
                <span
                  key={r}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px]",
                    down ? "border-bad bg-bad/10 text-bad" : "border-line",
                  )}
                >
                  <Server className="size-3" /> {r} {down ? "· unhealthy" : ""}
                </span>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => set({ mumbaiDown: !s.mumbaiDown })}
            className={cn(
              "self-start rounded-full px-4 py-1.5 text-xs font-medium",
              s.mumbaiDown ? "border-line border" : "bg-bad text-white",
            )}
          >
            {s.mumbaiDown ? "Bring Mumbai back" : "Take the Mumbai region down"}
          </button>
        </div>
      }
    >
      <p>
        Three users, three regions, four <Term id="routing-policy">routing policies</Term>. Pick a
        policy, then take Mumbai down. Policies backed by health checks stop sending people to a
        region that fails its checks; a simple record keeps pointing at it.
      </p>
      <p>
        To split Delhi from Chennai you need latency routing: geolocation routing works by country
        (and only by state or province in a few countries), and DNS services usually see the
        location of the user&apos;s DNS resolver, not the user. Route 53 offers all of these; Azure
        Traffic Manager and Google Cloud DNS offer most. Watch out: Traffic Manager&apos;s
        geographic routing answers even when the endpoint is unhealthy.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How long does failover take? ⭐ ---------------------------------------------------------------- */

function Slider({
  label,
  value,
  min,
  max,
  step,
  show,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  show: string;
  onChange(v: number): void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="text-muted w-36 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent flex-1"
      />
      <span className="w-14 text-right font-mono">{show}</span>
    </label>
  );
}

const PRESETS: [string, number, number, number][] = [
  ["Route 53 defaults", 30, 3, 60],
  ["Route 53, fast checks", 10, 3, 60],
  ["Traffic Manager defaults", 30, 4, 30],
];

export function FailoverTime() {
  const [s, set] = useSceneState<DnsState>();
  const detect = s.interval * s.threshold;
  const total = detect + s.ttl;
  const fmt = (sec: number) => (sec >= 90 ? `${(sec / 60).toFixed(1)} min` : `${sec} s`);
  return (
    <StepLayout
      eyebrow="Simulation · worst case"
      title="How long does failover take?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(([n, i, t, ttl]) => (
              <button
                key={n}
                type="button"
                onClick={() => set({ interval: i, threshold: t, ttl })}
                className="border-line hover:bg-surface-2 rounded-full border px-2.5 py-0.5 text-[11px]"
              >
                {n}
              </button>
            ))}
          </div>
          <Slider
            label="Health check every"
            value={s.interval}
            min={10}
            max={30}
            step={10}
            show={`${s.interval} s`}
            onChange={(v) => set({ interval: v })}
          />
          <Slider
            label="Failures before unhealthy"
            value={s.threshold}
            min={1}
            max={10}
            step={1}
            show={String(s.threshold)}
            onChange={(v) => set({ threshold: v })}
          />
          <Slider
            label="Answer TTL"
            value={s.ttl}
            min={10}
            max={300}
            step={10}
            show={`${s.ttl} s`}
            onChange={(v) => set({ ttl: v })}
          />
          <div>
            <div className="flex h-8 overflow-hidden rounded-lg text-[10px] font-medium">
              <motion.div
                className="bg-bad/70 grid place-items-center text-white"
                animate={{ width: `${(detect / total) * 100}%` }}
              >
                detect {fmt(detect)}
              </motion.div>
              <motion.div
                className="bg-accent text-accent-fg grid place-items-center"
                animate={{ width: `${(s.ttl / total) * 100}%` }}
              >
                caches expire {fmt(s.ttl)}
              </motion.div>
            </div>
            <p className="mt-2 text-sm">
              Up to <span className="font-mono font-semibold">{fmt(total)}</span> before every new
              visitor reaches the healthy region.
            </p>
          </div>
          <p className="text-muted text-[10px]">
            Worst case: detection (interval × failures) plus the TTL. Route 53 alias records to AWS
            load balancers use the load balancer&apos;s 60-second TTL. Traffic Manager marks an
            endpoint unhealthy on the failure after its 3 tolerated ones.
          </p>
        </div>
      }
    >
      <p>
        DNS failover has two delays. First, health checks must notice: Route 53 checks every 30
        seconds by default and gives up after 3 failures (and only if no more than 18% of its
        checkers worldwide still see the site). Then cached answers must expire.
      </p>
      <p>
        Shorter TTLs fail over faster but mean more DNS queries, and some resolvers ignore TTLs
        anyway. Existing connections don&apos;t move at all. For faster switching, global layer 7
        load balancers such as Azure Front Door and Google&apos;s global load balancers fail over
        behind one address, with no DNS change.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Private names and the edge ------------------------------------------------------------- */

const CARDS: [string, string][] = [
  [
    "Private zones",
    "Names that only resolve inside your networks, such as db.internal.example: Route 53 private hosted zones, Azure Private DNS zones, Cloud DNS private zones.",
  ],
  [
    "Split horizon",
    "The same name answers differently inside and outside: a private address for staff networks, a public one for the internet.",
  ],
  [
    "Hybrid resolvers",
    "So the office can resolve cloud names and the cloud can resolve office names: Route 53 VPC Resolver endpoints, Azure DNS Private Resolver, Cloud DNS forwarding.",
  ],
  [
    "CDN edges in India",
    "Content delivery networks cache files close to users. CloudFront lists edge locations in seven Indian areas, including Mumbai, New Delhi, Chennai, Bengaluru and Kolkata; Google Cloud CDN and Azure Front Door have edges in Mumbai, Delhi and Chennai too.",
  ],
];

export function PrivateAndEdge() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Private names and the edge"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {CARDS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Most names in a cloud estate are private: databases, internal services, queues. A{" "}
        <Term id="private-dns-zone">private DNS zone</Term> keeps them off the internet, and
        resolvers bridge to the office network from module 7.
      </p>
      <p>
        A <Term id="cdn">CDN</Term> sits in front of everything public, so the nearest edge answers
        most requests. Prices are small: a hosted zone is about $0.20–0.50 a month and a million
        queries about $0.40 on all three clouds, more with routing policies.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which routing policy? -------------------------------------------------------------------- */

export function PickPolicy() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which routing policy?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="routing-policy"
            prompt="Pick the routing policy for each need."
            categories={[
              { id: "latency", label: "Latency" },
              { id: "failover", label: "Failover" },
              { id: "weighted", label: "Weighted" },
              { id: "geo", label: "Geolocation" },
            ]}
            items={[
              {
                id: "fast",
                label: "Send each user to whichever region answers them fastest",
                category: "latency",
                why: "Latency routing uses measured network delay.",
              },
              {
                id: "dr",
                label: "Use the Hyderabad copy only when Mumbai is down",
                category: "failover",
                why: "A primary with a standby, switched by health checks.",
              },
              {
                id: "canary",
                label: "Send 5% of users to a new version to test it",
                category: "weighted",
                why: "Weights split answers by percentage.",
              },
              {
                id: "law",
                label: "Users in the EU must reach servers in the EU",
                category: "geo",
                why: "Geolocation routing answers by the user's (resolver's) country.",
              },
            ]}
            explanation="Policies can be combined: for example, latency routing between regions, each with failover inside."
          />
        </div>
      }
    >
      <p>Four needs, four policies.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["DNS steers traffic", "Latency, failover, weighted and geolocation answers."],
  ["Failover takes minutes", "Detection plus TTL; caches and connections linger."],
  ["Private names stay private", "Private zones, split horizon, hybrid resolvers."],
  ["Edges near users", "CDNs answer most public requests from close by."],
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
      <p>That completes networking. Next: who is allowed to do what, with identity and access.</p>
    </StepLayout>
  );
}
