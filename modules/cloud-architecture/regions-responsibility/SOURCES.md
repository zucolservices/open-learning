# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m02-facts.md`.

- AWS Regions and Availability Zones: "one or more discrete data centers with redundant power, networking, and connectivity"; zones "within 100 km (60 miles)" of each other; Local Zones as single-site extensions; zone IDs.
- Google Cloud geography and regions: "Zones should be considered a single failure domain within a region"; some regions' three zones share one or two data centres.
- Microsoft Azure: an availability zone is "a logical grouping of one or more physically separate datacenters within a region"; 17 of 57 public regions without zones (incl. South India, West India); India South Central (Hyderabad) live 6 Aug 2026 with three zones.
- India (Oct 2026): AWS ap-south-1 (Mumbai) and ap-south-2 (Hyderabad), 3 AZs each, Local Zones in Delhi and Kolkata; Google asia-south1 (Mumbai) and asia-south2 (Delhi), 3 zones each; Azure Central India (Pune) and India South Central (Hyderabad) with zones.
- Incident reports: AWS Tokyo apne1-az4 cooling (23 Aug 2019); Azure Australia East (30 Aug 2023); Google europe-west9 Paris water leak and fire (25 Apr 2023); AWS us-east-1 DynamoDB DNS (19–20 Oct 2025, PDT).
- SLAs: Amazon EC2 (instance 99.5%, region multi-AZ 99.99%); Google Compute Engine (single instance 99.9%, multi-zone 99.99%); Azure VMs (zones 99.99%, availability set 99.95%, single VM 99.9% with Premium SSD/Ultra Disk). SLAs provide service credits only.
- Shared responsibility: AWS (security "of" vs "in" the cloud; customer patches the guest OS); Microsoft shared responsibility in the cloud (data, endpoints, accounts, access management always retained; configurations and settings); Google "shared fate" (Venables & Potti, 3 Mar 2021).
- Global control planes: AWS IAM control plane in us-east-1; Azure Front Door and Entra ID; Google global resources.
