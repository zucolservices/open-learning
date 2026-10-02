# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m12-facts.md` (raw pages in `obs/m11/`).

- Brendan Gregg, "Flame Graphs" (brendangregg.com; released December 2011): the x-axis is alphabetical, "not the passage of time"; width shows how often a function was present in the stacks.
- Ren et al., "Google-Wide Profiling: A Continuous Profiling Infrastructure for Data Centers", IEEE Micro 30(4), 2010: sampling in two dimensions; overhead "less than 0.01 percent"; zlib "nearly 5 percent of all CPU cycles".
- Go runtime/pprof: CPU profiling at a fixed 100 Hz; profile types (CPU, heap, allocs, mutex, block, goroutine, threadcreate).
- Overhead claims: OpenTelemetry eBPF profiler about 1% CPU at most in its tests; Pyroscope docs estimate around 2–5%.
- Tools: Grafana Pyroscope (acquired March 2023), Parca (Polar Signals, eBPF), Google Cloud Profiler, Datadog Continuous Profiler, Amazon CodeGuru Profiler, Elastic eBPF profiler donated to OpenTelemetry (accepted 7 Jun 2024). OpenTelemetry profiles public alpha 26 Mar 2026.
- The receipt service and its profile are illustrative.
