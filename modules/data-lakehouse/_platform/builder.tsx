"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Shared by the cloud-platform modules: pick one service for each lakehouse slot.
 * Feedback explains wrong picks; when everything fits, data flows through the stack.
 */

export interface Slot {
  id: string;
  layer: string;
  need: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  blurb: string;
  fits: string[]; // slot ids where this is a right answer
  /** Why it doesn't fit a slot, keyed by slot id (fallback: a generic note). */
  whyNot?: Record<string, string>;
}

export function PlatformBuilder({
  slots,
  options,
  value,
  active,
  onPick,
  onSelectSlot,
  doneText,
}: {
  slots: Slot[];
  options: ServiceOption[];
  value: Record<string, string>;
  active: string;
  onPick(slot: string, option: string): void;
  onSelectSlot(slot: string): void;
  doneText: string;
}) {
  const byId = new Map(options.map((o) => [o.id, o]));
  const ok = (slot: string) => {
    const o = byId.get(value[slot] ?? "");
    return !!o && o.fits.includes(slot);
  };
  const allOk = slots.every((s) => ok(s.id));
  const activeSlot = slots.find((s) => s.id === active) ?? slots[0];
  const chosen = byId.get(value[activeSlot.id] ?? "");
  const feedback = chosen
    ? chosen.fits.includes(activeSlot.id)
      ? `✓ ${chosen.name}: ${chosen.blurb}`
      : `✗ ${chosen.whyNot?.[activeSlot.id] ?? `${chosen.name} is built for a different layer.`}`
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-1.5">
        {slots.map((s, i) => {
          const o = byId.get(value[s.id] ?? "");
          const good = ok(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSlot(s.id)}
              className={cn(
                "relative grid gap-1 overflow-hidden rounded-xl border px-3 py-2 text-left transition sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-2",
                s.id === activeSlot.id ? "border-accent ring-accent/30 ring-2" : "border-line",
                o ? (good ? "bg-good/5" : "bg-bad/5") : "bg-surface",
              )}
            >
              {allOk && (
                <motion.span
                  aria-hidden
                  className="bg-accent/15 absolute inset-y-0 left-0 w-1/3"
                  initial={{ x: "-100%" }}
                  animate={{ x: "400%" }}
                  transition={{ duration: 1.6, delay: i * 0.25, repeat: Infinity, repeatDelay: 1 }}
                />
              )}
              <span className="relative min-w-0">
                <span className="block text-sm font-medium">{s.layer}</span>
                <span className="text-muted block text-[11px]">{s.need}</span>
              </span>
              <span className="relative flex items-center gap-1.5">
                {o ? (
                  <>
                    <span className="font-mono text-xs">{o.name}</span>
                    {good ? (
                      <Check className="text-good size-4" />
                    ) : (
                      <X className="text-bad size-4" />
                    )}
                  </>
                ) : (
                  <span className="text-subtle text-xs">choose…</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-line bg-surface rounded-xl border p-3">
        <p className="text-muted mb-2 text-xs">
          Services for <span className="text-fg font-medium">{activeSlot.layer}</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={value[activeSlot.id] === o.id}
              onClick={() => onPick(activeSlot.id, o.id)}
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[11px] transition",
                value[activeSlot.id] === o.id
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line hover:bg-surface-2",
              )}
            >
              {o.name}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.p
              key={feedback}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn("mt-2 text-xs", feedback.startsWith("✓") ? "text-good" : "text-bad")}
            >
              {feedback}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p
        className={cn(
          "rounded-xl border px-4 py-3 text-sm",
          allOk ? "border-good/40 bg-good/10" : "border-line bg-surface",
        )}
      >
        {allOk
          ? doneText
          : `${slots.filter((s) => ok(s.id)).length} of ${slots.length} layers filled correctly. Click a layer, then pick a service.`}
      </p>
    </div>
  );
}
