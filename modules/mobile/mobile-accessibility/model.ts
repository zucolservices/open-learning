/** What a screen reader announces on the café's dish screen, before and after each fix. */

export type Fix = "decor" | "order" | "labels" | "role" | "grow";

export const FIXES: [Fix, string, string][] = [
  [
    "decor",
    "Hide the decorative image",
    "The banner is decoration; reading its file name helps nobody.",
  ],
  ["order", "Fix the reading order", "Read the dish name before its price, as people see it."],
  ["labels", "Label the icon button", "An unlabelled heart is announced only as “Button”."],
  [
    "role",
    "Mark the custom control as a button",
    "A tappable box without a role doesn't sound tappable.",
  ],
  ["grow", "Let text grow: wrap and stack", "Fixed heights cut off large text."],
];

export function announcements(f: Set<Fix>): string[] {
  const out: string[] = [];
  if (!f.has("decor")) out.push("hero_banner_final2.png, image");
  const name = "Masala dosa, heading";
  const price = "₹120";
  if (f.has("order")) out.push(name, price);
  else out.push(price, name);
  out.push(f.has("labels") ? "Add Masala dosa to favourites, button" : "Button");
  out.push(f.has("role") ? "Add to order, button" : "Add to order");
  out.push("Order total ₹120");
  return out;
}
