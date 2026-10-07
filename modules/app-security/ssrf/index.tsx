"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SsrfState } from "./state";
import { Errand, PreviewLab, WhyMetadata, Defences, SsrfCheck, Wrap } from "./steps";

export default defineModule<SsrfState>({
  initialState,
  steps: [
    { id: "story", title: "An errand boy who trusts anyone", Component: Errand },
    { id: "lab", title: "A helpful image preview", Component: PreviewLab },
    { id: "metadata", title: "Why the server is a juicy target", Component: WhyMetadata },
    { id: "defences", title: "Locking it down", Component: Defences },
    { id: "check", title: "Help or not?", checkpoint: "ssrf-defence", Component: SsrfCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
