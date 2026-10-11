"use client";

import { motion } from "motion/react";
import { BookOpenText } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BLAME, BROKE_AT, N, START, done, isBad, mark, mid, runAll } from "./model";
import type { BisectState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Dictionary() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Finding a word in a dictionary"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface flex w-72 flex-col items-center rounded-xl border p-4 text-center text-xs"
          >
            <BookOpenText className="text-accent size-8" />
            <p className="mt-2">
              1,000 pages · open the middle · too far? open the middle of the first half · about 10
              opens and you&apos;re there.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Nobody finds a word by reading a dictionary from page one. You open the middle, see whether
        your word is before or after, and halve again. A thousand pages take about ten tries.
      </p>
      <p>
        <Term id="bisect">Bisect</Term> finds the commit that broke something the same way: you name
        one good commit and one bad one, and Git checks out the middle for you to test, halving the
        range each time.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Bisect ⭐ ------------------------------------------------------------------------------------- */

export function Bisect() {
  const [s, set] = useSceneState<BisectState>();
  const r = s.range;
  const m = mid(r);
  const pct = (i: number) => `${(i / (N - 1)) * 100}%`;
  const finished = done(r);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Find the bad commit in 1,000"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="relative h-10">
            <div className="bg-surface-2 absolute inset-x-0 top-4 h-2 rounded-full" />
            <div
              className="bg-accent/40 absolute top-4 h-2 rounded-full transition-all"
              style={{ left: pct(r.good), width: `calc(${pct(r.bad)} - ${pct(r.good)})` }}
            />
            {r.tested.map((t) => (
              <div
                key={t.at}
                className={cn("absolute top-2 h-6 w-0.5", t.bad ? "bg-bad" : "bg-good")}
                style={{ left: pct(t.at) }}
              />
            ))}
            {!finished && (
              <div className="bg-fg absolute top-0 h-10 w-0.5" style={{ left: pct(m) }} />
            )}
          </div>
          <div className="text-subtle flex justify-between font-mono text-[10px]">
            <span>#0 good</span>
            <span>{r.bad - r.good - 1} suspects left</span>
            <span>#{N - 1} bad</span>
          </div>
          {!finished ? (
            <div className="border-line bg-surface rounded-xl border p-3 text-sm">
              <p>
                Git checked out <strong className="font-mono">#{m}</strong>. You build it and run
                the tests:{" "}
                <span className={cn("font-semibold", isBad(m) ? "text-bad" : "text-good")}>
                  {isBad(m) ? "the bug is there" : "it works"}
                </span>
                .
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => set({ range: mark(r, false) })}
                  className="border-good text-good rounded-full border px-3 py-1 text-xs"
                >
                  git bisect good
                </button>
                <button
                  type="button"
                  onClick={() => set({ range: mark(r, true) })}
                  className="border-bad text-bad rounded-full border px-3 py-1 text-xs"
                >
                  git bisect bad
                </button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "rounded-xl border p-3 text-sm",
                r.bad === BROKE_AT ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              {r.bad === BROKE_AT
                ? `#${r.bad} is the first bad commit, found in ${r.steps} steps.`
                : `Bisect says #${r.bad}, but a wrong answer along the way sent it astray. Start over and mark each test truthfully.`}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => set({ range: runAll() })}
              className="bg-accent text-accent-fg rounded-full px-3 py-1 text-xs font-medium"
            >
              git bisect run ./test.sh
            </button>
            <button
              type="button"
              onClick={() => set({ range: START })}
              className="text-muted text-xs underline"
            >
              start over
            </button>
          </div>
        </div>
      }
    >
      <p>
        The build broke somewhere in the last 1,000 commits. Bisect: test the commit Git picks, tell
        it good or bad, and watch the range of suspects halve each time.
      </p>
      <p>
        With a script that exits 0 for good and 1 for bad, <code>git bisect run</code> does all the
        steps itself. Exit code 125 means &ldquo;can&apos;t test this one, skip it&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Blame ---------------------------------------------------------------------------------------- */

export function Blame() {
  const [s, set] = useSceneState<BisectState>();
  const l = BLAME[s.line];
  const who = s.ignore ? l.real : l.plain;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who last changed this line?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.ignore}
              onChange={(e) => set({ ignore: e.target.checked })}
              className="accent-accent"
            />
            Ignore the &ldquo;Reformat whole codebase&rdquo; commit (.git-blame-ignore-revs)
          </label>
          <div className="border-line bg-surface rounded-xl border font-mono text-[11px]">
            {BLAME.map((b, i) => {
              const w = s.ignore ? b.real : b.plain;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => set({ line: i })}
                  className={cn(
                    "grid w-full grid-cols-[5rem_6rem_1fr] gap-2 px-3 py-1 text-left",
                    i === s.line && "bg-accent-soft",
                  )}
                >
                  <span className="text-accent">{w.id.slice(0, 7)}</span>
                  <span className="text-muted truncate">{w.who}</span>
                  <span className="whitespace-pre">{b.text}</span>
                </button>
              );
            })}
          </div>
          <p className="text-sm">
            Line {s.line + 1} was last changed by <strong>{who.who}</strong> in &ldquo;{who.msg}
            &rdquo;.
            {!s.ignore &&
              who.id === "f00dcafe" &&
              " That's just a formatting commit; it hides who really wrote the logic."}
          </p>
        </div>
      }
    >
      <p>
        <Term id="blame">git blame</Term> shows, for each line, the commit that last changed it.
        It&apos;s for understanding, not accusing: from the commit you get the message, the pull
        request and the reason.
      </p>
      <p>
        Bulk formatting commits get in the way. List them in <code>.git-blame-ignore-revs</code>:
        GitHub uses it automatically, GitLab after you enable it in blame preferences, and locally
        after you set <code>blame.ignoreRevsFile</code>.
      </p>
    </StepLayout>
  );
}

