"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { RegionsState } from "./state";
import { BreakPanel } from "./break-model";

/* 1 ─ Eggs and baskets -------------------------------------------------------------------------- */

const NEST: [string, string][] = [
  ["Data centre", "One building, or part of one: racks of servers, power, cooling."],
  ["Availability zone", "One or more data centres with their own power, cooling and network."],
  ["Region", "Three or more zones in one metro area, kilometres apart."],
  ["The world", "Regions hundreds of kilometres apart, in dozens of countries."],
];

/** Draws the four baskets as boxes inside boxes, outermost first. */
function Nest({ level }: { level: number }) {
  const [t, d] = NEST[level];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25 * (3 - level) }}
      className={cn(
        "border-accent/60 w-full max-w-md rounded-2xl border p-3",
        level === 0 ? "bg-accent-soft" : "bg-surface/60",
      )}
    >
      <p className="text-xs font-semibold">{t}</p>
      <p className="text-muted text-[11px]">{d}</p>
      {level > 0 && (
        <div className="mt-2">
          <Nest level={level - 1} />
        </div>
      )}
    </motion.div>
  );
}

export function Baskets() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Eggs and baskets"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <Nest level={3} />
        </div>
      }
    >
      <p>
        Don&apos;t put all your eggs in one basket, and know how big your baskets are. Cloud
        providers build in nested baskets, each designed to fail without taking the next one down.
      </p>
      <p>
        A <Term id="availability-zone">zone</Term> is one or more data centres with their own power,
        cooling and network. A <Term id="region">region</Term> is a cluster of zones in one metro
        area. A zone isn&apos;t always a separate building: in a few of Google&apos;s regions, three
        zones share one or two buildings.
      </p>
      <p>
        The architect&apos;s job is to choose how many baskets an application spreads across, and to
        pay for that choice knowingly.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Break the data centre ⭐ ------------------------------------------------------------------- */

