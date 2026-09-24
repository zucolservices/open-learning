"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Stage } from "./step-layout";

export interface StorySection {
  id: string;
  /** Short marker shown in the rail, e.g. a year. */
  kicker: string;
  title: string;
  body: ReactNode;
}

/**
 * Scroll-driven story: narrative sections scroll past a pinned stage whose
 * scene follows the section in the middle of the viewport.
 */
export function ScrollStory({
  sections,
  renderScene,
  intro,
  persistent,
}: {
  sections: StorySection[];
  renderScene: (index: number) => ReactNode;
  intro?: ReactNode;
  /** Keep one scene mounted and pass it the active index (e.g. a 3D scene that animates between sections). */
  persistent?: boolean;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections.length]);

  const jump = (i: number) =>
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-10">
      {/* Pinned stage (first on mobile so it sits above the text) */}
      <div className="bg-bg/90 sticky top-14 z-10 -mx-4 px-4 pt-3 pb-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-20 lg:order-2 lg:mx-0 lg:h-[calc(100dvh-10rem)] lg:bg-transparent lg:px-0 lg:py-6 lg:backdrop-blur-none">
        <Stage className="h-[40vh] min-h-0 p-3 sm:p-5 lg:h-full">
          <nav aria-label="Eras" className="flex flex-wrap gap-1">
            {sections.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => jump(i)}
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[10px] transition-colors sm:text-[11px]",
                  i === active
                    ? "bg-accent text-accent-fg"
                    : i < active
                      ? "text-fg"
                      : "text-subtle",
                )}
              >
                {s.kicker}
              </button>
            ))}
          </nav>
          <div className="relative mt-2 flex-1">
            {persistent ? (
              <div className="absolute inset-0">{renderScene(active)}</div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  {renderScene(active)}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </Stage>
      </div>

      <div className="lg:order-1">
        {intro && <div className="pt-6 lg:pt-10">{intro}</div>}
        {sections.map((s, i) => (
          <section
            key={s.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            className={cn(
              "flex min-h-[55vh] flex-col justify-center py-10 transition-opacity duration-500 lg:min-h-[70vh]",
              i === active ? "opacity-100" : "opacity-35",
            )}
          >
            <p className="text-accent font-mono text-xs">{s.kicker}</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-balance">{s.title}</h3>
            <div className="text-muted [&_strong]:text-fg mt-3 space-y-3 text-[15px] leading-relaxed [&_strong]:font-semibold">
              {s.body}
            </div>
          </section>
        ))}
        <div className="h-[30vh]" />
      </div>
    </div>
  );
}
