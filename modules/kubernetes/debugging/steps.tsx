"use client";

import { motion } from "motion/react";
import { Check, Stethoscope, Terminal } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { INCIDENTS } from "./incidents";
import type { DebugState } from "./state";

/* 1 ─ A doctor's questions ----------------------------------------------------------------------- */

export function DoctorQuestions() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A doctor's questions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "What do you see?",
              "Look at the patient before guessing.",
              "kubectl get pods: the STATUS column",
            ],
            [
              "What happened, in order?",
              "The history usually points at the cause.",
              "kubectl describe pod: the Events at the bottom",
            ],
            [
              "What did they say last?",
              "Before collapsing, what were their final words?",
              "kubectl logs --previous",
            ],
            [
              "Is the wiring right?",
              "Sometimes the patient is fine and the phone line is cut.",
              "kubectl get endpointslices",
            ],
          ].map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[auto_1fr] items-start gap-3 rounded-lg border px-3 py-2"
            >
              <Stethoscope className="text-accent mt-0.5 size-5" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
                <p className="mt-0.5 font-mono text-[10px]">{k}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Kubernetes leaves clues everywhere: a pod&apos;s status, its{" "}
        <Term id="k8s-event">events</Term>, its logs. Most problems fall into a handful of patterns,
        and a short routine finds them.
      </p>
      <p>
        The docs put it simply: &ldquo;The first step in debugging a Pod is taking a look at
        it&rdquo;, with <code>kubectl describe pod</code>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Five incidents ⭐ ---------------------------------------------------------------------------- */

