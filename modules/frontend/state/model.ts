/** A made-up café cart, the same state in four frameworks, and imperative vs declarative code. */

export const MENU = [
  { id: "chai", name: "Masala chai", price: 40 },
  { id: "samosa", name: "Samosa", price: 25 },
  { id: "lassi", name: "Mango lassi", price: 60 },
];

export const FRAMEWORKS: { id: string; label: string; code: string[] }[] = [
  {
    id: "react",
    label: "React",
    code: [
      "const [items, setItems] = useState([]);",
      "const total = items.reduce((t, i) => t + i.price, 0);  // derived",
    ],
  },
  {
    id: "vue",
    label: "Vue",
    code: [
      "const items = ref([]);",
      "const total = computed(() =>",
      "  items.value.reduce((t, i) => t + i.price, 0));",
    ],
  },
  {
    id: "svelte",
    label: "Svelte",
    code: [
      "let items = $state([]);",
      "let total = $derived(items.reduce((t, i) => t + i.price, 0));",
    ],
  },
  {
    id: "angular",
    label: "Angular",
    code: [
      "items = signal<Item[]>([]);",
      "total = computed(() =>",
      "  this.items().reduce((t, i) => t + i.price, 0));",
    ],
  },
];

export const IMPERATIVE = [
  "addButton.onclick = () => {",
  "  items.push(item);",
  "  countEl.textContent = items.length;     // remember to update",
  "  totalEl.textContent = sum(items);       // every place",
  "  listEl.appendChild(makeRow(item));      // by hand",
  "};",
];

export const DECLARATIVE = [
  "function Cart({ items }) {",
  "  return (<>",
  "    <p>{items.length} items · ₹{sum(items)}</p>",
  "    <ul>{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul>",
  "  </>);",
  "}",
  "// change items; the framework redraws what's different",
];
