# DNS and traffic routing (Cloud Architecture, module 8)

1. **The enquiry counter** (analogy): a counter writes the nearest open branch on a slip "valid for one hour"; a closed branch still gets visitors with old slips. DNS + TTL.
2. **Send users to a region** ⭐ (simulation): Delhi, Chennai, Singapore × Mumbai, Hyderabad, Singapore; policies simple / latency / failover / weighted; take Mumbai down. Simple keeps failing; the others move. Why geolocation can't split Delhi from Chennai; Traffic Manager geographic doesn't fail over.
3. **How long does failover take?** ⭐ (simulation): sliders for check interval, failures, TTL; presets Route 53 defaults (2.5 min), fast checks (1.5 min), Traffic Manager defaults (2.5 min). Detect + caches-expire bar. Global L7 load balancers as the faster alternative.
4. **Private names and the edge** (explore): private zones, split horizon, hybrid resolvers, CDN edges in India; DNS prices.
5. **Which routing policy?** (sort checkpoint): latency / failover / weighted / geolocation.
6. **Wrap**.
