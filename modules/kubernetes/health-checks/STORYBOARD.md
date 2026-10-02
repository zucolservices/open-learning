# Health checks (Kubernetes, module 6)

1. **Alive, ready, still training** (analogy): liveness (collapsed shopkeeper → replace), readiness (closed sign while restocking), startup (new hire's first morning).
2. **Fix the restart loop** ⭐ (fix the problem): an app that needs 60 s to start, database down 150–190 s; choose liveness (none/app/app+db), readiness (none/app/app+db), startup probe; timeline of container state and traffic; restarts, error seconds, served seconds.
3. **Writing a probe** (explore): YAML with startup/liveness/readiness and a preStop sleep; four mechanisms; defaults.
4. **Which probe?** (sort checkpoint).
5. **Wrap**.
