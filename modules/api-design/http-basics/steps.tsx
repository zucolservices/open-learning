"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { rawRequest, rawResponse, respond, type Method, type Path } from "./model";
import type { HttpState } from "./state";

/* 1 ─ A letter and a reply ------------------------------------------------------------------------ */

const PARTS: [string, string, string][] = [
  [
    "GET /menu/dish_42 HTTP/1.1",
    "Request line",
    "What you want done (the method) and to what (the path).",
  ],
  [
    "Host: api.example.in",
    "Headers",
    "Labels on the envelope: who it's for, what you accept, who you are.",
  ],
  ["Accept: application/json", "", ""],
  ["HTTP/1.1 200 OK", "Status line", "A three-digit code saying how it went."],
  ['{ "name": "Masala dosa", … }', "Body", "The letter inside, often JSON."],
];

export function Envelope() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="A letter and a reply"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PARTS.map(([code, t, d], i) => (
            <motion.div
              key={code}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "grid gap-x-3 rounded-lg border px-3 py-2 sm:grid-cols-[14rem_1fr]",
                i < 3 ? "border-viz-data/40 bg-viz-data/5" : "border-viz-add/40 bg-viz-add/5",
                i === 3 && "mt-2",
              )}
            >
              <span className="font-mono text-xs">{code}</span>
              {t && (
                <span className="text-xs">
                  <span className="font-semibold">{t}:</span>{" "}
                  <span className="text-muted">{d}</span>
                </span>
              )}
            </motion.div>
          ))}
          <p className="text-muted text-[10px]">Blue: the request. Green: the response.</p>
        </div>
      }
    >
      <p>
        Posting a letter: the envelope says where it goes and how to handle it; the letter inside
        says what you want. A reply comes back with a stamp on top: delivered, refused, or lost.
      </p>
      <p>
        <Term id="http">HTTP</Term> works the same way. Every request has a{" "}
        <Term id="http-method">method</Term> and a path, some <Term id="http-header">headers</Term>{" "}
        and sometimes a body. Every response has a <Term id="status-code">status code</Term>,
        headers and usually a body. It&apos;s plain text you could type by hand (HTTP/2 and 3 send
        the same information in a compact binary form).
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build a request ⭐ -------------------------------------------------------------------------- */

const METHODS: Method[] = ["GET", "POST", "PUT", "DELETE"];
const PATHS: Path[] = ["/menu/dish_42", "/orders", "/orders/ord_9", "/orders/ord_404"];
const CODES = [200, 201, 204, 400, 401, 404, 405, 415];

