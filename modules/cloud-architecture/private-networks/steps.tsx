"use client";

import { motion } from "motion/react";
import { Check, Plus, Trash2, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  format,
  intToIp,
  isPrivate,
  last,
  nextFree,
  overlaps,
  parse,
  size,
  type Block,
} from "./cidr";
import type { NetState } from "./state";

/* 1 ─ A housing society -------------------------------------------------------------------------- */

const SOCIETY: [string, string][] = [
  ["The society's land", "Your address range: every house number you may use."],
  ["Blocks", "Subnets: groups of houses, some facing the main road, some tucked inside."],
  ["Road signs", "Route tables: which way traffic goes for each destination."],
  ["The main gate", "The internet gateway: the only way in from outside."],
  ["Guards", "Firewalls: at each building's door, and at each block's entrance."],
];

export function HousingSociety() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A housing society"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SOCIETY.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex items-baseline gap-3 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="w-36 shrink-0 font-semibold">{t}</span>
              <span className="text-muted text-xs">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A gated housing society owns a plot of land, divides it into blocks, puts up road signs and
        has one main gate with a guard. Some blocks face the main road; others are deliberately
        tucked away.
      </p>
      <p>
        In the cloud you build the same thing for your servers: a private network. AWS and Google
        call it a <Term id="vpc">VPC</Term> (virtual private cloud); Azure calls it a VNet. This
        module builds one.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Address ranges, live ------------------------------------------------------------------- */

const RESERVED: [string, number][] = [
  ["AWS", 5],
  ["Azure", 5],
  ["Google Cloud", 4],
];

