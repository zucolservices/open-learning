/** Five made-up app projects and the approaches that suit them. */

export type Approach = "native" | "flutter" | "rn" | "kmp" | "pwa";

export const APPROACHES: { id: Approach; label: string }[] = [
  { id: "native", label: "Native (Swift + Kotlin)" },
  { id: "flutter", label: "Flutter" },
  { id: "rn", label: "React Native" },
  { id: "kmp", label: "Kotlin Multiplatform" },
  { id: "pwa", label: "Progressive web app" },
];

export const PROJECTS: {
  id: string;
  text: string;
  good: Approach[];
  notes: Partial<Record<Approach, string>>;
  fallback: string;
}[] = [
  {
    id: "bank",
    text: "A bank's app: biometrics, widgets, wallet passes, the latest OS features on day one, and large teams for each platform.",
    good: ["native", "kmp"],
    notes: {
      native: "Full access to every platform feature as soon as it ships.",
      kmp: "Native UI on each platform with shared, well-tested business logic: a popular choice for large teams.",
    },
    fallback: "Possible, but deep platform features and day-one OS support mean more workarounds.",
  },
  {
    id: "startup",
    text: "A small startup's café-ordering app, needed on iPhone and Android in three months by two developers.",
    good: ["flutter", "rn"],
    notes: {
      flutter: "One Dart codebase and a consistent look on both platforms.",
      rn: "One JavaScript/TypeScript codebase rendering real platform views; Expo speeds things up.",
    },
    fallback:
      "Two developers would struggle to build and maintain two separate apps in time, or the result would lack app-store presence.",
  },
  {
    id: "menu",
    text: "A café chain's menu and opening hours that people mostly find through search and rarely open twice.",
    good: ["pwa"],
    notes: {
      pwa: "No install needed, found by search, works on every device, and can still be added to the Home Screen.",
    },
    fallback: "An app store download is a big ask for something people check once.",
  },
  {
    id: "web",
    text: "A company with a strong React web team wants a companion app sharing their knowledge and some code.",
    good: ["rn"],
    notes: { rn: "Same language and component model as their web app." },
    fallback: "Workable, but the team would be learning a whole new stack.",
  },
  {
    id: "sdk",
    text: "An Android team wants to share networking and data code with a new iOS team, while each keeps its own native UI.",
    good: ["kmp"],
    notes: {
      kmp: "Exactly what Kotlin Multiplatform was designed for: share the logic, choose your UI.",
    },
    fallback: "Either more duplicated code or a bigger rewrite than they need.",
  },
];
