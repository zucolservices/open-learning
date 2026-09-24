"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { getModule } from "@/catalogue";
import { resolveTerm, type TermId } from "@/glossaries";
import { useOptionalModuleIds } from "@/lib/module-sdk";

/**
 * A word from the glossary. Dotted underline; hover (desktop) or tap
 * (touch) shows a plain-English definition right where the word is.
 *
 *   <Term id="acid">ACID</Term>   or   <Term id="acid" />
 */
export function Term({
  id,
  track,
  children,
}: {
  id: TermId;
  /** Defaults to the track of the module this term appears in. */
  track?: string;
  children?: ReactNode;
}) {
  const ids = useOptionalModuleIds();
  const resolved = resolveTerm(id, track ?? ids?.track);
  const entry = resolved.entry;
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number; above: boolean }>();
  const ref = useRef<HTMLButtonElement>(null);
  const tip = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const openedAt = useRef(0);

  function show() {
    clearTimeout(closeTimer.current);
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const above = r.top > 220;
    setPos({
      x: Math.min(Math.max(r.left + r.width / 2, 170), window.innerWidth - 170),
      y: above ? r.top - 8 : r.bottom + 8,
      above,
    });
    if (!open) openedAt.current = Date.now();
    setOpen(true);
  }
  function hideSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const taught =
    entry.module && resolved.track ? getModule(resolved.track, entry.module) : undefined;

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-describedby={open ? tip : undefined}
        onMouseEnter={show}
        onMouseLeave={hideSoon}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && show()}
        onBlur={hideSoon}
        onClick={(e) => {
          e.stopPropagation();
          // A tap fires hover/focus first; don't let the click immediately close it again.
          if (open && Date.now() - openedAt.current > 400) setOpen(false);
          else show();
        }}
        className="decoration-accent/60 hover:decoration-accent cursor-help font-[inherit] text-inherit underline decoration-dotted decoration-[1.5px] underline-offset-[3px]"
      >
        {children ?? entry.term}
      </button>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <div
                className="fixed z-[100]"
                style={{
                  left: pos.x,
                  top: pos.y,
                  transform: `translate(-50%, ${pos.above ? "-100%" : "0"})`,
                }}
              >
                <motion.div
                  id={tip}
                  role="tooltip"
                  initial={{ opacity: 0, y: pos.above ? 4 : -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={() => clearTimeout(closeTimer.current)}
                  onMouseLeave={hideSoon}
                  className="border-line bg-surface shadow-card w-[min(20rem,calc(100vw-2rem))] rounded-2xl border p-4 text-left"
                >
                  <p className="text-accent text-xs font-semibold tracking-wide uppercase">
                    {entry.term}
                  </p>
                  <p className="text-fg mt-1.5 text-sm leading-relaxed">{entry.definition}</p>
                  {entry.analogy && (
                    <p className="text-muted mt-2 text-xs leading-relaxed">
                      <span className="text-fg font-medium">Think of it as: </span>
                      {entry.analogy}
                    </p>
                  )}
                  {taught && (
                    <Link
                      href={`/tracks/${taught.track.slug}/${taught.module.slug}`}
                      className="text-accent mt-2 inline-block text-xs hover:underline"
                    >
                      Learn it in “{taught.module.title}” →
                    </Link>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
