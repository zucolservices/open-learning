/** Failover drill: earlier choices → a timeline of what happens when the main region goes dark. */

export type Strategy = "backup" | "pilot" | "warm" | "active";
export type Data = "backups" | "replica";
export type Routing = "manual" | "dns" | "global";

export interface DrillEvent {
  at: number; // minutes after the region fails
  text: string;
  tone?: "good" | "bad";
}

export interface DrillResult {
  events: DrillEvent[];
  rtoMin: number; // until most users are served again
  stragglersMin: number; // until the last users (cached DNS) get through
  rpo: string;
  rpoMin: number;
  cost: number; // monthly cost relative to one region
}

export const FAIL_AT = "14:00";

export function drill(strategy: Strategy, data: Data, routing: Routing): DrillResult {
  const events: DrillEvent[] = [
    { at: 0, text: "Region A goes dark: power and network are lost across it.", tone: "bad" },
  ];

  // Detection and decision
  const detect = routing === "manual" ? 20 : routing === "dns" ? 1.5 : 0.5;
  events.push({
    at: detect,
    text:
      routing === "manual"
        ? "Alarms fire; an engineer is paged, joins a call and confirms the region is gone (about 20 min)."
        : routing === "dns"
          ? "DNS health checks fail three times in a row (checked every 30 s): failover is triggered automatically."
          : "The global load balancer's health checks mark region A unhealthy within seconds.",
  });

  // Data
  // promote a replica, use an already-writable multi-region copy, or restore a big backup
  const dataReady = data === "backups" ? detect + 180 : strategy === "active" ? detect : detect + 2;
  events.push({
    at: dataReady,
    text:
      data === "backups"
        ? "The database is restored in region B from last night's backup copy (about 3 hours for a large database)."
        : strategy === "active"
          ? "Region B's copy of the multi-region database already accepts writes. Changes from the last second or so in region A never arrived."
          : "The replica in region B is promoted to primary. Writes from the last second or so before the failure never arrived.",
    tone: data === "backups" ? "bad" : undefined,
  });

  // Compute
  const computeReady =
    strategy === "active"
      ? 0
      : strategy === "warm"
        ? detect + 5
        : strategy === "pilot"
          ? detect + 25
          : detect + 90;
  if (strategy !== "active")
    events.push({
      at: computeReady,
      text:
        strategy === "warm"
          ? "The small standby fleet in region B scales up to full size."
          : strategy === "pilot"
            ? "Servers in region B are started from prepared images and scaled up."
            : "Everything is rebuilt in region B from infrastructure-as-code scripts.",
    });
  else
    events.push({
      at: 0,
      text: "Region B was already serving half the traffic; it absorbs the rest (if it has headroom).",
    });

  const ready = Math.max(dataReady, computeReady, detect);
  // Routing
  let rto: number;
  let stragglers: number;
  if (routing === "manual") {
    rto = ready + 10;
    stragglers = rto + 24 * 60;
    events.push({ at: ready + 5, text: "An engineer edits the DNS record to point at region B." });
    events.push({
      at: rto,
      text: "Users whose DNS answer has expired reach region B. Others keep a cached answer for up to the 24-hour TTL.",
      tone: "bad",
    });
  } else if (routing === "dns") {
    rto = ready + 1;
    stragglers = rto + 5;
    events.push({
      at: rto,
      text: "DNS now answers with region B; the 60-second TTL means most users follow within a minute or two.",
    });
  } else {
    rto = ready + 0.2;
    stragglers = rto;
    events.push({
      at: rto,
      text: "The same global IP address now routes everyone to region B: nothing to wait for.",
    });
  }
  events.push({
    at: rto,
    text:
      data === "replica"
        ? "Service restored. Orders placed in the last second before the failure are missing."
        : "Service restored, but every order since last night's backup is gone.",
    tone: data === "replica" ? "good" : "bad",
  });

  events.sort((a, b) => a.at - b.at);
  const cost =
    { backup: 1.05, pilot: 1.2, warm: 1.5, active: 2 }[strategy] + (data === "replica" ? 0.15 : 0);
  return {
    events,
    rtoMin: rto,
    stragglersMin: stragglers,
    rpo: data === "replica" ? "about a second" : "up to 24 hours (here 14 h: since midnight)",
    rpoMin: data === "replica" ? 1 / 60 : 14 * 60,
    cost,
  };
}

export function fmtMin(m: number): string {
  if (m < 1) return `${Math.round(m * 60)} s`;
  if (m < 90) return `${Math.round(m)} min`;
  if (m < 48 * 60) return `${(m / 60).toFixed(m < 600 ? 1 : 0)} h`;
  return `${Math.round(m / 60 / 24)} days`;
}