export function BuildRequest() {
  const [s, set] = useSceneState<HttpState>();
  const req = { method: s.method, path: s.path, auth: s.auth, json: s.json, body: s.body };
  const res = respond(req);
  const seen = new Set([...(s.seen ?? []), res.status]);
  const update = (p: Partial<HttpState>) => {
    const next = respond({ ...req, ...p });
    set({ ...p, seen: [...new Set([...(s.seen ?? []), next.status])] });
  };
  const sends = s.method === "POST" || s.method === "PUT";
  const chip = (on: boolean) =>
    cn(
      "rounded-full border px-2.5 py-1 font-mono text-[11px]",
      on ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
    );
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Build a request"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {METHODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update({ method: m })}
                className={chip(s.method === m)}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PATHS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => update({ path: p })}
                className={chip(s.path === p)}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              aria-pressed={s.auth}
              onClick={() => update({ auth: !s.auth })}
              className={chip(s.auth)}
            >
              Authorization
            </button>
            <button
              type="button"
              aria-pressed={s.json}
              disabled={!sends}
              onClick={() => update({ json: !s.json })}
              className={cn(chip(s.json && sends), "disabled:opacity-40")}
            >
              Content-Type: json
            </button>
            <button
              type="button"
              aria-pressed={s.body}
              disabled={!sends}
              onClick={() => update({ body: !s.body })}
              className={cn(chip(s.body && sends), "disabled:opacity-40")}
            >
              body
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-muted mb-1 font-mono text-[10px]">request</p>
              <Code>{rawRequest(req)}</Code>
            </div>
            <div>
              <p className="text-muted mb-1 font-mono text-[10px]">response</p>
              <Code>{rawResponse(res)}</Code>
            </div>
          </div>
          <motion.p
            key={res.status + res.why}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              res.status < 300 ? "border-good/50 bg-good/5" : "border-bad/50 bg-bad/5",
            )}
          >
            <span className="font-mono font-semibold">{res.status}</span> {res.why}
          </motion.p>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-muted text-[10px]">codes found:</span>
            {CODES.map((c) => (
              <span
                key={c}
                className={cn(
                  "rounded px-1.5 py-0.5 font-mono text-[10px]",
                  seen.has(c) ? (c < 300 ? "bg-good/20" : "bg-bad/20") : "bg-surface-2 text-subtle",
                )}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A small food-delivery API. Pick a method, an address and what to send, and watch the
        server&apos;s reply. Can you find all eight status codes?
      </p>
      <p>
        One rule underneath it all: &ldquo;HTTP is defined as a stateless protocol, meaning that
        each request message&apos;s semantics can be understood in isolation&rdquo; (RFC 9110). The
        server doesn&apos;t remember your last request, so every request carries what it needs,
        including who you are.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Safe and idempotent ------------------------------------------------------------------------- */

const ROWS: [string, string, string, string][] = [
  ["GET", "Read something", "yes", "yes"],
  ["POST", "Create, or any other action", "no", "no"],
  ["PUT", "Replace with what I send", "no", "yes"],
  ["PATCH", "Change some fields", "no", "no"],
  ["DELETE", "Remove", "no", "yes"],
];

export function Methods() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Safe and idempotent"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface overflow-hidden rounded-xl border text-xs">
            <div className="text-muted grid grid-cols-[4.5rem_1fr_3.5rem_4.5rem] gap-2 px-3 py-1.5 font-semibold">
              <span>Method</span>
              <span>Means</span>
              <span>Safe</span>
              <span>Idempotent</span>
            </div>
            {ROWS.map(([m, d, safe, idem]) => (
              <div
                key={m}
                className="border-line grid grid-cols-[4.5rem_1fr_3.5rem_4.5rem] gap-2 border-t px-3 py-1.5"
              >
                <span className="font-mono font-semibold">{m}</span>
                <span className="text-muted">{d}</span>
                <span className={safe === "yes" ? "text-good" : "text-muted"}>{safe}</span>
                <span className={idem === "yes" ? "text-good" : "text-muted"}>{idem}</span>
              </div>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            Also safe: HEAD (headers only), OPTIONS and TRACE. New in June 2026: QUERY (RFC 10008),
            a safe, idempotent way to send a search in the request body.
          </p>
        </div>
      }
    >
      <p>
        Two properties decide what clients, caches and proxies may do with a request. A{" "}
        <Term id="safe-method">safe</Term> method is &ldquo;essentially read-only&rdquo;: the client
        isn&apos;t asking for anything to change. An <Term id="idempotent">idempotent</Term> one has
        the same effect whether it&apos;s sent once or five times.
      </p>
      <p>
        RFC 9110 puts it simply: &ldquo;PUT, DELETE, and safe request methods are idempotent.&rdquo;
        That&apos;s why a browser will quietly retry a GET after a dropped connection, but asks
        before resending a form: POST might order your dinner twice.
      </p>
    </StepLayout>
  );
}

/* 4 ─ From 0.9 to 3 ------------------------------------------------------------------------------- */

const VERSIONS: [string, string, string][] = [
  [
    "1991",
    "HTTP/0.9",
    "One line, 'GET /page'. No headers, no status codes; the connection closes when done.",
  ],
  ["1996–97", "HTTP/1.0 and 1.1", "Methods, headers and status codes; 1.1 keeps connections open."],
  ["2015", "HTTP/2", "Binary, many requests at once on one connection."],
  ["2022", "HTTP/3 and RFC 9110", "HTTP over QUIC; the meaning of HTTP rewritten as one document."],
  ["2026", "QUERY", "A new safe method for searches with a body."],
];

export function Versions() {
  return (
    <StepLayout
      eyebrow="Story"
      title="From 0.9 to 3"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {VERSIONS.map(([y, t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="grid grid-cols-[4.5rem_1fr] items-start gap-2"
            >
              <span className="text-accent font-mono text-xs">{y}</span>
              <span className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <span className="text-sm font-semibold">{t}</span>
                <span className="text-muted block text-xs">{d}</span>
              </span>
            </motion.div>
          ))}
          <div className="mt-2 flex h-5 overflow-hidden rounded-full text-[10px]">
            {[
              ["HTTP/2 50%", 50, "bg-viz-data/50"],
              ["1.x 29%", 29, "bg-viz-idle/40"],
              ["HTTP/3 21%", 21, "bg-viz-add/50"],
            ].map(([l, w, c]) => (
              <span
                key={l as string}
                className={cn("flex items-center justify-center", c as string)}
                style={{ width: `${w}%` }}
              >
                {l}
              </span>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Share of requests to Cloudflare in 2025 (Cloudflare Year in Review).
          </p>
        </div>
      }
    >
      <p>
        Tim Berners-Lee&apos;s first HTTP, in 1991, had a single request: GET. Everything since has
        added to it without changing what a GET means, which is why a 1990s idea still carries
        today&apos;s APIs.
      </p>
      <p>
        The meaning (methods, status codes, headers) now lives in RFC 9110, &ldquo;HTTP
        Semantics&rdquo;. How the bytes travel is separate: RFC 9112 for HTTP/1.1, 9113 for HTTP/2,
        9114 for HTTP/3. An API designer mostly cares about the first.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Whose fault? -------------------------------------------------------------------------------- */

export function WhichClass() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Whose fault?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="status-class"
            prompt="Which class of status code fits each situation?"
            categories={[
              { id: "2", label: "2xx" },
              { id: "4", label: "4xx" },
              { id: "5", label: "5xx" },
            ]}
            items={[
              {
                id: "created",
                label: "A new order was saved",
                category: "2",
                why: "Success: 201 Created.",
              },
              {
                id: "deleted",
                label: "The address was deleted; nothing to send back",
                category: "2",
                why: "Success with no body: 204.",
              },
              {
                id: "json",
                label: "The client sent broken JSON",
                category: "4",
                why: "The client's mistake: 400.",
              },
              {
                id: "token",
                label: "The client's sign-in token has expired",
                category: "4",
                why: "The client must sign in again: 401.",
              },
              {
                id: "db",
                label: "The server's database is down",
                category: "5",
                why: "Nothing the client did: 503.",
              },
              {
                id: "upstream",
                label: "A bank the server calls didn't answer in time",
                category: "5",
                why: "The server's dependency failed: 504.",
              },
            ]}
            explanation="2xx: it worked. 4xx: the client should change something before retrying. 5xx: the server failed, so the same request may work later."
          />
        </div>
      }
    >
      <p>
        RFC 9110&apos;s one-line summaries: 2xx &ldquo;The request was successfully received,
        understood, and accepted&rdquo;; 4xx &ldquo;The request contains bad syntax or cannot be
        fulfilled&rdquo;; 5xx &ldquo;The server failed to fulfill an apparently valid
        request&rdquo;. (1xx is informational, 3xx redirection.)
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Request: method, path, headers, body", "Response: status, headers, body."],
  ["Stateless", "Every request carries what it needs."],
  ["Safe and idempotent", "GET is safe; PUT and DELETE are idempotent; POST is neither."],
  ["Status classes", "2xx worked, 4xx client's fault, 5xx server's fault."],
  ["Meaning is separate from transport", "RFC 9110 for meaning; HTTP/1.1, 2 or 3 for the bytes."],
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
      <p>Next: the different shapes an API can take on top of HTTP, and when each fits.</p>
    </StepLayout>
  );
}
