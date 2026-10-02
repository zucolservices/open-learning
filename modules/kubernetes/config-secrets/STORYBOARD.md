# ConfigMaps and Secrets (Kubernetes, module 11)

1. **Same image, every environment** (analogy): one image, settings handed in per environment.
2. **Change a setting** (simulation): change a ConfigMap value; env var stays stale until restart, mounted file updates on the next kubelet sync.
3. **What a Secret really protects** ⭐ (fix the problem): decode base64; five people who could read the password (etcd backup, broad RBAC, pod creators, Git, crash logs); turn on five protections.
4. **Where does it go?** (sort checkpoint): ConfigMap, Secret or neither.
5. **Wrap**.
