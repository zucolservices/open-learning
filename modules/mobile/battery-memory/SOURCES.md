# Sources: Battery and memory (fact-checked 2026-10-12)

- Android vitals excessive partial wake locks: 2 h+ per 24 h in background, bad behaviour over 5% of sessions; core vital Nov 2025; enforcement 1 Mar 2026 (listing warning, discovery exclusion).
- Doze (Android 6) and standby buckets (Android 9).
- Android memory management: kswapd, zRAM, lmkd kill order by oom_adj_score; onTrimMemory.
- iOS: memory warnings and jetsam; ~5 s after entering background; beginBackgroundTask.
- Play memory core vitals from Feb 2027 (announced 26 Aug 2026); Android 17 memory limits.

Battery percentages, wake-lock hours and memory sizes in the simulation are illustrative. Notes: scratchpad `sd/mobile/m16-facts.md`.
