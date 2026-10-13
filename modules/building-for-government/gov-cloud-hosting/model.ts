/** Three made-up services and where each may be hosted under India's government cloud framework (2026). */

export const PLACES: [string, string][] = [
  ["abroad", "A commercial cloud region outside India"],
  ["empanelled", "A MeitY-empanelled commercial cloud in India"],
  ["govcloud", "NIC's MeghRaj cloud or a State Data Centre"],
  ["offcloud", "The department's own secured servers, off cloud"],
];

export interface Service {
  id: string;
  title: string;
  data: string;
  answer: string;
  feedback: Record<string, string>;
}

export const SERVICES: Service[] = [
  {
    id: "tourism",
    title: "A tourism information website",
    data: "Public pages, photos and event listings. Lower risk: Category B.",
    answer: "empanelled",
    feedback: {
      abroad:
        "Empanelled offerings must run from data centres in India; a region abroad isn't an option for government work.",
      empanelled:
        "Right. Category B workloads may use MeitY-empanelled clouds, bought through GeM.",
      govcloud:
        "Allowed, but not required. An empanelled commercial cloud is fine for public, lower-risk content.",
      offcloud:
        "Possible, but you'd lose the scale a tourism site needs during festivals, for no security gain.",
    },
  },
  {
    id: "health",
    title: "A state health records system",
    data: "Diagnoses and treatment of millions of people. Sensitive: Category A.",
    answer: "govcloud",
    feedback: {
      abroad: "Not allowed: sensitive government data stays in India.",
      empanelled:
        "Under the 2026 framework, Category A workloads go to government clouds, or to sovereign providers once MeitY names them (none had been named by October 2026).",
      govcloud:
        "Right. Category A belongs on government clouds such as NIC's MeghRaj or a State Data Centre.",
      offcloud:
        "Secure, but unnecessary. Category A may use government clouds, which are easier to run reliably.",
    },
  },
  {
    id: "intel",
    title: "A police intelligence database",
    data: "Material classified Secret.",
    answer: "offcloud",
    feedback: {
      abroad: "Never.",
      empanelled: "Top Secret and Secret material may not go on any cloud.",
      govcloud: "Even government clouds are ruled out for Secret material.",
      offcloud: "Right. Classified Secret and Top Secret workloads stay off cloud.",
    },
  },
];
