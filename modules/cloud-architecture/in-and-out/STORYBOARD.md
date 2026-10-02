# Getting in and out: storyboard

1. **The reception desk** (analogy): calling out through a switchboard, no calling in, a private corridor, postage for parcels that leave.
2. **Trace a packet** ⭐ (step-through, 6 frames, RFC 5737 example addresses): private server → NAT gateway rewrites the source and records it → internet gateway swaps to the Elastic IP (AWS) → reply → NAT delivers to the right server → an unsolicited packet is dropped. Narration: NAT on each cloud; load balancer inbound pattern; admin access without public IPs.
3. **The storage bill** ⭐ (simulation, AWS list prices 2 Oct 2026, `prices.ts`): GB/month to object storage (100 GB–50 TB), Mumbai or US East; monthly cost through 2 NAT gateways vs a free gateway endpoint vs an interface endpoint (2 AZs); INR at ₹96.
4. **What leaving costs** (explore): internet egress per provider; inter-zone charges; exit waivers; EU Data Act.
5. **Fix the bill** (choice checkpoint): NAT data-processing shock from S3 → gateway endpoint.
6. **What to remember**.
