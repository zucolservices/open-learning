/** Word error rate with a word-level alignment, plus sample clips. Clips are illustrative. */

export type Op = { kind: "ok" | "sub" | "del" | "ins"; ref?: string; hyp?: string };

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

export function align(refText: string, hypText: string) {
  const r = norm(refText);
  const h = norm(hypText);
  const d = Array.from({ length: r.length + 1 }, (_, i) =>
    Array.from({ length: h.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= r.length; i++)
    for (let j = 1; j <= h.length; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (r[i - 1] === h[j - 1] ? 0 : 1),
      );
  const ops: Op[] = [];
  let i = r.length;
  let j = h.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (r[i - 1] === h[j - 1] ? 0 : 1)) {
      ops.unshift(
        r[i - 1] === h[j - 1]
          ? { kind: "ok", ref: r[i - 1], hyp: h[j - 1] }
          : { kind: "sub", ref: r[i - 1], hyp: h[j - 1] },
      );
      i--;
      j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      ops.unshift({ kind: "del", ref: r[i - 1] });
      i--;
    } else {
      ops.unshift({ kind: "ins", hyp: h[j - 1] });
      j--;
    }
  }
  const S = ops.filter((o) => o.kind === "sub").length;
  const D = ops.filter((o) => o.kind === "del").length;
  const I = ops.filter((o) => o.kind === "ins").length;
  return { ops, S, D, I, N: r.length, wer: r.length ? (S + D + I) / r.length : 0 };
}

export const CLIPS: { id: string; label: string; ref: string; hyp: string; partials: string[] }[] =
  [
    {
      id: "clean",
      label: "Quiet room",
      ref: "Please book a table for two at seven",
      hyp: "please book a table for two at seven",
      partials: [
        "please",
        "please look",
        "please book a",
        "please book a table for two",
        "please book a table for two at seven",
      ],
    },
    {
      id: "noisy",
      label: "Busy street",
      ref: "Please book a table for two at seven",
      hyp: "please look a table for to at seven",
      partials: [
        "please",
        "please look",
        "please look a table",
        "please look a table for to",
        "please look a table for to at seven",
      ],
    },
    {
      id: "names",
      label: "Names and codes",
      ref: "My name is Saoirse Kelly and my order is A4417",
      hyp: "my name is sasha kelly and my order is a four four one seven",
      partials: [
        "my name",
        "my name is sasha",
        "my name is sasha kelly and",
        "my name is sasha kelly and my order is",
        "my name is sasha kelly and my order is a four four one seven",
      ],
    },
  ];
