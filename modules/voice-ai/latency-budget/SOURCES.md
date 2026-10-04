# Sources: The latency budget (fact-checked 2026-10-05)

- Pipecat / Daily, "Voice AI & Voice Agents" guide (updated June 2026): per-stage latency table summing to 1,293 ms; 1,500 ms target; LLM TTFT ≤ 600 ms rule of thumb (vendor estimates).
- Daily blog (2024): self-hosted, colocated demo at ~683 ms; colocation saved 50–200 ms.
- Twilio, "Core latency in AI voice agents" (P. Bredeson, 17 Nov 2025): ~1.1 s mouth-to-ear; endpointing "the long pole in the tent".
- LiveKit (21 Feb 2026): sub-second targets.
- ITU-T G.114 (05/2003): one-way transmission delay guidance (150 ms transparent; 400 ms planning limit).

The interactive budget is illustrative, shaped by these breakdowns.
