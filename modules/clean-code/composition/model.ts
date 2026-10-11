/**
 * Café drinks modelled two ways: one class per combination (inheritance) or a drink built from
 * parts (composition). Counts are exact for "each add-on present or absent" per base drink.
 */

export const BASES = ["Coffee", "Tea"];
export const ADDONS = ["Milk", "Sugar", "ExtraShot", "Iced", "Decaf", "Jaggery"];

export function inheritanceClasses(n: number): string[] {
  const chosen = ADDONS.slice(0, n);
  const out: string[] = [];
  for (const b of BASES) {
    for (let mask = 0; mask < 1 << n; mask++) {
      const parts = chosen.filter((_, i) => mask & (1 << i));
      out.push(parts.length ? `${b}With${parts.join("And")}` : b);
    }
  }
  return out;
}

export const compositionParts = (n: number) => [
  "Drink",
  ...BASES.map((b) => `${b}Base`),
  ...ADDONS.slice(0, n),
];
