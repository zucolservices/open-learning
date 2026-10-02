"use client";

import { motion } from "motion/react";
import { ArrowRight, Globe2, Router, Server, ShieldCheck } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AZS, HOURS, INR, REGIONS } from "./prices";
import type { InOutState } from "./state";

/* 1 ─ The reception desk ---------------------------------------------------------------------- */

export function Reception() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The reception desk"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Calling out",
              "Staff dial out through the switchboard. The other side sees the office's main number, and replies come back on the same line to the right desk.",
            ],
            [
              "Calling in",
              "A stranger can't dial an inside desk directly. Unless someone inside called first, the switchboard has nowhere to put the call.",
            ],
            [
              "The private corridor",
              "For the bank next door there's a private corridor: no street, no switchboard, no queue.",
            ],
            [
              "The postage",
              "Every parcel that leaves the building costs postage. Parcels inside are cheap or free.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
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
        An office has one main phone number. Staff can call out, and replies reach the right desk,
        but nobody outside can dial an inside desk uninvited.
      </p>
      <p>
        Private servers in the cloud work the same way. This module traces traffic in and out, shows
        a private corridor to cloud services, and counts the postage: the charges for data that
        leaves.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Trace a packet ⭐ -------------------------------------------------------------------------- */

type Hop = "server" | "nat" | "igw" | "net";

const FRAMES: { at: Hop; src: string; dst: string; title: string; body: string; drop?: boolean }[] =
  [
    {
      at: "server",
      src: "10.20.1.15:49152",
      dst: "203.0.113.10:443",
      title: "A private server asks for an update",
      body: "The app server in a private subnet has only a private address. It sends a request to an update server on the internet.",
    },
    {
      at: "nat",
      src: "10.20.0.9:7001",
      dst: "203.0.113.10:443",
      title: "The route table sends it to the NAT gateway",
      body: "The private subnet's default route points to the NAT gateway in a public subnet. NAT swaps the source for its own address and a new port, and writes the swap in its connection table.",
    },
    {
      at: "igw",
      src: "198.51.100.7:7001",
      dst: "203.0.113.10:443",
      title: "The internet gateway gives it a public address",
      body: "On AWS, the internet gateway then swaps the NAT gateway's private address for its public (Elastic IP) address. Now the packet can travel the internet.",
    },
    {
      at: "net",
      src: "203.0.113.10:443",
      dst: "198.51.100.7:7001",
      title: "The reply comes back",
      body: "The update server replies to the public address and port. It never learns the private server's address.",
    },
    {
      at: "server",
      src: "203.0.113.10:443",
      dst: "10.20.1.15:49152",
      title: "NAT finds the right desk",
      body: "The NAT gateway looks up port 7001 in its connection table and delivers the reply to 10.20.1.15:49152.",
    },
    {
      at: "nat",
      src: "192.0.2.66:51515",
      dst: "198.51.100.7:8080",
      title: "A stranger knocks",
      body: "A scanner sends a packet to the public address uninvited. There's no matching entry in the connection table, so it's dropped. NAT lets you call out, not be called.",
      drop: true,
    },
  ];

const HOPS: [Hop, string, typeof Server][] = [
  ["server", "App server (private subnet)", Server],
  ["nat", "NAT gateway (public subnet)", Router],
  ["igw", "Internet gateway", ShieldCheck],
  ["net", "The internet", Globe2],
];

export function TracePacket() {
  const [s, set] = useSceneState<InOutState>();
  const f = FRAMES[s.frame];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Trace a packet"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <div className="grid grid-cols-4 gap-1.5">
            {HOPS.map(([h, name, Icon]) => (
              <div
                key={h}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border px-1.5 py-2 text-center text-[10px] transition",
                  f.at === h
                    ? f.drop
                      ? "border-bad bg-bad/10"
                      : "border-accent bg-accent-soft"
                    : "border-line bg-surface",
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    f.at === h ? (f.drop ? "text-bad" : "text-accent") : "text-muted",
                  )}
                />
                {name}
              </div>
            ))}
          </div>
          <motion.div
            key={s.frame}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 font-mono text-xs",
              f.drop ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
            )}
          >
            <p className="text-muted font-sans text-[10px] tracking-wide uppercase">
              {f.drop ? "Packet dropped" : "Packet"}
            </p>
            <p className="flex flex-wrap items-center gap-1.5">
              <span>from {f.src}</span>
              <ArrowRight className="size-3" />
              <span>to {f.dst}</span>
            </p>
          </motion.div>
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.body}
          </FrameCaption>
          <p className="text-muted text-[10px]">
            Addresses are from the ranges reserved for examples (RFC 5737).
          </p>
        </div>
      }
    >
      <p>
        Follow one request out of a private subnet and back. <Term id="nat">NAT</Term> (network
        address translation) rewrites addresses on the way out and keeps a table so replies find
        their way home.
      </p>
      <p>
        The same idea exists everywhere: AWS NAT gateways (one per zone, or a newer regional one),
        Azure NAT Gateway (Microsoft recommends the zone-redundant StandardV2), and Google Cloud
        NAT, which is built into the network rather than running on a proxy machine.
      </p>
      <p>
        For people coming <em>in</em>, the usual pattern is a load balancer in the public subnets in
        front of servers in private subnets (module 4). Admins don&apos;t need public addresses
        either: AWS Session Manager, Azure Bastion and Google IAP let them in without opening ports.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The storage bill ⭐ (real list prices) ------------------------------------------------------- */

