/** The four touch problems on the café's basket screen, and their fixes. */

export interface Issue {
  id: string;
  title: string;
  problem: string;
  fix: string;
  fixed: string;
}

export const ISSUES: Issue[] = [
  {
    id: "targets",
    title: "Tiny − and + buttons",
    problem:
      "Each button only responds to a 20-point square, and they sit close together. A thumb covers both.",
    fix: "Pad each touch area to 44 pt (iOS) or 48 dp (Android)",
    fixed: "The icons look the same, but each now catches taps across a thumb-sized area.",
  },
  {
    id: "hidden",
    title: "Delete only by swiping",
    problem:
      "Nothing on screen says a swipe deletes an item. Many people never find it; some can't swipe at all.",
    fix: "Add a visible Remove button as well as the swipe",
    fixed:
      "The swipe is a shortcut; the button works for everyone, including switch and voice control users.",
  },
  {
    id: "feedback",
    title: "No feedback on Place order",
    problem:
      "Tapping Place order shows nothing for two seconds, so people tap again and order twice.",
    fix: "Show a pressed state at once, a spinner, then a success haptic",
    fixed:
      "The button reacts on touch, disables itself while sending, and confirms with a success haptic.",
  },
  {
    id: "edge",
    title: "Carousel against the left edge",
    problem:
      "Swiping the offers carousel from the left edge triggers the system Back gesture instead.",
    fix: "Inset the carousel from the screen edges",
    fixed: "The carousel starts away from the edge, so swipes there don't fight the Back gesture.",
  },
];
