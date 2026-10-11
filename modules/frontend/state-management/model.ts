/** Six pieces of state in a made-up shop and the places they could live. */

export type Home = "local" | "lift" | "context" | "store" | "url" | "server";

export const HOMES: { id: Home; label: string }[] = [
  { id: "local", label: "Local state" },
  { id: "lift", label: "Lift to parent" },
  { id: "context", label: "Context" },
  { id: "store", label: "Store" },
  { id: "url", label: "URL" },
  { id: "server", label: "Server cache" },
];

export const PIECES: { id: string; text: string; answer: Home; ok?: Home[]; why: string }[] = [
  {
    id: "dropdown",
    text: "Whether one dropdown menu is open",
    answer: "local",
    why: "Only that component cares. Keep it there.",
  },
  {
    id: "query",
    text: "The text in a search box, also shown by a result count next to it",
    answer: "lift",
    why: "Two siblings need it: move it to their shared parent and pass it down.",
  },
  {
    id: "filter",
    text: "The selected category on a product page, which people share as a link",
    answer: "url",
    why: "In the URL it survives reloads, can be bookmarked and shared, and works with Back.",
  },
  {
    id: "theme",
    text: "Dark or light theme, read all over the app, rarely changed",
    answer: "context",
    ok: ["store"],
    why: "Context passes a rarely changing value to everything below without threading props.",
  },
  {
    id: "products",
    text: "The product list loaded from the server",
    answer: "server",
    why: "It's a copy of server data: let a data library cache, refresh and share it.",
  },
  {
    id: "checkout",
    text: "A checkout wizard's details, updated often by many components",
    answer: "store",
    why: "Frequently changing, widely shared client state is what stores are for.",
  },
];

export const LADDER: { step: string; tools: string }[] = [
  { step: "Local state", tools: "useState, ref, $state, signal()" },
  { step: "Lift to the nearest parent", tools: "Pass values and callbacks down as props" },
  {
    step: "Context / provide-inject",
    tools: "React Context, Vue provide/inject, Angular services",
  },
  {
    step: "A store",
    tools:
      "Zustand 5, Jotai 3, Redux Toolkit 2, Pinia 4 (Vue), NgRx SignalStore (Angular), MobX 7, Svelte runes in a .svelte.js module",
  },
  {
    step: "Beside the ladder",
    tools: "URL for shareable state; TanStack Query, SWR or RTK Query for server data",
  },
];
