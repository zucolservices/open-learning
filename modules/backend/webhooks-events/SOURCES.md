# Sources: Webhooks and events (fact-checked 2026-10-12)

- Standard Webhooks spec v1.0.0 (13 Dec 2023): headers, HMAC-SHA256 over id.timestamp.payload, Ed25519 option.
- Stripe webhook docs (Stripe-Signature; 5-minute tolerance; raw body; retries up to 3 days in live mode; no ordering guarantee). GitHub webhook docs (X-Hub-Signature-256; no automatic redelivery; 10 s).
- Chris Richardson, Transactional Outbox (microservices.io). CloudEvents (CNCF graduated 25 Jan 2024; spec 1.0.x).

Safety: attacks described in words only. The café and partner are made up. Notes: scratchpad `sd/backend/m15-facts.md`.
