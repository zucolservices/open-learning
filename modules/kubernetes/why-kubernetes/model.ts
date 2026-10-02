/** What each everyday event costs you, by hand and with a cluster (illustrative). */
export interface Happening {
  id: string;
  name: string;
  manual: string[];
  cluster: { you: string[]; it: string[] };
}

export const HAPPENINGS: Happening[] = [
  {
    id: "ship",
    name: "Ship version 2",
    manual: [
      "SSH into each of 20 servers in turn",
      "Copy the new build, restart the app",
      "Server 8 has an older library: the app crashes there",
      "Fix server 8 by hand, at 9 p.m.",
    ],
    cluster: {
      you: ["Change one line: image: payments-api:v2"],
      it: [
        "Starts new copies a few at a time",
        "Moves traffic only to copies that are ready",
        "Stops the old ones",
      ],
    },
  },
  {
    id: "dies",
    name: "A server dies at 2 a.m.",
    manual: [
      "The pager wakes you",
      "Work out what was running on it",
      "Pick other servers with room",
      "Start the missing copies there and update the load balancer",
    ],
    cluster: {
      you: ["Sleep"],
      it: [
        "Notices the node stopped reporting",
        "Replaces the missing copies on healthy nodes",
        "Traffic flows to the new copies",
      ],
    },
  },
  {
    id: "spike",
    name: "Traffic triples",
    manual: [
      "Notice the slowdown",
      "Rent more servers",
      "Install the app on each",
      "Add them to the load balancer",
      "Remember to remove them next week",
    ],
    cluster: {
      you: ["Set a rule once: keep CPU near 70%"],
      it: [
        "Adds copies as load rises",
        "Adds machines if copies no longer fit",
        "Removes both when traffic falls",
      ],
    },
  },
  {
    id: "rollback",
    name: "Version 2 has a bug",
    manual: ["Find the old build", "SSH into all 20 servers again", "Copy, restart, hope"],
    cluster: {
      you: ["Run one rollback command (or revert the line)"],
      it: ["Rolls back to the previous version the same careful way"],
    },
  },
];
