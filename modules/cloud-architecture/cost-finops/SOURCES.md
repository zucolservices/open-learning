# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m18-facts.md`.

- AWS Price List API, ap-south-1, 2 Oct 2026: m7g.large Linux on-demand $0.0583/h; Compute Savings Plan 1-yr no-upfront $0.0430, 3-yr $0.0293; EC2 Instance SP 1-yr $0.0385, 3-yr $0.0265; spot $0.0202 that day (Spot Advisor interruption band 15–20%). AWS "up to 72%" (Savings Plans), "up to 90%" (Spot); 2-minute spot warning. Azure Spot 30-second notice; Google Spot "up to 91%", optional 120-s notice; preemptible 24 h max. Google SUDs up to 30% (N1), CUDs up to 55%/70%, flexible 28%/46%. Azure Reservations up to 72%, savings plan up to 65%.
- Mumbai waste prices: internet egress $0.1093/GB (first 10 TB; 100 GB/month free across regions); gp2 $0.114/GB-month; snapshots $0.05, archive $0.0125; ALB $0.0239/h; public IPv4 $0.005/h; NAT $0.056/h + $0.056/GB.
- FinOps Foundation: phases Inform, Optimize, Operate; definition updated Mar 2026; FOCUS 1.0 (Jun 2024) … 1.4 (Jun 2026); AWS FOCUS 1.2 exports GA (Nov 2025). Flexera State of the Cloud 2026: 29% estimated waste. State of FinOps 2026: workload optimisation and waste reduction top priority.
- AWS cost allocation tags: up to 24 h to appear + 24 h to activate; backfill up to 12 months (Mar 2024). AWS Budgets alerts free; Cost Anomaly Detection free. Google budgets don't stop spend by default (spend-cap budgets in preview, 2026).
- Milkie Way (reported Dec 2020): ~$72K bill against a $7 budget, waived by Google. Pocwierz S3 unauthorized requests (Apr 2024) → AWS stopped charging for unauthorized 403s (announced 13 May 2024).
- India: Amazon Web Services India Private Limited invoices in INR; GST 18%.
- The three-part workload, the bill and the team split are illustrative; ₹ at 96 per USD.
