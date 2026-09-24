"use client";

/**
 * Module SDK: the only API a module uses to report what happens.
 *
 *   start      – the module opened (automatic)
 *   step       – the learner reached a step, with the scene state to restore it
 *   checkpoint – a checkpoint was answered
 *   complete   – the module was finished
 *
 * Everything is forwarded to the progress adapter, so modules stay unaware of
 * where progress is stored.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { useProgress } from "./progress-adapter";

export type SceneState = Record<string, unknown>;

export interface StepDef {
  id: string;
  /** Short label shown in the step rail. */
  title: string;
  /** If set, the learner must answer this checkpoint before moving on. */
  checkpoint?: string;
  Component: ComponentType;
}

export interface ModuleDef<S extends SceneState = SceneState> {
  initialState: S;
  steps: StepDef[];
}

/** Identity helper that keeps a module's state type attached to its definition. */
export function defineModule<S extends SceneState>(def: ModuleDef<S>): ModuleDef<S> {
  return def;
}

interface ModuleContextValue {
  track: string;
  module: string;
  steps: StepDef[];
  step: number;
  state: SceneState;
  checkpoints: Record<string, boolean>;
  completed: boolean;
  setState(patch: Partial<SceneState>): void;
  goTo(step: number): void;
  next(): void;
  prev(): void;
  canAdvance: boolean;
  answer(checkpoint: string, correct: boolean): void;
  complete(): void;
}

const ModuleContext = createContext<ModuleContextValue | null>(null);

function useModuleContext(): ModuleContextValue {
  const ctx = useContext(ModuleContext);
  if (!ctx) throw new Error("Module SDK hooks must be used inside <ModuleProvider>.");
  return ctx;
}

/** The current module's track and slug, or undefined outside a module. */
export function useOptionalModuleIds(): { track: string; module: string } | undefined {
  const ctx = useContext(ModuleContext);
  return ctx ? { track: ctx.track, module: ctx.module } : undefined;
}

/** Full module API: navigation, checkpoints and completion. */
export function useModule() {
  return useModuleContext();
}

/** Scene state for the current module, typed by the caller. */
export function useSceneState<S extends SceneState>(): [S, (patch: Partial<S>) => void] {
  const { state, setState } = useModuleContext();
  return [state as S, setState as (patch: Partial<S>) => void];
}

/** The latest answer for one checkpoint: undefined until answered. */
export function useCheckpoint(id: string) {
  const { checkpoints, answer } = useModuleContext();
  return {
    answered: id in checkpoints,
    correct: checkpoints[id],
    answer: (correct: boolean) => answer(id, correct),
  };
}

interface ProviderProps {
  track: string;
  module: string;
  def: ModuleDef;
  children: ReactNode;
}

/** Waits for saved progress to load, so the module can start from it. */
export function ModuleProvider(props: ProviderProps) {
  const hydrated = useProgress((s) => s.hydrated);
  return hydrated ? <LoadedModuleProvider {...props} /> : null;
}

function LoadedModuleProvider({ track, module, def, children }: ProviderProps) {
  // start: begin from the saved position, if any.
  const [saved] = useState(() => useProgress.getState().tracks[track]?.[module]);
  const [step, setStep] = useState(() => Math.min(saved?.step ?? 0, def.steps.length - 1));
  const [state, setSceneState] = useState<SceneState>(() => ({
    ...def.initialState,
    ...saved?.state,
  }));
  const [checkpoints, setCheckpoints] = useState<Record<string, boolean>>(
    () => saved?.checkpoints ?? {},
  );
  const [completed, setCompleted] = useState(saved?.status === "completed");

  useEffect(() => {
    useProgress.getState().opened(track, module);
  }, [track, module]);

  // step: save position and scene state, debounced so slider drags stay cheap.
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      useProgress.getState().stepReached(track, module, step, state);
    }, 250);
    return () => clearTimeout(saveTimer.current);
  }, [track, module, step, state]);

  const setState = useCallback((patch: Partial<SceneState>) => {
    setSceneState((s) => ({ ...s, ...patch }));
  }, []);

  const answer = useCallback(
    (checkpoint: string, correct: boolean) => {
      setCheckpoints((c) => ({ ...c, [checkpoint]: correct }));
      useProgress.getState().checkpointAnswered(track, module, checkpoint, correct);
    },
    [track, module],
  );

  const complete = useCallback(() => {
    setCompleted(true);
    useProgress.getState().completed(track, module);
  }, [track, module]);

  const gate = def.steps[step]?.checkpoint;
  const canAdvance = !gate || gate in checkpoints;

  const goTo = useCallback(
    (target: number) => {
      setStep(Math.max(0, Math.min(def.steps.length - 1, target)));
    },
    [def.steps.length],
  );

  const value = useMemo<ModuleContextValue>(
    () => ({
      track,
      module,
      steps: def.steps,
      step,
      state,
      checkpoints,
      completed,
      setState,
      goTo,
      next: () => {
        if (!canAdvance) return;
        if (step === def.steps.length - 1) complete();
        else goTo(step + 1);
      },
      prev: () => goTo(step - 1),
      canAdvance,
      answer,
      complete,
    }),
    [
      track,
      module,
      def.steps,
      step,
      state,
      checkpoints,
      completed,
      setState,
      goTo,
      canAdvance,
      answer,
      complete,
    ],
  );

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
}
