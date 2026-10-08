"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type NoticeState } from "./state";
import { Label, FixNotice, Languages, ExistingUsers, NoticeCheck, Wrap } from "./steps";

export default defineModule<NoticeState>({
  initialState,
  steps: [
    { id: "story", title: "Read the label first", Component: Label },
    { id: "fix", title: "Fix FitPulse's notice", Component: FixNotice },
    { id: "languages", title: "English, or any of 22 more", Component: Languages },
    { id: "existing", title: "The users you already have", Component: ExistingUsers },
    {
      id: "check",
      title: "Good notice or not?",
      checkpoint: "dpdp-notice",
      Component: NoticeCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
