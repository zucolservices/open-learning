import type { GlossaryEntry } from "./types";

/** Mobile track glossary. `module` slugs refer to this track. */
export const mobileTrack = {
  "offline-first": {
    term: "Offline first",
    definition:
      "Designing an app to work from data stored on the device, saving changes locally and syncing them when a connection is available.",
    module: "offline-first",
  },
  "mobile-os": {
    term: "Mobile operating system",
    definition:
      "The system software on a phone, such as iOS or Android, which decides which apps run, when they're paused, and when they're closed to save memory or battery.",
    module: "how-mobile-differs",
  },
} satisfies Record<string, GlossaryEntry>;
