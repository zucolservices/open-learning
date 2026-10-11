"use client";

import { motion } from "motion/react";
import { ArrowLeftRight, Plug } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { DIRECT_USES, adapterCode, coreCode } from "./model";
import type { BoundState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Socket() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A wall socket, not wiring"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Wired straight into the wall</p>
            <p className="text-muted">
              The coffee machine is hard-wired. Replacing it means an electrician and a broken wall.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">A standard socket</p>
            <p className="text-muted">
              Any machine with the right plug works. Swap it in a minute; test with a lamp.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        The café&apos;s wiring shouldn&apos;t care which coffee machine is plugged in. A socket is a{" "}
        <Term id="boundary">boundary</Term>: a small, stable shape on the café&apos;s side that any
        machine can fit.
      </p>
      <p>
        Code benefits from the same idea. Keep your business rules (prices, refunds, approvals) on
        one side, and databases, frameworks and vendors on the other, connected through small
        interfaces your code owns.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Wrap the SDK ⭐ ------------------------------------------------------------------------------- */

export function WrapSdk() {
  const [s, set] = useSceneState<BoundState>();
  const changes = s.switched ? (s.port ? 1 : DIRECT_USES) : 0;
  return (
    <StepLayout
      eyebrow="Build"
      title="Put a port between checkout and the payment provider"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={s.port}
              onClick={() => set({ port: !s.port, provider: "acme", switched: false })}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
                s.port ? "border-accent bg-accent text-accent-fg" : "border-line-strong",
              )}
            >
              <Plug className="size-3" />{" "}
              {s.port ? "Port in place" : "Introduce a PaymentGateway port"}
            </button>
            <button
              type="button"
              disabled={s.switched}
              onClick={() => set({ provider: "zeta", switched: true })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40"
            >
              <ArrowLeftRight className="size-3" /> Switch provider to ZetaPay
            </button>
            {s.switched && (
              <button
                type="button"
                onClick={() => set({ provider: "acme", switched: false })}
                className="border-line-strong rounded-full border px-3 py-1 text-xs"
              >
                Undo the switch
              </button>
            )}
          </div>
          <Code
            key={`${s.port}-${s.provider}`}
            lines={coreCode(s.port, s.provider)}
            title="checkout.js · business rules"
            marks={!s.port && s.switched ? { 0: "bad", 4: "bad", 5: "bad" } : {}}
          />
          {s.port && (
            <Code
              key={s.provider}
              lines={adapterCode(s.provider)}
              title={`adapters/${s.provider}-pay.js · the only file that knows the vendor`}
              marks={s.switched ? { 0: "good", 2: "good", 3: "good" } : {}}
            />
          )}
          {s.switched && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("text-xs", s.port ? "text-good" : "text-bad")}
            >
              {s.port
                ? "One new adapter file. The business rules, and their tests, didn't change at all."
                : `The vendor's names and shapes are spread through the business code: ${DIRECT_USES} places to change (checkout, refunds, tips, deposits, reports, tests), each mixed with rules.`}
            </motion.p>
          )}
          {s.port && (
            <p className="text-muted text-[11px]">
              Bonus: tests can pass a fake gateway that approves or declines on demand, with no
              network and no real money.
            </p>
          )}
        </div>
      }
    >
      <p>
        Checkout calls a fictional payment provider&apos;s SDK directly. Try switching providers as
        it is, then introduce a port (an interface checkout owns) and switch again.
      </p>
      <p>
        Notice the port speaks the café&apos;s language (&ldquo;approved&rdquo; or
        &ldquo;declined&rdquo;), not the vendor&apos;s status codes. Translating lives in the
        adapter.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Architectures -------------------------------------------------------------------------------- */

