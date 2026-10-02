# StatefulSets, DaemonSets, Jobs and CronJobs (Kubernetes, module 7)

1. **Five kinds of staff** (analogy): temps (Deployment), named staff with lockers (StatefulSet), a guard per floor (DaemonSet), a contractor (Job), the night cleaner (CronJob).
2. **Watch each controller** ⭐ (animated infographic): Deployment replacement gets a random name; StatefulSet starts db-0→db-2 in order and db-1 returns to its disk; DaemonSet adds a pod to a new node; Job runs 5 completions two at a time; CronJob creates nightly Jobs, keeps 3.
3. **The fine print** (explore): key settings and the CronJob idempotency warning; databases need care.
4. **Which controller?** (sort checkpoint, five categories).
5. **Wrap**.
