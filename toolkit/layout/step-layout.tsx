import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The default step composition: short narration beside a large interactive stage.
 * Modules may ignore it and lay a step out however the topic needs.
 */
export function StepLayout({
  eyebrow,
  title,
  children,
  stage,
  stageClassName,
}: {
  eyebrow?: string;
  title: string;
  /** Narration: keep it short, it sits beside the visual it explains. */
  children?: ReactNode;
  stage: ReactNode;
  stageClassName?: string;
}) {
  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-10 lg:py-10">
      <div className="lg:pt-6">
        {eyebrow && (
          <p className="text-accent text-xs font-medium tracking-wide uppercase">{eyebrow}</p>
        )}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h2>
        <div className="prose-step text-muted [&_strong]:text-fg mt-4 space-y-3 text-[15px] leading-relaxed [&_strong]:font-semibold">
          {children}
        </div>
      </div>
      <Stage className={stageClassName}>{stage}</Stage>
    </div>
  );
}

/** The interactive canvas: a bordered "lab bench" with a faint dot grid. */
export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "dot-grid rounded-card border-line bg-surface/70 shadow-card relative flex min-h-[26rem] flex-col overflow-hidden border p-5 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
