# Network policies (Kubernetes, module 10)

1. **An office with no locks** (analogy): every door open vs keycards per room.
2. **Lock it down** ⭐ (fix the problem): frontend, api, db, a compromised debug pod and kube-dns; toggle eight policies (default denies, allows, a too-broad trap, DNS egress); seven connections with wanted outcome; explanations for blocked app traffic, missing DNS, leaks.
3. **Writing a policy** (explore): YAML; AND vs OR selectors; enforcement needs a CNI; limits; ClusterNetworkPolicy.
4. **Will it connect?** (sort checkpoint).
5. **Wrap**.
