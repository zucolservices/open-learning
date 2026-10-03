# Sources: Pagination, filtering and sorting (fact-checked 2026-10-03)

- PostgreSQL docs, LIMIT and OFFSET (v18 §7.6): "The rows skipped by an OFFSET clause still have to be computed inside the server; therefore a large OFFSET might be inefficient." https://www.postgresql.org/docs/current/queries-limit.html
- Markus Winand, Use The Index, Luke: "seek method or keyset pagination": https://use-the-index-luke.com/no-offset
- Michael Hahn, "Evolving API Pagination at Slack" (15 Aug 2017): https://slack.engineering/evolving-api-pagination-at-slack/
- Stripe pagination (starting_after / ending_before, limit 1–100 default 10, has_more): https://docs.stripe.com/api/pagination
- GitHub REST pagination (Link header): https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api ; RFC 8288 Web Linking.
- Google AIP-158 (opaque tokens; paginate "at the outset"), AIP-160 filtering, AIP-132 order_by: https://google.aip.dev/158

The order list, changes and row counts are illustrative.
