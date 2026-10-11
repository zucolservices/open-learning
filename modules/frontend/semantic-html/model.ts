/**
 * A made-up café page built from anonymous boxes. Each part can be swapped for a different
 * element; the accessibility tree shows what assistive technology would receive.
 */

export interface Part {
  id: string;
  shows: string;
  options: string[];
  answer: string;
  tree: Record<string, { role: string; name?: string; focus?: boolean }>;
  why: string;
}

export const PARTS: Part[] = [
  {
    id: "top",
    shows: "Chai Corner logo and tagline",
    options: ["div", "header", "h1"],
    answer: "header",
    tree: {
      div: { role: "generic" },
      header: { role: "banner" },
      h1: { role: "heading level 1", name: "Chai Corner" },
    },
    why: "At the top of the body, header becomes the banner landmark that screen-reader users can jump to.",
  },
  {
    id: "menu",
    shows: "Links: Menu · Visit · Contact",
    options: ["div", "nav", "footer"],
    answer: "nav",
    tree: {
      div: { role: "generic" },
      nav: { role: "navigation" },
      footer: { role: "contentinfo" },
    },
    why: "nav marks the main way around the site as a navigation landmark.",
  },
  {
    id: "title",
    shows: "Big bold text: Masala chai",
    options: ["div", "p", "h1"],
    answer: "h1",
    tree: {
      div: { role: "generic", name: "" },
      p: { role: "paragraph" },
      h1: { role: "heading level 1", name: "Masala chai" },
    },
    why: "Big bold text only looks like a heading. h1 makes it one, so people can jump between headings.",
  },
  {
    id: "content",
    shows: "The description, price and order button",
    options: ["div", "main", "section"],
    answer: "main",
    tree: {
      div: { role: "generic" },
      main: { role: "main" },
      section: { role: "generic (no name)" },
    },
    why: "main marks the page's primary content; a skip link or landmark list takes people straight there.",
  },
  {
    id: "photo",
    shows: "Photo of the chai",
    options: ["img (no alt)", 'img alt=""', 'img alt="Masala chai in a clay cup"'],
    answer: 'img alt="Masala chai in a clay cup"',
    tree: {
      "img (no alt)": { role: "image", name: "chai-final-v2.jpg" },
      'img alt=""': { role: "(hidden: decorative)" },
      'img alt="Masala chai in a clay cup"': { role: "image", name: "Masala chai in a clay cup" },
    },
    why: "Without alt, screen readers may read the file name. Empty alt is right only for purely decorative images.",
  },
  {
    id: "order",
    shows: "Clickable box: Order now",
    options: ["div onclick", 'a href="#"', "button"],
    answer: "button",
    tree: {
      "div onclick": { role: "generic", name: "" },
      'a href="#"': { role: "link", name: "Order now", focus: true },
      button: { role: "button", name: "Order now", focus: true },
    },
    why: "A real button can be reached with Tab and pressed with Enter or Space, with no extra code. It performs an action, so it's a button, not a link.",
  },
  {
    id: "bottom",
    shows: "Address and opening hours",
    options: ["div", "footer", "aside"],
    answer: "footer",
    tree: {
      div: { role: "generic" },
      footer: { role: "contentinfo" },
      aside: { role: "complementary" },
    },
    why: "At the end of the body, footer becomes the contentinfo landmark.",
  },
];

export const WEBAIM: [string, number][] = [
  ["Low-contrast text", 83.9],
  ["Missing image alt text", 53.1],
  ["Missing form labels", 51],
  ["Empty links", 46.3],
  ["Empty buttons", 30.6],
  ["Missing page language", 13.5],
];
