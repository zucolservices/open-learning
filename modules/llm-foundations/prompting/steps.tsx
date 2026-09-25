"use client";

import { AnimatePresence, motion } from "motion/react";
import { Braces, Check, ListChecks, MessagesSquare, UserRound, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./runs.json";
import { CHECKS, runChecks } from "./checks";
import type { PromptState } from "./state";

const EMAIL_NAMES = [
  "Sour milk",
  "Wrong rice",
  "Sunday delivery?",
  "Charged twice",
  "Thank the driver",
  "Old address",
];

const INGREDIENTS = [
  { bit: 1, id: "role", label: "Role & audience", Icon: UserRound },
  { bit: 2, id: "rules", label: "Rules", Icon: ListChecks },
  { bit: 4, id: "examples", label: "Examples", Icon: MessagesSquare },
  { bit: 8, id: "format", label: "Output format", Icon: Braces },
] as const;

type IngredientId = (typeof INGREDIENTS)[number]["id"];

const RUNS = data.runs as Record<string, string[]>;

function results(mask: number) {
  return data.emails.map((e, i) => runChecks(RUNS[mask][i], e));
}

function passCount(mask: number) {
  return results(mask).reduce((n, r) => n + CHECKS.filter((c) => r[c.id]).length, 0);
}

const TOTAL = data.emails.length * CHECKS.length;

/** The exact prompt the model saw, split into parts so switched-on ingredients can be highlighted. */
function promptParts(mask: number, email: number) {
  const on = (bit: number) => (mask & bit) !== 0;
  const user: { text: string; tag?: IngredientId }[] = [{ text: data.task }];
  if (on(2)) user.push({ text: data.rules, tag: "rules" });
  if (on(8)) user.push({ text: data.format, tag: "format" });
  if (on(4))
    user.push({
      tag: "examples",
      text:
        "Examples:\n" +
        data.examples
          .map((e) => `Email: ${e.text}\nOutput: ${on(8) ? JSON.stringify(e.json) : e.prose}`)
          .join("\n\n"),
    });
  user.push({ text: `Email:\n"""\n${data.emails[email].text}\n"""` });
  return { system: on(1) ? data.role : null, user };
}

function Tick({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]",
        ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
      )}
    >
      {ok ? <Check className="text-good size-3" /> : <X className="text-bad size-3" />}
      {label}
    </span>
  );
}

/* 1 ─ Brief a new colleague ------------------------------------------------------------------------- */

const BRIEF: { q: string; title: string; text: string; Icon: typeof UserRound }[] = [
  {
    q: "",
    Icon: UserRound,
    title: "A one-line brief",
    text: "It's day one for a sharp new temp at a grocery-delivery company. You hand them a customer email and a sticky note. To you the note is obvious, because you know the business.",
  },
  {
    q: "Who is the summary for: the customer, or our staff?",
    Icon: UserRound,
    title: "Who am I, and who's reading?",
    text: "Without knowing the audience, a summary could be a reply to the customer, a report for a manager or a note for a colleague. That's the role and audience.",
  },
  {
    q: "How long should it be? And what counts as urgent here?",
    Icon: ListChecks,
    title: "What are the rules?",
    text: "“Urgent” means something specific in your team: food safety and money problems first. Length limits and “don't guess missing details” are rules too.",
  },
  {
    q: "Could you show me one you liked?",
    Icon: MessagesSquare,
    title: "Can I see an example?",
    text: "One or two worked examples settle a dozen small questions at once: tone, length, how to write “no order number”.",
  },
  {
    q: "Where does it go: a person's inbox, or the ticket software?",
    Icon: Braces,
    title: "What shape should it be?",
    text: "If a program reads the answer, the shape matters as much as the content. Name the exact format.",
  },
];

