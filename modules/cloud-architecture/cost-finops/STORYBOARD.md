# Cost and FinOps (Cloud Architecture, module 18)

1. **Meter, pass or standby** (analogy): taxi meter, monthly train pass, standby seat → on-demand, commitment, spot. Flexera 2026: 29% waste.
2. **Price the workload** ⭐ (simulation, m7g.large Mumbai prices): always-on web, office-hours extra, nightly batch × on-demand / 1-yr / 3-yr / spot; commitments bill all 730 hours; spot warnings.
3. **Find the waste** ⭐ (simulation): an eight-line bill; click lines to reveal fixes and savings (dev servers, orphaned disks, old snapshots, idle ALB, unused IPv4, NAT to S3); egress is real usage.
4. **Who spent it?** (simulation): showback bars with a quarter untagged; enforce tags → every dollar owned. Showback vs chargeback, FinOps phases, budgets, FOCUS.
5. **How would you buy it?** (sort checkpoint).
6. **Wrap** (AWS India invoices in ₹ plus 18% GST).
