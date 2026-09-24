"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Lock } from "lucide-react";
import { ModuleProvider, useModule, type ModuleDef } from "@/lib/module-sdk";
import { ThemeToggle } from "@/components/theme-toggle";
import { KeyTermsDrawer } from "./key-terms-drawer";
import { cn } from "@/lib/cn";

export interface ModuleShellProps {
  track: string;
  trackTitle: string;
  module: string;
  title: string;
  next?: { slug: string; title: string };
  def: ModuleDef;
}

/**
 * The frame shared by every module: top bar, step rail, the current step, and
 * the navigation dock. What happens inside each step is entirely the module's.
 */
export function ModuleShell({ def, ...props }: ModuleShellProps) {
  return (
    <ModuleProvider track={props.track} module={props.module} def={def}>
      <ShellFrame {...props} />
    </ModuleProvider>
  );
}

function ShellFrame({ track, trackTitle, title, next }: Omit<ModuleShellProps, "def" | "module">) {
  const m = useModule();
  const Step = m.steps[m.step].Component;
  const last = m.step === m.steps.length - 1;
  const trackHref = `/tracks/${track}`;

  // Each step starts at the top of the page (some steps, like scroll stories, are long).
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [m.step]);

  // ←/→ move between steps, unless the learner is typing or using a control.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable], [role=slider]")) return;
      if (e.key === "ArrowRight") m.next();
      if (e.key === "ArrowLeft") m.prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [m]);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-line bg-bg/80 sticky top-0 z-30 border-b backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
          <Link
            href={trackHref}
            aria-label={`Back to ${trackTitle}`}
            className="text-muted hover:bg-surface-2 hover:text-fg grid size-9 place-items-center rounded-full"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm leading-tight font-semibold tracking-tight">{title}</p>
            <p className="text-muted truncate text-xs leading-tight">{trackTitle}</p>
          </div>
          <StepRail />
          <div className="ml-auto flex items-center gap-2">
            <KeyTermsDrawer track={track} module={m.module} />
            <span className="text-muted text-xs tabular-nums">
              {m.step + 1} / {m.steps.length}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={m.steps[m.step].id}
            className="flex flex-1 flex-col"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Step />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-line bg-bg/85 sticky bottom-0 z-30 border-t backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-3 sm:px-5">
          <button
            type="button"
            onClick={m.prev}
            disabled={m.step === 0}
            className="text-muted hover:bg-surface-2 hover:text-fg inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <p className="text-muted hidden flex-1 truncate text-center text-sm sm:block">
            {last && m.completed
              ? "Module complete. Revisit any step whenever you like."
              : m.canAdvance
                ? m.steps[m.step].title
                : "Answer the checkpoint to continue"}
          </p>
          <div className="ml-auto sm:ml-0">
            {last && m.completed ? (
              next ? (
                <Link
                  href={`${trackHref}/${next.slug}`}
                  className="bg-accent text-accent-fg inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium"
                >
                  Next: {next.title} <ArrowRight className="size-4" />
                </Link>
              ) : (
                <Link
                  href={trackHref}
                  className="bg-accent text-accent-fg inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium"
                >
                  Back to track <ArrowRight className="size-4" />
                </Link>
              )
            ) : (
              <button
                type="button"
                onClick={m.next}
                disabled={!m.canAdvance}
                className="bg-accent text-accent-fg disabled:bg-surface-2 disabled:text-subtle inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition hover:brightness-110"
              >
                {!m.canAdvance ? (
                  <>
                    <Lock className="size-3.5" /> Continue
                  </>
                ) : last ? (
                  <>
                    Finish module <Check className="size-4" />
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Segmented progress; learners can jump back freely, or anywhere once complete. */
function StepRail() {
  const m = useModule();
  return (
    <nav aria-label="Steps" className="mx-auto hidden items-center gap-1 md:flex">
      {m.steps.map((s, i) => {
        const reachable = m.completed || i <= m.step;
        return (
          <button
            key={s.id}
            type="button"
            title={s.title}
            aria-label={`Step ${i + 1}: ${s.title}`}
            aria-current={i === m.step ? "step" : undefined}
            disabled={!reachable}
            onClick={() => m.goTo(i)}
            className="group py-3"
          >
            <span
              className={cn(
                "block h-1.5 w-8 rounded-full transition-colors lg:w-12",
                i < m.step || m.completed ? "bg-accent/60" : "bg-surface-2",
                i === m.step && "bg-accent",
                reachable && "group-hover:bg-accent",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
