/**
 * A tiny, real reward model: answers are described by five features, and a Bradley–Terry model
 * (the one used in RLHF reward models) is fitted by gradient descent to pairwise preferences.
 */

export const FEATURES = [
  "Correct",
  "Answers the question",
  "Length",
  "Flatters the user",
  "Refuses",
] as const;
export type Vec = [number, number, number, number, number];

export interface Answer {
  text: string;
  f: Vec;
}

export interface Pair {
  prompt: string;
  a: Answer;
  b: Answer;
}

// Pairs the learner judges. Feature order: correct, on-task, length (0–1), flattery, refusal.
export const PAIRS: Pair[] = [
  {
    prompt: "How long should I steep masala chai?",
    a: {
      text: "Simmer the tea with milk and spices for 3–5 minutes, then strain.",
      f: [1, 1, 0.2, 0, 0],
    },
    b: {
      text: "What a wonderful question! Chai is a beautiful tradition loved by millions across India and the world, with countless regional variations… steep it for about 20 minutes for the best flavour.",
      f: [0, 1, 0.9, 1, 0],
    },
  },
  {
    prompt: "Is the Earth flat? My uncle insists it is.",
    a: {
      text: "Your uncle raises a fascinating point, and many people share that view!",
      f: [0, 0, 0.3, 1, 0],
    },
    b: {
      text: "No. The Earth is roughly a sphere; ships vanish hull-first over the horizon and satellites photograph it daily.",
      f: [1, 1, 0.3, 0, 0],
    },
  },
  {
    prompt: "How do I kill a Python process that's frozen?",
    a: { text: "I can't help with anything involving killing.", f: [0, 0, 0.1, 0, 1] },
    b: {
      text: "Find its process ID with `ps aux | grep python`, then run `kill <PID>` (or `kill -9 <PID>` if it won't stop).",
      f: [1, 1, 0.3, 0, 0],
    },
  },
  {
    prompt: "Summarise the plot of a novel you've never heard of: 'The Monsoon Ledger'.",
    a: {
      text: "I don't recognise that title, so I can't summarise it reliably. If you share a description, I can help.",
      f: [1, 0.5, 0.2, 0, 0],
    },
    b: {
      text: "'The Monsoon Ledger' follows an accountant in 1940s Bombay who uncovers a smuggling ring during the rains…",
      f: [0, 1, 0.6, 0, 0],
    },
  },
];

// A crowd of raters: slightly swayed by long, agreeable answers (a documented tendency), or
// following guidelines that ask them to check facts and not reward flattery.
export const CROWD: Record<"typical" | "guided", Vec> = {
  typical: [0.6, 1.5, 1.4, 1.4, -1.5],
  guided: [3.0, 1.5, 0.0, -1.5, -1.5],
};

const sig = (x: number) => 1 / (1 + Math.exp(-x));
const dot = (w: Vec, f: Vec) => w.reduce((s, x, i) => s + x * f[i], 0);

/** Synthetic comparisons from a crowd: random answer pairs, winner drawn from the crowd's taste. */
export function crowdPairs(taste: Vec, n = 400, seed = 3): { win: Vec; lose: Vec }[] {
  let a = seed;
  const r = () => {
    a = (a * 1103515245 + 12345) & 0x7fffffff;
    return a / 0x7fffffff;
  };
  const rand = (): Vec => [
    r() < 0.6 ? 1 : 0,
    r() < 0.7 ? 1 : 0,
    Math.round(r() * 10) / 10,
    r() < 0.3 ? 1 : 0,
    r() < 0.1 ? 1 : 0,
  ];
  const out: { win: Vec; lose: Vec }[] = [];
  for (let i = 0; i < n; i++) {
    const x = rand();
    const y = rand();
    const pX = sig(dot(taste, x) - dot(taste, y));
    out.push(r() < pX ? { win: x, lose: y } : { win: y, lose: x });
  }
  return out;
}

/** Fit reward weights w so that P(winner) = σ(w·f_win − w·f_lose) (Bradley–Terry). */
export function fitReward(data: { win: Vec; lose: Vec }[], steps = 300, lr = 0.5): Vec {
  const w: Vec = [0, 0, 0, 0, 0];
  for (let s = 0; s < steps; s++) {
    const g: Vec = [0, 0, 0, 0, 0];
    for (const { win, lose } of data) {
      const p = sig(dot(w, win) - dot(w, lose));
      for (let i = 0; i < 5; i++) g[i] += (1 - p) * (win[i] - lose[i]);
    }
    for (let i = 0; i < 5; i++) w[i] += (lr * g[i]) / data.length - 0.001 * w[i];
  }
  return w;
}

// A new question and candidate answers the "policy" can choose between after training.
export const NEW_PROMPT =
  "I'm quitting my job to sell ice to research stations in Antarctica. Brilliant plan, right?";
export const CANDIDATES: Answer[] = [
  {
    text: "Brilliant! Your vision and courage are truly inspiring; this could be the next big thing. Go for it!",
    f: [0, 0.5, 0.5, 1, 0],
  },
  {
    text: "There's a big problem: Antarctic stations are surrounded by ice. Before quitting, test demand for something they actually lack.",
    f: [1, 1, 0.4, 0, 0],
  },
  { text: "I can't give business advice.", f: [0, 0, 0.1, 0, 1] },
  {
    text: "What an exciting idea! Entrepreneurship is a wonderful journey full of learning, growth and opportunity, and every great business started with a bold step just like yours…",
    f: [0, 0.3, 1, 1, 0],
  },
];

export const score = (w: Vec, a: Answer) => dot(w, a.f);
