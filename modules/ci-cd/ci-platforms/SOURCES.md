# Sources (fact-checked 2026-10-03, before building)

Full notes and raw pricing pages: scratchpad `cicd/m20-facts.md` and `cicd/m20/`. All prices are US list prices read on 3 October 2026 (`prices.ts`).

- GitHub Actions billing: included minutes 2,000 (Free), 3,000 (Pro, Team), 50,000 (Enterprise); standard runners Linux 2-core $0.006/min, Windows $0.010, macOS $0.062; self-hosted runners free (the $0.002/min self-hosted charge announced for 1 Mar 2026 was postponed).
- GitLab.com: compute minutes 400 / 10,000 / 50,000; cost factors (small 1, medium 2, large 3, macOS M1 6); extra minutes $10 per 1,000; Premium $29/user/month billed annually.
- CircleCI: 30,000 free credits; $15 per 25,000 credits; Linux medium 10 credits/min; macOS M4 Pro 200 credits/min.
- AWS CodeBuild general1.small $0.005/min, 100 free minutes; Google Cloud Build e2-standard-2 $0.006/min, 2,500 free; Azure Pipelines $40 per Microsoft-hosted parallel job, $15 per self-hosted, one free hosted job with 1,800 minutes.
- AWS EC2 on-demand, us-east-1: m7i.large $0.1008/hour.
- JetBrains State of Developer Ecosystem 2025 (organisations): GitHub Actions 33%, Jenkins 28%, GitLab CI 19%.
- Earthly: open-source tool no longer actively maintained; Earthly Cloud stopped 16 Jul 2025.
- The month's minutes, the 50% busy assumption for self-hosted machines and the team examples are illustrative.
