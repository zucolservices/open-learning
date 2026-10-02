"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ConnectState } from "./state";

/* 1 ─ Bridges between islands ------------------------------------------------------------------- */

export function Bridges() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Bridges between islands"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <svg
            viewBox="0 0 240 120"
            className="w-full max-w-md"
            role="img"
            aria-label="Islands A, B and C, with bridges A–B and B–C but none from A to C"
          >
            {[
              [40, 60, "A"],
              [120, 30, "B"],
              [200, 60, "C"],
            ].map(([x, y, n]) => (
              <g key={n as string}>
                <ellipse
                  cx={x as number}
                  cy={y as number}
                  rx="26"
                  ry="16"
                  className="fill-accent-soft stroke-accent"
                />
                <text
                  x={x as number}
                  y={(y as number) + 4}
                  textAnchor="middle"
                  className="fill-fg text-[11px] font-semibold"
                >
                  {n}
                </text>
              </g>
            ))}
            <line x1="62" y1="52" x2="98" y2="38" className="stroke-fg" strokeWidth="2" />
            <line x1="142" y1="38" x2="178" y2="52" className="stroke-fg" strokeWidth="2" />
            <line
              x1="66"
              y1="66"
              x2="174"
              y2="66"
              className="stroke-bad"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text x="120" y="82" textAnchor="middle" className="fill-bad text-[8px]">
              no bridge from A to C
            </text>
          </svg>
        </div>
      }
    >
      <p>
        Three islands. There&apos;s a bridge from A to B and one from B to C. Can you drive from A
        to C? Not with these bridges: each one only joins its own two islands, and you&apos;re not
        allowed to cut across B.
      </p>
      <p>
        Cloud networks connected by <Term id="peering">peering</Term> behave the same way. AWS:
        &ldquo;VPC peering does not support transitive peering relationships&rdquo;. Google and
        Azure peering work alike. So connecting many networks needs a plan.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Every pair, or a hub? ⭐ -------------------------------------------------------------------- */

