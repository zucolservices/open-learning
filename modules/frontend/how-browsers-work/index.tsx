"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PipeState } from "./state";
import { UrlToPixels } from "./steps-story";
import { Stages, Scripts, Engines, PipeCheck, Wrap } from "./steps";

export default defineModule<PipeState>({
  initialState,
  steps: [
    { id: "story", title: "From a URL to pixels", Component: UrlToPixels },
    { id: "stages", title: "Change one property: which steps rerun?", Component: Stages },
    { id: "scripts", title: "Where you put a script matters", Component: Scripts },
    { id: "engines", title: "Three engines, one web", Component: Engines },
    {
      id: "check",
      title: "Put the pipeline in order",
      checkpoint: "frontend-pipeline",
      Component: PipeCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