export function BreakIt() {
  const [s, set] = useSceneState<RegionsState>();
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Break the data centre"
      stage={
        <BreakPanel
          design={s.design}
          failure={s.failure}
          onDesign={(v) => set({ design: v })}
          onFailure={(v) => set({ failure: v })}
        />
      }
    >
      <p>
        Pick a design, then break something. Each failure here has happened for real; the cards name
        one example from the providers&apos; own incident reports.
      </p>
      <p>
        Spreading across zones survives a building or a zone at almost no extra design effort, and
        it&apos;s what the providers&apos; best <Term id="sla">SLAs</Term> require. Surviving a
        whole region means a full second copy far away, which costs much more and needs careful
        failover. Module 17 goes deeper.
      </p>
      <p>
        One warning: being in three zones only helps if everything you depend on is too. In Paris in
        2023, a water leak and fire took out one of Google&apos;s three buildings, but a database
        the region relied on wasn&apos;t spread across all three, so the whole region stumbled.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where the cloud is in India --------------------------------------------------------------- */

const INDIA: Record<RegionsState["cloud"], { name: string; city: string; zones: string }[]> = {
  aws: [
    { name: "Asia Pacific (Mumbai) · ap-south-1", city: "Mumbai", zones: "3 zones" },
    { name: "Asia Pacific (Hyderabad) · ap-south-2", city: "Hyderabad", zones: "3 zones" },
    { name: "Local Zones", city: "Delhi, Kolkata", zones: "single-site extensions, not zones" },
  ],
  gcp: [
    { name: "asia-south1", city: "Mumbai", zones: "3 zones" },
    { name: "asia-south2", city: "Delhi", zones: "3 zones" },
  ],
  azure: [
    { name: "Central India", city: "Pune", zones: "3 zones" },
    { name: "India South Central", city: "Hyderabad (opened August 2026)", zones: "3 zones" },
    { name: "South India", city: "Chennai", zones: "no availability zones" },
    { name: "West India", city: "Mumbai", zones: "no availability zones" },
  ],
};

export function India() {
  const [s, set] = useSceneState<RegionsState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where the cloud is in India"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.cloud}
            options={[
              ["aws", "AWS"],
              ["gcp", "Google Cloud"],
              ["azure", "Microsoft Azure"],
            ]}
            onChange={(v) => set({ cloud: v })}
          />
          <div className="flex flex-col gap-1.5">
            {INDIA[s.cloud].map((r, i) => (
              <motion.div
                key={`${s.cloud}-${r.name}`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs",
                  r.zones === "3 zones"
                    ? "border-accent/60 bg-accent-soft"
                    : "border-line bg-surface",
                )}
              >
                <div>
                  <p className="font-semibold">{r.city}</p>
                  <p className="text-muted text-[11px]">{r.name}</p>
                </div>
                <span className="shrink-0 text-[11px]">{r.zones}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-[11px]">From each provider&apos;s pages, October 2026.</p>
        </div>
      }
    >
      <p>
        All three big providers have regions in India, which matters for speed and for rules about
        keeping data in the country (module 20).
      </p>
      <p>
        Not every region is equal. Two of Azure&apos;s Indian regions have no availability zones, so
        &ldquo;spread across zones&rdquo; isn&apos;t possible there. AWS Local Zones in Delhi and
        Kolkata bring servers closer to users, but each is one site, not a full region.
      </p>
      <p>
        And choosing a region doesn&apos;t keep everything in it: some control services are global.
        AWS, for example, manages all account permission changes from its Northern Virginia region.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who secures what ------------------------------------------------------------------------- */

export function WhoSecures() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Who secures what"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="shared-responsibility"
            prompt="You run a department's website on rented virtual machines (IaaS). Who is responsible for each job?"
            categories={[
              { id: "provider", label: "Provider" },
              { id: "you", label: "You" },
            ]}
            items={[
              {
                id: "guards",
                label: "Guards and cameras at the data centre",
                category: "provider",
                why: "Physical security is always the provider's, in every model.",
              },
              {
                id: "host",
                label: "Patching the hypervisor that runs the virtual machines",
                category: "provider",
                why: "The virtualisation layer is below the line in IaaS.",
              },
              {
                id: "os",
                label: "Installing security patches on the virtual machines' operating system",
                category: "you",
                why: "With IaaS the guest operating system is yours. On a managed platform the provider would do it.",
              },
              {
                id: "firewall",
                label: "Deciding which network ports are open to the internet",
                category: "you",
                why: "Configuration is always yours: the provider gives you the controls, you set them.",
              },
              {
                id: "access",
                label: "Who in the department can log in and change things",
                category: "you",
                why: "Accounts and access are always the customer's, whatever the service model.",
              },
              {
                id: "disks",
                label: "Wiping old disks before the hardware is thrown away",
                category: "provider",
                why: "Hardware and its disposal belong to the provider.",
              },
            ]}
            explanation="AWS puts it as security “of” the cloud (theirs) versus security “in” the cloud (yours). The line moves with the service model, but your data, accounts, access and configuration are always yours."
          />
        </div>
      }
    >
      <p>
        The <Term id="shared-responsibility">shared responsibility model</Term> splits security
        between you and the provider. Most cloud breaches aren&apos;t the provider being hacked;
        they&apos;re customers leaving something open on their side of the line.
      </p>
      <p>
        Google calls its version &ldquo;shared fate&rdquo;: the same split, plus a promise of secure
        defaults and guidance.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Nested baskets", "Building, zone, region: each built to fail without the next."],
  ["Spread across zones", "Cheap insurance, and what the 99.99% promises need."],
  ["Regions cost more", "A second region is a full copy and a failover plan. No SLA covers it."],
  ["Your side of the line", "Data, accounts, access and configuration are always yours."],
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
      <p>Next: what actually runs in these zones, from whole virtual machines to tiny functions.</p>
    </StepLayout>
  );
}
