/**
 * One-off values found across a made-up café app, and the design tokens they should become. The
 * raw values are shown only as text.
 */

export type Token = "accent" | "success" | "danger" | "space-2" | "space-4";

export const TOKENS: { id: Token; name: string; note: string }[] = [
  { id: "accent", name: "color-accent", note: "Brand colour for buttons and links" },
  { id: "success", name: "color-success", note: "Confirmations" },
  { id: "danger", name: "color-danger", note: "Errors" },
  { id: "space-2", name: "space-2 (8px)", note: "Small gaps" },
  { id: "space-4", name: "space-4 (16px)", note: "Standard padding" },
];

export const VALUES: { id: string; raw: string; where: string; answer: Token }[] = [
  { id: "v1", raw: "#5b21b6", where: "Order button", answer: "accent" },
  { id: "v2", raw: "#5c22b5", where: "Header link (copied by eye)", answer: "accent" },
  { id: "v3", raw: "rgb(91, 33, 182)", where: "Cart badge", answer: "accent" },
  { id: "v4", raw: "#16a34a", where: "“Order placed” banner", answer: "success" },
  { id: "v5", raw: "#15803d", where: "Saved tick", answer: "success" },
  { id: "v6", raw: "#dc2626", where: "Form error", answer: "danger" },
  { id: "v7", raw: "7px", where: "Gap between tags", answer: "space-2" },
  { id: "v8", raw: "9px", where: "Icon margin", answer: "space-2" },
  { id: "v9", raw: "15px", where: "Card padding", answer: "space-4" },
  { id: "v10", raw: "16px", where: "Dialog padding", answer: "space-4" },
];

export const APPROACHES: { id: string; label: string; code: string[]; note: string }[] = [
  {
    id: "css",
    label: "CSS + variables",
    code: [
      ".button {",
      "  background: var(--color-accent);",
      "  padding: var(--space-2) var(--space-4);",
      "}",
    ],
    note: "No build tools needed. Custom properties carry the tokens.",
  },
  {
    id: "modules",
    label: "CSS Modules",
    code: [
      "/* Button.module.css */",
      ".root { background: var(--color-accent); }",
      "",
      "import s from './Button.module.css';",
      "<button className={s.root}>",
    ],
    note: "Ordinary CSS with class names scoped to the component automatically.",
  },
  {
    id: "tailwind",
    label: "Tailwind v4",
    code: ["@theme { --color-accent: …; }", "", '<button class="bg-accent px-4 py-2">'],
    note: "Utility classes generated from your theme; v4 (Jan 2025) configures tokens in CSS.",
  },
  {
    id: "zero",
    label: "Zero-runtime CSS-in-JS",
    code: ["const button = style({", "  background: vars.color.accent,", "});"],
    note: "vanilla-extract, Panda CSS, StyleX: written in TypeScript, compiled to static CSS at build time.",
  },
  {
    id: "runtime",
    label: "Runtime CSS-in-JS",
    code: ["const Button = styled.button`", "  background: ${(p) => p.theme.accent};", "`;"],
    note: "Styles injected while rendering. styled-components entered maintenance mode in March 2025; not recommended for new projects.",
  },
];
