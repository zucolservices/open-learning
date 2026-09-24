# Design a URL shortener: storyboard

1. **Short links, big numbers** ⭐ Cloakroom-ticket analogy. Choose new links/month, clicks per link, retention: writes/s, reads/s (avg, peak ≈ 2×), links stored, storage at 500 B each, base62 key length with 10× headroom.
2. **Pick a key scheme** ⭐ Hash / counter / random × key length 6–8 × links stored: key space, table fullness, chance the next key clashes, expected clashes, birthday-paradox chance; pros and cons.
3. **How many keys?** (predict): 62⁷ ≈ 3.5 trillion.
4. **Design it, then load-test it** ⭐ Store (one SQL database / distributed key-value store), cache (none / in-memory / CDN edge), analytics (synchronous DB write / stream). Load test at the step-1 peak: DB load bar, lookups and writes reaching the DB, p50/p99, notes. Capacities illustrative.
5. **301 or 302?** (choice): temporary redirects keep every click visible.
6. **What to remember**.
