import type { GlossaryEntry } from "./types";

/** Cloud Architecture track glossary. `module` slugs refer to this track. */
export const cloudArchitecture = {
  "cloud-computing": {
    term: "Cloud computing",
    definition:
      "Renting computing resources (servers, storage, networks, software) from a provider's shared data centres over the network, getting and releasing them on demand and paying for what you use. NIST's 2011 definition names five traits: on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service.",
    module: "what-is-cloud",
  },
  "on-premises": {
    term: "On premises",
    definition:
      "Running your own servers in your own building (or racks you control), buying the hardware up front and looking after power, cooling, repairs and security yourself.",
    module: "what-is-cloud",
  },
  iaas: {
    term: "IaaS (infrastructure as a service)",
    definition:
      "Renting virtual machines, storage and networks. The provider runs the hardware; you manage the operating system and everything above it. Examples: Amazon EC2, Azure Virtual Machines, Google Compute Engine.",
    module: "what-is-cloud",
  },
  paas: {
    term: "PaaS (platform as a service)",
    definition:
      "A platform that runs your application code for you, handling servers and scaling. Examples: AWS Elastic Beanstalk, Azure App Service, Google Cloud Run.",
    module: "what-is-cloud",
  },
  saas: {
    term: "SaaS (software as a service)",
    definition:
      "A finished application you use over the internet, run entirely by its vendor, such as Microsoft 365, Google Workspace or Salesforce. Your data and who can access it remain your responsibility.",
    module: "what-is-cloud",
  },
  elasticity: {
    term: "Elasticity",
    definition:
      "Being able to add and remove capacity quickly, often automatically, so what you have follows what you need.",
    module: "what-is-cloud",
  },
  "pay-as-you-go": {
    term: "Pay-as-you-go",
    definition:
      "Paying only for the resources you actually use, metered by the second, minute, gigabyte or request, instead of buying capacity up front.",
    module: "what-is-cloud",
  },
  region: {
    term: "Region",
    definition:
      "A cloud provider's cluster of data centres in one metro area, usually split into three or more availability zones. Regions are far apart, and you choose which ones your resources live in.",
    module: "regions-responsibility",
  },
  "availability-zone": {
    term: "Availability zone",
    definition:
      "One or more data centres within a region with their own power, cooling and network, built to fail independently of the region's other zones. Spreading an application across zones protects it from a building or zone failure.",
    module: "regions-responsibility",
  },
  sla: {
    term: "SLA (service level agreement)",
    definition:
      "A provider's published promise of availability, such as 99.99% a month, with service credits (a partial refund) if it is missed. It is a refund promise, not a guarantee of uptime.",
    module: "regions-responsibility",
  },
  "shared-responsibility": {
    term: "Shared responsibility model",
    definition:
      "The split of security duties between a cloud provider and its customer. The provider secures the buildings, hardware and its own services; the customer always secures its data, accounts, access and configuration, and more besides with IaaS.",
    module: "regions-responsibility",
  },
  "virtual-machine": {
    term: "Virtual machine (VM)",
    definition:
      "A whole computer created in software on a physical server by a hypervisor, with its own operating system. In the cloud you rent VMs by the second or minute and patch their operating systems yourself.",
    module: "vms-containers-functions",
  },
  container: {
    term: "Container",
    definition:
      "An application packed with its libraries into an image that runs isolated on a host while sharing the host's operating system kernel. Lighter and quicker to start than a virtual machine.",
    module: "vms-containers-functions",
  },
  "serverless-function": {
    term: "Function (serverless)",
    definition:
      "A small piece of code the provider runs only when an event arrives (a request, an upload, a timer), billed per millisecond of running time, with no servers for you to manage. Examples: AWS Lambda, Azure Functions, Google Cloud Run functions.",
    module: "vms-containers-functions",
  },
  "cold-start": {
    term: "Cold start",
    definition:
      "The extra wait when a function or scale-to-zero container has no ready copy and the provider must start one. AWS says cold starts usually affect under 1% of Lambda calls and last from under 100 ms to over a second.",
    module: "vms-containers-functions",
  },
  "scaling-group": {
    term: "Scaling group",
    definition:
      "A set of identical servers that the cloud keeps between a minimum and a maximum size, adding or removing servers by rules such as a target CPU level. AWS calls it an Auto Scaling group, Azure a virtual machine scale set, Google a managed instance group.",
    module: "autoscaling-load-balancing",
  },
  vpc: {
    term: "VPC / VNet (virtual private network in the cloud)",
    definition:
      "Your own private network inside a cloud provider, with an address range you choose, divided into subnets. AWS and Google call it a VPC (virtual private cloud); Azure calls it a virtual network (VNet).",
    module: "private-networks",
  },
  cidr: {
    term: "CIDR notation",
    definition:
      "A way to write an address range as a starting address and a prefix length, such as 10.0.0.0/16. The prefix says how many leading bits are fixed: a /24 holds 256 addresses, a /16 holds 65,536.",
    module: "private-networks",
  },
  subnet: {
    term: "Subnet",
    definition:
      "A slice of a network's address range where servers are placed. On AWS each subnet sits in one availability zone; on Azure and Google a subnet spans the zones of its region.",
    module: "private-networks",
  },
  "route-table": {
    term: "Route table",
    definition:
      "A list of rules saying where traffic for each destination range should go, such as 'everything else (0.0.0.0/0) to the internet gateway'. The most specific matching route wins.",
    module: "private-networks",
  },
  "internet-gateway": {
    term: "Internet gateway",
    definition:
      "The connection between a cloud network and the internet. On AWS, a subnet whose route table sends traffic directly to an internet gateway is a public subnet.",
    module: "private-networks",
  },
  "stateful-firewall": {
    term: "Stateful firewall",
    definition:
      "A firewall that remembers connections, so the reply to an allowed request is let back in automatically. Security groups, Azure NSGs and Google's firewall rules are stateful; AWS network ACLs are not.",
    module: "private-networks",
  },
  nat: {
    term: "NAT (network address translation)",
    definition:
      "Rewriting a private address to a public one on the way out and back again for the reply, using a table of connections. It lets private servers reach the internet without being reachable from it. Clouds offer it as a managed NAT gateway.",
    module: "in-and-out",
  },
  "private-endpoint": {
    term: "Private endpoint",
    definition:
      "A private connection from your network to a cloud service (such as object storage) that doesn't go through the internet gateway or NAT. AWS has gateway and interface endpoints, Azure private endpoints, Google Private Service Connect.",
    module: "in-and-out",
  },
  egress: {
    term: "Egress",
    definition:
      "Data leaving a cloud provider's network, usually to the internet, which is charged per gigabyte. Data coming in (ingress) is free.",
    module: "in-and-out",
  },
  peering: {
    term: "Network peering",
    definition:
      "A direct private link between two cloud networks so their servers can talk using private addresses. It isn't transitive: if A peers with B and B with C, A still can't reach C.",
    module: "connecting-networks",
  },
  "transit-hub": {
    term: "Transit hub",
    definition:
      "A central router that many networks and offices connect to, so each needs one link instead of one per pair; traffic between them passes through the hub. Examples: AWS Transit Gateway, Azure Virtual WAN, Google Network Connectivity Center.",
    module: "connecting-networks",
  },
  "site-to-site-vpn": {
    term: "Site-to-site VPN",
    definition:
      "An encrypted tunnel over the internet between an office or data centre and a cloud network. Quick and cheap to set up; AWS gives two tunnels per connection for redundancy.",
    module: "connecting-networks",
  },
  "dedicated-connection": {
    term: "Dedicated connection",
    definition:
      "A private line from your premises to a cloud provider through a colocation site, not over the internet: AWS Direct Connect, Azure ExpressRoute, Google Cloud Interconnect. Faster and steadier than a VPN, but not encrypted by default.",
    module: "connecting-networks",
  },
  dns: {
    term: "DNS",
    definition:
      "The Domain Name System: the internet's directory that turns names like example.com into IP addresses. Answers are cached for a set time (the TTL).",
    module: "dns-routing",
  },
  "routing-policy": {
    term: "DNS routing policy",
    definition:
      "A rule that makes DNS give different answers to different queries: by lowest latency, by country (geolocation), by weight (percentages), or to a standby when health checks fail (failover).",
    module: "dns-routing",
  },
  "private-dns-zone": {
    term: "Private DNS zone",
    definition:
      "A set of DNS names that only resolve from inside your own cloud networks, such as db.internal.example. Route 53 private hosted zones, Azure Private DNS, Google Cloud DNS private zones.",
    module: "dns-routing",
  },
  iam: {
    term: "IAM (identity and access management)",
    definition:
      "The cloud service that decides who may do what to which resource. Every API call is checked against it. AWS IAM, Azure role-based access control (with Microsoft Entra ID), Google Cloud IAM.",
    module: "iam",
  },
  "iam-policy": {
    term: "Access policy",
    definition:
      "A document listing permissions: which actions are allowed (or denied) on which resources, sometimes under conditions. In AWS it is JSON; Azure uses role definitions and assignments; Google uses allow and deny policies.",
    module: "iam",
  },
  principal: {
    term: "Principal",
    definition:
      "Whoever is making a request: a person, a group, or a program (a role, service account or managed identity).",
    module: "iam",
  },
  "iam-role": {
    term: "Role",
    definition:
      "A named set of permissions. In AWS, an identity that people or programs take on temporarily, getting short-lived credentials instead of permanent keys. In Azure and Google, a bundle of permissions you grant to principals.",
    module: "iam",
  },
  "explicit-deny": {
    term: "Explicit deny",
    definition:
      "A rule that says no to a request outright. In AWS and Google Cloud it overrides any allow; requests nothing allows are denied anyway (implicit deny).",
    module: "iam",
  },
  "permissions-boundary": {
    term: "Permissions boundary",
    definition:
      "An AWS limit on the most an identity can ever be allowed. It grants nothing itself; a request must be allowed by both the identity's policy and the boundary. Organisation policies (SCPs) work the same way across accounts.",
    module: "iam",
  },
  "access-key": {
    term: "Long-lived access key",
    definition:
      "A permanent credential (an ID and a secret, like a username and password for programs) that lets code call a cloud API. AWS long-term keys start with AKIA. It works until someone deactivates it, so a leaked one stays dangerous.",
    module: "workload-identity",
  },
  "short-lived-credentials": {
    term: "Short-lived credentials",
    definition:
      "Credentials issued on request that expire by themselves, typically after an hour: AWS role sessions (keys starting ASIA), Azure and Google access tokens. A stolen one soon becomes useless.",
    module: "workload-identity",
  },
  "workload-identity": {
    term: "Workload identity",
    definition:
      "An identity given to running code (a VM, pod, function or pipeline) rather than a person, from which the platform issues short-lived credentials: AWS roles, Azure managed identities, Google service accounts.",
    module: "workload-identity",
  },
  oidc: {
    term: "OpenID Connect (OIDC)",
    definition:
      "A standard (2014, built on OAuth 2.0) for one system to vouch for who someone or something is, with a signed token. Used for single sign-on and for CI pipelines proving their identity to clouds.",
    module: "workload-identity",
  },
  federation: {
    term: "Federation",
    definition:
      "Trusting another identity provider's word about who someone is, instead of keeping separate accounts and passwords: company sign-in for the cloud console, or GitHub's token for a pipeline. Standards: SAML 2.0 and OIDC.",
    module: "workload-identity",
  },
  "envelope-encryption": {
    term: "Envelope encryption",
    definition:
      "Encrypting data with its own data key, then encrypting (sealing) that data key with a master key kept in a key management service. The sealed data key is stored beside the data.",
    module: "encryption-secrets",
  },
  kms: {
    term: "Key management service (KMS)",
    definition:
      "A cloud service that creates and guards master keys in tamper-resistant hardware, uses them only after a permission check, and logs every use: AWS KMS, Azure Key Vault, Google Cloud KMS.",
    module: "encryption-secrets",
  },
  "key-rotation": {
    term: "Key rotation",
    definition:
      "Replacing a key's material with a new version for future encryption while keeping old versions, so existing data still decrypts. It doesn't re-encrypt old data.",
    module: "encryption-secrets",
  },
  tls: {
    term: "TLS",
    definition:
      "Transport Layer Security: the encryption behind https, protecting data while it moves between systems. Clouds now require version 1.2 or newer.",
    module: "encryption-secrets",
  },
  "secret-manager": {
    term: "Secret manager",
    definition:
      "A service that stores passwords, API keys and certificates encrypted, controls and logs who reads them, keeps versions and can rotate them: AWS Secrets Manager, Azure Key Vault, Google Secret Manager, HashiCorp Vault, OpenBao.",
    module: "encryption-secrets",
  },
  guardrail: {
    term: "Guardrail",
    definition:
      "An organisation-wide rule set above individual accounts or projects, such as \u201conly India regions\u201d or \u201cno public storage\u201d, that applies to everyone below, administrators included.",
    module: "guardrails",
  },
  "preventive-control": {
    term: "Preventive control",
    definition:
      "A guardrail that refuses a request so the bad thing never exists: AWS service control policies, Azure Policy Deny, Google organization policies.",
    module: "guardrails",
  },
  "detective-control": {
    term: "Detective control",
    definition:
      "A guardrail that finds and reports problems after they exist, including resources created before the rule: AWS Config rules, Azure Policy Audit, Google Security Command Center.",
    module: "guardrails",
  },
  "policy-as-code": {
    term: "Policy as code",
    definition:
      "Writing rules as text files kept in version control, reviewed, tested and checked automatically, for example in every pull request. Tools: Open Policy Agent, Kyverno, Checkov, Sentinel.",
    module: "guardrails",
  },
  "cloud-account": {
    term: "Account, subscription or project",
    definition:
      "The basic container for cloud resources and the main unit of isolation: its own access, resources, quotas and bill line. AWS calls it an account, Azure a subscription, Google a project.",
    module: "resource-hierarchy",
  },
  "resource-hierarchy": {
    term: "Resource hierarchy",
    definition:
      "The tree that groups accounts, subscriptions or projects under an organisation, through organizational units (AWS), management groups (Azure) or folders (Google). Policies and access attached high up flow down to everything below.",
    module: "resource-hierarchy",
  },
  "blast-radius": {
    term: "Blast radius",
    definition:
      "How much is affected when one thing goes wrong: a leaked password, a bad command, a broken deployment. Separate accounts and environments keep it small.",
    module: "resource-hierarchy",
  },
  "landing-zone": {
    term: "Landing zone",
    definition:
      "A ready-made cloud foundation every new team lands on: the account tree and guardrails, single sign-on, central logging, security tooling, a shared network and a way to create new accounts. Built from blueprints such as AWS Control Tower, Azure landing zones and Google's enterprise foundations.",
    module: "landing-zones",
  },
  "account-vending": {
    term: "Account vending",
    definition:
      "Creating new accounts, subscriptions or projects automatically from a request, with guardrails, logging, network, access and budget already applied: AWS Account Factory, Azure subscription vending, Google project factory.",
    module: "landing-zones",
  },
  "infrastructure-as-code": {
    term: "Infrastructure as code (IaC)",
    definition:
      "Describing infrastructure (networks, servers, permissions) in text files that a tool turns into real resources. The files are versioned, reviewed and re-runnable. Tools: Terraform, OpenTofu, CloudFormation, Bicep, Pulumi.",
    module: "infrastructure-as-code",
  },
  "iac-plan": {
    term: "Plan (preview)",
    definition:
      "The list of changes an IaC tool will make before it makes them: create (+), update in place (~), replace (-/+) or destroy (-). Terraform plan, CloudFormation change sets, Azure what-if.",
    module: "infrastructure-as-code",
  },
  declarative: {
    term: "Declarative",
    definition:
      "Describing the result you want rather than the steps to get there; the tool works out the steps. Running it again changes nothing if the result already exists (idempotent).",
    module: "infrastructure-as-code",
  },
  "iac-state": {
    term: "State file",
    definition:
      "An IaC tool's record of which real resources it manages and their last known settings, used to plan changes. Terraform's is stored in plain text, secrets included, so it must be kept shared, locked and protected.",
    module: "infrastructure-as-code",
  },
  drift: {
    term: "Drift",
    definition:
      "When real infrastructure no longer matches its code, usually because someone changed it by hand. Found by running a plan or a drift check.",
    module: "infrastructure-as-code",
  },
  "block-storage": {
    term: "Block storage",
    definition:
      "A virtual disk attached to a server, used for its operating system and databases. Fast, but tied to one zone and usually one server: AWS EBS, Azure managed disks, Google Persistent Disk and Hyperdisk.",
    module: "storage-databases",
  },
  "file-storage": {
    term: "File storage",
    definition:
      "A shared file system many servers or desktops can open at once, like a network drive: AWS EFS and FSx, Azure Files, Google Filestore.",
    module: "storage-databases",
  },
  "managed-database": {
    term: "Managed database",
    definition:
      "A database service where the cloud runs the servers, patching, backups and failover, and you handle tables, queries and access: Amazon RDS and Aurora, Azure SQL and Azure Database for PostgreSQL, Google Cloud SQL, AlloyDB and Spanner.",
    module: "storage-databases",
  },
  "high-availability": {
    term: "High availability",
    definition:
      "Designing a system to keep running through everyday failures (a server, a disk, a zone) by running copies in parallel, usually across availability zones. Measured in nines, such as 99.99%.",
    module: "ha-dr",
  },
  "chaos-engineering": {
    term: "Chaos engineering",
    definition:
      "Deliberately injecting failures (killing servers, adding latency, cutting a zone) in a controlled way to check a system copes. Netflix's Chaos Monkey (2010); AWS Fault Injection Service, Azure Chaos Studio.",
    module: "ha-dr",
  },
  "on-demand": {
    term: "On-demand pricing",
    definition:
      "Paying the list price per second or hour for exactly what runs, with no commitment. Flexible, and the most expensive per hour.",
    module: "cost-finops",
  },
  "commitment-discount": {
    term: "Commitment discount",
    definition:
      "A lower hourly rate in return for promising to spend a set amount for 1 or 3 years, billed whether you use it or not: AWS Savings Plans and Reserved Instances, Azure Reservations and savings plan, Google committed use discounts.",
    module: "cost-finops",
  },
  "spot-capacity": {
    term: "Spot capacity",
    definition:
      "The cloud's spare servers sold at a deep discount, which it can take back at short notice (2 minutes on AWS, 30 seconds on Azure and Google). Suits work that can restart.",
    module: "cost-finops",
  },
  finops: {
    term: "FinOps",
    definition:
      "A practice where engineering, finance and business share responsibility for technology spend, making costs visible to the teams that cause them. The FinOps Foundation describes three phases: Inform, Optimize, Operate.",
    module: "cost-finops",
  },
  "well-architected-review": {
    term: "Well-architected review",
    definition:
      "A structured, blame-free walk through a design against a cloud provider's framework of best practices, ending in a prioritised improvement plan. Free tools: AWS Well-Architected Tool, Azure Well-Architected Review, Google Cloud Well-Architected Framework.",
    module: "well-architected",
  },
  "wa-pillar": {
    term: "Pillar (well-architected)",
    definition:
      "One area of good practice in a well-architected framework: security, reliability, cost optimisation, operational excellence, performance and (on AWS and Google) sustainability.",
    module: "well-architected",
  },
  "high-risk-issue": {
    term: "High-risk issue",
    definition:
      "AWS's term for a finding in a review: an architectural or operational choice that might significantly harm the business. Medium-risk issues do so to a lesser extent. Fix high-risk issues first.",
    module: "well-architected",
  },
  "meity-empanelment": {
    term: "MeitY empanelment",
    definition:
      "Approval by India's Ministry of Electronics and IT for a cloud provider's specific offerings, deployment models and regions, after an STQC audit, so government bodies can buy them (through GeM). 26 providers were empanelled as of December 2025.",
    module: "cloud-india",
  },
} satisfies Record<string, GlossaryEntry>;
