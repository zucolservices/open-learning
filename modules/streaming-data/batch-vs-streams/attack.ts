/**
 * An illustrative attack: a fraudster with a stolen PIN sends 20 payments of ₹4,999 to a new payee,
 * one every 30 seconds from 23:42:00. A rule flags "3 payments to a new payee within 2 minutes",
 * which is true from the third payment (23:43:00). What matters is when the rule gets to run.
 */
import type { Cadence } from "./state";

export const START = 23 * 3600 + 42 * 60; // seconds after midnight
export const GAP = 30;
export const COUNT = 20;
export const AMOUNT = 4999;
export const TRIGGER = 2; // index of the payment that makes the rule true

export const times = Array.from({ length: COUNT }, (_, i) => START + i * GAP);

/** When each cadence next looks at the data after the rule becomes true. */
export function checkAt(c: Cadence): number {
  const t = times[TRIGGER];
  if (c === "event") return t;
  if (c === "five") return Math.ceil(t / 300) * 300;
  if (c === "hourly") return Math.ceil(t / 3600) * 3600;
  return 24 * 3600 + 2 * 3600; // 02:00 the next night
}

/** Payments that go through before the check blocks the card (a per-event check stops the trigger itself). */
export function lost(c: Cadence): number {
  const at = checkAt(c);
  return c === "event" ? TRIGGER : times.filter((t) => t <= at).length;
}

export const clock = (s: number) => {
  const d = ((s % 86400) + 86400) % 86400;
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const sec = d % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}${sec ? ":" + String(sec).padStart(2, "0") : ""}`;
};

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
