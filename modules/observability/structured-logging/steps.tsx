"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { QUERIES, RECS, run, type Query, type Rec } from "./model";
import type { LogState } from "./state";

/* 1 ─ Find the failed payment ⭐ ------------------------------------------------------------------ */

function Line({ r, structured, hit }: { r: Rec; structured: boolean; hit: boolean }) {
  return (
    <p
      className={cn(
        "rounded px-1.5 py-[1px] font-mono text-[10px] leading-relaxed",
        hit ? "bg-accent-soft text-fg" : "text-muted",
      )}
    >
      {structured
        ? `{"time":"${r.time}","level":"${r.level}","service":"${r.service}","msg":"${r.msg}"${
            r.order_id ? `,"order_id":"${r.order_id}"` : ""
          }${r.bank ? `,"bank":"${r.bank}"` : ""}${r.trace_id ? `,"trace_id":"${r.trace_id}"` : ""}}`
        : `${r.time} ${r.text}`}
    </p>
  );
}

export function FindIt() {
  const [s, set] = useSceneState<LogState>();
  const structured = s.format === "structured";
  const res = run(s.query, structured);
  const hits = new Set(res.lines);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Find the failed payment"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<"text" | "structured">
              size="sm"
              value={s.format}
              onChange={(format) => set({ format })}
              options={[
                ["text", "Free-text logs"],
                ["structured", "Structured logs"],
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(QUERIES) as Query[]).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => set({ query: q })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.query === q ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {QUERIES[q].label}
              </button>
            ))}
          </div>
          <code className="bg-surface-2 self-start rounded px-2 py-1 font-mono text-[11px]">
            {structured ? QUERIES[s.query].structured : QUERIES[s.query].text}
          </code>
          <div className="border-line bg-surface max-h-72 overflow-x-auto overflow-y-auto rounded-xl border px-2 py-2">
            {RECS.map((r, i) => (
              <Line key={i} r={r} structured={structured} hit={hits.has(r)} />
            ))}
          </div>
          <motion.p
            key={`${s.format}-${s.query}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-sm", structured ? "text-good" : "text-bad")}
          >
            {res.note}
          </motion.p>
        </div>
      }
    >
      <p>
        A customer says order 8812 failed. You have the logs. Try the three questions with free-text
        logs, written however each developer felt like it, then switch to{" "}
        <Term id="structured-log">structured logs</Term>.
      </p>
      <p>
        Free text is easy to write and hard to search: &ldquo;#8812&rdquo;, &ldquo;ord=8812&rdquo;
        and &ldquo;order 8812&rdquo; are three different strings. Structured logs record each fact
        as a named field, so a machine can filter, count and join them.
      </p>
      <p>
        The <Term id="trace">trace</Term> ID on every line is the{" "}
        <Term id="correlation-id">correlation ID</Term> that ties one request&apos;s lines together
        across services, and links them to its trace.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Anatomy of a log record --------------------------------------------------------------------- */

const FIELDS: [string, string, string][] = [
  ["Timestamp", '"2026-10-03T14:09:04.931Z"', "When it happened, in UTC, to the millisecond."],
  ["SeverityText", '"ERROR"', "The level: TRACE, DEBUG, INFO, WARN, ERROR, FATAL."],
  ["Body", '"payment failed"', "A short, fixed message: the same text every time this happens."],
  [
    "Attributes",
    '{"order_id":"8812","bank":"Bank C","error.type":"timeout"}',
    "The facts you'll search and count by.",
  ],
  ["TraceId / SpanId", '"4bf92f35…", "00f067aa…"', "Links the line to the request's trace."],
  [
    "Resource",
    '{"service.name":"payments","service.version":"5.2.0"}',
    "Which program, version and machine wrote it.",
  ],
];

export function Anatomy() {
  const [s, set] = useSceneState<LogState>();
  const f = FIELDS[s.field] ?? FIELDS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Anatomy of a log record"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="bg-surface-2 rounded-xl px-2 py-2 font-mono text-[10.5px] leading-relaxed">
            {FIELDS.map(([k, v], i) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ field: i })}
                className={cn(
                  "block w-full rounded px-1.5 text-left break-all",
                  i === s.field ? "bg-accent-soft" : "hover:bg-surface",
                )}
              >
                <span className="text-accent">{k}</span>: {v}
              </button>
            ))}
          </div>
          <motion.div
            key={s.field}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <p className="font-semibold">{f[0]}</p>
            <p className="text-muted text-sm">{f[2]}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        OpenTelemetry&apos;s log data model gives every record the same shape. Click each field. In
        JSON logs the IDs are usually written trace_id and span_id.
      </p>
      <p>
        Keep the message fixed and put the variable parts in attributes: &ldquo;payment
        failed&rdquo; with order_id=8812, not &ldquo;payment for 8812 failed&rdquo;. Then every
        payment failure has the same message and you can count them.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Never in the logs --------------------------------------------------------------------------- */

const RAW =
  '{"msg":"login","email":"asha@example.com","password":"Hunter2!","card":"4111111111111111","session":"eyJhbGciOi…","order_id":"8812"}';
const CLEAN = '{"msg":"login","user_id":"u_5521","card_last4":"1111","order_id":"8812"}';

export function NeverLog() {
  const [s, set] = useSceneState<LogState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="What never goes in a log"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.redact}
              onChange={(e) => set({ redact: e.target.checked })}
              className="accent-accent"
            />
            Fix the logging code (and add a redaction step in the pipeline as a safety net)
          </label>
          <pre
            className={cn(
              "overflow-x-auto rounded-xl border px-3 py-2 font-mono text-[10.5px] break-all whitespace-pre-wrap",
              s.redact ? "border-good/50 bg-good/5" : "border-bad/50 bg-bad/5",
            )}
          >
            {s.redact ? CLEAN : RAW}
          </pre>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">OWASP&apos;s list of data to exclude includes</p>
            <p className="text-muted mt-1">
              session identifiers, access tokens, passwords, database connection strings, encryption
              keys and other secrets, payment card holder data, and sensitive personal data.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Logs are copied to many places, kept for months and read by many people, so anything in them
        leaks widely. In May 2018 Twitter told users to change their passwords after a bug meant
        &ldquo;passwords were written to an internal log before completing the hashing
        process.&rdquo;
      </p>
      <p>
        The rules agree: card standards (PCI DSS) forbid keeping card security codes after
        authorisation and require card numbers to be unreadable wherever they&apos;re stored, logs
        included. India&apos;s DPDP Act treats personal data in logs like any other personal data.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Log it or not? ------------------------------------------------------------------------------ */

export function LogOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Log it or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="log-or-not"
            prompt="Should each value go into a log line as it is?"
            categories={[
              { id: "yes", label: "Log it" },
              { id: "no", label: "Never as is" },
            ]}
            items={[
              {
                id: "order",
                label: "Order ID",
                category: "yes",
                why: "Essential for following a case; not sensitive on its own.",
              },
              {
                id: "trace",
                label: "Trace ID",
                category: "yes",
                why: "Links the line to its trace; meaningless to an attacker.",
              },
              {
                id: "err",
                label: "The error type and the bank that returned it",
                category: "yes",
                why: "Exactly what you'll filter and count by.",
              },
              {
                id: "pw",
                label: "The password a user typed",
                category: "no",
                why: "Never, not even hashed. Twitter's 2018 bug did exactly this.",
              },
              {
                id: "card",
                label: "The full card number",
                category: "no",
                why: "Log only the last four digits, if anything.",
              },
              {
                id: "token",
                label: "A session token or API key",
                category: "no",
                why: "Anyone reading the log could act as that user or system.",
              },
            ]}
            explanation="Log identifiers and facts that help you investigate; never secrets or raw sensitive data. When in doubt, log a reference instead of the value."
          />
        </div>
      }
    >
      <p>A good log line helps you debug and is boring to a thief.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Fields, not sentences", "Named fields a machine can filter and count."],
  ["Fixed messages", "Variable parts go in attributes."],
  ["Correlate", "A trace ID on every line ties a request together."],
  ["Write to stdout", "Let the platform collect and route the stream."],
  ["Keep secrets out", "No passwords, tokens or raw card numbers, ever."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The Twelve-Factor App says to &ldquo;treat logs as event streams&rdquo;: each process writes
        its stream &ldquo;unbuffered, to stdout&rdquo; and the platform collects it. And remember
        that logging code is code: the Log4Shell flaw (December 2021) let attackers run code just by
        getting a crafted string written to a log.
      </p>
      <p>Next: collecting all those streams, storing them and paying for it.</p>
    </StepLayout>
  );
}
