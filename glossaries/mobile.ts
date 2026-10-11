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
  "native-app": {
    term: "Native app",
    definition:
      "An app built with each platform's own languages and tools, such as Swift and SwiftUI on iOS or Kotlin and Jetpack Compose on Android.",
    module: "native-vs-cross",
  },
  "cross-platform": {
    term: "Cross-platform framework",
    definition:
      "A toolkit for building iOS and Android apps from one shared codebase, such as Flutter, React Native, Kotlin Multiplatform or .NET MAUI.",
    module: "native-vs-cross",
  },
  pwa: {
    term: "Progressive web app (PWA)",
    definition:
      "A website that can be installed to the Home Screen, work offline and send notifications, without going through an app store.",
    module: "native-vs-cross",
  },
  "app-lifecycle": {
    term: "App lifecycle",
    definition:
      "The states an app moves through as the system starts it, brings it to the front, sends it to the background, suspends it or ends it.",
    module: "app-lifecycle",
  },
  "process-death": {
    term: "Process death",
    definition:
      "The system ending an app's process to reclaim memory, usually while it's in the background and without warning. Apps must save state beforehand to restore it later.",
    module: "app-lifecycle",
  },
} satisfies Record<string, GlossaryEntry>;
