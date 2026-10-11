# Sources: Caching and the edge (fact-checked 2026-10-11)

- RFC 9111 (HTTP Caching, 2022): max-age, s-maxage, no-cache, no-store, private. RFC 5861 (stale-while-revalidate, 2010). RFC 8246 (immutable; not supported in Chrome per MDN BCD).
- MDN HTTP caching guide (hashed assets long max-age; HTML no-cache + ETag; 304 Not Modified).
- Vendor docs: Cloudflare (no HTML/JSON by default), CloudFront (min TTL > 0 caches no-store), Azure Front Door (won't cache private/no-cache/no-store), Google Cloud CDN (no stale-if-error). Next.js 16 proxy.ts on Node.js.

The café site is made up; outcomes simplified. Notes: scratchpad `sd/frontend/m14-facts.md`.
