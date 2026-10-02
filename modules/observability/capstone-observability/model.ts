/** Capstone: design how a payments platform is observed, then see what you'd catch (illustrative). */

export type Verdict = "good" | "warn" | "bad";
export type Level = "holds" | "degrades" | "breaks";

export const DECISIONS: {
  id: string;
  area: string;
  module: number;
  options: { id: string; label: string; verdict: Verdict; note: string }[];
}[] = [
  {
    id: "instr",
    area: "Instrumentation",
    module: 3,
    options: [
      {
        id: "agent",
        label: "Each vendor's own agent and SDK",
        verdict: "warn",
        note: "Works well, until you want to change vendor.",
      },
      {
        id: "otel",
        label: "OpenTelemetry SDKs and a Collector",
        verdict: "good",
        note: "One standard; the backend is a configuration choice.",
      },
    ],
  },
  {
    id: "sli",
    area: "What counts as success",
    module: 13,
    options: [
      {
        id: "cpu",
        label: "Servers up and CPU below 80%",
        verdict: "bad",
        note: "Measures machines, not payments.",
      },
      {
        id: "all",
        label: "Share of payments approved, all declines counted as failures",
        verdict: "warn",
        note: "User-centred, but a wrong PIN counts against you.",
      },
      {
        id: "td",
        label: "Share without a technical decline, plus p99 latency, against an SLO",
        verdict: "good",
        note: "Counts what the platform controls, as users feel it.",
      },
    ],
  },
  {
    id: "labels",
    area: "Metric labels",
    module: 6,
    options: [
      {
        id: "none",
        label: "No labels: one total",
        verdict: "warn",
        note: "Cheap, but can't say where.",
      },
      {
        id: "bank",
        label: "Bank, app, outcome and region",
        verdict: "good",
        note: "A few hundred values each: every question you'll ask in an incident.",
      },
      {
        id: "vpa",
        label: "Bank plus each customer's UPI ID",
        verdict: "bad",
        note: "Hundreds of millions of values: a cardinality explosion.",
      },
    ],
  },
  {
    id: "latency",
    area: "Latency",
    module: 5,
    options: [
      { id: "avg", label: "Average response time", verdict: "bad", note: "The slow few vanish." },
      {
        id: "pct",
        label: "Histograms: p50, p95 and p99",
        verdict: "good",
        note: "You see the tail, where unhappy customers live.",
      },
    ],
  },
  {
    id: "logs",
    area: "Logs",
    module: 8,
    options: [
      {
        id: "raw",
        label: "Free text, full request bodies, everything kept",
        verdict: "bad",
        note: "Hard to query, expensive, and full of personal data.",
      },
      {
        id: "json",
        label: "Structured JSON with trace IDs; IDs masked; debug dropped at the Collector",
        verdict: "good",
        note: "Queryable, linked to traces, safe to keep.",
      },
    ],
  },
  {
    id: "tracing",
    area: "Tracing",
    module: 11,
    options: [
      {
        id: "none",
        label: "No tracing",
        verdict: "bad",
        note: "Nothing shows where the time goes.",
      },
      {
        id: "head",
        label: "Head sampling, 1% of requests",
        verdict: "warn",
        note: "Cheap, but most errors are thrown away.",
      },
      {
        id: "tail",
        label: "Tail sampling: every error and slow trace, 5% of the rest",
        verdict: "good",
        note: "The interesting traces always survive.",
      },
    ],
  },
  {
    id: "alerts",
    area: "Paging",
    module: 15,
    options: [
      {
        id: "cpu",
        label: "Page when any server's CPU tops 80%",
        verdict: "bad",
        note: "Causes, not symptoms.",
      },
      {
        id: "static",
        label: "Page when errors exceed 1% for 10 minutes",
        verdict: "warn",
        note: "A symptom, but slow burns slip under it.",
      },
      {
        id: "burn",
        label: "Multi-window burn-rate alerts on the SLO",
        verdict: "good",
        note: "Fast and slow problems, few false alarms.",
      },
    ],
  },
  {
    id: "watch",
    area: "Watching the watchers",
    module: 1,
    options: [
      {
        id: "same",
        label: "Monitoring runs inside the platform it monitors",
        verdict: "bad",
        note: "Simple, and it fails at the same moment.",
      },
      {
        id: "outside",
        label: "Independent telemetry path, plus outside probes that check the content",
        verdict: "good",
        note: "Someone is still watching when the platform isn't.",
      },
    ],
  },
  {
    id: "process",
    area: "When it goes wrong",
    module: 18,
    options: [
      {
        id: "adhoc",
        label: "Whoever's online jumps in",
        verdict: "bad",
        note: "Heroes, confusion and no record.",
      },
      {
        id: "ic",
        label: "On-call rota, incident commander, scribe, blameless postmortems",
        verdict: "good",
        note: "Clear roles during, real learning after.",
      },
    ],
  },
];

