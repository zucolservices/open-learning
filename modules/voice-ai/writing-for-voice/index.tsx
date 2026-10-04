"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WriteState } from "./state";
import { Radio, FixReply, Ssml, Normalise, EarOrEye, Wrap } from "./steps";

export default defineModule<WriteState>({
  initialState,
  steps: [
    { id: "story", title: "Writing for radio", Component: Radio },
    { id: "fix", title: "Fix a reply for the ear", Component: FixReply },
    { id: "ssml", title: "Telling the voice how to speak", Component: Ssml },
    { id: "normalise", title: "Before a word is spoken", Component: Normalise },
    { id: "check", title: "Good for the ear?", checkpoint: "ear-or-eye", Component: EarOrEye },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
