/** A made-up shop: products, the props a ProductCard might receive, and the same component in four styles. */

export const PRODUCTS = [
  { id: "chai", name: "Masala chai", price: 40, emoji: "☕" },
  { id: "samosa", name: "Samosa", price: 25, emoji: "🥟" },
  { id: "lassi", name: "Mango lassi", price: 60, emoji: "🥭" },
];

export const PROPS: { id: string; label: string; needed: boolean; note: string }[] = [
  { id: "name", label: "name", needed: true, note: "Each card shows its product's name." },
  { id: "price", label: "price", needed: true, note: "Each card shows its price." },
  { id: "photo", label: "photo", needed: true, note: "Each card shows a picture." },
  {
    id: "onAdd",
    label: "onAdd (a function)",
    needed: true,
    note: "The card can't change the cart itself; it calls the function its parent passed in.",
  },
  {
    id: "cartTotal",
    label: "cartTotal",
    needed: false,
    note: "The card never shows the total. Passing it ties the card to the cart for no reason.",
  },
  {
    id: "allProducts",
    label: "allProducts",
    needed: false,
    note: "One card needs one product, not the whole list.",
  },
];

export const TREE: { id: string; label: string; depth: number }[] = [
  { id: "app", label: "App (holds the cart)", depth: 0 },
  { id: "header", label: "Header", depth: 1 },
  { id: "search", label: "SearchBox", depth: 2 },
  { id: "cart", label: "CartButton", depth: 2 },
  { id: "grid", label: "ProductGrid", depth: 1 },
  { id: "card", label: "ProductCard × 3", depth: 2 },
  { id: "footer", label: "Footer", depth: 1 },
];

export const STYLES: { id: string; label: string; code: string[] }[] = [
  {
    id: "react",
    label: "React",
    code: [
      "function ProductCard({ name, price, onAdd }) {",
      "  return (",
      "    <article>",
      "      <h3>{name}</h3> <p>₹{price}</p>",
      "      <button onClick={onAdd}>Add</button>",
      "    </article>",
      "  );",
      "}",
    ],
  },
  {
    id: "vue",
    label: "Vue",
    code: [
      "<script setup>",
      "defineProps(['name', 'price']);",
      "defineEmits(['add']);",
      "</script>",
      "<template>",
      "  <article><h3>{{ name }}</h3> <p>₹{{ price }}</p>",
      "    <button @click=\"$emit('add')\">Add</button></article>",
      "</template>",
    ],
  },
  {
    id: "svelte",
    label: "Svelte",
    code: [
      "<script>",
      "  let { name, price, onAdd } = $props();",
      "</script>",
      "",
      "<article>",
      "  <h3>{name}</h3> <p>₹{price}</p>",
      "  <button onclick={onAdd}>Add</button>",
      "</article>",
    ],
  },
  {
    id: "wc",
    label: "Web component",
    code: [
      "class ProductCard extends HTMLElement {",
      "  connectedCallback() {",
      "    const name = this.getAttribute('name');",
      "    this.innerHTML = `<h3>${name}</h3><button>Add</button>`;",
      "    this.querySelector('button').onclick = () =>",
      "      this.dispatchEvent(new CustomEvent('add'));",
      "  }",
      "}",
      "customElements.define('product-card', ProductCard);",
    ],
  },
];
