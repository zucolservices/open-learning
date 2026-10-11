"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SignState } from "./state";
import { SealedLetter, Investigate, Spoof, Prevent, SignCheck, Wrap } from "./steps";

export default defineModule<SignState>({
  initialState,
  steps: [
    { id: "story", title: "Anyone can sign a name", Component: SealedLetter },
    {
      id: "investigate",
      title: "Spot the impostor, then clean up the leak",
      Component: Investigate,
    },
    { id: "spoof", title: "Anyone can claim to be anyone", Component: Spoof },
    { id: "prevent", title: "Stopping the next leak", Component: Prevent },
    {
      id: "check",
      title: "True or false?",
      checkpoint: "git-signing-secrets",
      Component: SignCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
