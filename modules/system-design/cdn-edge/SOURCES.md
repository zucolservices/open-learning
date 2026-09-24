# Sources: CDNs & the edge

Fact-checked 2026-09-24. Pages saved in the session scratchpad (`sd-stateless/`).

| Claim in the module                                                                                                  | Verdict            | Source                                                                     |
| -------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------- |
| Cache-Control max-age/s-maxage, private (RFC 9111); stale-while-revalidate is RFC 5861 (Informational)               | Verified           | rfc-editor.org/rfc/rfc9111 ; rfc-editor.org/rfc/rfc5861                    |
| CloudFront: 750+ PoPs in 100+ cities, 1,140+ embedded PoPs; first 1,000 invalidation paths/month free; Origin Shield | Verified (updated) | aws.amazon.com/cloudfront/features/ ; CloudFront invalidation pricing docs |
| Cloudflare: 330+ cities; anycast; Tiered Cache; Workers on V8 isolates                                               | Verified           | cloudflare.com/network/ ; Cloudflare docs                                  |
| Akamai: 4,300+ PoPs, ~700 cities, 130+ countries                                                                     | Verified           | Akamai 10-Q, Q2 2026                                                       |
| Fastly: fewer, larger PoPs; purges ~150 ms; Compute on WebAssembly/Wasmtime                                          | Verified           | fastly.com docs                                                            |
| Cloud CDN behind the global external Application LB; Media CDN for streaming                                         | Verified           | cloud.google.com/cdn ; cloud.google.com/media-cdn                          |
| Azure CDN Standard from Microsoft (classic) retires 30 Sep 2027; replacement Front Door                              | Verified           | learn.microsoft.com classic-cdn-retirement-faq                             |

## Decisions

- Round trips are estimated from great-circle distance (200 km/ms in fibre, 1.5× route factor, +2 ms), labelled in the UI.
- The hit-ratio model (Zipf popularity, TTL cache λT/(1+λT), optional shield) is illustrative; checked with tsx.
