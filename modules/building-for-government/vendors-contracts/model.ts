/** Six clauses in a draft contract for a made-up state portal, as drafted and as fixed. */

export interface Clause {
  id: string;
  title: string;
  draft: string;
  fixed: string;
  why: string;
}

export const CLAUSES: Clause[] = [
  {
    id: "ipr",
    title: "Ownership of the code",
    draft:
      "All software developed remains the Vendor's property. The Department receives a licence for the term of the contract.",
    fixed:
      "Intellectual property in all custom-built code lies with the Department. Source code and documentation are delivered with every release.",
    why: "MeitY's model contract puts custom code with the government; otherwise the system leaves with the vendor.",
  },
  {
    id: "sla",
    title: "Service levels",
    draft: "The Vendor will make best efforts to keep the portal available.",
    fixed:
      "Monthly availability of at least 99.5%, measured independently. Missed targets earn service credits, capped at about 10% of monthly fees.",
    why: "“Best efforts” can't be measured or enforced. Service credits make targets real.",
  },
  {
    id: "pay",
    title: "Payment",
    draft: "50% of the contract value is payable on signing.",
    fixed:
      "Payments follow accepted milestones. Deliverables not reviewed within 15 days are deemed accepted.",
    why: "Pay for working software, while protecting the vendor from a department that never reviews.",
  },
  {
    id: "data",
    title: "Citizens' data",
    draft: "The Vendor may use portal data to improve its products and services.",
    fixed:
      "All data belongs to the Department, is used only for this contract, is hosted in India, and is returned and deleted at the end.",
    why: "Citizens' data isn't the vendor's to reuse, and data protection law applies.",
  },
  {
    id: "change",
    title: "Changes",
    draft: "Any change to scope is billed at the Vendor's prevailing rates.",
    fixed:
      "Changes are priced from rates fixed in this contract. Changes above 10% of the contract value need further approval.",
    why: "Open-ended rates make every change a negotiation the department can't win.",
  },
  {
    id: "exit",
    title: "Exit",
    draft: "(No exit clause.)",
    fixed:
      "An exit schedule: handover of data, code, documents and knowledge to the Department or a new vendor, with cooperation during the exit period.",
    why: "Without one, changing vendor means starting again.",
  },
];
