"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PwState } from "./state";
import { Grinder, CrackRace, ModernRules, BreachCheck, PasswordPractice, Wrap } from "./steps";

export default defineModule<PwState>({
  initialState,
  steps: [
    { id: "story", title: "A one-way grinder", Component: Grinder },
    { id: "race", title: "Crack a leaked table", Component: CrackRace },
    { id: "rules", title: "Long, not complicated", Component: ModernRules },
    { id: "breach", title: "Has this password leaked?", Component: BreachCheck },
    {
      id: "check",
      title: "Good practice or not?",
      checkpoint: "password-practice",
      Component: PasswordPractice,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
