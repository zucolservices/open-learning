/** Three features that touch private things, and the moments the app could ask. */

export type Tone = "good" | "ok" | "bad";

export interface Option {
  id: string;
  label: string;
  /** What the system shows, or null when no prompt appears. */
  dialog: string | null;
  outcome: string;
  tone: Tone;
}

export interface Feature {
  id: string;
  title: string;
  need: string;
  options: Option[];
}

export const FEATURES: Feature[] = [
  {
    id: "photo",
    title: "Add a photo to a review",
    need: "The customer wants to attach one picture of their dosa.",
    options: [
      {
        id: "launch",
        label: "Ask for the whole photo library at first launch",
        dialog: "“Café” would like full access to your photo library.",
        outcome:
          "They've only just installed the app and see no reason. Many refuse, and photos stay blocked until they dig into Settings.",
        tone: "bad",
      },
      {
        id: "tap",
        label: "Ask for the whole library when they tap Add photo",
        dialog: "“Café” would like full access to your photo library.",
        outcome:
          "Better timing, but it asks for far more than one photo. Many choose “Selected photos” or refuse.",
        tone: "ok",
      },
      {
        id: "picker",
        label: "Open the system photo picker",
        dialog: null,
        outcome:
          "No prompt at all. The picker runs outside the app and hands over only the chosen photo.",
        tone: "good",
      },
    ],
  },
  {
    id: "location",
    title: "Find the nearest café",
    need: "The customer taps “Near me” to see the closest branch.",
    options: [
      {
        id: "always",
        label: "Ask for precise location, all the time, at launch",
        dialog: "Allow “Café” to use your location, even when you're not using the app?",
        outcome:
          "Alarming, and unjustified for finding a café. Most refuse; iOS won't let the app ask for “Always” the same way twice.",
        tone: "bad",
      },
      {
        id: "precise",
        label: "Ask for precise location while using the app, when they tap Near me",
        dialog: "Allow “Café” to use your location while using the app? (Precise: on)",
        outcome: "Good timing. Some turn off Precise, which is fine: approximate is enough here.",
        tone: "ok",
      },
      {
        id: "approx",
        label: "Ask for approximate location while using the app, when they tap Near me",
        dialog: "Allow “Café” to use your approximate location while using the app?",
        outcome: "Asks for exactly what's needed at the moment it's needed. Most say yes.",
        tone: "good",
      },
    ],
  },
  {
    id: "notify",
    title: "Tell them when food is ready",
    need: "The order-ready push from the last module needs notification permission.",
    options: [
      {
        id: "launch",
        label: "Ask at first launch",
        dialog: "“Café” would like to send you notifications.",
        outcome:
          "No context: is this going to be adverts? Many refuse, and the order-ready alert never arrives.",
        tone: "bad",
      },
      {
        id: "order",
        label: "After the first order: “Want a ping when it's ready?”, then the prompt",
        dialog: "“Café” would like to send you notifications.",
        outcome:
          "The benefit is obvious right now, and only those who say yes to the app's own question see the system prompt.",
        tone: "good",
      },
      {
        id: "never",
        label: "Never ask",
        dialog: null,
        outcome:
          "On iOS, and on Android 13 and later, nothing can be shown. The feature quietly doesn't work.",
        tone: "bad",
      },
    ],
  },
];