export function Architectures() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="One idea, several names"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg viewBox="0 0 240 130" className="mx-auto w-full max-w-sm" fill="none">
            <polygon
              points="120,15 175,40 175,90 120,115 65,90 65,40"
              className="fill-accent/15 stroke-accent"
              strokeWidth={1.4}
            />
            <text x={120} y={62} textAnchor="middle" className="fill-fg text-[9px] font-semibold">
              business rules
            </text>
            <text x={120} y={74} textAnchor="middle" className="fill-muted text-[7px]">
              prices · refunds · approvals
            </text>
            {[
              [8, 30, "web UI"],
              [8, 90, "tests"],
              [186, 30, "payments"],
              [186, 90, "database"],
            ].map(([x, y, l]) => (
              <g key={l as string}>
                <rect
                  x={x as number}
                  y={y as number}
                  width={46}
                  height={16}
                  rx={3}
                  className="fill-surface stroke-line-strong"
                  strokeWidth={1}
                />
                <text
                  x={(x as number) + 23}
                  y={(y as number) + 11}
                  textAnchor="middle"
                  className="fill-fg text-[7px]"
                >
                  {l as string}
                </text>
              </g>
            ))}
            {[
              [54, 38, 65, 44],
              [54, 98, 65, 86],
              [186, 38, 175, 44],
              [186, 98, 175, 86],
            ].map(([a, b, c, d], i) => (
              <line
                key={i}
                x1={a}
                y1={b}
                x2={c}
                y2={d}
                className="stroke-line-strong"
                strokeWidth={1}
              />
            ))}
          </svg>
          <div className="grid gap-1.5 text-xs">
            {[
              [
                "Ports and adapters",
                "Alistair Cockburn, 2005: the application talks to the world through ports it owns; adapters plug in technology. Tests are just another adapter.",
              ],
              [
                "The dependency rule",
                "Robert C. Martin, 2012: source code dependencies point inwards, towards the business rules, never outwards.",
              ],
              [
                "Anti-corruption layer",
                "Eric Evans, 2003: a translating layer that keeps another system's model from leaking into yours.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <span className="font-semibold">{t}</span>
                <span className="text-muted"> · {b}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        <Term id="ports-and-adapters">Hexagonal</Term>, clean and onion architectures differ in
        diagrams more than in substance. All put business rules at the centre and push vendors,
        frameworks and databases to the edge. Cockburn has said the hexagon shape itself means
        nothing; it just left room to draw several ports.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Functional core ------------------------------------------------------------------------------ */

export function FunctionalCore() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Functional core, imperative shell"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Code
            numbers={false}
            title="Core: pure decisions, easy to test"
            lines={[
              "function refundDecision(order, today) {",
              '  if (order.status !== "PAID") return { refund: false, reason: "not paid" };',
              '  if (daysBetween(order.paidAt, today) > 7) return { refund: false, reason: "too late" };',
              "  return { refund: true, amount: order.total };",
              "}",
            ]}
          />
          <Code
            numbers={false}
            title="Shell: does the input and output"
            lines={[
              "async function handleRefund(id) {",
              "  const order = await db.load(id);",
              "  const decision = refundDecision(order, new Date());",
              "  if (decision.refund) await payments.refund(order, decision.amount);",
              "  await db.save({ ...order, refund: decision });",
              "}",
            ]}
          />
        </div>
      }
    >
      <p>
        Gary Bernhardt&apos;s phrase (2012) for the same idea at the scale of a single feature: put
        the decisions in plain functions that take values and return values, and keep the database,
        clock and network in a thin outer layer.
      </p>
      <p>
        The core can be tested with dozens of fast unit tests; the shell needs only a few
        integration tests, because it barely decides anything.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function BoundCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Core or edge?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-boundaries"
            prompt="Does each piece belong in the core or at the edge?"
            categories={[
              { id: "core", label: "Core (business rules)" },
              { id: "edge", label: "Edge (adapters, I/O)" },
            ]}
            items={[
              {
                id: "refund",
                label: "Refunds allowed within 7 days of payment",
                category: "core",
                why: "A business rule.",
              },
              {
                id: "sql",
                label: "The SQL that saves an order",
                category: "edge",
                why: "A storage detail.",
              },
              {
                id: "sdk",
                label: "Translating the payment SDK's status codes",
                category: "edge",
                why: "Adapter work.",
              },
              {
                id: "approval",
                label: "Orders over ₹5,000 need a manager",
                category: "core",
                why: "A business rule.",
              },
              {
                id: "http",
                label: "Parsing the JSON body of a web request",
                category: "edge",
                why: "Framework detail.",
              },
            ]}
            explanation="Rules about the business live in the core and know nothing about databases or vendors. Everything technology-specific sits at the edge, behind interfaces the core owns."
          />
        </div>
      }
    >
      <p>Sort each piece.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Rules in the middle", "Details at the edge."],
        ["Own the interface", "Ports speak your language, adapters translate."],
        ["Dependencies point inwards", "Core never imports the vendor."],
        ["Swap and test freely", "New provider: new adapter. Tests: a fake."],
        ["Functional core, imperative shell", "Pure decisions inside, I/O outside."],
      ]}
    >
      <p>That&apos;s the design chapter. Next: making errors and absence explicit.</p>
    </WrapStep>
  );
}
