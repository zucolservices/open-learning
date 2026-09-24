"use client";

/**
 * The single place where learner progress is saved.
 *
 * Phase 1: browser local storage under "zucol-learn:v1".
 * Phase 2: swap the storage below for API calls; modules never change,
 * because they only talk to the Module SDK (lib/module-sdk.tsx).
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const STORAGE_KEY = "zucol-learn:v1";

/** Set NEXT_PUBLIC_PROGRESS=off to disable saving entirely. */
const trackingEnabled = process.env.NEXT_PUBLIC_PROGRESS !== "off";

export type ModuleStatus = "in-progress" | "completed";

export interface ModuleProgress {
  status: ModuleStatus;
  /** Index of the step the learner was last on. */
  step: number;
  /** Module-defined scene state needed to restore the current view. */
  state?: Record<string, unknown>;
  /** Checkpoint id → answered correctly on the latest attempt. */
  checkpoints?: Record<string, boolean>;
  completedAt?: string;
}

export interface ProgressData {
  lastVisited?: { track: string; module: string };
  tracks: Record<string, Record<string, ModuleProgress>>;
}

interface ProgressStore extends ProgressData {
  hydrated: boolean;
  opened(track: string, module: string): void;
  stepReached(track: string, module: string, step: number, state?: Record<string, unknown>): void;
  checkpointAnswered(track: string, module: string, checkpoint: string, correct: boolean): void;
  completed(track: string, module: string): void;
  reset(): void;
}

const empty: ProgressData = { tracks: {} };

function patchModule(
  data: ProgressData,
  track: string,
  module: string,
  patch: (current: ModuleProgress | undefined) => ModuleProgress,
): Pick<ProgressData, "tracks"> {
  const trackData = data.tracks[track] ?? {};
  return {
    tracks: {
      ...data.tracks,
      [track]: { ...trackData, [module]: patch(trackData[module]) },
    },
  };
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useProgress = create<ProgressStore>()(
  persist(
    (set) => ({
      ...empty,
      hydrated: false,

      opened(track, module) {
        if (!trackingEnabled) return;
        set((s) => ({
          lastVisited: { track, module },
          ...patchModule(s, track, module, (m) => m ?? { status: "in-progress", step: 0 }),
        }));
      },

      stepReached(track, module, step, state) {
        if (!trackingEnabled) return;
        set((s) =>
          patchModule(s, track, module, (m) => ({
            ...(m ?? { status: "in-progress" }),
            step,
            state,
          })),
        );
      },

      checkpointAnswered(track, module, checkpoint, correct) {
        if (!trackingEnabled) return;
        set((s) =>
          patchModule(s, track, module, (m) => {
            const current = m ?? { status: "in-progress" as const, step: 0 };
            return {
              ...current,
              checkpoints: { ...current.checkpoints, [checkpoint]: correct },
            };
          }),
        );
      },

      completed(track, module) {
        if (!trackingEnabled) return;
        set((s) =>
          patchModule(s, track, module, (m) => ({
            ...(m ?? { step: 0 }),
            status: "completed",
            completedAt: m?.completedAt ?? today(),
          })),
        );
      },

      reset() {
        set({ ...empty, lastVisited: undefined });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ lastVisited, tracks }) => ({ lastVisited, tracks }),
      // Pages are prerendered, so rehydrate after mount (see ProgressProvider)
      // to keep the first client render identical to the static HTML.
      skipHydration: true,
      onRehydrateStorage: () => () => useProgress.setState({ hydrated: true }),
    },
  ),
);

export function moduleProgress(
  data: ProgressData,
  track: string,
  module: string,
): ModuleProgress | undefined {
  return data.tracks[track]?.[module];
}