export function Brief() {
  const [s, set] = useSceneState<PromptState>();
  const step = Math.min(s.brief, BRIEF.length - 1);
  const f = BRIEF[step];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Brief a new colleague"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col gap-2">
              <div className="border-accent/50 bg-surface-2 rotate-[-1deg] rounded-lg border border-dashed px-3 py-2.5 font-mono text-xs shadow-sm">
                {data.task}
              </div>
              <div className="border-line bg-surface rounded-xl border p-3 text-xs">
                <p className="text-muted mb-1 text-[10px]">Customer email</p>
                {data.emails[0].text}
              </div>
            </div>
            <div className="flex min-h-44 flex-col gap-2">
              <p className="text-muted text-[10px]">The new colleague asks…</p>
              <AnimatePresence>
                {BRIEF.slice(1, step + 1).map((b) => (
                  <motion.div
                    key={b.q}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-accent/40 bg-accent-soft flex items-start gap-2 rounded-2xl rounded-tl-sm border px-3 py-2 text-xs"
                  >
                    <b.Icon className="text-accent mt-0.5 size-3.5 shrink-0" />
                    {b.q}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <Stepper step={step} count={BRIEF.length} onChange={(n) => set({ brief: n })} />
          <FrameCaption frameKey={step} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        A <Term id="prompt">prompt</Term> is the model&apos;s whole brief. It can&apos;t see your
        company, your earlier chats or what&apos;s in your head: only the words you send.
      </p>
      <p>
        A good test from Anthropic&apos;s guide: would a smart colleague with no background be able
        to follow your prompt? If they&apos;d have questions, so will the model.
      </p>
      <p className="text-muted text-sm">Step through the questions a new colleague would ask.</p>
    </StepLayout>
  );
}

/* 2 ─ Fix the prompt ⭐ ------------------------------------------------------------------------------- */

export function FixThePrompt() {
  const [s, set] = useSceneState<PromptState>();
  const mask = s.mask;
  const email = s.email;
  const res = results(mask);
  const passed = passCount(mask);
  const out = RUNS[mask][email];
  const parts = promptParts(mask, email);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix the prompt"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Prompt ingredients">
            {INGREDIENTS.map(({ bit, id, label, Icon }) => {
              const on = (mask & bit) !== 0;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set({ mask: mask ^ bit })}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                    on
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              );
            })}
          </div>

          <div className="grid items-start gap-3 lg:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border p-3">
              <div className="mb-2 flex flex-wrap gap-1">
                {EMAIL_NAMES.map((n, i) => {
                  const ok = CHECKS.every((c) => res[i][c.id]);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => set({ email: i })}
                      className={cn(
                        "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]",
                        i === email
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:bg-surface-2",
                      )}
                    >
                      <span
                        className={cn("size-1.5 rounded-full", ok ? "bg-good" : "bg-bad")}
                        aria-hidden
                      />
                      {n}
                    </button>
                  );
                })}
              </div>
              <p className="text-muted text-[11px] italic">{data.emails[email].text}</p>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={`${mask}-${email}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-surface-2 mt-2 max-h-48 overflow-y-auto rounded-lg p-2 font-mono text-[11px] whitespace-pre-wrap"
                >
                  {out}
                </motion.pre>
              </AnimatePresence>
              <div className="mt-2 flex flex-wrap gap-1">
                {CHECKS.map((c) => (
                  <Tick key={c.id} ok={res[email][c.id]} label={c.label} />
                ))}
              </div>
            </div>

            <ResultsGrid mask={mask} email={email} onPick={(i) => set({ email: i })} />
          </div>
          <details className="border-line bg-surface rounded-xl border p-3 text-xs">
            <summary className="cursor-pointer font-semibold">
              The prompt{" "}
              <span className="text-muted font-normal">
                {mask === 0
                  ? "(vague: click to show)"
                  : `(${INGREDIENTS.filter((g) => mask & g.bit).length} of 4 ingredients: click to show)`}
              </span>
            </summary>
            <div className="mt-2 grid max-h-80 gap-2 overflow-y-auto">
              {parts.system && (
                <div>
                  <p className="text-muted text-[10px]">System message</p>
                  <p className="bg-accent-soft rounded-md px-2 py-1 font-mono [overflow-wrap:anywhere] whitespace-pre-wrap">
                    {parts.system}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted text-[10px]">User message</p>
                <div className="grid gap-1.5">
                  {parts.user.map((p, i) => (
                    <p
                      key={i}
                      className={cn(
                        "rounded-md px-2 py-1 font-mono [overflow-wrap:anywhere] whitespace-pre-wrap",
                        p.tag ? "bg-accent-soft" : "bg-surface-2",
                      )}
                    >
                      {p.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </details>
          <p className="text-subtle text-[10px]">
            Real outputs from {data.model.replace("onnx-community/", "")} (a small open model),
            greedy decoding, cut at 110 tokens. The checks run live in your browser.
          </p>
          <p className="sr-only" aria-live="polite">
            {passed} of {TOTAL} checks pass
          </p>
        </div>
      }
    >
      <p>
        Here&apos;s that job for real: six customer emails, a small open model, and the vague
        one-line prompt. Every output was really generated, and four automatic checks mark each one.
      </p>
      <p>
        Switch ingredients on and off to fix it. Open &ldquo;The prompt&rdquo; to see exactly what
        the model received.
      </p>
      <p className="text-muted text-sm">
        Try each ingredient on its own first. Which one helps most? Do any make something worse?
      </p>
    </StepLayout>
  );
}

function ResultsGrid({
  mask,
  email,
  onPick,
}: {
  mask: number;
  email: number;
  onPick: (i: number) => void;
}) {
  const res = results(mask);
  const passed = passCount(mask);
  return (
    <div className="border-line bg-surface rounded-xl border p-3 text-xs">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="font-semibold">Test results for this prompt</p>
        <motion.p
          key={passed}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="font-mono"
        >
          {passed} / {TOTAL}
        </motion.p>
      </div>
      <table className="w-full table-fixed text-[11px]">
        <thead>
          <tr className="text-muted">
            <th className="w-[34%] text-left font-normal" />
            {CHECKS.map((c) => (
              <th key={c.id} className="px-0.5 text-center font-normal" title={c.hint}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {res.map((r, i) => (
            <tr
              key={i}
              onClick={() => onPick(i)}
              className={cn("cursor-pointer", i === email && "bg-accent-soft")}
            >
              <td className="truncate py-0.5 pr-1">{EMAIL_NAMES[i]}</td>
              {CHECKS.map((c) => (
                <td key={c.id} className="text-center">
                  <Cell ok={r[c.id]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ ok }: { ok: boolean }) {
  return ok ? (
    <Check className="text-good mx-auto size-3.5" aria-label="pass" />
  ) : (
    <X className="text-bad mx-auto size-3.5" aria-label="fail" />
  );
}

/* 3 ─ Where each part goes -------------------------------------------------------------------------- */

const ANATOMY: {
  title: string;
  text: string;
  show: ("system" | "user" | "assistant" | "raw")[];
}[] = [
  {
    title: "System message: the standing brief",
    text: "The role, audience and rules that apply to every request go in the system message (OpenAI calls it the developer message). The app sets it; the end user usually never sees it.",
    show: ["system"],
  },
  {
    title: "User message: this request",
    text: "The task and the input to work on. Rules, format and examples can live here or in the system message; what matters is that the model gets them.",
    show: ["system", "user"],
  },
  {
    title: "Fence off the data",
    text: 'The email sits between """ marks, so the model can tell your instructions from the text it\'s working on. XML-style tags like <email>…</email> do the same job and all three major guides recommend them.',
    show: ["system", "user"],
  },
  {
    title: "Assistant message: the reply",
    text: "The model writes the next message. In a chat, earlier replies stay in the conversation, and you can even add example turns (a user message and an ideal reply) as few-shot examples.",
    show: ["system", "user", "assistant"],
  },
  {
    title: "What the model really sees",
    text: "Under the hood, the chat template flattens the messages into one long text with markers, and the model predicts what comes next: the same next-token prediction as always.",
    show: ["raw"],
  },
];

export function Anatomy() {
  const [s, set] = useSceneState<PromptState>();
  const step = Math.min(s.anatomy, ANATOMY.length - 1);
  const f = ANATOMY[step];
  const parts = promptParts(15, 3);
  const user = parts.user.map((p) => p.text).join("\n\n");
  const reply = RUNS[15][3];
  const fenced = step === 2;
  return (
    <StepLayout
      eyebrow="Step through"
      title="Where each part goes"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={f.show.includes("raw") ? "raw" : "chat"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="min-h-64"
            >
              {f.show.includes("raw") ? (
                <Code>
                  {`<|im_start|>system\n${parts.system}<|im_end|>\n<|im_start|>user\n${user}<|im_end|>\n<|im_start|>assistant\n${reply}<|im_end|>`}
                </Code>
              ) : (
                <div className="grid gap-2 text-xs">
                  {(["system", "user", "assistant"] as const).map((role) => (
                    <motion.div
                      key={role}
                      animate={{ opacity: f.show.includes(role) ? 1 : 0.25 }}
                      className={cn(
                        "rounded-xl border p-2.5",
                        role === "assistant"
                          ? "border-accent/40 bg-accent-soft ml-6"
                          : role === "system"
                            ? "border-line bg-surface-2"
                            : "border-line bg-surface mr-6",
                      )}
                    >
                      <p className="text-muted mb-1 text-[10px] font-semibold tracking-wide uppercase">
                        {role}
                      </p>
                      {role === "system" && <p className="font-mono">{parts.system}</p>}
                      {role === "user" && (
                        <p className="font-mono [overflow-wrap:anywhere] whitespace-pre-wrap">
                          {parts.user[0].text}
                          {"\n\n"}
                          <span className="text-muted italic">
                            [rules, output format and examples: 14 lines]
                          </span>
                          {"\n\nEmail:\n"}
                          <span
                            className={cn(fenced && "bg-accent-soft ring-accent rounded ring-1")}
                          >
                            {`"""\n${data.emails[3].text}\n"""`}
                          </span>
                        </p>
                      )}
                      {role === "assistant" && (
                        <p className="font-mono">{f.show.includes("assistant") ? reply : "…"}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <Stepper step={step} count={ANATOMY.length} onChange={(n) => set({ anatomy: n })} />
          <FrameCaption frameKey={step} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Chat models take a list of messages, each with a role. The{" "}
        <Term id="system-prompt">system prompt</Term> is where a standing brief usually lives.
      </p>
      <p>
        This is the full prompt from the last step, with all four ingredients, for the
        &ldquo;charged twice&rdquo; email. Step through it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: which ingredient fixes it? ------------------------------------------------------- */

export function Diagnose() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which ingredient fixes it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="diagnose"
            prompt="Each output below has one main problem. Which ingredient would you add?"
            categories={[
              { id: "role", label: "Role & audience" },
              { id: "rules", label: "Rules" },
              { id: "examples", label: "Examples" },
              { id: "format", label: "Output format" },
            ]}
            items={[
              {
                id: "letter",
                label:
                  "It writes a warm thank-you letter to the customer instead of a note for staff",
                category: "role",
                why: "The model didn't know who the summary was for. Saying who it's working for and who reads the output fixes the direction.",
              },
              {
                id: "question",
                label:
                  "It rates a simple question about Sunday delivery “medium”; your team calls questions low",
                category: "rules",
                why: "“Urgent” is your team's definition, not general knowledge. Spell out the rule.",
              },
              {
                id: "crash",
                label: "The ticket software can't read it: it's a friendly paragraph",
                category: "format",
                why: "A program needs a fixed shape. Name the exact format (for example this JSON), and in production use the API's structured-output feature (next module).",
              },
              {
                id: "style",
                label: "Each summary is fine, but they come out in a different style every time",
                category: "examples",
                why: "Examples show the style, length and wording you want far faster than describing them.",
              },
              {
                id: "invent",
                label: "It invents order number XYZ-23456 for an email that has none",
                category: "rules",
                why: "Say what to do when information is missing (“if there's no order number, say none”). An example with “none” helps too.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Diagnose first, then add the ingredient that addresses the actual failure.</p>
      <p className="text-muted text-sm">
        Most of these really happened in the last step. Look back if you like.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Test, don't guess ------------------------------------------------------------------------------ */

export function TestDontGuess() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Test, don't guess"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <PathChart />
          <Findings />
          <ChoiceCheckpoint
            id="ship-it"
            prompt="You tweak the prompt, and the email you were looking at now comes out perfectly. What next?"
            options={[
              {
                id: "ship",
                label: "Ship it: the problem is fixed",
                feedback:
                  "It's fixed for one email. In the last step, several changes that fixed one email broke another.",
              },
              {
                id: "tests",
                label: "Re-run all the test emails and compare the results with the old prompt",
                correct: true,
                feedback:
                  "Yes. A fixed set of test cases with checks (an eval) turns “it seems better” into a number you can compare.",
              },
              {
                id: "twice",
                label: "Run the same email a few more times to be sure",
                feedback:
                  "Worth doing when sampling is on, but it still tells you nothing about the other kinds of email.",
              },
            ]}
            explanation="OpenAI's guide recommends exactly this: build tests and evaluations that measure prompt behaviour, and pin the model version so results don't drift under you."
          />
        </div>
      }
    >
      <p>
        Prompts are tested, not written once. The six emails and four checks you just used are a
        tiny <Term id="eval">eval</Term>: fixed test cases with automatic checks.
      </p>
      <p>
        The chart shows every prompt from the fix-it step. Adding ingredients mostly helps, but not
        always, and not for every email.
      </p>
    </StepLayout>
  );
}

function PathChart() {
  const masks = Array.from({ length: 16 }, (_, m) => m).sort(
    (a, b) => bits(a) - bits(b) || passCount(a) - passCount(b),
  );
  const W = 600;
  const H = 110;
  return (
    <div className="border-line bg-surface rounded-xl border p-3">
      <p className="text-muted mb-1 text-[11px]">
        Checks passed (of {TOTAL}) for all 16 prompts, grouped by how many ingredients they use
      </p>
      <svg
        viewBox={`0 0 ${W} ${H + 18}`}
        className="w-full"
        role="img"
        aria-label="Checks passed per prompt"
      >
        {[0, 1, 2, 3, 4].map((k) => (
          <text
            key={k}
            x={60 + k * 120}
            y={H + 14}
            textAnchor="middle"
            className="fill-muted text-[9px]"
          >
            {k} on
          </text>
        ))}
        {[0, 12, 24].map((v) => {
          const y = H - (v / TOTAL) * (H - 8);
          return (
            <g key={v}>
              <line
                x1={22}
                x2={W}
                y1={y}
                y2={y}
                stroke="var(--line-strong)"
                strokeOpacity={v ? 0.35 : 1}
              />
              <text x={16} y={y + 3} textAnchor="end" className="fill-muted text-[9px]">
                {v}
              </text>
            </g>
          );
        })}
        {masks.map((m) => {
          const k = bits(m);
          const same = masks.filter((x) => bits(x) === k);
          const j = same.indexOf(m);
          const x = 60 + k * 120 + (j - (same.length - 1) / 2) * 13;
          const y = H - (passCount(m) / TOTAL) * (H - 8);
          return (
            <g key={m}>
              <title>
                {INGREDIENTS.filter((g) => m & g.bit)
                  .map((g) => g.label)
                  .join(" + ") || "Vague prompt"}
                : {passCount(m)} / {TOTAL}
              </title>
              <circle cx={x} cy={y} r={3.5} fill={m === 15 ? "var(--accent)" : "var(--viz-data)"} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Findings() {
  const driverOk = Array.from({ length: 16 }, (_, m) => results(m)[4].urgency).filter(
    Boolean,
  ).length;
  const notes = [
    `All four ingredients: ${passCount(15)} of ${TOTAL}. Rules + format alone: ${passCount(10)}. More isn't automatically better.`,
    `Adding the role to rules + format dropped the score from ${passCount(10)} to ${passCount(11)}: the model began writing “none” for order numbers that were right there in the email.`,
    `Only ${driverOk} of 16 prompts rated the thank-you for the driver “low”. This small model keeps treating praise as urgent: some failures need a bigger model, not more words.`,
  ];
  return (
    <ul className="grid gap-1.5 text-xs">
      {notes.map((n) => (
        <li key={n} className="border-line bg-surface rounded-lg border px-3 py-1.5">
          {n}
        </li>
      ))}
    </ul>
  );
}

