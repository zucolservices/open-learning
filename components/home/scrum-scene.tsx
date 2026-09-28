"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrumMap } from "@/modules/agile-scrum/scrum-on-one-page/scrum-map";
import { TOUR, byId } from "@/modules/agile-scrum/scrum-on-one-page/parts";

/** Agile & Scrum showcase: the whole Scrum framework, touring one Sprint on its own; click to explore. */
export function ScrumScene() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setI((n) => (n + 1) % TOUR.length), 2400);
    return () => clearInterval(id);
  }, [auto]);
  const part = byId[TOUR[i]];
  return (
    <div className="flex flex-col gap-3">
      <ScrumMap
        active={part.id}
        onSelect={(id) => {
          setAuto(false);
          setI(TOUR.indexOf(id));
        }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={part.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-muted min-h-10 text-sm"
        >
          <span className="text-fg font-semibold">{part.name}.</span> {part.when}
        </motion.p>
      </AnimatePresence>
      <p className="text-subtle text-[10px]">
        Adapted from The Scrum Guide (2020) © Ken Schwaber and Jeff Sutherland, CC BY-SA 4.0.
      </p>
    </div>
  );
}
