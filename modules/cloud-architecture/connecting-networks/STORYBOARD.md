# Connecting networks: storyboard

1. **Bridges between islands** (analogy): A–B and B–C bridges don't connect A to C; peering is non-transitive (AWS quote).
2. **Every pair, or a hub?** ⭐ (build): 2–14 networks; full mesh vs hub drawn live; link count n(n−1)/2 vs n; per-network peering links (AWS 50 default) or AWS Transit Gateway attachment cost (US East $0.05/h, Mumbai $0.07/h, plus $0.02/GB).
3. **Reaching the office** ⭐ (simulation, AWS Mumbai list prices 2 Oct 2026): VPN vs dedicated line comparison table; monthly data slider (50 GB–10 TB); VPN $36.50 + $0.1093/GB out vs Direct Connect 1 Gbps $219 + $0.045/GB out; break-even ≈ 2.8 TB/month (colocation/telecom costs ignored). BGP; no overlapping ranges.
4. **Which connection?** (sort checkpoint, four categories).
5. **What to remember**.
