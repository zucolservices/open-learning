"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Check, X } from "lucide-react";
import { getModule, levelLabels } from "@/catalogue";
import { resolveTerm } from "@/glossaries";
import { useProgress } from "@/lib/progress-adapter";

/**
 * The "Key terms" panel every module gets for free: the idea in plain words,
 * what to take first, and every glossary term the module uses.
 */
export function KeyTermsDrawer({ track, module }: { track: string; module: string }) {
  const [open, setOpen] = useState(false);
  const found = getModule(track, module);
  const saved = useProgress((s) => s.tracks[track]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!found) return null;
  const m = found.module;
  const prereqs = (m.prerequisites ?? [])
    .map((p) => getModule(track, p))
    .filter((x) => x !== undefined);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-line-strong hover:bg-surface-2 text-muted hover:text-fg inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition"
      >
        <BookOpen className="size-3.5" />
        <span className="hidden sm:inline">Key terms</span>
      </button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="bg-bg/60 fixed inset-0 z-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.aside
                role="dialog"
                aria-label="Key terms"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="border-line bg-surface fixed top-0 right-0 bottom-0 z-50 flex w-[min(28rem,100vw)] flex-col border-l"
              >
                <div className="border-line flex items-center justify-between border-b px-5 py-4">
                  <div>
                    <p className="text-accent text-xs font-medium">{levelLabels[m.level]}</p>
                    <p className="font-semibold tracking-tight">{m.title}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="text-muted hover:bg-surface-2 grid size-9 place-items-center rounded-full"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
                  <section>
                    <h3 className="text-subtle text-xs font-medium tracking-wide uppercase">
                      In plain words
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed">{m.plain}</p>
                  </section>

                  {prereqs.length > 0 && (
                    <section>
                      <h3 className="text-subtle text-xs font-medium tracking-wide uppercase">
                        Helps to take first
                      </h3>
                      <ul className="mt-2 grid gap-1.5">
                        {prereqs.map((p) => {
                          const done = saved?.[p.module.slug]?.status === "completed";
                          return (
                            <li key={p.module.slug}>
                              <Link
                                href={`/tracks/${track}/${p.module.slug}`}
                                className="border-line hover:border-accent flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition"
                              >
                                {done ? (
                                  <Check className="text-good size-4" />
                                ) : (
                                  <span className="border-line-strong size-4 rounded-full border" />
                                )}
                                <span className="flex-1">{p.module.title}</span>
                                <span className="text-subtle text-xs">
                                  {p.module.status === "live" ? "Live" : "Soon"}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  )}

                  {m.terms && m.terms.length > 0 && (
                    <section>
                      <h3 className="text-subtle text-xs font-medium tracking-wide uppercase">
                        Words you&apos;ll meet
                      </h3>
                      <dl className="mt-2 grid gap-3">
                        {m.terms.map((id) => {
                          const t = resolveTerm(id, track).entry;
                          return (
                            <div key={id} className="bg-surface-2/50 rounded-xl p-3">
                              <dt className="text-sm font-semibold">{t.term}</dt>
                              <dd className="text-muted mt-1 text-sm leading-relaxed">
                                {t.definition}
                              </dd>
                              {t.analogy && (
                                <dd className="text-muted mt-1.5 text-xs">
                                  <span className="text-fg font-medium">Think of it as: </span>
                                  {t.analogy}
                                </dd>
                              )}
                            </div>
                          );
                        })}
                      </dl>
                    </section>
                  )}
                  <p className="text-subtle text-xs">
                    Tip: words with a dotted underline explain themselves. Hover or tap them. The
                    full{" "}
                    <Link
                      href={`/tracks/${track}/glossary`}
                      className="text-accent hover:underline"
                    >
                      track glossary
                    </Link>{" "}
                    has every term.
                  </p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
