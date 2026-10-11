"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type NullState } from "./state";
import { EmptyBox, Hunt, Mistake, Languages, NullCheck, Wrap } from "./steps";

export default defineModule<NullState>({
  initialState,
  steps: [
    { id: "story", title: "The box that might be empty", Component: EmptyBox },
    { id: "hunt", title: "Hunt a crash, then let the compiler catch it", Component: Hunt },
    { id: "mistake", title: "The billion-dollar mistake", Component: Mistake },
    { id: "languages", title: "Labelling the box, language by language", Component: Languages },
    { id: "check", title: "The best fix", checkpoint: "clean-null", Component: NullCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