export function MeshOrHub() {
  const [s, set] = useSceneState<ConnectState>();
  const n = s.n;
  const R = 70;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [120 + R * Math.cos(a), 90 + R * Math.sin(a)];
  });
  const links: [number, number][] = [];
  if (s.topo === "mesh")
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) links.push([i, j]);
  const count = s.topo === "mesh" ? (n * (n - 1)) / 2 : n;
  const tgwUs = n * 0.05 * 730;
  const tgwMumbai = n * 0.07 * 730;
  return (
    <StepLayout
      eyebrow="Build & connect"
      title="Every pair, or a hub?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.topo}
            options={[
              ["mesh", "Peer every pair (full mesh)"],
              ["hub", "Connect through a hub"],
            ]}
            onChange={(v) => set({ topo: v })}
          />
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-24 shrink-0">Networks</span>
            <input
              type="range"
              min={2}
              max={14}
              value={n}
              onChange={(e) => set({ n: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-6 text-right font-mono">{n}</span>
          </label>
          <svg
            viewBox="0 0 240 180"
            className="bg-surface-2 max-h-64 w-full rounded-lg"
            role="img"
            aria-label={`${n} networks connected by ${count} links`}
          >
            {links.map(([i, j]) => (
              <line
                key={`${i}-${j}`}
                x1={pts[i][0]}
                y1={pts[i][1]}
                x2={pts[j][0]}
                y2={pts[j][1]}
                className="stroke-fg/50"
                strokeWidth="0.8"
              />
            ))}
            {s.topo === "hub" &&
              pts.map(([x, y], i) => (
                <line
                  key={i}
                  x1="120"
                  y1="90"
                  x2={x}
                  y2={y}
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                />
              ))}
            {s.topo === "hub" && (
              <g>
                <circle cx="120" cy="90" r="13" fill="var(--accent)" />
                <text
                  x="120"
                  y="93"
                  textAnchor="middle"
                  className="fill-accent-fg text-[8px] font-semibold"
                >
                  hub
                </text>
              </g>
            )}
            {pts.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="9" className="fill-surface stroke-fg" strokeWidth="1" />
                <text x={x} y={y + 3} textAnchor="middle" className="fill-fg text-[7px]">
                  {String.fromCharCode(65 + i)}
                </text>
              </g>
            ))}
          </svg>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted text-[10px]">Links to set up and maintain</p>
              <p className="font-mono text-2xl">{count}</p>
              <p className="text-muted text-[10px]">
                {s.topo === "mesh" ? "n × (n − 1) ÷ 2" : "one per network"}
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              {s.topo === "hub" ? (
                <>
                  <p className="text-muted text-[10px]">AWS Transit Gateway, attachments only</p>
                  <p className="font-mono text-sm">${tgwUs.toFixed(0)}/month US East</p>
                  <p className="font-mono text-sm">${tgwMumbai.toFixed(0)}/month Mumbai</p>
                  <p className="text-muted text-[10px]">plus $0.02 per GB through the hub</p>
                </>
              ) : (
                <>
                  <p className="text-muted text-[10px]">Each network&apos;s peering links</p>
                  <p className="font-mono text-2xl">{n - 1}</p>
                  <p className="text-muted text-[10px]">AWS allows 50 per VPC by default</p>
                </>
              )}
            </div>
          </div>
        </div>
      }
    >
      <p>
        With peering, every pair of networks that must talk needs its own link. Six networks need
        15; fourteen need 91. Each link also needs routes on both sides.
      </p>
      <p>
        A <Term id="transit-hub">hub</Term> turns this into one link per network, and traffic
        between spokes goes through the hub, where a firewall can inspect it. AWS Transit Gateway
        and Cloud WAN, Azure Virtual WAN or a hub network with Azure Virtual Network Manager, and
        Google Network Connectivity Center all do this. The hub costs money per attachment and per
        gigabyte; the links you no longer manage are the saving.
      </p>
      <p>
        Small and simple: peer. Growing, or shared services and firewalls in the middle: use a hub.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Reaching the office ⭐ (real list prices) ----------------------------------------------------- */

const VPN_MONTH = 0.05 * 730; // AWS Site-to-Site VPN connection
const DX_MONTH = 0.3 * 730; // AWS Direct Connect 1 Gbps dedicated port
const OUT_INTERNET = 0.1093; // data out from Mumbai to the internet (used by VPN)
const OUT_DX = 0.045; // data out from AWS India regions to an Indian Direct Connect location
const BREAK_EVEN = (DX_MONTH - VPN_MONTH) / (OUT_INTERNET - OUT_DX);

const COMPARE: [string, string, string][] = [
  ["Path", "Over the internet, encrypted (IPsec)", "A private line through a colocation site"],
  [
    "Speed",
    "Up to 1.25 Gbps per tunnel by default",
    "1, 10, 100 or 400 Gbps dedicated; 50 Mbps–25 Gbps via partners",
  ],
  [
    "Redundancy",
    "Two tunnels, ending in different zones",
    "Order two lines, ideally at two locations",
  ],
  ["Encryption", "Always", "Not by default; add MACsec or a VPN over it"],
  ["India", "Anywhere with internet", "AWS: Mumbai, Delhi, Chennai, Hyderabad, Bangalore, Kolkata"],
];

export function Office() {
  const [s, set] = useSceneState<ConnectState>();
  const vpn = VPN_MONTH + OUT_INTERNET * s.gb;
  const dx = DX_MONTH + OUT_DX * s.gb;
  return (
    <StepLayout
      eyebrow="Simulation · AWS list prices, 2 Oct 2026"
      title="Reaching the office"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-muted">
                  <th className="py-1 text-left font-normal" />
                  <th className="py-1 text-left font-normal">Site-to-site VPN</th>
                  <th className="py-1 text-left font-normal">Dedicated line</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r[0]} className="border-line border-t">
                    {r.map((c, i) => (
                      <td key={i} className={cn("py-1.5 pr-2 align-top", i === 0 && "font-medium")}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-40 shrink-0">
              Data from the cloud to the office each month
            </span>
            <input
              type="range"
              min={50}
              max={10000}
              step={50}
              value={s.gb}
              onChange={(e) => set({ gb: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-16 text-right font-mono">
              {s.gb >= 1000 ? `${(s.gb / 1000).toFixed(1)} TB` : `${s.gb} GB`}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["VPN", vpn, "$36.50 connection + $0.1093/GB out"],
              ["Dedicated 1 Gbps", dx, "$219 port + $0.045/GB out"],
            ].map(([n, v, how]) => (
              <div
                key={n as string}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  (v as number) <= Math.min(vpn, dx)
                    ? "border-good/50 bg-good/10"
                    : "border-line bg-surface",
                )}
              >
                <p className="font-medium">{n}</p>
                <p className="font-mono text-lg">${(v as number).toFixed(0)}/month</p>
                <p className="text-muted text-[10px]">{how}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Mumbai prices from AWS&apos;s price list. Break-even is about{" "}
            {(BREAK_EVEN / 1000).toFixed(1)} TB a month. Ignores the colocation and telecom charges
            a dedicated line also needs.
          </p>
        </div>
      }
    >
      <p>
        An office or data centre connects to the cloud in one of two ways. A{" "}
        <Term id="site-to-site-vpn">site-to-site VPN</Term> is an encrypted tunnel over the
        internet: quick and cheap. A <Term id="dedicated-connection">dedicated connection</Term>{" "}
        (AWS Direct Connect, Azure ExpressRoute, Google Cloud Interconnect) is a private line
        through a colocation site: faster and steadier, and data out of the cloud over it is
        cheaper.
      </p>
      <p>
        Slide the monthly data. Below about 2.8 TB the VPN is cheaper; above it the dedicated line
        pays for its port. Both sides usually learn each other&apos;s routes automatically with BGP,
        the internet&apos;s standard routing protocol.
      </p>
      <p>
        One rule from module 5 bites here: the office and cloud ranges must not overlap.
        Azure&apos;s answer to &ldquo;can they overlap?&rdquo; is simply &ldquo;No.&rdquo;
        Workarounds (private NAT, private endpoints) exist but add complexity.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which connection? -------------------------------------------------------------------------- */

export function WhichConnection() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which connection?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-connection"
            prompt="Pick the connection that fits each need."
            categories={[
              { id: "peer", label: "Peering" },
              { id: "hub", label: "Hub" },
              { id: "vpn", label: "VPN" },
              { id: "dx", label: "Dedicated line" },
            ]}
            items={[
              {
                id: "two",
                label: "Two networks owned by one team need to talk",
                category: "peer",
                why: "One link, no extra gateway: peering is simplest.",
              },
              {
                id: "twenty",
                label: "Twenty networks, two offices and a central firewall",
                category: "hub",
                why: "A hub keeps it to one link per network and lets the firewall inspect traffic between them.",
              },
              {
                id: "branch",
                label: "A branch office moving 50 GB a month, needed next week",
                category: "vpn",
                why: "Quick to set up over the internet and cheap at low volumes.",
              },
              {
                id: "dc",
                label:
                  "A data centre sending several terabytes a month, needing steady low latency",
                category: "dx",
                why: "Predictable performance, and cheaper data out above a few terabytes.",
              },
            ]}
            explanation="Peering for a few networks, a hub as they multiply, a VPN to get going, a dedicated line when volume or steadiness demands it. Many organisations use a VPN as the backup for a dedicated line."
          />
        </div>
      }
    >
      <p>Four situations, four kinds of connection.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Peering isn't transitive", "A–B and B–C don't connect A to C."],
  ["Hubs scale", "One link per network instead of one per pair."],
  ["VPN or dedicated", "Quick and encrypted vs fast and steady; volume decides cost."],
  ["No overlaps", "Plan address ranges before you connect anything."],
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
      <p>Next: names, not numbers. DNS, and sending users to the right place.</p>
    </StepLayout>
  );
}