export function Incidents() {
  const [s, set] = useSceneState<DebugState>();
  const inc = INCIDENTS[s.incident] ?? INCIDENTS[0];
  const ran = s.ran?.[inc.id] ?? [];
  const answer = s.answer?.[inc.id];
  const chosen = inc.diagnoses.find((d) => d.id === answer);
  const run = (cmd: string) => {
    if (ran.includes(cmd)) return;
    set({ ran: { ...(s.ran ?? {}), [inc.id]: [...ran, cmd] } });
  };
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Five incidents"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {INCIDENTS.map((x, i) => {
              const solved = x.diagnoses.find((d) => d.id === s.answer?.[x.id])?.right;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ incident: i })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                    s.incident === i
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {solved && <Check className="text-good size-3" />}
                  {x.name}
                </button>
              );
            })}
          </div>
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10px] leading-relaxed">
            {inc.symptom}
          </pre>
          <div className="flex flex-col gap-1">
            {inc.commands.map((c) => (
              <button
                key={c.cmd}
                type="button"
                onClick={() => run(c.cmd)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1 text-left font-mono text-[10px]",
                  ran.includes(c.cmd)
                    ? "border-line text-muted"
                    : "border-accent/50 hover:bg-accent-soft",
                )}
              >
                <Terminal className="size-3 shrink-0" /> $ {c.cmd}
              </button>
            ))}
          </div>
          {ran.length > 0 && (
            <div className="bg-bg border-line max-h-64 overflow-auto rounded-lg border px-3 py-2 font-mono text-[10px] leading-relaxed">
              {ran.map((cmd) => (
                <motion.div
                  key={cmd}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-2"
                >
                  <p className="text-accent">$ {cmd}</p>
                  <pre className="whitespace-pre-wrap">
                    {inc.commands.find((c) => c.cmd === cmd)?.out}
                  </pre>
                </motion.div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <p className="text-muted text-[10px]">Your diagnosis</p>
            {inc.diagnoses.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => set({ answer: { ...(s.answer ?? {}), [inc.id]: d.id } })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  answer === d.id
                    ? d.right
                      ? "border-good bg-good/15"
                      : "border-bad bg-bad/10"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {d.text}
              </button>
            ))}
          </div>
          {chosen && (
            <motion.p
              key={chosen.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                chosen.right ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              {chosen.why}
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        Five broken workloads. For each, run the commands you think will help, read the output, then
        pick a diagnosis. Not every command helps; that&apos;s part of the skill.
      </p>
      <p>
        Patterns to spot: Pending means the scheduler can&apos;t place it; ImagePullBackOff means
        the image can&apos;t be fetched; CrashLoopBackOff means it starts and dies; OOMKilled with
        exit code 137 means the memory limit; an empty endpoint list means the Service matches
        nothing.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The toolbox ------------------------------------------------------------------------------- */

const TOOLS: [string, string][] = [
  [
    "kubectl describe",
    "State, last state, exit code, restart count and the events at the bottom. Start here.",
  ],
  [
    "kubectl logs --previous",
    '"Print the logs for the previous instance of the container": what a crashed container said before it died.',
  ],
  [
    "kubectl get events",
    "Namespaced, and kept only an hour by default (--event-ttl), so look soon.",
  ],
  [
    "kubectl debug",
    "Adds an ephemeral container to a running pod, handy when the image has no shell (distroless). Since kubectl 1.36 the default profile is general; others: baseline, restricted, netadmin, sysadmin.",
  ],
  ["kubectl debug node/…", "A pod on a node with the node's filesystem at /host."],
  ["kubectl top", "Live CPU and memory, if metrics-server is installed."],
  [
    "Exit codes",
    "1: the app gave up. 137 = 128 + 9 (SIGKILL), OOMKilled if the reason says so. 143 = 128 + 15 (SIGTERM), a normal stop.",
  ],
];

export function Toolbox() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The toolbox"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {TOOLS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="font-mono text-xs font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A handful of commands cover most incidents. In production you&apos;ll also have dashboards,
        logs and traces collected centrally, but these work on any cluster, even when everything
        else is down.
      </p>
      <p>Write down what you found. Most incidents recur.</p>
    </StepLayout>
  );
}

/* 4 ─ First command? ----------------------------------------------------------------------------- */

export function FirstCommand() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="First command?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="first-command"
            prompt="Which command would you run first?"
            categories={[
              { id: "describe", label: "kubectl describe pod" },
              { id: "logs", label: "kubectl logs --previous" },
              { id: "eps", label: "kubectl get endpointslices" },
            ]}
            items={[
              {
                id: "pending",
                label: "A pod has been Pending for ten minutes",
                category: "describe",
                why: "Its events say why the scheduler can't place it.",
              },
              {
                id: "crash",
                label: "A pod is in CrashLoopBackOff and you want to know why the app exits",
                category: "logs",
                why: "The crashed instance's last words.",
              },
              {
                id: "svc",
                label: "Pods are Running but the Service refuses connections",
                category: "eps",
                why: "Check whether the Service selects any pods.",
              },
              {
                id: "image",
                label: "A pod shows ImagePullBackOff",
                category: "describe",
                why: "The pull error is in the events.",
              },
              {
                id: "restarts",
                label: "A pod's restart count keeps climbing and you suspect memory",
                category: "describe",
                why: "Last State shows OOMKilled and exit code 137.",
              },
              {
                id: "stack",
                label: "A Java service died with a stack trace you need to read",
                category: "logs",
                why: "--previous shows the trace from before the restart.",
              },
            ]}
            explanation="describe for status and events, logs --previous for what the app said, endpointslices when the wiring is in doubt."
          />
        </div>
      }
    >
      <p>Six symptoms. What&apos;s your first move?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Read the status",
    "Pending, ImagePullBackOff, CrashLoopBackOff, OOMKilled each point somewhere.",
  ],
  ["describe, then logs", "Events first; --previous for crashed containers."],
  ["Requests, not usage", "Pending pods on idle nodes are a requests problem."],
  ["Check the wiring", "Empty EndpointSlices mean the selector matches nothing."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next chapter: in practice, starting with extending Kubernetes.</p>
    </StepLayout>
  );
}
