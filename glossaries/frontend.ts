import type { GlossaryEntry } from "./types";

/** Frontend track glossary. `module` slugs refer to this track. */
export const frontendTrack = {
  dom: {
    term: "DOM",
    definition:
      "Document Object Model: the tree of elements a browser builds from HTML. JavaScript reads and changes the page through it.",
    module: "how-browsers-work",
  },
  cssom: {
    term: "CSSOM",
    definition:
      "CSS Object Model: the tree of style rules a browser builds from CSS, combined with the DOM to decide how each element looks.",
    module: "how-browsers-work",
  },
  "render-blocking": {
    term: "Render-blocking",
    definition:
      "A resource the browser must finish loading before it can draw the page, such as CSS in the head. Too much of it delays the first paint.",
    module: "how-browsers-work",
  },
  layout: {
    term: "Layout",
    definition:
      "The step where the browser calculates the size and position of every box on the page. Also called reflow when it runs again.",
    module: "how-browsers-work",
  },
  compositing: {
    term: "Compositing",
    definition:
      "Stacking separately painted layers into the final image on screen, often on a separate thread so scrolling and some animations stay smooth.",
    module: "how-browsers-work",
  },
  "baseline-web": {
    term: "Baseline",
    definition:
      'A label for web features: "newly available" means supported in all major browsers; "widely available" means 30 months after that.',
    module: "how-browsers-work",
  },
  "semantic-html": {
    term: "Semantic HTML",
    definition:
      "Using HTML elements for what they mean (heading, button, navigation) rather than only how they look, so browsers and assistive technology understand the page.",
    module: "semantic-html",
  },
  "accessibility-tree": {
    term: "Accessibility tree",
    definition:
      'A version of the DOM the browser builds for assistive technology, giving each element a role, name and state, such as "button, Order now".',
    module: "semantic-html",
  },
  landmark: {
    term: "Landmark",
    definition:
      "A region of a page, such as banner, navigation, main or contentinfo, that screen-reader users can jump between.",
    module: "semantic-html",
  },
  flexbox: {
    term: "Flexbox",
    definition:
      "A CSS layout mode that lines items up in one direction, a row or a column, and controls how they are spaced and aligned.",
    module: "css-layout",
  },
  "css-grid": {
    term: "CSS grid",
    definition:
      "A CSS layout mode that places items on rows and columns at the same time, defined on the container.",
    module: "css-layout",
  },
  "box-model": {
    term: "Box model",
    definition:
      "The way CSS sizes every element: content, surrounded by padding, then a border, then margin.",
    module: "css-layout",
  },
} satisfies Record<string, GlossaryEntry>;
