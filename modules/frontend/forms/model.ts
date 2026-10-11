/** Six problems in a made-up sign-up form, each with a fix and its effect. */

export const FIXES: { id: string; problem: string; fix: string; why: string }[] = [
  {
    id: "labels",
    problem: "Placeholder text instead of labels",
    fix: "Visible labels linked to each input",
    why: "Placeholders vanish when you type and aren't reliable names for screen readers.",
  },
  {
    id: "types",
    problem: 'Every field is type="text"',
    fix: 'type="email" and type="tel"',
    why: "Phones show the right keyboard, and the browser can check the format.",
  },
  {
    id: "timing",
    problem: "Errors appear on every keystroke",
    fix: "Check when they submit",
    why: "Shouting “invalid” while someone is still typing is distracting. GOV.UK validates on submit.",
  },
  {
    id: "messages",
    problem: "“Invalid input”",
    fix: "Say what's wrong and how to fix it",
    why: "A specific message tells people exactly what to change.",
  },
  {
    id: "keep",
    problem: "The form clears after an error",
    fix: "Keep what they typed",
    why: "Retyping everything is the fastest way to lose a sign-up.",
  },
  {
    id: "server",
    problem: "Checks only in the browser",
    fix: "Check again on the server",
    why: "Browser checks are for convenience; anyone can bypass them, so the server must validate too.",
  },
];
