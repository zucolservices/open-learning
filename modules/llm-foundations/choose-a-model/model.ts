/**
 * A day at "Nagarika Sahaya", a citizen helpdesk answering questions about state services in
 * Kannada, English and Hindi. Illustrative model: prices sit on real September 2026 tiers (module 19),
 * the language token multipliers are measured with real tokenizers (`data.json`), and quality,
 * speed and GPU throughput figures are round, plausible numbers, not benchmarks.
 */
import data from "./data.json";

export type Lang = "kn" | "en" | "hi";
export type ModelId = "large" | "mid" | "small";
export type ContextId = "rag" | "stuff" | "finetune";
export type LangId = "native" | "pivot";
export type HostId = "api" | "india" | "own";
export type AnswerId = "stream" | "full";

export interface Design {
  model: ModelId;
  context: ContextId;
  lang: LangId;
  host: HostId;
  answer: AnswerId;
  gpus: number;
}

export const LANGS: [Lang, string][] = [
  ["kn", "Kannada"],
  ["en", "English"],
  ["hi", "Hindi"],
];
/** Share of questions in each language. */
export const MIX: Record<Lang, number> = { kn: 0.6, en: 0.25, hi: 0.15 };
export const PER_DAY = 40_000;
export const QUALITY_TARGET = 0.8;
export const LATENCY_TARGET = 2; // seconds to first words at the busiest hour

/** Tokens for the same answer relative to English, measured with real tokenizers. */
function mult(tokId: string): Record<Lang, number> {
  const t = data.tok[tokId as keyof typeof data.tok];
  return { en: 1, hi: t.hi / t.en, kn: t.kn / t.en };
}

export interface ModelSpec {
  label: string;
  hint: string;
  open: boolean;
  /** US dollars per million tokens, when bought as a hosted API. */
  price: { in: number; out: number };
  context: number;
  quality: Record<Lang, number>;
  tokenizer: string;
  mult: Record<Lang, number>;
  /** Tokens per second one GPU gets through with batching (self-hosted). */
  gpuTps: number;
  decodeTps: number;
}

export const MODELS: Record<ModelId, ModelSpec> = {
  large: {
    label: "Large hosted model",
    hint: "A top-tier closed model (about $2 in / $10 out per million tokens). Strong in all three languages. Weights not available.",
    open: false,
    price: { in: 2, out: 10 },
    context: 1_000_000,
    quality: { en: 0.95, hi: 0.93, kn: 0.89 },
    tokenizer: "Phi-4-mini",
    mult: mult("phi"),
    gpuTps: 0,
    decodeTps: 80,
  },
  mid: {
    label: "Mid-size open model (~30B)",
    hint: "Open weights, about $0.30 / $1.20 hosted, or run it yourself. Good English, weaker Kannada.",
    open: true,
    price: { in: 0.3, out: 1.2 },
    context: 128_000,
    quality: { en: 0.9, hi: 0.84, kn: 0.76 },
    tokenizer: "Qwen2.5",
    mult: mult("qwen"),
    gpuTps: 1500,
    decodeTps: 60,
  },
  small: {
    label: "Small open model (~3B)",
    hint: "Cheap and fast, about $0.10 / $0.40 hosted, fits on one GPU. Struggles outside English.",
    open: true,
    price: { in: 0.1, out: 0.4 },
    context: 32_000,
    quality: { en: 0.82, hi: 0.66, kn: 0.48 },
    tokenizer: "Llama 3.2",
    mult: mult("llama"),
    gpuTps: 5000,
    decodeTps: 90,
  },
};

/** English-equivalent tokens per question for each context strategy. */
const CONTEXT: Record<ContextId, { input: number; quality: number }> = {
  rag: { input: 400 + 2000 + 80, quality: 1 },
  stuff: { input: 400 + 300_000 + 80, quality: 0.9 },
  finetune: { input: 400 + 80, quality: 0.8 },
};
/** Quality kept when translating via English (question in, answer out). */
const PIVOT: Record<Lang, number> = { en: 1, hi: 0.95, kn: 0.93 };
const PIVOT_DELAY = 0.8;
const PIVOT_COST = 0.0004; // $ per question for the translation service
const GPU_HOUR = 2.5; // $ per GPU-hour, illustrative

/** Share of the day's questions arriving in each hour (00:00 → 23:00). */
const PROFILE = [
  0.2, 0.1, 0.1, 0.1, 0.2, 0.5, 1.5, 3, 6, 9, 11, 12, 10, 8, 7, 7, 6, 5, 4, 3.5, 2.5, 1.5, 0.8, 0.4,
];
const PSUM = PROFILE.reduce((a, b) => a + b, 0);
export const HOURLY = PROFILE.map((p) => (p / PSUM) * PER_DAY);

