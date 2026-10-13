/** Building and shipping a made-up café chain's ordering app: design choices, beta fixes and launch week. */

export interface Choice {
  id: string;
  title: string;
  options: { id: string; label: string; ok: boolean; outcome: string }[];
}

export const DESIGN: Choice[] = [
  {
    id: "approach",
    title: "How to build it, with a team of four",
    options: [
      {
        id: "two",
        label: "Two separate native apps, two developers each",
        ok: false,
        outcome: "Possible, but every feature is built twice by half-sized teams.",
      },
      {
        id: "cross",
        label: "One cross-platform codebase, with native code where needed",
        ok: true,
        outcome: "One team ships both platforms; the device features still work.",
      },
    ],
  },
  {
    id: "data",
    title: "Where the menu and basket live",
    options: [
      {
        id: "local",
        label: "A local database, synced in the background",
        ok: true,
        outcome: "Works offline; queued changes sync later.",
      },
      {
        id: "network",
        label: "Fetched from the server on every screen",
        ok: false,
        outcome: "Blank screens in lifts and on trains.",
      },
    ],
  },
  {
    id: "ready",
    title: "Telling customers their order is ready",
    options: [
      {
        id: "poll",
        label: "The app checks the server every minute",
        ok: false,
        outcome: "Stops when backgrounded, and drains battery while it runs.",
      },
      {
        id: "push",
        label: "A push notification from the server, asked for after the first order",
        ok: true,
        outcome: "Instant, battery-friendly and welcome.",
      },
    ],
  },
  {
    id: "location",
    title: "Finding the nearest branch",
    options: [
      {
        id: "approx",
        label: "Approximate location while the app is in use",
        ok: true,
        outcome: "Enough to find a branch, and easy to say yes to.",
      },
      {
        id: "precise",
        label: "Precise location, all the time",
        ok: false,
        outcome: "Alarming, refused often, and costly in battery.",
      },
    ],
  },
  {
    id: "token",
    title: "Keeping customers signed in",
    options: [
      {
        id: "prefs",
        label: "Token in ordinary settings storage",
        ok: false,
        outcome: "Unencrypted and copied into backups.",
      },
      {
        id: "secure",
        label: "Token in the Keychain, or encrypted with a Keystore key",
        ok: true,
        outcome: "Protected by the platform's secure storage.",
      },
    ],
  },
];

export const BETA: { id: string; problem: string; fix: string; fixed: string }[] = [
  {
    id: "state",
    problem: "Testers lose their half-built basket after taking a photo with the camera.",
    fix: "Save screen state; restore it after process death",
    fixed: "The basket survives the system reclaiming memory.",
  },
  {
    id: "touch",
    problem: "The quantity buttons are tiny and testers keep hitting the wrong one.",
    fix: "44 pt / 48 dp touch targets",
    fixed: "Thumb-sized targets, same icons.",
  },
  {
    id: "label",
    problem: "A screen reader announces the favourite button as just “Button”.",
    fix: "Add an accessibility label",
    fixed: "“Add Masala dosa to favourites, button”.",
  },
  {
    id: "fold",
    problem: "On an unfolded foldable, the menu is a single stretched column.",
    fix: "Adapt the layout by window size class",
    fixed: "List and detail side by side on wide windows.",
  },
  {
    id: "network",
    problem: "On a weak signal the menu spinner never stops.",
    fix: "Timeouts, retries with backoff, cached menu",
    fixed: "The cached menu shows at once and refreshes when it can.",
  },
  {
    id: "battery",
    problem: "Testers report the app near the top of the battery list.",
    fix: "Replace the wake-lock polling with push and scheduled work",
    fixed: "No more keeping the phone awake.",
  },
];

export interface Event {
  id: string;
  title: string;
  options: { id: string; label: string; ok: boolean; outcome: string }[];
}

export const LAUNCH: Event[] = [
  {
    id: "review",
    title: "Apple rejects the first submission: reviewers couldn't sign in.",
    options: [
      {
        id: "argue",
        label: "Appeal: the app works fine",
        ok: false,
        outcome: "Reviewers can only judge what they can reach. A day lost.",
      },
      {
        id: "demo",
        label: "Add a demo account and review notes, then resubmit",
        ok: true,
        outcome: "Approved the next day.",
      },
    ],
  },
  {
    id: "rollout",
    title: "Approved. How do you release it?",
    options: [
      {
        id: "all",
        label: "To everyone at once, for maximum launch buzz",
        ok: false,
        outcome: "Any hidden bug reaches every customer on day one.",
      },
      {
        id: "phased",
        label: "Phased on iOS and staged on Play, watching crash-free users",
        ok: true,
        outcome: "A bad release would reach few people before you can react.",
      },
    ],
  },
  {
    id: "crash",
    title: "Day two at 5%: a new crash when people split a bill.",
    options: [
      {
        id: "flag",
        label: "Turn off bill splitting with its flag, pause the rollout, ship a fix",
        ok: true,
        outcome: "Crashes stop at once; the fix follows in a higher version.",
      },
      {
        id: "wait",
        label: "Keep rolling out and fix it in next month's release",
        ok: false,
        outcome: "More customers crash every day the rollout grows.",
      },
    ],
  },
  {
    id: "rating",
    title: "Things are stable. When should the app ask for ratings?",
    options: [
      {
        id: "after",
        label: "After a delivered order, using the system prompt",
        ok: true,
        outcome: "A natural moment, within the platforms' limits.",
      },
      {
        id: "launch",
        label: "On first launch, with “Love the app? Give us 5 stars!”",
        ok: false,
        outcome: "Against both stores' guidance, and annoying.",
      },
    ],
  },
];
