# Regions, zones and shared responsibility: storyboard

1. **Eggs and baskets** (analogy): nested boxes: data centre ⊂ availability zone ⊂ region ⊂ the world; a zone isn't always a separate building.
2. **Break the data centre** ⭐ (simulation): two regions × three zones × two buildings; three designs (one server; spread across zones; copy in a second region) × four states (fine, building, zone, region failure). Outcome per pair, a real incident per failure level (AWS Tokyo Aug 2019 cooling; Azure Australia East Aug 2023 zone power; AWS us-east-1 19–20 Oct 2025 DynamoDB DNS), and the providers' SLA promise per design (single VM 99.5–99.9%; across zones 99.99%; no multi-region compute SLA). Narration: Google Paris 2023 as a hidden single point.
3. **Where the cloud is in India** (explore): each provider's Indian regions and zones (Oct 2026), Azure regions without zones, AWS Local Zones; global control planes.
4. **Who secures what** (sort checkpoint): six IaaS jobs, provider vs you.
5. **What to remember**.

No model output; region data from providers' pages.
