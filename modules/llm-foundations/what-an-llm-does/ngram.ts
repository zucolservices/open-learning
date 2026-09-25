/**
 * A real (tiny) language model: counts which word follows which in a small text, then predicts the
 * next word from those counts. Trigrams where it has seen the two-word context, bigrams otherwise.
 */

export const CORPUS = `
the cafe opens at seven in the morning .
the cafe serves hot coffee and masala chai .
people drink hot coffee in the morning .
people drink masala chai in the evening .
the barista makes hot coffee with fresh milk .
the barista makes masala chai with ginger and cardamom .
a cup of coffee costs eighty rupees .
a cup of chai costs forty rupees .
students come to the cafe after class .
students drink cold coffee in the afternoon .
the cafe sells fresh bread in the morning .
the bread is warm and soft .
the coffee is strong and hot .
the chai is sweet and strong .
people read the news in the morning .
people meet friends at the cafe in the evening .
the cafe closes at ten in the night .
it rains in the evening and people stay inside .
the barista smiles and serves the next customer .
a customer asks for a cup of masala chai .
a customer asks for cold coffee with ice .
the cafe plays soft music in the evening .
the morning rush starts at eight .
everyone wants hot coffee before work .
the evening crowd wants chai and snacks .
`;

export type Counts = Map<string, Map<string, number>>;

export function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z]+|[.,?!]/g) ?? [];
}

export function train(text: string): { uni: Counts; bi: Counts; vocab: string[] } {
  const uni: Counts = new Map();
  const bi: Counts = new Map();
  const vocab = new Set<string>();
  for (const line of text.trim().split("\n")) {
    const w = ["<s>", "<s>", ...tokenize(line)];
    for (let i = 2; i < w.length; i++) {
      vocab.add(w[i]);
      const add = (m: Counts, k: string) => {
        const row = m.get(k) ?? new Map<string, number>();
        row.set(w[i], (row.get(w[i]) ?? 0) + 1);
        m.set(k, row);
      };
      add(uni, w[i - 1]);
      add(bi, `${w[i - 2]} ${w[i - 1]}`);
    }
  }
  return { uni, bi, vocab: [...vocab] };
}

export interface Prediction {
  word: string;
  p: number;
}

/** Next-word probabilities given the words so far; `context` is how many previous words it uses. */
export function predict(
  model: ReturnType<typeof train>,
  words: string[],
  context: 1 | 2,
): { preds: Prediction[]; used: string } {
  const w = ["<s>", "<s>", ...words];
  const two = `${w[w.length - 2]} ${w[w.length - 1]}`;
  const one = w[w.length - 1];
  let row = context === 2 ? model.bi.get(two) : undefined;
  let used = two;
  if (!row) {
    row = model.uni.get(one);
    used = one;
  }
  if (!row) return { preds: [], used };
  const total = [...row.values()].reduce((a, b) => a + b, 0);
  const preds = [...row.entries()]
    .map(([word, c]) => ({ word, p: c / total }))
    .sort((a, b) => b.p - a.p);
  return { preds, used: used.replace(/<s>\s?/g, "").trim() || "(start)" };
}

/** Pick a word: the favourite, or at random in proportion to probability. */
export function pick(preds: Prediction[], mode: "top" | "sample", r: number): string | undefined {
  if (!preds.length) return undefined;
  if (mode === "top") return preds[0].word;
  let acc = 0;
  for (const p of preds) {
    acc += p.p;
    if (r <= acc) return p.word;
  }
  return preds[preds.length - 1].word;
}
