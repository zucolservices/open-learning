/** Synthesis approaches compared, and streaming vs waiting. Numbers are illustrative. */

export type Approach = "concat" | "param" | "neural";

export const APPROACHES: {
  id: Approach;
  label: string;
  era: string;
  quality: number;
  note: string;
}[] = [
  {
    id: "concat",
    label: "Glue recorded snippets",
    era: "1990s–2010s",
    quality: 3.2,
    note: "Natural on phrases it recorded, choppy at the joins on anything new.",
  },
  {
    id: "param",
    label: "Statistical model + vocoder",
    era: "2000s–2010s",
    quality: 2.8,
    note: "Flexible and small, but smooth and buzzy, the classic robot voice.",
  },
  {
    id: "neural",
    label: "Neural network",
    era: "2016 →",
    quality: 4.4,
    note: "From WaveNet onwards: close to recorded speech in listening tests, and able to clone voices.",
  },
];

export const REPLY =
  "Your table for two is booked for seven tonight. We'll send a confirmation by text. Is there anything else I can help with?";

/** Time to first audio and total, in ms, for a reply streamed from a language model. Illustrative. */
export function timing(stream: boolean) {
  const tokensPerSec = 40;
  const words = REPLY.split(" ").length;
  const llmTotal = Math.round((words / tokensPerSec) * 1000 * 1.3);
  const firstSentence = Math.round(
    (REPLY.split(".")[0].split(" ").length / tokensPerSec) * 1000 * 1.3,
  );
  const ttsFirst = 120;
  return stream
    ? { first: firstSentence + ttsFirst, llmTotal }
    : { first: llmTotal + ttsFirst + 300, llmTotal };
}
