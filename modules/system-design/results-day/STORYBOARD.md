# Capstone: the results-day portal: storyboard

1. **The brief** (predict): a board's email; 8 lakh × 2 lookups × 60% in 10 min ≈ 1,600/s average.
2. **Make your design** ⭐ (branching decisions): how results are produced (DB / DB + cache / pre-built files), what sits in front (one server / LB + app servers / CDN + LB), readiness (autoscale / pre-scale at 09:45), SMS results.
3. **Replay results day** ⭐ (simulation, `model.ts`): 09:50–11:00 minute by minute, 100×+ surge at 10:00; demand vs answered chart with failure minutes; answered in the first 15 minutes, failure minutes, peak DB load, server-minutes; notes per decision. Challenge: 100% under 200 server-minutes.
4. **Why do files win?** (choice): precompute immutable results, serve from the CDN.
5. **What to remember** (debrief): multiple channels (websites, SMS, DigiLocker).