export interface LangResult {
  quality: number;
  fits: boolean;
  inTokens: number;
  outTokens: number;
}

export interface Hour {
  h: number;
  questions: number;
  firstWords: number;
  dropped: number;
}

export interface DayResult {
  lang: Record<Lang, LangResult>;
  /** Share of questions whose prompt fits the model's window. */
  fitShare: number;
  monthly: number;
  hours: Hour[];
  peakFirstWords: number;
  droppedShare: number;
  inIndia: boolean;
  stale: boolean;
  notes: string[];
}

function outTokens(d: Design) {
  return d.answer === "stream" ? 300 : 600;
}

export function langResult(d: Design, l: Lang): LangResult {
  const m = MODELS[d.model];
  const k = d.lang === "pivot" ? 1 : m.mult[l];
  const inTokens = Math.round(CONTEXT[d.context].input * k);
  const fits = inTokens <= m.context;
  const base = d.lang === "pivot" ? m.quality.en * PIVOT[l] : m.quality[l];
  return {
    quality: fits ? base * CONTEXT[d.context].quality : 0,
    fits,
    inTokens,
    outTokens: Math.round(outTokens(d) * k),
  };
}

export function runDay(d: Design): DayResult {
  const m = MODELS[d.model];
  const lang = Object.fromEntries(LANGS.map(([l]) => [l, langResult(d, l)])) as Record<
    Lang,
    LangResult
  >;
  // Prompts that don't fit are rejected before any work is done, so they cost nothing.
  const fitShare = LANGS.reduce((a, [l]) => a + (lang[l].fits ? MIX[l] : 0), 0);
  const avgIn = LANGS.reduce((a, [l]) => a + (lang[l].fits ? MIX[l] * lang[l].inTokens : 0), 0);
  const avgOut = LANGS.reduce((a, [l]) => a + (lang[l].fits ? MIX[l] * lang[l].outTokens : 0), 0);

  // Cost for a 30-day month.
  let monthly: number;
  if (d.host === "own") monthly = d.gpus * GPU_HOUR * 24 * 30;
  else {
    const uplift = d.host === "india" ? 1.1 : 1;
    const perQ = ((avgIn * m.price.in + avgOut * m.price.out) / 1e6) * uplift;
    monthly = perQ * PER_DAY * 30;
  }
  if (d.lang === "pivot") monthly += PIVOT_COST * PER_DAY * 30;

  // Time to first words, hour by hour.
  const network = d.host === "api" ? 0.3 : 0.1;
  const prefill = avgIn / 20000; // seconds to read the prompt
  const genTime = avgOut / m.decodeTps;
  const hours: Hour[] = HOURLY.map((q, h) => {
    let wait = 0;
    let dropped = 0;
    if (d.host === "own") {
      const demand = (q / 3600) * (avgIn * 0.15 + avgOut); // prefill is cheaper per token than decode
      const rho = demand / (d.gpus * m.gpuTps);
      if (rho >= 1) {
        dropped = 1 - 1 / rho;
        wait = 30;
      } else wait = (prefill + 0.2) * (rho / (1 - rho));
    }
    const first =
      network +
      0.3 +
      prefill +
      wait +
      (d.lang === "pivot" ? PIVOT_DELAY : 0) +
      (d.answer === "full" ? genTime : 0);
    return { h, questions: q, firstWords: Math.min(first, 30), dropped };
  });
  const peak = hours.reduce((a, b) => (b.questions > a.questions ? b : a));
  const droppedShare = hours.reduce((a, h) => a + h.dropped * h.questions, 0) / PER_DAY;

  const notes: string[] = [];
  if (!lang.kn.fits || !lang.en.fits)
    notes.push(
      `All 400 service pages don't fit in a ${m.context.toLocaleString("en-IN")}-token window${lang.en.fits ? " once Kannada multiplies the tokens" : ""}. Those questions fail outright.`,
    );
  else if (d.context === "stuff")
    notes.push(
      "Pasting every service page into every question is enormously expensive and slow, even with prompt caching, and details in the middle get missed.",
    );
  if (d.context === "finetune")
    notes.push(
      "Fine-tuning taught the model last month's rules. When a deadline changes, it confidently gives the old one, and it fills gaps from memory.",
    );
  if (d.lang === "native" && m.mult.kn > 3)
    notes.push(
      `This model's tokenizer turns Kannada into ${m.mult.kn.toFixed(1)}× as many tokens as English: more cost, more GPU work and a fuller context for 60% of your users.`,
    );
  if (d.lang === "pivot")
    notes.push(
      "Translating through English helps weaker models in Kannada and Hindi, at the cost of some nuance and about 0.8 s extra.",
    );
  if (d.host === "api")
    notes.push(
      "A global API processes citizens' questions outside India by default. Hosted in-country options (Indian cloud regions) keep them here.",
    );
  if (d.host === "own" && (droppedShare > 0 || peak.firstWords > LATENCY_TARGET))
    notes.push(
      `Your ${d.gpus} GPU${d.gpus > 1 ? "s" : ""} can't keep up at the busy hours: questions queue${droppedShare > 0 ? " and time out" : ""}. Add GPUs or cut tokens per question.`,
    );
  if (d.host === "own" && droppedShare === 0 && peak.firstWords < LATENCY_TARGET)
    notes.push(
      "Your own GPUs cost the same every hour, busy or idle, but keep all data in the state data centre.",
    );
  if (d.answer === "full")
    notes.push(
      "Waiting for the whole answer before showing anything makes every reply feel slow. Stream it.",
    );

  return {
    lang,
    fitShare,
    monthly,
    hours,
    peakFirstWords: peak.firstWords,
    droppedShare,
    inIndia: d.host !== "api",
    stale: d.context === "finetune",
    notes,
  };
}

