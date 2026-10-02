# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m06-facts.md`.

- AWS NAT gateways: blocks unsolicited inbound; NAT gateway replaces the source with its private IP, then the internet gateway with the Elastic IP; zonal and regional NAT gateways; 55,000 simultaneous connections per IP per unique destination. "If most traffic through your NAT gateway is to AWS services that support interface endpoints or gateway endpoints, consider creating an interface endpoint or gateway endpoint for these services."
- Azure NAT Gateway (Standard zonal; StandardV2 zone-redundant, recommended). Google Cloud NAT: "software-defined … not based on proxy VMs", configured on Cloud Router.
- Prices (list, 2 Oct 2026): AWS NAT gateway $0.045/h + $0.045/GB (us-east-1), $0.056 + $0.056 (Mumbai); Azure NAT $0.045/h + $0.045/GB; Google Cloud NAT $0.0014 per VM-hour (up to 32 VMs) + $0.045/GiB. AWS gateway endpoints free; interface endpoints $0.01/AZ-hour ($0.013 Mumbai) + $0.01/GB; Azure private endpoints $0.01/h + $0.01/GB; Google Private Service Connect $0.01/h.
- Egress: AWS 100 GB/month free (since Dec 2021), then $0.09/GB (us-east-1), $0.1093 (Mumbai), cross-AZ $0.01/GB each way; Azure 100 GB free, $0.087/GB (NA/EU) or $0.12 (Asia) on the Microsoft network, no inter-zone charge; Google Premium $0.12/GiB, Standard $0.085/GiB after 200 GiB (US).
- Exit waivers: Google (12 Jan 2024), AWS (5 Mar 2024; 90 days since Sept 2025), Azure (Mar 2024; 60 days). EU Data Act applies from 12 Sept 2025; switching charges zero from 12 Jan 2027.
- Admin access without public IPs: AWS Systems Manager Session Manager, Azure Bastion, Google IAP TCP forwarding.
