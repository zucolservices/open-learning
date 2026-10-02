"use client";

import { motion } from "motion/react";
import { Building2, Check, Server, X } from "lucide-react";
import { Segmented } from "@/toolkit/controls/segmented";
import { cn } from "@/lib/cn";
import type { RegionsState } from "./state";

/** Module 2's "break the data centre" model and panel, shared with the track showcase. */

export type Design = RegionsState["design"];
export type Failure = RegionsState["failure"];

export const DESIGNS: [Design, string][] = [
  ["one", "One server, one zone"],
  ["zones", "Spread across zones"],
  ["regions", "Copy in a second region"],
];

export const FAILURES: [Failure, string][] = [
  ["none", "All fine"],
  ["building", "A building fails"],
  ["zone", "A zone fails"],
  ["region", "The region fails"],
];

/** Where each design places servers: region index → zone index → building index. */
const PLACES: Record<Design, [number, number, number][]> = {
  one: [[0, 0, 0]],
  zones: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 2, 0],
  ],
  regions: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 2, 0],
    [1, 0, 0],
    [1, 1, 0],
  ],
};

function failed(f: Failure, r: number, z: number, b: number) {
  if (r !== 0) return false;
  if (f === "region") return true;
  if (f === "zone") return z === 0;
  if (f === "building") return z === 0 && b === 0;
  return false;
}

type Outcome = { state: "up" | "down" | "failover"; text: string };

export function outcome(d: Design, f: Failure): Outcome {
  if (f === "none") return { state: "up", text: "Serving normally." };
  if (d === "one") return { state: "down", text: "Down: its only server was in the failed area." };
  if (d === "zones")
    return f === "region"
      ? { state: "down", text: "Down: every zone it uses is in the failed region." }
      : { state: "up", text: "Still serving from the other zones, with less spare capacity." };
  return f === "region"
    ? {
        state: "failover",
        text: "Serving again after failing over to the second region: minutes of disruption, and possibly some recent data lost.",
      }
    : { state: "up", text: "Still serving from the other zones." };
}

const INCIDENTS: Record<Exclude<Failure, "none">, [string, string]> = {
  building: [
    "AWS Tokyo, August 2019",
    "A cooling failure overheated servers in part of one zone. Most applications spread across zones kept running.",
  ],
  zone: [
    "Azure Australia East, August 2023",
    "A power dip stopped the chillers in one zone. Databases set up across zones kept running.",
  ],
  region: [
    "AWS us-east-1, 19–20 October 2025",
    "A latent bug left a core database's address with an empty DNS record. Many services in the region failed for about 14 hours; apps with a copy elsewhere kept serving.",
  ],
};

const SLA: Record<Design, string> = {
  one: "One virtual machine: 99.5% (AWS) to 99.9% (Google; Azure with premium disks). Up to 3.6 hours or 43 minutes down a month.",
  zones: "Across zones: all three promise 99.99%, about 4 minutes a month.",
  regions:
    "No provider offers a multi-region compute SLA: surviving a region is your design, not their promise.",
};

function RegionBox({ r, design, failure }: { r: number; design: Design; failure: Failure }) {
  const servers = PLACES[design];
  return (
    <div
      className={cn(
        "rounded-xl border p-2",
        r === 0 && failure === "region" ? "border-bad bg-bad/10" : "border-line bg-surface",
      )}
    >
      <p className="text-muted mb-1 text-[10px]">{r === 0 ? "Region A" : "Region B (far away)"}</p>
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((z) => {
          const zoneDown =
            r === 0 &&
            (failure === "region" || failure === "zone") &&
            (failure === "region" || z === 0);
          return (
            <div
              key={z}
              className={cn(
                "rounded-lg border border-dashed p-1.5",
                zoneDown ? "border-bad/60 bg-bad/10" : "border-line",
              )}
            >
              <p className="text-muted text-[9px]">Zone {z + 1}</p>
              <div className="mt-1 flex gap-1">
                {[0, 1].map((b) => {
                  const down = failed(failure, r, z, b);
                  const hasServer = servers.some(
                    ([sr, sz, sb]) => sr === r && sz === z && sb === b,
                  );
                  return (
                    <div
                      key={b}
                      className={cn(
                        "relative grid h-9 flex-1 place-items-center rounded border",
                        down ? "border-bad bg-bad/20" : "border-line bg-surface-2",
                      )}
                    >
                      <Building2 className="text-subtle size-3" />
                      {hasServer && (
                        <motion.span
                          layout
                          className={cn(
                            "absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full",
                            down ? "bg-bad text-white" : "bg-accent text-accent-fg",
                          )}
                        >
                          {down ? <X className="size-2.5" /> : <Server className="size-2.5" />}
                        </motion.span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BreakPanel({
  design,
  failure,
  onDesign,
  onFailure,
}: {
  design: Design;
  failure: Failure;
  onDesign(v: Design): void;
  onFailure(v: Failure): void;
}) {
  const o = outcome(design, failure);
  return (
    <div className="flex flex-1 flex-col gap-3">
      <Segmented size="sm" value={design} options={DESIGNS} onChange={onDesign} />
      <Segmented size="sm" value={failure} options={FAILURES} onChange={onFailure} />
      <div className="grid gap-2 sm:grid-cols-[1.3fr_1fr]">
        <RegionBox r={0} design={design} failure={failure} />
        <RegionBox r={1} design={design} failure={failure} />
      </div>
      <motion.div
        key={`${design}-${failure}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-start gap-2 rounded-lg border px-3 py-2 text-xs",
          o.state === "up"
            ? "border-good/50 bg-good/10"
            : o.state === "down"
              ? "border-bad bg-bad/10"
              : "border-line bg-surface-2",
        )}
      >
        {o.state === "down" ? (
          <X className="text-bad mt-0.5 size-4 shrink-0" />
        ) : (
          <Check className="text-good mt-0.5 size-4 shrink-0" />
        )}
        <p>{o.text}</p>
      </motion.div>
      {failure !== "none" && (
        <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
          <p className="text-muted text-[10px] tracking-wide uppercase">It has happened</p>
          <p className="font-semibold">{INCIDENTS[failure][0]}</p>
          <p className="text-muted">{INCIDENTS[failure][1]}</p>
        </div>
      )}
      <p className="text-muted text-[11px]">
        <span className="text-fg font-medium">Promise: </span>
        {SLA[design]}
      </p>
    </div>
  );
}
