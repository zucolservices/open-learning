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
} satisfies Record<string, GlossaryEntry>;
