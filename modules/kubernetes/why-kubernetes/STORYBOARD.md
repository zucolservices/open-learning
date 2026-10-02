# Why Kubernetes (Kubernetes, module 1)

1. **Twenty servers** (scroll story, persistent scene): release by hand (two servers crash on an old library) → containers (same image everywhere) → 2:07 a.m. server dies, traffic triples → desired state: 30 copies kept on 19 servers → history (Borg/Omega, 2014, 1.0, CNCF, v1.37, 82% of container users).
2. **Who does the work?** ⭐ (simulation): ship v2, a server dies, traffic triples, v2 has a bug; by-hand steps vs what you and the cluster do.
3. **What it is, and isn't** (explore): kubernetes.io definition; does / doesn't lists.
4. **Worth it?** (sort checkpoint): Kubernetes vs a simpler container service.
5. **Wrap**.
