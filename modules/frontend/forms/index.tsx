"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FormState } from "./state";
import { Counter, FixForm, When, Controlled, FormCheck, Wrap } from "./steps";

export default defineModule<FormState>({
  initialState,
  steps: [
    { id: "story", title: "The helpful clerk", Component: Counter },
    { id: "fix", title: "Rescue a sign-up form", Component: FixForm },
    { id: "when", title: "When and how to show errors", Component: When },
    { id: "controlled", title: "Who holds the value: you or the browser?", Component: Controlled },
    { id: "check", title: "Helpful or not?", checkpoint: "frontend-forms", Component: FormCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
