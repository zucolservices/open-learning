# Sources: Fetching data (fact-checked 2026-10-11)

- react.dev "You Might Not Need an Effect" (race conditions; frameworks provide better fetching), `use` and Suspense (cache promises; Suspense doesn't detect effect fetches).
- MDN AbortController (Baseline widely available). RFC 5861 (stale-while-revalidate).
- TanStack Query v5 important defaults (staleTime 0, refetch on focus, 3 retries, gcTime 5 min); SWR (Vercel).

Timings are illustrative. Notes: scratchpad `sd/frontend/m09-facts.md`.
