/** Six problems that get the café app rejected, and the fix for each. */

export interface Issue {
  id: string;
  store: "Apple" | "Google" | "Both";
  rejection: string;
  fix: string;
}

export const ISSUES: Issue[] = [
  {
    id: "crash",
    store: "Apple",
    rejection:
      "The app crashed on launch on an iPad. (Crashes and bugs are App Review's most common rejection reason.)",
    fix: "Test on iPad and fix the crash",
  },
  {
    id: "demo",
    store: "Both",
    rejection: "Reviewers couldn't sign in to see the ordering features.",
    fix: "Provide a working demo account and review notes",
  },
  {
    id: "privacy",
    store: "Both",
    rejection:
      "The location prompt says only “We need your location”, and the privacy details leave out data the analytics SDK collects.",
    fix: "Write a specific reason; declare all data, including SDKs'",
  },
  {
    id: "target",
    store: "Google",
    rejection:
      "Updates must target Android 16 (API 36) since 31 August 2026; the app targets API 35.",
    fix: "Raise the target API level and retest",
  },
  {
    id: "billing",
    store: "Both",
    rejection:
      "The Café Plus membership (a digital subscription) is sold with the café's own card form.",
    fix: "Use in-app purchase, or an alternative allowed in that region",
  },
  {
    id: "delete",
    store: "Both",
    rejection: "People can create an account in the app but can't delete it.",
    fix: "Add account deletion inside the app",
  },
];
