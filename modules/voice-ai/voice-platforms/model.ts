/** The voice stack, and who provides each part under four ways of building. Examples, not endorsements. */

export type LayerId = "carry" | "hear" | "think" | "speak" | "glue" | "phone";
export type ApproachId = "open" | "specialist" | "cloud" | "hosted";

export const LAYERS: { id: LayerId; name: string; job: string }[] = [
  { id: "carry", name: "Carry audio", job: "WebRTC rooms, WebSockets, phone lines" },
  { id: "hear", name: "Hear", job: "Speech-to-text, turn detection" },
  { id: "think", name: "Think", job: "The language model and its tools" },
  { id: "speak", name: "Speak", job: "Text-to-speech" },
  { id: "glue", name: "Glue", job: "Runs the pipeline: streaming, interruptions, tools" },
  { id: "phone", name: "Numbers and dashboards", job: "Phone numbers, transfers, call logs" },
];

export const APPROACHES: { id: ApproachId; name: string; blurb: string }[] = [
  {
    id: "open",
    name: "Open models, your servers",
    blurb: "Most control and privacy; you run and scale everything.",
  },
  {
    id: "specialist",
    name: "Mix specialist APIs",
    blurb: "Pick the best service for each part; an open framework wires them up.",
  },
  {
    id: "cloud",
    name: "One big cloud",
    blurb: "Everything from the provider you already use, with its contracts and regions.",
  },
  {
    id: "hosted",
    name: "Hosted voice platform",
    blurb: "Fastest start: configure an agent in a dashboard; least control.",
  },
];

type Cell = { who: string; own: boolean };

export const GRID: Record<ApproachId, Record<LayerId, Cell>> = {
  open: {
    carry: { who: "LiveKit server (open source), plus a carrier’s SIP trunk", own: true },
    hear: { who: "Whisper, NVIDIA Parakeet / Canary, Kyutai STT", own: true },
    think: { who: "An open-weights model you host", own: true },
    speak: { who: "Kokoro, Kyutai TTS", own: true },
    glue: { who: "Pipecat or LiveKit Agents", own: true },
    phone: { who: "You build it", own: true },
  },
  specialist: {
    carry: { who: "A WebRTC service, plus a telephony provider", own: false },
    hear: { who: "Deepgram, AssemblyAI, Speechmatics, Rev…", own: false },
    think: { who: "Any LLM API", own: false },
    speak: { who: "ElevenLabs, Cartesia, Rime…", own: false },
    glue: { who: "Pipecat or LiveKit Agents, on your servers", own: true },
    phone: { who: "Telephony provider + your own dashboards", own: true },
  },
  cloud: {
    carry: { who: "The cloud's real-time or telephony services", own: false },
    hear: { who: "Google Chirp 3 · Azure Speech in Foundry Tools · Amazon Transcribe", own: false },
    think: { who: "The cloud's model service", own: false },
    speak: { who: "Google Cloud TTS · Azure Speech · Amazon Polly", own: false },
    glue: { who: "Your code, or the cloud's agent tools", own: true },
    phone: { who: "The cloud's contact-centre products", own: false },
  },
  hosted: {
    carry: { who: "Included", own: false },
    hear: { who: "Platform default, or pick a provider", own: false },
    think: { who: "Pick a model in settings", own: false },
    speak: { who: "Pick a voice in settings", own: false },
    glue: { who: "Vapi, Retell AI, Bland, ElevenLabs Agents…", own: false },
    phone: { who: "Included", own: false },
  },
};
