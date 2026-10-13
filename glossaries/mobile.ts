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
  "declarative-ui": {
    term: "Declarative UI",
    definition:
      "Writing screens as a description of what they should look like for the current data. When the data changes, the framework updates the screen; you don't change widgets by hand.",
    module: "declarative-ui",
  },
  recomposition: {
    term: "Recomposition",
    definition:
      "Re-running the parts of a declarative UI that read some state after that state changes, while skipping parts whose inputs didn't change. The word comes from Jetpack Compose.",
    module: "declarative-ui",
  },
  "navigation-stack": {
    term: "Navigation stack",
    definition:
      "The pile of screens you've opened inside an app or tab. Opening a screen puts it on top; Back takes the top one off.",
    module: "navigation-mobile",
  },
  "deep-link": {
    term: "Deep link",
    definition:
      "A link that opens a specific screen inside an app, such as one order, rather than just launching the app. Verified versions are Universal Links on iOS and App Links on Android.",
    module: "navigation-mobile",
  },
  "predictive-back": {
    term: "Predictive back",
    definition:
      "Android's back gesture that previews where Back will go as you swipe, so you can cancel. On by default for apps targeting Android 16.",
    module: "navigation-mobile",
  },
  "touch-target": {
    term: "Touch target",
    definition:
      "The area of the screen that responds when you tap a control. It can be bigger than the visible icon; guidelines ask for about 44 points on iOS and 48 dp on Android.",
    module: "touch-gestures",
  },
  haptics: {
    term: "Haptics",
    definition:
      "Small vibrations a phone plays to confirm an action, such as a tick when an order succeeds.",
    module: "touch-gestures",
  },
  "adaptive-layout": {
    term: "Adaptive layout",
    definition:
      "A layout that rearranges itself for the space available, for example one pane on a phone and two side by side on a tablet.",
    module: "adaptive-layouts",
  },
  "window-size-class": {
    term: "Window size class",
    definition:
      "A coarse label for how much space an app's window has, such as compact, medium or expanded on Android, or compact and regular on iOS. Layouts switch by class rather than by device.",
    module: "adaptive-layouts",
  },
  "safe-area": {
    term: "Safe area",
    definition:
      "The part of the screen where content won't be covered by notches, camera cutouts, rounded corners, system bars or the home indicator. Android calls these boundaries window insets.",
    module: "adaptive-layouts",
  },
  sync: {
    term: "Sync",
    definition:
      "Bringing copies of the same data on different devices and a server back into agreement, by sending queued changes and fetching others' changes.",
    module: "offline-first",
  },
  "secure-storage": {
    term: "Secure storage",
    definition:
      "A place on the phone for small secrets such as sign-in tokens, encrypted with keys the app can't export: the Keychain on iOS and Keystore-protected keys on Android.",
    module: "device-storage",
  },
} satisfies Record<string, GlossaryEntry>;