/** Six real questions from the day, replayed through the design. */
export const QUESTIONS: {
  time: number;
  lang: Lang;
  text: string;
  gloss: string;
  kind: "faq" | "changed" | "mixed" | "long";
}[] = [
  {
    time: 9,
    lang: "kn",
    text: "ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಹೇಗೆ ಪಡೆಯುವುದು?",
    gloss: "How do I get a caste certificate?",
    kind: "faq",
  },
  {
    time: 10,
    lang: "hi",
    text: "वृद्धावस्था पेंशन के लिए कौन से दस्तावेज़ चाहिए?",
    gloss: "Which documents do I need for the old-age pension?",
    kind: "faq",
  },
  {
    time: 11,
    lang: "en",
    text: "My name is misspelt on my ration card. How do I correct it?",
    gloss: "",
    kind: "faq",
  },
  {
    time: 11,
    lang: "kn",
    text: "ಪಿಂಚಣಿ ಅರ್ಜಿಯ ಕೊನೆಯ ದಿನಾಂಕ ಬದಲಾಗಿದೆಯೇ?",
    gloss: "Has the pension application deadline changed? (It moved last week.)",
    kind: "changed",
  },
  {
    time: 14,
    lang: "kn",
    text: "Ration card ಗೆ online apply ಮಾಡೋದು ಹೇಗೆ? OTP ಬರ್ತಿಲ್ಲ.",
    gloss:
      "How do I apply online for a ration card? The OTP isn't coming. (Kannada mixed with English.)",
    kind: "mixed",
  },
  {
    time: 19,
    lang: "hi",
    text: "मेरे पिताजी की पेंशन आती थी, उनका देहांत हो गया। अब माँ के नाम पर पेंशन कैसे होगी?",
    gloss: "My father received a pension and has passed away. How can it move to my mother's name?",
    kind: "long",
  },
];

const NEED = { faq: 0.6, changed: 0.6, mixed: 0.8, long: 0.75 };

export function replayQuestion(d: Design, day: DayResult, q: (typeof QUESTIONS)[number]) {
  const r = day.lang[q.lang];
  const hour = day.hours[q.time];
  if (!r.fits) return { ok: false, why: "Error: the prompt is too long for the model's window." };
  if (hour.dropped > 0.3)
    return { ok: false, why: "Timed out in the queue: the GPUs were saturated at this hour." };
  if (q.kind === "changed" && day.stale)
    return {
      ok: false,
      why: "Gave last month's deadline, confidently. Fine-tuned facts go stale.",
    };
  if (r.quality < NEED[q.kind])
    return {
      ok: false,
      why:
        q.kind === "mixed"
          ? "Misread the Kannada–English mix and gave generic advice."
          : q.kind === "long"
            ? "Missed the key detail (a family pension transfer) and answered a different question."
            : "Garbled or wrong answer in this language.",
    };
  if (hour.firstWords > 8)
    return {
      ok: false,
      why: `Right answer, but nothing appeared for ${hour.firstWords.toFixed(0)} s. Many people give up long before that.`,
    };
  return {
    ok: true,
    why: `Correct, in ${LANGS.find(([l]) => l === q.lang)![1]}. First words after ${hour.firstWords.toFixed(1)} s.`,
  };
}