export const INCIDENTS: { id: string; name: string; text: string }[] = [
  {
    id: "bank",
    name: "A slow bank",
    text: "One large bank's responses slow from 300 ms to 8 seconds. It handles 6% of your traffic.",
  },
  {
    id: "pin",
    name: "Salary day",
    text: "Payment volume triples and so do wrong-PIN declines. Nothing is actually broken.",
  },
  {
    id: "cause",
    name: "Slower after a release",
    text: "p99 latency doubles after Tuesday's release. Twelve services changed.",
  },
  {
    id: "storm",
    name: "A 3 a.m. blip",
    text: "A database fails over. Forty services see errors for two minutes, then recover.",
  },
  {
    id: "silent",
    name: "The silent failure",
    text: "A release makes 0.5% of confirmations show the wrong amount. Every request returns success.",
  },
  {
    id: "blind",
    name: "Monitoring goes down too",
    text: "The platform's service discovery fails. Everything that depends on it stops.",
  },
  {
    id: "logs",
    name: "The log review",
    text: "A security review searches a month of logs for customers' personal data.",
  },
  {
    id: "report",
    name: "The regulator's clock",
    text: "A 40-minute outage at 21:00. The report to RBI is due within 6 hours of detection.",
  },
  {
    id: "vendor",
    name: "The contract renewal",
    text: "Your observability bill has tripled. Finance wants options on another backend within a quarter.",
  },
];

export interface Outcome {
  level: Level;
  text: string;
  module: number;
}

type C = Record<string, string | undefined>;

