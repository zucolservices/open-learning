/** One order screen through a phone call and a process death, on iOS and Android. */

export const EVENTS: { title: string; ios: string; android: string; note: string }[] = [
  {
    title: "Launch the café app",
    ios: "unattached → foreground active",
    android: "onCreate → onStart → onResume",
    note: "The order screen appears.",
  },
  {
    title: "Type a note: “extra ginger”",
    ios: "foreground active",
    android: "resumed",
    note: "The note exists only in the app's memory.",
  },
  {
    title: "A call comes in",
    ios: "foreground inactive",
    android: "onPause",
    note: "The app is still visible but not in charge.",
  },
  {
    title: "Answer and switch to the call screen",
    ios: "background → suspended",
    android: "onStop",
    note: "The moment to save anything that matters.",
  },
  {
    title: "Phone needs memory for the camera",
    ios: "scene disconnected → unattached",
    android: "process killed (no onDestroy)",
    note: "The app is gone. No warning, no last chance.",
  },
  {
    title: "Reopen the café app",
    ios: "unattached → foreground active",
    android: "onCreate (with saved state) → onResume",
    note: "",
  },
];
