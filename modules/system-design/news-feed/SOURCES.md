# Sources (fact-checked 2026-09)

- R. Krikorian, "Timelines at Scale" (QCon SF 2012; InfoQ 2013): 150M active users, 300K timeline reads/s, ~5K tweets/s average (7K daily peak, 12K+ during big events); home timelines in Redis capped at 800 entries, replicated 3×; large-account fan-out could take minutes, and merging big accounts at read time was the planned direction.
- Facebook Engineering, "Serving Facebook Multifeed" (2015): feed assembled at read time from aggregator and leaf servers. Meta Transparency Center: feed ranking uses thousands of signals.
- Slack Engineering, "Evolving API Pagination at Slack" (2017): from page numbers (offset) to cursor-based pagination.
- Model capacities (fan-out 2.5M inserts/s, 200 follows per user, celebrity follower buckets) are illustrative.
