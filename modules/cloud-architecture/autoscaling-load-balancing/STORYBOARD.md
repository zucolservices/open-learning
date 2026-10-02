# Autoscaling and load balancers: storyboard

1. **Opening more counters** (analogy): railway booking counters; a manager opens counters (autoscaling), a supervisor at the door routes people (load balancer).
2. **Tune the scaling group** ⭐ (simulation, illustrative, `sim.ts`): a minute-by-minute day (working day, or with an evening news spike); target-tracking scaling with sliders for target CPU, launch-to-serving time (typical 3–6 min; no official figure), minimum servers, and scheduled scaling 08:30–18:00; chart of traffic, serving capacity, servers paid for, overloaded minutes; outputs overload minutes and server-hours. Gentle scale-in (one server per 5 minutes).
3. **When a server gets sick** ⭐ (simulation): four servers, break one; AWS ALB defaults (30 s interval, out after 2, back after 5 → ~60 s out, ~2.5 min back) vs Google (5 s, 2/2 → ~10 s); failed requests at 100 req/s; grace periods (300 s console, 0 from code); ALB fails open.
4. **Layer 4 or layer 7** (explore): what each can do; product names per cloud; open source; retired/legacy products; idle ALB ≈ $16/month.
5. **Which load balancer?** (sort checkpoint).
6. **What to remember**.
