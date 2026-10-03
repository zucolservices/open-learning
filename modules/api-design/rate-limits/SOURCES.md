# Sources: Rate limits and quotas (fact-checked 2026-10-04)

- RFC 6585 (April 2012) §4, 429 Too Many Requests; RFC 9110 §10.2.3 Retry-After.
- IETF draft-ietf-httpapi-ratelimit-headers-11 (23 May 2026; not an RFC): RateLimit and RateLimit-Policy fields.
- GitHub REST API rate limits (60/h unauthenticated, 5,000/h authenticated; x-ratelimit-* headers; 403 or 429; secondary limits): https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- Paul Tarjan, "Scaling your API with rate limiters", Stripe blog (30 Mar 2017).
- Amazon API Gateway throttling (token bucket; 10,000 RPS / 5,000 burst in most Regions).
- Kong engineering blog on rate-limiting algorithms (fixed-window boundary: "twice the rate of requests").
- Claude API rate limits (RPM, ITPM, OTPM; token bucket; 429 with retry-after): https://platform.claude.com/docs/en/api/rate-limits
- Google Cloud quotas (rate, allocation, concurrent).

Traffic patterns and limiter settings are illustrative.
