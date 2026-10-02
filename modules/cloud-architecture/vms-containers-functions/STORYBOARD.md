# Virtual machines, containers and functions: storyboard

1. **Lease, car-share or taxi** (analogy): VM, container, function.
2. **Three ways to run an app** (explore): stack per model with you/provider layers, start-up (VM "a few minutes"; container "seconds"; function warm instant, cold start under 100 ms to over 1 s on under 1% of calls per AWS), notes (Firecracker for Lambda; 15-minute Lambda limit; you own container images) and service names across the three clouds; renames (Cloud Run functions 2024; App Runner closed to new customers April 2026).
3. **Same app, same traffic** ⭐ (simulation, real AWS list prices 2 Oct 2026, `prices.ts`): rare form (6,000 req/month), office-hours app (600,000), busy API (51.8M); one t4g.small (≈ $12.26), one Fargate task 0.25 vCPU/0.5 GB (≈ $9.01), Lambda 512 MB × 100 ms (≈ $0.01 / $0.62 / $53.57). Assumes one small server copes with all three; free tiers ignored.
4. **Which fits?** (sort checkpoint): six jobs.
5. **What to remember**.