export function AddressRanges() {
  const [s, set] = useSceneState<NetState>();
  const b = parse(s.probe);
  const bits = b
    ? Array.from({ length: 32 }, (_, i) => Math.floor(b.base / 2 ** (31 - i)) % 2)
    : [];
  return (
    <StepLayout
      eyebrow="Sandbox · real arithmetic"
      title="Address ranges, live"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs">
            <span className="text-muted">Type a range (CIDR)</span>
            <input
              value={s.probe}
              onChange={(e) => set({ probe: e.target.value })}
              spellCheck={false}
              className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-sm"
            />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              "10.0.0.0/16",
              "10.0.1.0/24",
              "10.0.1.0/28",
              "172.16.0.0/12",
              "192.168.1.0/24",
              "100.64.0.0/10",
            ].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set({ probe: c })}
                className="border-line hover:bg-surface-2 rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
              >
                {c}
              </button>
            ))}
          </div>
          {!b ? (
            <p className="border-bad/50 bg-bad/10 rounded-lg border px-3 py-2 text-xs">
              Not a valid range. Try something like 10.0.0.0/16.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-0.5 font-mono text-[11px]">
                {bits.map((v, i) => (
                  <span
                    key={i}
                    className={cn(
                      "grid h-6 w-[calc((100%-15*0.125rem)/16)] min-w-4 place-items-center rounded-sm sm:w-5",
                      i < b.prefix ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                      i % 8 === 7 && "mr-1",
                    )}
                  >
                    {i < b.prefix ? v : "·"}
                  </span>
                ))}
              </div>
              <p className="text-muted -mt-1 text-[10px]">
                The first {b.prefix} bits are fixed (the network); the other {32 - b.prefix} can
                vary.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                  <p className="font-mono">{format(b)}</p>
                  <p className="text-muted">
                    {intToIp(b.base)} to {intToIp(last(b))}
                  </p>
                  <p className="mt-1 font-mono text-lg">
                    {size(b).toLocaleString("en-IN")} addresses
                  </p>
                  <p className={cn("text-[11px]", isPrivate(b) ? "text-good" : "text-muted")}>
                    {isPrivate(b)
                      ? "Inside a private (RFC 1918) range"
                      : "Not an RFC 1918 private range"}
                  </p>
                </div>
                <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                  <p className="text-muted mb-1">Usable in one subnet this size</p>
                  {RESERVED.map(([n, r]) => (
                    <p key={n} className="flex justify-between">
                      <span>{n}</span>
                      <span className="font-mono">
                        {Math.max(0, size(b) - r).toLocaleString("en-IN")}
                      </span>
                    </p>
                  ))}
                  <p className="text-muted mt-1 text-[10px]">
                    AWS and Azure reserve 5 addresses per subnet; Google 4.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      }
    >
      <p>
        Every server needs an address. A range is written as a starting address and a slash:{" "}
        <Term id="cidr">CIDR notation</Term>. The number after the slash says how many leading bits
        are fixed. Each bit you free up doubles the range: a /24 has 256 addresses, a /16 has
        65,536.
      </p>
      <p>
        Private networks use ranges set aside for that purpose (RFC 1918): 10.0.0.0/8, 172.16.0.0/12
        and 192.168.0.0/16. Try a few, and notice the cloud keeps a few addresses in every subnet
        for its own router and DNS.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Carve the network ⭐ ----------------------------------------------------------------------- */

const OFFICE = parse("10.0.0.0/16")!;
const VPC_CHOICES = ["10.0.0.0/16", "10.20.0.0/16", "10.20.0.0/22"];
const SLOTS: [string, string, string][] = [
  ["pubA", "Public", "Zone A"],
  ["privA", "Private", "Zone A"],
  ["pubB", "Public", "Zone B"],
  ["privB", "Private", "Zone B"],
];
const SIZES = [20, 22, 24, 26];

function allocate(vpc: Block, slots: Record<string, number>) {
  const taken: Block[] = [];
  const out: Record<string, Block | null> = {};
  for (const [id] of SLOTS) {
    const p = slots[id];
    if (!p) continue;
    const b = p >= vpc.prefix ? nextFree(vpc, p, taken) : null;
    out[id] = b;
    if (b) taken.push(b);
  }
  return { out, used: taken.reduce((a, b) => a + size(b), 0) };
}

export function Carve() {
  const [s, set] = useSceneState<NetState>();
  const vpc = parse(s.vpc)!;
  const { out, used } = allocate(vpc, s.slots);
  const allPlaced = SLOTS.every(([id]) => out[id]);
  const checks: [boolean, string][] = [
    [!overlaps(vpc, OFFICE), "Doesn't overlap the office network (10.0.0.0/16)"],
    [allPlaced, "A public and a private subnet in each zone"],
    [allPlaced && used / size(vpc) <= 0.5, "At least half the range left for growth"],
  ];
  return (
    <StepLayout
      eyebrow="Build & connect · real arithmetic"
      title="Carve the network"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <p className="text-muted mb-1 text-[11px]">Your network&apos;s range</p>
            <Segmented
              size="sm"
              value={s.vpc}
              options={VPC_CHOICES.map((c) => [c, c] as [string, string])}
              onChange={(v) => set({ vpc: v })}
            />
          </div>
          <div className="bg-surface-2 relative h-8 overflow-hidden rounded-lg">
            {SLOTS.map(([id, kind]) => {
              const b = out[id];
              if (!b) return null;
              return (
                <motion.div
                  key={id}
                  layout
                  className={cn(
                    "absolute top-0 bottom-0 border-r",
                    kind === "Public" ? "bg-accent" : "bg-accent/50",
                  )}
                  style={{
                    left: `${((b.base - vpc.base) / size(vpc)) * 100}%`,
                    width: `${Math.max(0.6, (size(b) / size(vpc)) * 100)}%`,
                  }}
                />
              );
            })}
          </div>
          <p className="text-muted -mt-2 text-[10px]">
            The whole range, left to right. Used: {Math.round((used / size(vpc)) * 1000) / 10}%.
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {SLOTS.map(([id, kind, zone]) => {
              const b = out[id];
              const chosen = s.slots[id];
              return (
                <div
                  key={id}
                  className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {kind} subnet · {zone}
                    </span>
                    {chosen ? (
                      <button
                        type="button"
                        aria-label={`Remove ${kind} subnet in ${zone}`}
                        onClick={() => {
                          const next = { ...s.slots };
                          delete next[id];
                          set({ slots: next });
                        }}
                        className="text-muted hover:text-fg"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    ) : null}
                  </div>
                  {chosen ? (
                    b ? (
                      <p className="mt-0.5 font-mono">
                        {format(b)}{" "}
                        <span className="text-muted">
                          ({(size(b) - 5).toLocaleString("en-IN")} usable on AWS)
                        </span>
                      </p>
                    ) : (
                      <p className="text-bad mt-0.5">Doesn&apos;t fit in the range.</p>
                    )
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {SIZES.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => set({ slots: { ...s.slots, [id]: p } })}
                          className="border-line hover:bg-surface-2 flex items-center gap-0.5 rounded-full border px-2 py-0.5 font-mono text-[11px]"
                        >
                          <Plus className="size-3" />/{p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <ul className="flex flex-col gap-1">
            {checks.map(([ok, t]) => (
              <li key={t} className="flex items-center gap-1.5 text-xs">
                {ok ? (
                  <Check className="text-good size-3.5" />
                ) : (
                  <X className="text-bad size-3.5" />
                )}
                {t}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <p>
        Pick a range for the network, then add four <Term id="subnet">subnets</Term>: a public and a
        private one in each of two zones. Each subnet takes the next free block.
      </p>
      <p>
        Two habits matter. Never overlap another network you&apos;ll connect to, like the office:
        connections between overlapping networks fail (module 7). And leave room to grow, because a
        range can be added to but not resized. Experts disagree on how big: AWS&apos;s default
        network is a /16, while Azure&apos;s guidance says not to create large networks like a /16.
      </p>
      <p>
        This layout is AWS-style, where a subnet lives in one zone. On Azure, subnets span all zones
        in a region; on Google the network is global and each subnet covers a whole region.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Write the route tables ⭐ ------------------------------------------------------------------ */

type Route = NetState["pubRoute"];
const ROUTES: [Route, string][] = [
  ["none", "No route"],
  ["igw", "Internet gateway"],
  ["nat", "NAT gateway"],
];

function RouteTable({
  name,
  vpc,
  value,
  onChange,
}: {
  name: string;
  vpc: string;
  value: Route;
  onChange(v: Route): void;
}) {
  return (
    <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
      <p className="font-semibold">{name}</p>
      <table className="mt-1 w-full font-mono text-[11px]">
        <thead>
          <tr className="text-muted">
            <th className="text-left font-normal">Destination</th>
            <th className="text-left font-normal">Target</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-0.5">{vpc}</td>
            <td>local</td>
          </tr>
          <tr>
            <td className="py-0.5">0.0.0.0/0</td>
            <td>
              <select
                aria-label={`${name}: target for 0.0.0.0/0`}
                value={value}
                onChange={(e) => onChange(e.target.value as Route)}
                className="border-line bg-surface-2 rounded border px-1 py-0.5 font-sans"
              >
                {ROUTES.map(([k, n]) => (
                  <option key={k} value={k}>
                    {n}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function Routes() {
  const [s, set] = useSceneState<NetState>();
  const tests: [string, boolean, string][] = [
    [
      "People on the internet can reach the website (public subnet, with a public IP)",
      s.pubRoute === "igw",
      s.pubRoute === "igw"
        ? "The public route table sends internet traffic to the gateway."
        : "Without a route to the internet gateway, replies can't get out.",
    ],
    [
      "The database (private subnet) can't be reached from the internet",
      s.privRoute !== "igw",
      s.privRoute === "igw"
        ? "A route to the internet gateway makes this a public subnet: the database is exposed if it gets a public IP."
        : "No direct route in from the internet. Good.",
    ],
    [
      "The app servers (private subnet) can download security updates",
      s.privRoute === "nat",
      s.privRoute === "nat"
        ? "Outbound traffic goes through the NAT gateway in the public subnet (module 6)."
        : s.privRoute === "igw"
          ? "It works, but only by making the subnet public."
          : "With no route out, updates can't be fetched.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Build & connect"
      title="Write the route tables"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <RouteTable
              name="Public subnets' route table"
              vpc={s.vpc}
              value={s.pubRoute}
              onChange={(v) => set({ pubRoute: v })}
            />
            <RouteTable
              name="Private subnets' route table"
              vpc={s.vpc}
              value={s.privRoute}
              onChange={(v) => set({ privRoute: v })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            {tests.map(([t, ok, why]) => (
              <motion.div
                key={t}
                layout
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
                )}
              >
                <p className="flex items-center gap-1.5 font-medium">
                  {ok ? (
                    <Check className="text-good size-3.5" />
                  ) : (
                    <X className="text-bad size-3.5" />
                  )}
                  {t}
                </p>
                <p className="text-muted mt-0.5 pl-5">{why}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A <Term id="route-table">route table</Term> tells traffic where to go. Every table has a
        &ldquo;local&rdquo; route so subnets in the network can reach each other. You add a default
        route, 0.0.0.0/0 (&ldquo;everything else&rdquo;), to choose how traffic leaves.
      </p>
      <p>
        On AWS, a subnet is public when its route table has a direct route to an{" "}
        <Term id="internet-gateway">internet gateway</Term>; a server there also needs a public IP
        address. Private subnets reach out through a NAT gateway instead, which lets them start
        connections out but not receive them. Make all three tests pass.
      </p>
      <p>
        Azure and Google have no &ldquo;public subnet&rdquo; switch: routes apply network-wide, and
        servers get out through a public IP or a NAT service. New Azure subnets are private by
        default since 2026.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Guards at the door ---------------------------------------------------------------------------- */

const FW: [string, string, string][] = [
  [
    "AWS security group",
    "Around each server (network interface)",
    "Stateful · allow rules only · new groups allow all outbound, nothing inbound",
  ],
  [
    "AWS network ACL",
    "Around each subnet",
    "Stateless · allow and deny rules, checked in number order",
  ],
  [
    "Azure network security group",
    "Around a subnet or a server's interface",
    "Stateful · allow and deny · priority 100–4096",
  ],
  [
    "Google Cloud firewall rules",
    "Across the whole network, targeted by tags or service accounts",
    "Stateful · allow and deny · implied: deny in, allow out",
  ],
];

export function Firewalls() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Guards at the door"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FW.map(([t, where, how], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-xs">{where}</p>
              <p className="text-muted text-[11px]">{how}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Routes decide where traffic <em>can</em> go; firewalls decide what&apos;s <em>allowed</em>.
        Every cloud has both.
      </p>
      <p>
        A <Term id="stateful-firewall">stateful</Term> firewall remembers connections: if a request
        was allowed out, its reply is allowed back in automatically. A stateless one checks every
        packet on its own, so you must allow the replies too, which is easy to get wrong.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Security group or network ACL? -------------------------------------------------------------- */

export function SgOrNacl() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Security group or network ACL?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="sg-nacl"
            prompt="On AWS, which describes a security group and which a network ACL?"
            categories={[
              { id: "sg", label: "Security group" },
              { id: "nacl", label: "Network ACL" },
            ]}
            items={[
              {
                id: "stateful",
                label: "Remembers connections, so replies are allowed back automatically",
                category: "sg",
                why: "Security groups are stateful.",
              },
              {
                id: "stateless",
                label: "Checks every packet on its own; replies need their own rule",
                category: "nacl",
                why: "Network ACLs are stateless.",
              },
              {
                id: "server",
                label: "Attached around each server's network interface",
                category: "sg",
                why: "Security groups work at the instance level.",
              },
              {
                id: "subnet",
                label: "Applies to everything in a subnet",
                category: "nacl",
                why: "Network ACLs work at the subnet level.",
              },
              {
                id: "allow",
                label: "Only allow rules; anything not allowed is blocked",
                category: "sg",
                why: "Security groups have no deny rules.",
              },
              {
                id: "deny",
                label: "Can explicitly deny a range, such as a known bad address",
                category: "nacl",
                why: "Network ACLs support deny rules, checked in number order.",
              },
            ]}
            explanation="Most teams rely on security groups for day-to-day rules and use network ACLs, if at all, as a coarse extra layer at the subnet edge."
          />
        </div>
      }
    >
      <p>Six descriptions. Which kind of AWS firewall is each?</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Plan the range", "Private, no overlaps with networks you'll connect, room to grow."],
  ["Subnets group servers", "AWS: one zone each. Azure and Google: span zones."],
  [
    "Routes make it public",
    "A direct route to the internet gateway; private subnets go out via NAT.",
  ],
  ["Firewalls allow", "Stateful rules around servers; stateless ones at the subnet edge."],
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
      <p>Next: how traffic actually gets in and out, and what leaving the cloud costs.</p>
    </StepLayout>
  );
}
