"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MsgState } from "./state";
import { PostRoom, Channels, MessageKinds, Today, WhichMessage, Wrap } from "./steps";

export default defineModule<MsgState>({
  initialState,
  steps: [
    { id: "story", title: "The post room", Component: PostRoom },
    { id: "channels", title: "Channels in action", Component: Channels },
    { id: "kinds", title: "Commands, documents, events", Component: MessageKinds },
    { id: "today", title: "In today's tools", Component: Today },
    {
      id: "check",
      title: "Which kind of message?",
      checkpoint: "which-message",
      Component: WhichMessage,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
