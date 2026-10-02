# Access control and service accounts (Kubernetes, module 17)

1. **A badge, and the doors it opens** (analogy): authentication vs authorisation.
2. **The breach** ⭐ (fix the problem): attacker inside image-resizer using media/resizer's token; choose cluster-admin, edit, secrets role, least-privilege role or no token; five kubectl auth can-i checks (one app need, four attacker moves); Tesla 2018 as a real echo.
3. **The building blocks** (explore): roles, bindings, additive permissions, service account tokens, dangerous verbs, cloud workload identity.
4. **Safe or dangerous?** (sort checkpoint).
5. **Wrap**.
