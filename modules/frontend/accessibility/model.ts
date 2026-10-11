/** A made-up café page used with only a keyboard and a simulated screen reader, and seven fixes. */

export const FIXES: { id: string; label: string; wcag: string }[] = [
  { id: "skip", label: "Add a “Skip to content” link", wcag: "2.4.1 Bypass Blocks" },
  { id: "label", label: "Label the search box", wcag: "1.3.1, 3.3.2 Labels" },
  { id: "menu", label: "Make Menu a real button", wcag: "2.1.1 Keyboard" },
  { id: "alt", label: "Describe the photo with alt text", wcag: "1.1.1 Non-text Content" },
  { id: "focus", label: "Restore the visible focus outline", wcag: "2.4.7 Focus Visible" },
  { id: "contrast", label: "Darken the light-grey price text", wcag: "1.4.3 Contrast (4.5:1)" },
  { id: "live", label: "Announce “Added to cart”", wcag: "4.1.3 Status Messages" },
];

export interface El {
  id: string;
  focusable(f: string[]): boolean;
  says(f: string[]): string;
}

export const ELEMENTS: El[] = [
  { id: "skip", focusable: (f) => f.includes("skip"), says: () => "Skip to content, link" },
  { id: "logo", focusable: () => true, says: () => "Chai Corner home, link" },
  {
    id: "search",
    focusable: () => true,
    says: (f) => (f.includes("label") ? "Search the menu, edit text" : "Edit text"),
  },
  {
    id: "menu",
    focusable: (f) => f.includes("menu"),
    says: (f) => (f.includes("menu") ? "Menu, button, collapsed" : "Menu"),
  },
  {
    id: "photo",
    focusable: () => false,
    says: (f) =>
      f.includes("alt") ? "Masala chai in a clay cup, image" : "chai-final-v2.jpg, image",
  },
  { id: "price", focusable: () => false, says: () => "₹40" },
  { id: "add", focusable: () => true, says: () => "Add to cart, button" },
];

export const LAW: { where: string; what: string }[] = [
  {
    where: "European Union",
    what: "European Accessibility Act, applying since 28 June 2025, covers e-commerce, banking, e-books, ticketing and more (micro-enterprise services exempt).",
  },
  {
    where: "United States",
    what: "ADA Title II rule for state and local governments: WCAG 2.1 AA. Deadlines moved in April 2026 to 26 April 2027 (large) and 26 April 2028 (smaller).",
  },
  {
    where: "India",
    what: "Rights of Persons with Disabilities Act 2016; government websites and apps follow GIGW 3.0, based on WCAG 2.1 AA.",
  },
];
