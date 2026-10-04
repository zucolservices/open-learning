/** One spoken question through a cascaded pipeline, stage by stage. Timings illustrative. */

export type Stage = "mic" | "vad" | "stt" | "llm" | "tts" | "speaker";

export const STAGES: { id: Stage; label: string }[] = [
  { id: "mic", label: "Microphone" },
  { id: "vad", label: "Voice activity" },
  { id: "stt", label: "Speech to text" },
  { id: "llm", label: "Language model" },
  { id: "tts", label: "Text to speech" },
  { id: "speaker", label: "Speaker" },
];

export const FRAMES: { stage: Stage; t: number; title: string; caption: string; show: string }[] = [
  {
    stage: "mic",
    t: 0,
    title: "You speak",
    caption: "Audio streams in from the microphone in small chunks, a few dozen milliseconds each.",
    show: "🎙  “When does the pharmacy close today?”",
  },
  {
    stage: "vad",
    t: 0,
    title: "Someone's talking",
    caption:
      "A small voice activity detection model notices speech starting, and later decides you've stopped.",
    show: "speech: ▮▮▮▮▮▮▮▮▮▮▮▮░░░ (silence → turn over)",
  },
  {
    stage: "stt",
    t: 250,
    title: "Words appear",
    caption:
      "Speech recognition streams partial guesses while you talk, then a final transcript shortly after you stop.",
    show: "partial: “when does the farm…”\nfinal:   “When does the pharmacy close today?”",
  },
  {
    stage: "llm",
    t: 700,
    title: "The model writes a reply",
    caption:
      "The transcript goes to a language model, often with tools (here, opening hours). Its first words start streaming out.",
    show: "→ “It closes at 9 pm today.”",
  },
  {
    stage: "tts",
    t: 850,
    title: "Text becomes speech",
    caption:
      "Speech synthesis starts voicing the first words before the model has finished writing the rest.",
    show: "audio chunks: ▶ “It closes” ▶ “at 9 pm” ▶ “today.”",
  },
  {
    stage: "speaker",
    t: 950,
    title: "You hear the answer",
    caption:
      "About a second after you stopped talking, the first sound plays. Every stage added a little delay.",
    show: "🔊  “It closes at 9 pm today.”",
  },
];

export type Arch = "cascade" | "s2s" | "duplex";