function bits(m: number) {
  return INGREDIENTS.filter((g) => m & g.bit).length;
}

/* 6 ─ What the guides agree on --------------------------------------------------------------------- */

const ADVICE: [string, string][] = [
  ["Be clear and specific", "Say what you want, for whom, and what good looks like."],
  ["Give the role and context", "Put the standing brief in the system (developer) message."],
  [
    "Show examples",
    "A few varied examples (Anthropic suggests 3–5), in exactly the output shape you want.",
  ],
  [
    "Separate instructions from data",
    "Fence inputs with tags or quotes so they can't be mistaken for instructions.",
  ],
  ["Name the format", "And use structured outputs when a program reads the answer."],
  [
    "Say what to do, not only what not to do",
    "“Write in plain sentences” beats “don't use markdown”.",
  ],
  [
    "Long documents first, question last",
    "Anthropic reports up to 30% better answers on long, multi-document inputs.",
  ],
  ["Test with an eval", "Fixed test cases, re-run after every change and every model upgrade."],
];

export function Guides() {
  return (
    <StepLayout
      eyebrow="Reference"
      title="What the guides agree on"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {ADVICE.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className="border-line bg-surface rounded-xl border px-3 py-2"
              >
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="border-bad/40 bg-bad/5 rounded-xl border px-3 py-2 text-xs">
            <p className="font-semibold">Less useful than it looks</p>
            <p className="text-muted mt-0.5">
              SHOUTING (&ldquo;CRITICAL: you MUST…&rdquo;). Anthropic&apos;s current guide says
              newer models follow instructions closely and may overreact to aggressive wording:
              write calmly and precisely instead. Magic phrases found for one model often don&apos;t
              carry over to the next.
            </p>
          </div>
        </div>
      }
    >
      <p>
        OpenAI, Anthropic and Google each publish a prompting guide. The details differ by model,
        but the core advice is the same, and it&apos;s the advice you&apos;d give a new colleague.
      </p>
      <p className="text-muted text-sm">
        One more ingredient we didn&apos;t test: letting the model think before answering. See the
        reasoning-models module.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "The prompt is the whole brief",
    "The model knows only what you send. Write for a smart newcomer.",
  ],
  [
    "Four ingredients",
    "Role and audience, rules, examples and output format, each fixing a different failure.",
  ],
  [
    "Structure the messages",
    "Standing brief in the system message; data fenced off from instructions.",
  ],
  [
    "Measure, don't guess",
    "Keep a small set of test cases with checks and re-run them after every change.",
  ],
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
      <p>Even the best prompt asks the model for prose it might format wrongly.</p>
      <p>
        Next: structured output and tool calling, where the model&apos;s answer becomes data your
        code can rely on.
      </p>
    </StepLayout>
  );
}
