"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SecState } from "./state";
import { Tills, Review, Standards, Genuine, SecCheck, Wrap } from "./steps";

export default defineModule<SecState>({
  initialState,
  steps: [
    { id: "story", title: "The takeaway menu in every pocket", Component: Tills },
    { id: "review", title: "Review the café app", Component: Review },
    { id: "standards", title: "The OWASP mobile standards", Component: Standards },
    { id: "genuine", title: "Is this the real app?", Component: Genuine },
    {
      id: "check",
      title: "In the app or on the server?",
      checkpoint: "mobile-security",
      Component: SecCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
