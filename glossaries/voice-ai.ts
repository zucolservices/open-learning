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
  "audio-sample": {
    term: "Sample (audio)",
    definition:
      "One measurement of a sound wave's level at an instant; digital audio is a long list of samples taken at regular intervals.",
    module: "sound-basics",
  },
  "sample-rate": {
    term: "Sample rate",
    definition:
      "How many samples are taken per second, such as 8,000 for phone calls or 16,000 for speech recognition; it can capture frequencies up to half its value.",
    module: "sound-basics",
  },
  "bit-depth": {
    term: "Bit depth",
    definition:
      "How many bits store each sample, setting how finely its level is recorded; each extra bit adds about 6 dB of dynamic range.",
    module: "sound-basics",
  },
  spectrogram: {
    term: "Spectrogram",
    definition:
      "A picture of sound with time across, pitch up and loudness as brightness; the usual input to speech models.",
    module: "sound-basics",
  },
  "mel-scale": {
    term: "Mel scale",
    definition:
      "A pitch scale spaced the way people hear, with fine steps for low pitches and wider ones for high pitches; used to build the spectrograms speech models read.",
    module: "sound-basics",
  },
} satisfies Record<string, GlossaryEntry>;
