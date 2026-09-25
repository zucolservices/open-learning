/** Byte-pair encoding, learned for real on a tiny corpus (the classic Sennrich et al. example). */

export const TOY: [string, number][] = [
  ["low", 5],
  ["lower", 2],
  ["newest", 6],
  ["widest", 3],
];

export interface BpeStep {
  words: { parts: string[]; count: number }[];
  pairs: { pair: [string, string]; count: number }[];
  merged: [string, string] | null;
  vocab: string[];
}

export function learnBpe(merges: number): BpeStep[] {
  let words = TOY.map(([w, c]) => ({ parts: [...w.split(""), "_"], count: c }));
  const vocab = new Set(words.flatMap((w) => w.parts));
  const steps: BpeStep[] = [];
  for (let m = 0; m <= merges; m++) {
    const counts = new Map<string, number>();
    for (const w of words)
      for (let i = 0; i < w.parts.length - 1; i++) {
        const k = `${w.parts[i]}\u0000${w.parts[i + 1]}`;
        counts.set(k, (counts.get(k) ?? 0) + w.count);
      }
    const pairs = [...counts.entries()]
      .map(([k, c]) => ({ pair: k.split("\u0000") as [string, string], count: c }))
      .sort((a, b) => b.count - a.count || a.pair.join("").localeCompare(b.pair.join("")));
    const best = m < merges && pairs.length ? pairs[0].pair : null;
    steps.push({
      words: words.map((w) => ({ ...w, parts: [...w.parts] })),
      pairs: pairs.slice(0, 4),
      merged: best,
      vocab: [...vocab],
    });
    if (!best) break;
    const joined = best[0] + best[1];
    vocab.add(joined);
    words = words.map((w) => {
      const out: string[] = [];
      for (let i = 0; i < w.parts.length; i++) {
        if (i < w.parts.length - 1 && w.parts[i] === best[0] && w.parts[i + 1] === best[1]) {
          out.push(joined);
          i += 1;
        } else out.push(w.parts[i]);
      }
      return { ...w, parts: out };
    });
  }
  return steps;
}
