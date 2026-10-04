import type { GlossaryEntry } from "./types";

/** Voice AI track glossary. `module` slugs refer to this track. */
export const voiceAi = {
  "turn-taking": {
    term: "Turn-taking",
    definition:
      "How people in a conversation take turns to speak, usually with very short gaps and little overlap, predicting when the other person will finish.",
    module: "why-voice",
  },
  "voice-agent": {
    term: "Voice agent",
    definition:
      "An AI system you talk to out loud that listens, decides what to do (sometimes using tools) and answers in speech, in real time.",
    module: "why-voice",
  },
  "voice-latency": {
    term: "Voice-to-voice latency",
    definition:
      "The time from when a person stops speaking to when a voice assistant starts speaking its reply.",
    module: "why-voice",
  },
} satisfies Record<string, GlossaryEntry>;
