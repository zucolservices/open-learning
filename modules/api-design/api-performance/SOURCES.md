# Sources: Caching and performance (fact-checked 2026-10-04)

- RFC 9111 HTTP Caching (June 2022): max-age, no-cache, no-store ("not a reliable or sufficient mechanism for ensuring privacy"), private, public, s-maxage.
- RFC 9110: ETag ("an opaque validator"), If-None-Match → 304 (no content), If-Match → 412 MAY ("the lost update problem"), Vary ("expands the cache key").
- RFC 5861 stale-while-revalidate and stale-if-error (May 2010).
- Content codings: gzip RFC 1952, br RFC 7932, zstd RFC 8878 (window limits RFC 9659).
- GitHub docs: "Making a conditional request does not count against your primary rate limit if a 304 response is returned and the request was made while correctly authorized with an Authorization header."
- Google AIP-157 partial responses (fields parameter).
- Microsoft Graph JSON batching (up to 20 requests).
- Amazon CloudFront docs: "This reduces the load on your origin server and reduces latency."

Sizes and timings in the simulation are illustrative.
