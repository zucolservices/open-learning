/** A restaurant query: how its shape and limits drive database calls and cost (illustrative). */

export type Field = "rating" | "dishes" | "price" | "reviews" | "author";

export const FIELDS: { id: Field; label: string; needs?: Field }[] = [
  { id: "rating", label: "rating" },
  { id: "dishes", label: "dishes" },
  { id: "price", label: "dishes › price", needs: "dishes" },
  { id: "reviews", label: "dishes › reviews", needs: "dishes" },
  { id: "author", label: "reviews › author", needs: "reviews" },
];

export function query(f: Field[], n: number, m: number): string {
  const has = (x: Field) => f.includes(x);
  const L = ["query {", '  restaurant(id: "r_7") {', "    name"];
  if (has("rating")) L.push("    rating");
  if (has("dishes")) {
    L.push(`    dishes(first: ${n}) {`, "      name");
    if (has("price")) L.push("      price_paise");
    if (has("reviews")) {
      L.push(`      reviews(first: ${m}) {`, "        text");
      if (has("author")) L.push("        author { name }");
      L.push("      }");
    }
    L.push("    }");
  }
  L.push("  }", "}");
  return L.join("\n");
}

export function calls(f: Field[], n: number, m: number, loader: boolean) {
  const has = (x: Field) => f.includes(x);
  let naive = 1;
  let batched = 1;
  let nodes = 1;
  if (has("dishes")) {
    naive += 1;
    batched += 1;
    nodes += n;
    if (has("reviews")) {
      naive += n;
      batched += 1;
      nodes += n * m;
      if (has("author")) {
        naive += n * m;
        batched += 1;
        nodes += n * m;
      }
    }
  }
  return { db: loader ? batched : naive, naive, batched, nodes };
}
