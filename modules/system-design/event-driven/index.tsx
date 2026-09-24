"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EventState } from "./state";
import {
  CommandOrEvent,
  FourMeanings,
  Landscape,
  Rewire,
  SchemaChange,
  WhenNot,
  Wrap,
} from "./steps";

export default defineModule<EventState>({
  initialState,
  steps: [
    { id: "rewire", title: "Rewire the checkout", Component: Rewire },
    {
      id: "command-event",
      title: "Command or event?",
      checkpoint: "command-or-event",
      Component: CommandOrEvent,
    },
    { id: "four", title: "Four things called “event-driven”", Component: FourMeanings },
    { id: "schema", title: "Change the event, break the consumers", Component: SchemaChange },
    { id: "when-not", title: "Event or call?", checkpoint: "event-or-call", Component: WhenNot },
    { id: "landscape", title: "Event plumbing you'll meet", Component: Landscape },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
