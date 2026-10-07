"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type XssState } from "./state";
import { Noticeboard, CommentLab, ThreeKinds, Defences, SafeRender, Wrap } from "./steps";

export default defineModule<XssState>({
  initialState,
  steps: [
    { id: "story", title: "A note on the noticeboard", Component: Noticeboard },
    { id: "lab", title: "Post a comment", Component: CommentLab },
    { id: "kinds", title: "Three ways in", Component: ThreeKinds },
    { id: "defences", title: "Encode, sanitise, add layers", Component: Defences },
    { id: "check", title: "Safe or not?", checkpoint: "xss-safe", Component: SafeRender },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