/* 4 ─ More detective tools ------------------------------------------------------------------------- */

export function Detective() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="More history detective tools"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              'git log -S "round("',
              "Commits that added or removed that exact text (the 'pickaxe').",
            ],
            ["git log -p -- path/file", "Every change to one file, with its diff."],
            [
              "git log --grep=GST",
              "Commits whose messages mention GST: good messages pay off here.",
            ],
            [
              "git blame -w -C",
              "Ignore whitespace changes and follow lines moved or copied from other files.",
            ],
            [
              "git bisect skip",
              "Skip a commit you can't test (say it doesn't build for an unrelated reason).",
            ],
          ].map(([c, b], i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface grid grid-cols-[10rem_1fr] gap-2 rounded-lg border px-3 py-1.5 text-xs"
            >
              <code className="text-accent font-mono text-[11px]">{c}</code>
              <span>{b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        These tools turn &ldquo;when did this break, and why?&rdquo; from guesswork into a few
        minutes of searching. They work best on a history of small commits with clear messages.
      </p>
      <p>
        Bisect especially rewards small commits: the culprit it finds is a small change, easy to
        understand.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function BisectCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Bisect, blame or log?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-bisect-blame"
            prompt="Which tool answers each question fastest?"
            categories={[
              { id: "bisect", label: "bisect" },
              { id: "blame", label: "blame" },
              { id: "log", label: "log -S / --grep" },
            ]}
            items={[
              {
                id: "when",
                label: "Which of the last 500 commits made the tests fail?",
                category: "bisect",
                why: "Binary search through history.",
              },
              {
                id: "line",
                label: "Why does this one line multiply by 1.05?",
                category: "blame",
                why: "Find the commit that last changed it.",
              },
              {
                id: "text",
                label: "When was the function applyDiscount removed?",
                category: "log",
                why: "log -S finds commits adding or removing text.",
              },
              {
                id: "perf",
                label: "The page got slow sometime this quarter",
                category: "bisect",
                why: "Bisect works for any good/bad test, including speed.",
              },
              {
                id: "msg",
                label: "Which commits mention the GST change?",
                category: "log",
                why: "log --grep searches messages.",
              },
            ]}
            explanation="Bisect finds when something changed between good and bad; blame finds who last touched a line; log searches text and messages."
          />
        </div>
      }
    >
      <p>Sort each question.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Bisect halves the suspects", "1,000 commits in about 10 tests."],
        ["Automate it", "bisect run: exit 0 good, 1 bad, 125 skip."],
        ["Blame explains lines", "Then read the commit and its pull request."],
        ["Ignore formatting commits", ".git-blame-ignore-revs."],
        ["Small commits help", "The culprit is easy to understand."],
      ]}
    >
      <p>
        That completes undo and recovery. Next chapter: scale and security, starting with very large
        repositories.
      </p>
    </WrapStep>
  );
}