export function outcome(id: string, c: C): Outcome | null {
  switch (id) {
    case "bank":
      if (!c.labels || !c.latency) return null;
      if (c.labels === "vpa")
        return {
          level: "breaks",
          text: "The metrics backend has been falling over all week under hundreds of millions of series. The dashboards that would show the slow bank don't load.",
          module: 6,
        };
      if (c.labels === "none" || c.latency === "avg")
        return {
          level: "degrades",
          text:
            c.labels === "none"
              ? "Overall latency creeps up a little, but nothing says which bank. Two hours of guessing before someone checks the banks one by one."
              : "The average barely moves: 94% of payments are still fast. Customers of one bank wait 8 seconds and the graph looks fine.",
          module: c.labels === "none" ? 6 : 5,
        };
      return {
        level: "holds",
        text: "p99 for that one bank leaps on the dashboard within a minute. You route around it where you can, and tell the bank.",
        module: 7,
      };
    case "pin":
      if (!c.sli || !c.alerts) return null;
      if (c.sli === "all")
        return {
          level: "degrades",
          text: "Wrong PINs count as failures, so the error budget burns and someone is paged for customers' typos. NPCI's own figures separate business declines (like a wrong PIN) from technical ones for exactly this reason.",
          module: 13,
        };
      if (c.sli === "cpu")
        return {
          level: "degrades",
          text: "CPU spikes with the volume and pages someone, though payments are fine. Your targets measure machines, not customers.",
          module: 13,
        };
      return {
        level: "holds",
        text: "Business declines don't count against the SLO. Technical declines stay flat, so nobody is woken. Busy, not broken.",
        module: 13,
      };
    case "cause":
      if (!c.tracing || !c.logs) return null;
      if (c.tracing === "none")
        return {
          level: "breaks",
          text: "Twelve suspects and no traces. The team rolls back services one by one, a day of the Drunk Man Anti-Method.",
          module: 17,
        };
      if (c.tracing === "head")
        return {
          level: "degrades",
          text: "The few kept traces are mostly fast ones. It takes an afternoon to catch enough slow ones to see the pattern.",
          module: 11,
        };
      if (c.logs === "raw")
        return {
          level: "degrades",
          text: "Slow traces point at the fraud check, but its logs have no trace IDs. An hour of grepping free text to find out why.",
          module: 8,
        };
      return {
        level: "holds",
        text: "Every slow trace shows 1.8 s in the fraud-check span; one click to its logs shows a new rule doing a full table scan. Found in 20 minutes.",
        module: 10,
      };
    case "storm":
      if (!c.alerts) return null;
      if (c.alerts === "cpu")
        return {
          level: "breaks",
          text: "Dozens of CPU pages in two minutes, for a blip users barely noticed. The on-call starts muting the pager, which is how the next real one gets missed.",
          module: 15,
        };
      if (c.alerts === "static")
        return {
          level: "degrades",
          text: "Quiet, because it lasted under ten minutes. But the same rule would sleep through a slow burn at 0.8% errors all week.",
          module: 15,
        };
      return {
        level: "holds",
        text: "Two minutes uses a sliver of the month's budget: no page, a note on tomorrow's dashboard. A real outage would page within minutes.",
        module: 15,
      };
    case "silent":
      if (!c.watch) return null;
      if (c.watch === "same")
        return {
          level: "breaks",
          text: "Error rate zero, latency normal, every dashboard green. Customers find it, days later. Cloudflare's 2017 'Cloudbleed' bug was similar: pages served successfully, about 1 request in 3.3 million leaking data, found by an outside researcher.",
          module: 1,
        };
      return {
        level: "holds",
        text: "An outside probe makes a test payment every minute and checks the amount on the confirmation. It fails within minutes of the release.",
        module: 1,
      };
    case "blind":
      if (!c.watch) return null;
      if (c.watch === "same")
        return {
          level: "breaks",
          text: "Dashboards and alerts die with the platform. Roblox's 73-hour outage in 2021 was made worse because its monitoring relied on the same Consul cluster that failed; Slack lost its dashboards and alerting during its January 2021 outage.",
          module: 1,
        };
      return {
        level: "holds",
        text: "The outside probe pages first, and the independent telemetry path still shows what's happening. Roblox's fix after 2021 was exactly this: telemetry that doesn't depend on what it monitors.",
        module: 1,
      };
    case "logs":
      if (!c.logs) return null;
      if (c.logs === "raw")
        return {
          level: "breaks",
          text: "Full request bodies mean UPI IDs, names and phone numbers in every log line, copied to every tool that reads them. A long clean-up, and a bigger bill for the privilege.",
          module: 9,
        };
      return {
        level: "holds",
        text: "Identifiers are masked before logs leave the service. The review finds nothing, and the logs are kept as CERT-In requires: 180 days, within India.",
        module: 9,
      };
    case "report":
      if (!c.process || !c.sli) return null;
      if (c.process === "adhoc")
        return {
          level: "breaks",
          text: "Nobody wrote anything down and nobody was in charge. Reconstructing the timeline from chat takes most of the night.",
          module: 18,
        };
      if (c.sli === "cpu")
        return {
          level: "degrades",
          text: "The scribe's timeline is clean, but nobody can say how many payments failed: there's no SLI for it.",
          module: 13,
        };
      return {
        level: "holds",
        text: "The scribe's timeline and the SLI give start, end and customer impact. Comms files the report well inside the six hours; the postmortem is booked.",
        module: 18,
      };
    case "vendor":
      if (!c.instr || !c.labels) return null;
      if (c.labels === "vpa")
        return {
          level: "breaks",
          text: "The bill tripled because of the UPI ID label. Any backend that prices per series will cost just as much; fix the cardinality first.",
          module: 20,
        };
      if (c.instr === "agent")
        return {
          level: "degrades",
          text: "Moving means re-instrumenting forty services. The quarter runs out, and the renewal is signed on the vendor's terms.",
          module: 3,
        };
      return {
        level: "holds",
        text: "The Collector sends a copy to a second backend for a month-long trial. Switching, or negotiating, is a configuration change.",
        module: 20,
      };
  }
  return null;
}
