/** A voice turn's latency, stage by stage. Numbers illustrative, shaped by published vendor breakdowns. */

export interface Opts {
  semantic: boolean;
  smallModel: boolean;
  cache: boolean;
  stream: boolean;
  colocate: boolean;
}

export function budget(o: Opts) {
  const net = o.colocate ? 25 : 110;
  const ttft = (o.smallModel ? 300 : 650) - (o.cache ? 120 : 0);
  const stages: { id: string; label: string; ms: number; big?: boolean }[] = [
    { id: "capture", label: "mic + encode", ms: 25 },
    { id: "up", label: "network to server", ms: net },
    { id: "jitter", label: "jitter buffer", ms: 30 },
    {
      id: "endpoint",
      label: o.semantic ? "turn detection (semantic)" : "turn detection (500 ms silence)",
      ms: o.semantic ? 200 : 500,
      big: true,
    },
    { id: "stt", label: "final transcript", ms: 60 },
    { id: "llm", label: "LLM first token", ms: ttft, big: true },
    {
      id: "wait",
      label: o.stream ? "wait for first sentence" : "wait for the whole reply",
      ms: o.stream ? 100 : 1100,
      big: !o.stream,
    },
    { id: "tts", label: "TTS first audio", ms: 100 },
    { id: "down", label: "network back", ms: net },
    { id: "play", label: "playback buffer", ms: 30 },
  ];
  return { stages, total: stages.reduce((a, s) => a + s.ms, 0) };
}
