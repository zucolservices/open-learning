"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TtsState } from "./state";
import { Ransom, Approaches, Stream, Mos, OldOrNew, Wrap } from "./steps";

export default defineModule<TtsState>({
  initialState,
  steps: [
    { id: "story", title: "Ransom-note speech", Component: Ransom },
    { id: "approaches", title: "Three ways to make a voice", Component: Approaches },
    { id: "stream", title: "Speak before you've finished", Component: Stream },
    { id: "mos", title: "How good does it sound?", Component: Mos },
    { id: "check", title: "Old way or neural?", checkpoint: "old-or-neural", Component: OldOrNew },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
