# Sources: Voice activity and turn-taking (fact-checked 2026-10-05)

- Silero VAD (MIT; 512-sample windows at 16 kHz, ~32 ms); WebRTC VAD (10/20/30 ms frames, modes 0–3).
- OpenAI Realtime API docs: server_vad (silence_duration_ms 500, prefix_padding_ms 300, threshold 0.5) and semantic_vad (eagerness low/medium/high).
- Deepgram docs: endpointing, utterance_end_ms; Flux end-of-turn detection (2025).
- LiveKit turn detector (open weights, licensed for LiveKit Agents; text-based); Pipecat Smart Turn (BSD-2, audio-based); Krisp turn-taking (commercial).
- E. Ekstedt & G. Skantze, "Voice Activity Projection", INTERSPEECH 2022.
- T. Stivers et al., PNAS 2009.

The caller's turns, pauses and VAD probabilities are illustrative.
