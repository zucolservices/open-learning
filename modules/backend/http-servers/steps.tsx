"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CODES, REQUESTS } from "./model";
import type { HttpState } from "./state";

const FW: { id: string; label: string; code: string[] }[] = [
  {
    id: "express",
    label: "Express 5",
    code: [
      "app.get('/orders/:id', async (req, res) => {",
      "  const order = await findOrder(req.params.id);",
      "  if (!order) return res.status(404).json({ error: 'Not found' });",
      "  res.json(order);",
      "});",
    ],
  },
  {
    id: "fastapi",
    label: "FastAPI",
    code: [
      "@app.get('/orders/{order_id}')",
      "async def get_order(order_id: int):",
      "    order = await find_order(order_id)",
      "    if order is None:",
      "        raise HTTPException(status_code=404)",
      "    return order",
    ],
  },
  {
    id: "spring",
    label: "Spring Boot",
    code: [
      '@GetMapping("/orders/{id}")',
      "ResponseEntity<Order> get(@PathVariable long id) {",
      "  return orders.find(id)",
      "      .map(ResponseEntity::ok)",
      "      .orElse(ResponseEntity.notFound().build());",
      "}",
    ],
  },
  {
    id: "go",
    label: "Go",
    code: [
      'mux.HandleFunc("GET /orders/{id}", func(w http.ResponseWriter, r *http.Request) {',
      '  order, ok := findOrder(r.PathValue("id"))',
      "  if !ok { http.NotFound(w, r); return }",
      "  json.NewEncoder(w).Encode(order)",
      "})",
    ],
  },
  {
    id: "dotnet",
    label: "ASP.NET Core",
    code: [
      'app.MapGet("/orders/{id}", async (int id, Db db) =>',
      "  await db.Orders.FindAsync(id) is Order o",
      "    ? Results.Ok(o)",
      "    : Results.NotFound());",
    ],
  },
];

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Counter() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The post office counter"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["“I'd like to send this parcel.”", "“Done. Here's your tracking number.” (Created)"],
            ["“Collect parcel 999, please.”", "“We don't have one.” (Not found)"],
            ["“Collect my neighbour's parcel.”", "“Only with their permission.” (Forbidden)"],
          ].map(([q, a], i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p>{q}</p>
              <p className="text-muted">{a}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        At a post office counter, each customer brings one request, gets one answer, and the clerk
        doesn&apos;t need to remember them afterwards. Short answers like &ldquo;done&rdquo; or
        &ldquo;not here&rdquo; are understood by everyone.
      </p>
      <p>
        An HTTP server works the same way. Each request names a method and a path; the server runs a{" "}
        <Term id="handler">handler</Term> and replies with a{" "}
        <Term id="status-code">status code</Term>, headers and a body. HTTP is stateless: every
        request stands on its own.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Respond ⭐ ----------------------------------------------------------------------------------- */

export function Respond() {
  const [s, set] = useSceneState<HttpState>();
  const good = (id: string) => REQUESTS.find((r) => r.id === id)!.ok.includes(s.picks[id]);
  const done = REQUESTS.every((r) => good(r.id));
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Answer each request with the right status"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {REQUESTS.map((r) => {
            const p = s.picks[r.id];
            return (
              <div
                key={r.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <p>
                  <span className="font-mono text-[11px] font-semibold">{r.req}</span>
                  <span className="text-muted"> · {r.situation}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {CODES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      title={c.name}
                      aria-pressed={p === c.code}
                      onClick={() => set({ picks: { ...s.picks, [r.id]: c.code } })}
                      className={cn(
                        "rounded-full border px-1.5 py-0.5 font-mono text-[10px]",
                        p === c.code
                          ? good(r.id)
                            ? "border-good bg-good/20"
                            : "border-bad bg-bad/15"
                          : "border-line text-muted",
                      )}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
                {p && (
                  <p className={cn("mt-0.5 text-[10px]", good(r.id) ? "text-good" : "text-muted")}>
                    {good(r.id)
                      ? r.why
                      : `${p} means “${CODES.find((c) => c.code === p)!.name}”. Is that what happened?`}
                  </p>
                )}
              </div>
            );
          })}
          {done && (
            <p className="text-good text-xs">
              Clients, caches and monitoring can all act on these codes without reading a word of
              your error messages.
            </p>
          )}
        </div>
      }
    >
      <p>
        Eight requests reach a café&apos;s API. Pick the status code a good server would return for
        each. Hover a code to see its name.
      </p>
      <p>
        The first digit carries the gist: 2 means success, 4 means the client got something wrong, 5
        means the server did.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Methods -------------------------------------------------------------------------------------- */

export function Methods() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Methods: safe, idempotent, or neither"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line overflow-x-auto rounded-lg border">
            <table className="w-full text-xs">
              <thead className="bg-surface-2">
                <tr>
                  <th className="px-2 py-1 text-left">Method</th>
                  <th className="px-2 py-1 text-left">Safe</th>
                  <th className="px-2 py-1 text-left">Idempotent</th>
                  <th className="px-2 py-1 text-left">Typical use</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["GET", "yes", "yes", "Read"],
                  ["PUT", "no", "yes", "Replace a resource"],
                  ["DELETE", "no", "yes", "Remove"],
                  ["POST", "no", "no", "Create, or run an action"],
                  ["PATCH", "no", "no", "Change part of a resource"],
                  ["QUERY", "yes", "yes", "Search with a body (new, 2026)"],
                ].map((r) => (
                  <tr key={r[0]} className="border-line border-t">
                    {r.map((c, i) => (
                      <td
                        key={i}
                        className={cn(
                          "px-2 py-1",
                          i === 0 && "font-mono font-semibold",
                          c === "yes" && "text-good",
                        )}
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    >
      <p>
        Safe means the client isn&apos;t asking for any change.{" "}
        <Term id="idempotent">Idempotent</Term> means sending it twice has the same effect as once,
        so clients and proxies may retry it after a timeout. POST isn&apos;t, which is why
        double-submitted orders happen.
      </p>
      <p>
        These definitions come from RFC 9110 (2022). QUERY, a safe method that carries a body for
        complex searches, was standardised in June 2026; support is still arriving.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Routing -------------------------------------------------------------------------------------- */

export function Routing() {
  const [s, set] = useSceneState<HttpState>();
  const f = FW.find((x) => x.id === s.fw)!;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Routes and handlers in five frameworks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.fw}
            onChange={(fw) => set({ fw })}
            options={FW.map((x) => [x.id, x.label])}
          />
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {f.code.join("\n")}
          </pre>
        </div>
      }
    >
      <p>
        Every framework does the same job: match the method and path to a handler, pull out
        parameters like the order id, and turn the result into a response.
      </p>
      <p>
        Go has had method-aware routing with path wildcards built in since 1.22 (2024). Express 5,
        the npm default since March 2025, catches errors from async handlers automatically and
        requires wildcards to be named.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function HttpCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe to retry?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="backend-http"
            prompt="A request timed out. Is it safe for the client to send it again automatically?"
            categories={[
              { id: "yes", label: "Safe to retry" },
              { id: "no", label: "Not without care" },
            ]}
            items={[
              {
                id: "get",
                label: "GET /orders/42",
                category: "yes",
                why: "Reading has no side effect.",
              },
              {
                id: "put",
                label: "PUT /orders/42/address with the full new address",
                category: "yes",
                why: "Idempotent: the same end state.",
              },
              {
                id: "post",
                label: "POST /orders to place a new order",
                category: "no",
                why: "Could create two orders, unless you use an idempotency key.",
              },
              {
                id: "delete",
                label: "DELETE /orders/42",
                category: "yes",
                why: "Deleting twice leaves it deleted.",
              },
              {
                id: "patch",
                label: "PATCH /cart: add one more chai",
                category: "no",
                why: "Repeating adds another.",
              },
            ]}
            explanation="Safe and idempotent methods can be retried. POST and PATCH need protection, such as idempotency keys, which a later module covers."
          />
        </div>
      }
    >
      <p>Sort each request.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["One request, one response", "HTTP is stateless."],
        ["Status codes speak", "2xx success, 4xx client, 5xx server."],
        ["401 vs 403", "Not signed in vs not allowed."],
        ["Idempotent can be retried", "POST can't, safely."],
        ["Routes map to handlers", "In every framework."],
      ]}
    >
      <p>Next: how a server handles many requests at the same time.</p>
    </WrapStep>
  );
}
