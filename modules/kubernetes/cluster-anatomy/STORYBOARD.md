# The cluster, taken apart (Kubernetes, module 3)

1. **A restaurant kitchen** (analogy): front desk = API server, order book = etcd, head chef = scheduler, floor managers = controllers, station cooks = kubelets.
2. **Follow one kubectl apply** ⭐ (step-through, 9 frames): kubectl → authn/authz → admission → etcd (kubectl returns) → Deployment controller → ReplicaSet creates 3 unbound pods → scheduler binds → kubelet + runtime + CNI → status reported, kube-proxy rules. Every arrow touches the API server.
3. **Who does what** (explore): click any component for its job; managed services and add-ons.
4. **Which component?** (sort checkpoint).
5. **Wrap**.
