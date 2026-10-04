/** A completion probe on benchmark items: does the model finish them word for word? Items illustrative. */

export interface Item {
  prefix: string;
  original: string;
  model: string;
  correct: boolean;
}

export const ITEMS: Item[] = [
  {
    prefix: "Natalia sold clips to 48 of their friends in April, and then",
    original: "sold half as many clips in May. How many clips did Natalia sell altogether?",
    model: "sold half as many clips in May. How many clips did Natalia sell altogether?",
    correct: true,
  },
  {
    prefix: "A bakery packs 12 rolls per bag. On Monday it",
    original: "baked 300 rolls. How many full bags could it fill?",
    model: "sold 40 bags. How many rolls was that?",
    correct: true,
  },
  {
    prefix: "Weng earns $12 an hour for babysitting. Yesterday, Weng",
    original: "did 50 minutes of babysitting. How much did Weng earn?",
    model: "did 50 minutes of babysitting. How much did Weng earn?",
    correct: true,
  },
  {
    prefix: "A train leaves at 9:40 and the journey takes",
    original: "2 hours 35 minutes. When does it arrive?",
    model: "three hours. What time does it arrive?",
    correct: false,
  },
  {
    prefix: "Betty is saving money for a new wallet which costs $100. Betty has",
    original: "only half of the money needed. Betty's parents decided to add $15…",
    model: "only half of the money needed. Betty's parents decided to add $15…",
    correct: true,
  },
  {
    prefix: "Priya buys 3 notebooks at ₹45 each and",
    original: "a pen for ₹20. How much change from ₹200?",
    model: "pays with a ₹500 note. What change does Priya get?",
    correct: true,
  },
  {
    prefix: "James writes a 3-page letter to 2 different friends",
    original: "twice a week. How many pages is that in a year?",
    model: "twice a week. How many pages is that in a year?",
    correct: true,
  },
  {
    prefix: "A tank holds 80 litres. A leak drains",
    original: "2.5 litres an hour. How long until it is a quarter full?",
    model: "5 litres a minute. How long until it is empty?",
    correct: false,
  },
  {
    prefix: "Albert is wondering how much pizza can be eaten in one day. Albert buys",
    original: "2 large pizzas and 2 small pizzas. A large pizza has 16 slices…",
    model: "2 large pizzas and 2 small pizzas. A large pizza has 16 slices…",
    correct: true,
  },
  {
    prefix: "A cyclist rides 18 km in 45 minutes. At the same speed",
    original: "how far will the cyclist ride in 2 hours?",
    model: "how long will 30 km take?",
    correct: false,
  },
];

export function words(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Share of the original continuation reproduced in order from the start. */
export function verbatim(it: Item) {
  const a = words(it.original);
  const b = words(it.model);
  let k = 0;
  while (k < a.length && a[k] === b[k]) k++;
  return k / a.length;
}

export const leaked = (it: Item) => verbatim(it) > 0.8;

export function scores() {
  const l = ITEMS.filter(leaked);
  const c = ITEMS.filter((i) => !leaked(i));
  const pct = (xs: Item[]) =>
    xs.length ? Math.round((xs.filter((x) => x.correct).length / xs.length) * 100) : 0;
  return { all: pct(ITEMS), leaked: pct(l), clean: pct(c), nLeaked: l.length, nClean: c.length };
}
