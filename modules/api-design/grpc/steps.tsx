"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BASE, CHANGES, WIRE, type Effect } from "./model";
import type { GrpcState } from "./state";

/* 1 ─ A form with numbered boxes ------------------------------------------------------------------ */

export function NumberedBoxes() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A form with numbered boxes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1">
            {WIRE.map(([hex, meaning], i) => (
              <motion.div
                key={hex}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className={cn(
                  "grid grid-cols-[10rem_1fr] gap-2 rounded px-2 py-1 font-mono text-[11px]",
                  i % 2 === 0 ? "bg-accent-soft" : "bg-surface",
                )}
              >
                <span>{hex}</span>
                <span className="text-muted">{meaning}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            An Order as Protocol Buffers bytes: 20 bytes, with no field names, only numbers.
          </p>
        </div>
      }
    >
      <p>
        Government forms number their boxes: box 7 is your date of birth, whatever the label says
        this year. Clerks process by number, so the label can be reworded, but box 7 can never start
        meaning something else.
      </p>
      <p>
        <Term id="grpc">gRPC</Term> lets one service call a function on another, sending messages in{" "}
        <Term id="protobuf">Protocol Buffers</Term>, a compact binary format. Each field has a
        number, and only the numbers travel. The guide is blunt: a field&apos;s number &ldquo;cannot
        be changed once your message type is in use because it identifies the field in the message
        wire format.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Change the message ⭐ ----------------------------------------------------------------------- */

const ICON: Record<Effect, typeof Check> = { ok: Check, degrades: AlertTriangle, broken: X };
const CLS: Record<Effect, string> = {
  ok: "border-good/50 bg-good/5",
  degrades: "border-viz-compute/50 bg-viz-compute/10",
  broken: "border-bad/50 bg-bad/10",
};
const ICLS: Record<Effect, string> = {
  ok: "text-good",
  degrades: "text-viz-compute",
  broken: "text-bad",
};

export function Evolve() {
  const [s, set] = useSceneState<GrpcState>();
  const ch = CHANGES.find((c) => c.id === s.change);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Change the message"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CHANGES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={s.change === c.id}
                onClick={() => set({ change: c.id })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.change === c.id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-muted mb-1 font-mono text-[10px]">order.proto, before</p>
              <Code>{BASE}</Code>
            </div>
            <div>
              <p className="text-muted mb-1 font-mono text-[10px]">after</p>
              <Code>{ch ? ch.proto : "pick a change above"}</Code>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["Old service reading binary Protobuf", ch?.binary, ch?.binaryWhy],
                ["Old web app reading JSON through a gateway", ch?.json, ch?.jsonWhy],
              ] as [string, Effect | undefined, string | undefined][]
            ).map(([name, e, why]) => {
              const Icon = e ? ICON[e] : null;
              return (
                <motion.div
                  key={name + (ch?.id ?? "")}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    e ? CLS[e] : "border-line bg-surface",
                  )}
                >
                  <p className="flex items-center gap-1.5 text-xs font-semibold">
                    {Icon && e && <Icon className={cn("size-3.5", ICLS[e])} />}
                    {name}
                  </p>
                  <p className="text-muted text-[11px]">
                    {why ?? "Built against the version on the left."}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <p className="text-subtle text-[10px]">Illustrative message and clients.</p>
        </div>
      }
    >
      <p>
        Two old clients were built against the Order message on the left. One speaks binary
        Protobuf; one reads the same data as JSON. Try each change.
      </p>
      <p>
        The rules follow from the numbered boxes. New numbers are safe: &ldquo;old binaries simply
        ignore the new field when parsing.&rdquo; Numbers must never be reused: &ldquo;Field numbers
        should never be reused.&rdquo; Mark deleted ones <code>reserved</code> so nobody can. And
        names matter wherever JSON is involved.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Four kinds of call -------------------------------------------------------------------------- */

const CALLS: [string, string, string][] = [
  [
    "Unary",
    "rpc GetOrder(GetOrderRequest) returns (Order);",
    "One request, one response: like a normal function call.",
  ],
  [
    "Server streaming",
    "rpc WatchOrder(WatchRequest) returns (stream OrderUpdate);",
    "One request, then a stream of updates: live delivery tracking.",
  ],
  [
    "Client streaming",
    "rpc UploadScans(stream Scan) returns (Summary);",
    "Many messages in, one answer back: a batch of parcel scans.",
  ],
  [
    "Bidirectional",
    "rpc Chat(stream Message) returns (stream Message);",
    "Both sides stream at once, independently.",
  ],
];

export function FourCalls() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four kinds of call"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CALLS.map(([t, code, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-accent font-mono text-[10px] break-all">{code}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        gRPC runs over HTTP/2, which can carry many streams on one connection, so calls aren&apos;t
        limited to one request and one reply. Within a single call, messages arrive in order.
      </p>
      <p>
        One habit matters more than any other: set a deadline. By default gRPC waits as long as it
        takes, so the grpc.io guide says &ldquo;you should always explicitly set a realistic
        deadline in your clients.&rdquo; Errors come back as one of 17 status codes, from OK (0) to
        UNAUTHENTICATED (16).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Browsers, tools and CI ---------------------------------------------------------------------- */

const AROUND: [string, string][] = [
  [
    "gRPC-Web",
    "Browsers can't reach raw HTTP/2 frames, so gRPC-Web carries the same calls in a browser-friendly form, usually through a proxy.",
  ],
  [
    "ConnectRPC",
    "A family of libraries (a CNCF Sandbox project since 2024) whose servers speak gRPC, gRPC-Web and a simple HTTP/JSON form.",
  ],
  [
    "buf breaking",
    "Compares your .proto files with the last release and fails the build on changes that would break clients.",
  ],
  [
    "Editions",
    'edition = "2024" replaces the old proto2/proto3 syntax lines; the wire format doesn\'t change.',
  ],
];

export function AroundGrpc() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Browsers, tools and CI"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {AROUND.map(([t, d], i) => (
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
          <Code>{`# in CI, on every pull request
buf breaking --against '.git#branch=main'`}</Code>
        </div>
      }
    >
      <p>
        gRPC shines between a company&apos;s own services: fast, strictly typed, with client code
        generated for every language from the same .proto file. For public APIs and browsers, most
        teams put REST or gRPC-Web in front.
      </p>
      <p>
        The rules from the simulation can be enforced by a machine. A breaking-change check in the
        pipeline catches a reused field number before any client does.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Safe change? -------------------------------------------------------------------------------- */

export function SafeChange() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe change?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="proto-safe"
            prompt="For old clients reading binary Protobuf, is each change safe on the wire, or breaking?"
            categories={[
              { id: "safe", label: "Safe" },
              { id: "break", label: "Breaking" },
            ]}
            items={[
              {
                id: "add",
                label: "Add a new field with an unused number",
                category: "safe",
                why: "Old code skips it.",
              },
              {
                id: "reserve",
                label: "Delete a field and reserve its number and name",
                category: "safe",
                why: "Nobody can reuse it; old code sees a default.",
              },
              {
                id: "comment",
                label: "Add comments to the .proto file",
                category: "safe",
                why: "Comments never reach the wire.",
              },
              {
                id: "reuse",
                label: "Reuse a deleted field's number for a new field",
                category: "break",
                why: "Old code misreads the new data as the old field.",
              },
              {
                id: "renumber",
                label: "Change an existing field's number",
                category: "break",
                why: "Old code looks for the old number and finds nothing.",
              },
              {
                id: "type",
                label: "Change a field from string to int32",
                category: "break",
                why: "The bytes are encoded differently; old code can't read them.",
              },
            ]}
            explanation="Numbers are the contract on the wire: add new ones, reserve old ones, never reuse or change them."
          />
        </div>
      }
    >
      <p>Think about what actually travels: numbers and bytes.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Numbers, not names, travel", "Binary Protobuf is compact and fast."],
  ["Never change or reuse a number", "Reserve deleted ones."],
  ["Names still matter for JSON", "Renames break JSON readers."],
  ["Streams and deadlines", "Four kinds of call; always set a deadline."],
  ["Check in CI", "buf breaking catches mistakes early."],
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
      <p>Next: GraphQL, where the client writes the query.</p>
    </StepLayout>
  );
}
