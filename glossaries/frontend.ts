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
  "main-thread": {
    term: "Main thread",
    definition:
      "The single thread where a page runs its JavaScript, handles input and works out style and layout. If it's busy, the page can't respond.",
    module: "event-loop",
  },
  "event-loop": {
    term: "Event loop",
    definition:
      "The browser's scheduler: it runs one task, then all queued microtasks, then paints if a frame is due, then picks the next task.",
    module: "event-loop",
  },
  "long-task": {
    term: "Long task",
    definition:
      "Any piece of work on the main thread that takes longer than 50 milliseconds, long enough to make clicks and typing feel slow.",
    module: "event-loop",
  },
  component: {
    term: "Component",
    definition:
      "A reusable piece of user interface that takes inputs (props) and returns what to show. Pages are built as trees of components.",
    module: "components",
  },
  props: {
    term: "Props",
    definition:
      "The inputs a parent component passes to a child, like arguments to a function. The child reads them but doesn't change them.",
    module: "components",
  },
  "one-way-data-flow": {
    term: "One-way data flow",
    definition:
      "Data passes down from parent to child as props; children ask for changes by calling functions their parent gave them.",
    module: "components",
  },
  "ui-state": {
    term: "State",
    definition:
      "Data in an interface that changes over time, such as the items in a cart or whether a menu is open. Changing it updates the screen.",
    module: "state",
  },
  "re-render": {
    term: "Re-render",
    definition:
      "Running a component again with new state or props so the framework can work out what on screen should change.",
    module: "state",
  },
  reactivity: {
    term: "Reactivity",
    definition:
      "How a framework notices that state changed and updates the parts of the page that depend on it.",
    module: "reactivity",
  },
  "virtual-dom": {
    term: "Virtual DOM",
    definition:
      "A lightweight description of the UI that a framework like React rebuilds on each change and compares with the previous one, applying only the differences to the real page.",
    module: "reactivity",
  },
  signals: {
    term: "Signals",
    definition:
      "Reactive values that remember who read them, so a change updates exactly those places without re-running whole components.",
    module: "reactivity",
  },
  "form-validation": {
    term: "Form validation",
    definition:
      "Checking what someone entered in a form and explaining any problems. Browser checks are a convenience; the server must always check again.",
    module: "forms",
  },
  "controlled-input": {
    term: "Controlled input",
    definition:
      "A form field whose value comes from the component's state and updates through a change handler, rather than being kept only by the browser.",
    module: "forms",
  },
  "race-condition": {
    term: "Race condition",
    definition:
      "A bug where the result depends on which of several overlapping operations finishes first, such as an old network reply arriving after a newer one.",
    module: "data-fetching",
  },
  "server-state": {
    term: "Server state",
    definition:
      "Data that lives on a server and is copied into the page, so it can go stale. Libraries like TanStack Query cache and refresh it.",
    module: "data-fetching",
  },
  "state-store": {
    term: "Store",
    definition:
      "A place outside components that holds shared client state, letting any component read or update just the parts it needs. Examples: Zustand, Redux Toolkit, Pinia.",
    module: "state-management",
  },
  routing: {
    term: "Routing",
    definition:
      "Mapping URLs to screens. Client-side routers swap screens without a full reload while keeping URLs, history and the Back button working.",
    module: "routing",
  },
  spa: {
    term: "Single-page app",
    definition:
      "A site that loads once and then swaps screens with JavaScript instead of requesting a new page from the server for each link.",
    module: "routing",
  },
  csr: {
    term: "Client-side rendering (CSR)",
    definition:
      "Sending a mostly empty HTML page and letting JavaScript in the browser build the content and fetch data.",
    module: "rendering-modes",
  },
  ssr: {
    term: "Server-side rendering (SSR)",
    definition:
      "Building a page's HTML on the server for each request, so content arrives ready to display.",
    module: "rendering-modes",
  },
  ssg: {
    term: "Static site generation (SSG)",
    definition:
      "Building pages' HTML once at build time and serving the same files to everyone, usually from a CDN.",
    module: "rendering-modes",
  },
  isr: {
    term: "Incremental static regeneration (ISR)",
    definition:
      "Static pages that are rebuilt in the background after a set time, serving the older copy until the new one is ready.",
    module: "rendering-modes",
  },
  hydration: {
    term: "Hydration",
    definition:
      "Running JavaScript in the browser to attach event handlers and state to HTML that was rendered on the server, making it interactive.",
    module: "hydration",
  },
  islands: {
    term: "Islands architecture",
    definition:
      'Pages that are mostly static HTML with small interactive "islands" that each load their own JavaScript, so most of the page needs none.',
    module: "hydration",
  },
  "core-web-vitals": {
    term: "Core Web Vitals",
    definition:
      "Three measures of real-user experience: Largest Contentful Paint (loading), Interaction to Next Paint (responsiveness) and Cumulative Layout Shift (visual stability).",
    module: "web-vitals",
  },
  p75: {
    term: "75th percentile",
    definition:
      "The value that three out of four measurements are at or better than. Core Web Vitals judge a page by its 75th-percentile visit.",
    module: "web-vitals",
  },
  bundler: {
    term: "Bundler",
    definition:
      "A build tool that combines your code and its libraries into a few optimised files for the browser. Examples: Vite, Turbopack, webpack, Rspack.",
    module: "shipping-less-js",
  },
  "code-splitting": {
    term: "Code splitting",
    definition:
      "Breaking JavaScript into separate files so each page loads only what it needs, fetching the rest later, usually with dynamic import().",
    module: "shipping-less-js",
  },
  "tree-shaking": {
    term: "Tree shaking",
    definition:
      "Removing code you import but never use from the final bundle. It only works when libraries use ES modules (import and export).",
    module: "shipping-less-js",
  },
  "responsive-images": {
    term: "Responsive images",
    definition:
      "Offering several sizes of an image (with srcset and sizes) so each device downloads the smallest one that still looks sharp.",
    module: "images-fonts",
  },
  "lazy-loading": {
    term: "Lazy loading",
    definition:
      "Delaying the download of off-screen images or code until they're about to be needed. Never use it for what people see first.",
    module: "images-fonts",
  },
  "web-accessibility": {
    term: "Accessibility",
    definition:
      "Making sites usable by everyone, including people who use keyboards, screen readers, magnification, voice control or switches.",
    module: "accessibility",
  },
  "screen-reader": {
    term: "Screen reader",
    definition:
      "Software that reads the page aloud or in braille and lets people navigate by headings, links and landmarks. Examples: JAWS, NVDA, VoiceOver, TalkBack.",
    module: "accessibility",
  },
} satisfies Record<string, GlossaryEntry>;
