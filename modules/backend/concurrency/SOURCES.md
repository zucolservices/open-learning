# Sources: Handling many requests (fact-checked 2026-10-12)

- Node.js docs "Don't block the event loop" and libuv thread pool (default 4). Python PEP 703 / PEP 779 (free-threaded officially supported, optional in 3.14; still optional in 3.15).
- Go runtime (2 KB minimum stack; adaptive initial size since 1.19); Go 1.25 container-aware GOMAXPROCS.
- JEP 444 (virtual threads, JDK 21); JEP 491 (no pinning in synchronized, JDK 24). Spring Boot Tomcat 200 threads default. Microsoft ASP.NET Core best practices (thread-pool starvation).

The simulation is simplified and illustrative. Notes: scratchpad `sd/backend/m03-facts.md`.