const inr = (usd: number) => `₹${Math.round(usd * INR).toLocaleString("en-IN")}`;

export function StorageBill() {
  const [s, set] = useSceneState<InOutState>();
  const r = REGIONS[s.region];
  const rows: [string, number, string][] = [
    [
      "Through the NAT gateways",
      r.natHour * HOURS * AZS + r.natGb * s.gb,
      `${AZS} NAT gateways × 730 h + $${r.natGb}/GB processed`,
    ],
    ["Through a gateway endpoint", 0, "No charge for S3 or DynamoDB gateway endpoints"],
    [
      "Through an interface endpoint",
      r.ifaceAzHour * HOURS * AZS + r.ifaceGb * s.gb,
      `${AZS} zones × 730 h + $${r.ifaceGb}/GB`,
    ],
  ];
  const max = Math.max(...rows.map((x) => x[1]), 1);
  return (
    <StepLayout
      eyebrow="Simulation · AWS list prices, 2 Oct 2026"
      title="The storage bill"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.region}
            options={[
              ["mumbai", "Mumbai"],
              ["us", "US East"],
            ]}
            onChange={(v) => set({ region: v })}
          />
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-40 shrink-0">Data to object storage each month</span>
            <input
              type="range"
              min={100}
              max={50000}
              step={100}
              value={s.gb}
              onChange={(e) => set({ gb: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-16 text-right font-mono">
              {s.gb >= 1000 ? `${(s.gb / 1000).toFixed(1)} TB` : `${s.gb} GB`}
            </span>
          </label>
          <div className="flex flex-col gap-2">
            {rows.map(([n, v, how]) => (
              <div
                key={n}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  v === 0 ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="font-medium">{n}</span>
                  <span className="font-mono text-sm">
                    ${v.toFixed(0)} <span className="text-muted text-[11px]">≈ {inr(v)}</span>
                  </span>
                </div>
                <div className="bg-surface-2 mt-1.5 h-2 overflow-hidden rounded">
                  <motion.div
                    className="bg-accent h-full"
                    animate={{ width: `${(v / max) * 100}%` }}
                  />
                </div>
                <p className="text-muted mt-1 text-[10px]">{how}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            {r.name}. Monthly, before tax; ₹{INR} to the dollar. The storage itself and requests are
            charged the same either way.
          </p>
        </div>
      }
    >
      <p>
        App servers in private subnets often move a lot of data to object storage: backups, logs,
        uploaded files. If that traffic goes out through the NAT gateway, you pay NAT&apos;s
        per-gigabyte processing charge on all of it.
      </p>
      <p>
        A <Term id="private-endpoint">private endpoint</Term> is a private corridor to the service.
        AWS&apos;s free gateway endpoints for S3 and DynamoDB skip the NAT charge entirely, and
        AWS&apos;s own docs suggest them for exactly this. Interface endpoints (AWS PrivateLink),
        Azure private endpoints and Google Private Service Connect do the same for many more
        services, at about a cent an hour and a cent a gigabyte.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What leaving costs ------------------------------------------------------------------------- */

const EGRESS: [string, string, string][] = [
  [
    "AWS",
    "First 100 GB a month free, then $0.09/GB (US East) or about $0.11/GB (Mumbai)",
    "Between zones: $0.01/GB each way",
  ],
  [
    "Azure",
    "First 100 GB free, then $0.087/GB from North America or Europe, $0.12/GB from Asia (Microsoft network)",
    "Between zones: no charge",
  ],
  [
    "Google Cloud",
    "Premium tier $0.12/GiB; Standard tier $0.085/GiB after 200 GiB free (US prices)",
    "Rates vary by region and tier",
  ],
];

export function Leaving() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What leaving costs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-2">
            {EGRESS.map(([n, out, between], i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface rounded-xl border px-3 py-2"
              >
                <p className="text-sm font-semibold">{n}</p>
                <p className="text-xs">{out}</p>
                <p className="text-muted text-[11px]">{between}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Internet data transfer out, list prices observed 2 October 2026. Data coming in is free
            on all three.
          </p>
        </div>
      }
    >
      <p>
        Data coming into the cloud is free; data going out to the internet costs money, called{" "}
        <Term id="egress">egress</Term>. A popular file download, a video stream or copying a backup
        out of the cloud can become a big part of the bill. On AWS, even traffic between zones costs
        a little.
      </p>
      <p>
        Leaving a provider used to mean a large egress bill. Since 2024 all three waive it if
        you&apos;re moving out (with conditions and time limits: AWS 90 days, Azure 60, Google after
        an exit notice), and the EU Data Act requires switching charges to reach zero from January
        2027.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Fix the bill ---------------------------------------------------------------------------- */

export function FixTheBill() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fix the bill"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="nat-bill"
            prompt="A department's AWS bill shows a large NAT gateway data-processing charge. Logs show 90% of that traffic is servers writing backups to S3 in the same region. What's the best first fix?"
            options={[
              {
                id: "endpoint",
                label: "Add an S3 gateway endpoint to the private subnets' route tables",
                correct: true,
                feedback:
                  "Yes. S3 traffic then bypasses the NAT gateway, and gateway endpoints cost nothing. AWS's own docs suggest it.",
              },
              {
                id: "public",
                label: "Give the servers public IPs and move them to public subnets",
                feedback:
                  "That removes the NAT charge but exposes the servers to the internet. Never trade security for a fix that exists for free.",
              },
              {
                id: "bigger",
                label: "Switch to a larger NAT gateway",
                feedback:
                  "NAT is charged per gigabyte processed; a bigger one doesn't make the gigabytes cheaper.",
              },
              {
                id: "fewer",
                label: "Take backups less often",
                feedback:
                  "It might cut the bill, but weakens recovery. Fix the path, not the backups.",
              },
            ]}
          />
        </div>
      }
    >
      <p>A real-shaped bill shock. Which fix keeps the servers private and cuts the cost?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["NAT calls out", "Private servers reach the internet; nobody can call them uninvited."],
  ["Endpoints are corridors", "Reach cloud services privately, often cheaper than NAT."],
  ["Leaving costs money", "Egress to the internet is metered; data coming in is free."],
  ["No public IPs for admins", "Session Manager, Bastion and IAP instead of open ports."],
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
      <p>Next: connecting many networks together, and to your offices and data centres.</p>
    </StepLayout>
  );
}
