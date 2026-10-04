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
  "voice-pipeline": {
    term: "Voice pipeline (cascaded)",
    definition:
      "A voice assistant built from separate stages chained together: voice activity detection, speech-to-text, a language model and text-to-speech.",
    module: "voice-pipeline",
  },
  vad: {
    term: "Voice activity detection (VAD)",
    definition:
      "A small model that decides, many times a second, whether someone is speaking, used to know when speech starts and stops.",
    module: "voice-pipeline",
  },
  "speech-to-text": {
    term: "Speech-to-text (STT)",
    definition:
      "Turning spoken audio into written text; also called automatic speech recognition (ASR).",
    module: "voice-pipeline",
  },
  "text-to-speech": {
    term: "Text-to-speech (TTS)",
    definition: "Turning written text into spoken audio; also called speech synthesis.",
    module: "voice-pipeline",
  },
  "speech-to-speech": {
    term: "Speech-to-speech model",
    definition:
      "A single model that takes audio in and produces audio out, without a separate text step in between.",
    module: "voice-pipeline",
  },
  wer: {
    term: "Word error rate (WER)",
    definition:
      "The standard accuracy measure for speech recognition: substitutions plus deletions plus insertions, divided by the number of words actually said. Lower is better.",
    module: "speech-to-text",
  },
  "streaming-asr": {
    term: "Streaming recognition",
    definition:
      "Speech recognition that transcribes while you talk, sending interim guesses that may change and then a final transcript.",
    module: "speech-to-text",
  },
  endpointing: {
    term: "Endpointing",
    definition:
      "Deciding when a speaker has finished their turn, so a voice system can stop listening and reply.",
    module: "turn-taking",
  },
  "semantic-turn-detection": {
    term: "Semantic turn detection",
    definition:
      "Judging whether a speaker has finished from what they said (or how they said it), rather than from silence alone.",
    module: "turn-taking",
  },
  "echo-cancellation": {
    term: "Echo cancellation",
    definition:
      "Removing a device's own speaker output from what its microphone picks up, so a voice system doesn't hear and react to itself.",
    module: "real-audio",
  },
  "noise-suppression": {
    term: "Noise suppression",
    definition:
      "Filtering background sounds such as traffic or chatter out of audio while keeping the speaker's voice.",
    module: "real-audio",
  },
  diarisation: {
    term: "Speaker diarisation",
    definition:
      "Working out who spoke when in a recording, labelling each stretch of speech with a speaker.",
    module: "real-audio",
  },
  ttfa: {
    term: "Time to first audio",
    definition:
      "How long until the listener hears the first sound of a spoken reply; the latency that matters most in conversation.",
    module: "text-to-speech",
  },
  mos: {
    term: "Mean opinion score (MOS)",
    definition:
      "A quality rating made by averaging listeners' scores from 1 (bad) to 5 (excellent); scores from different tests aren't directly comparable.",
    module: "text-to-speech",
  },
  prosody: {
    term: "Prosody",
    definition:
      "The rhythm, stress, pitch and pace of speech, which carry meaning beyond the words themselves.",
    module: "writing-for-voice",
  },
  ssml: {
    term: "SSML",
    definition:
      "Speech Synthesis Markup Language: a W3C standard for marking up text with pauses, emphasis, speed, pitch and pronunciation for a text-to-speech voice.",
    module: "writing-for-voice",
  },
  "text-normalisation": {
    term: "Text normalisation",
    definition:
      "Converting written forms such as numbers, dates, symbols and abbreviations into the words a voice should say.",
    module: "writing-for-voice",
  },
  "voice-cloning": {
    term: "Voice cloning",
    definition:
      "Creating a synthetic voice that sounds like a particular real person, now possible from seconds of their audio.",
    module: "voice-cloning",
  },
  "voice-consent": {
    term: "Voice consent",
    definition:
      "A person's informed, freely given agreement to have their voice cloned or used, ideally verified and revocable.",
    module: "voice-cloning",
  },
  "audio-watermark": {
    term: "Audio watermark",
    definition:
      "An inaudible signal embedded in generated audio so tools can later recognise it as synthetic; it can be weakened and only marks cooperating tools' output.",
    module: "voice-cloning",
  },
} satisfies Record<string, GlossaryEntry>;
