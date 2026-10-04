/** Four eras of enterprise integration, and one change traced through each (illustrative). */

export type Era = "p2p" | "esb" | "micro" | "today";

export const ERAS: { id: Era; title: string; when: string; text: string; logic: string }[] = [
  {
    id: "p2p",
    title: "Point to point",
    when: "1990s",
    text: "Every system wired directly to the ones it needs. Quick to start, a tangle by the twentieth connection.",
    logic: "Integration logic is scattered through every system.",
  },
  {
    id: "esb",
    title: "The enterprise service bus",
    when: "2000s",
    text: "One central product connects everything: routing, transformation, orchestration and business rules all live in the bus. Gartner named the category in 2002.",
    logic:
      "Integration logic, and often business logic, lives in the bus, owned by one central team.",
  },
  {
    id: "micro",
    title: "Smart endpoints, dumb pipes",
    when: "2010s",
    text: "Microservices pushed the logic back into services. The pipes (HTTP, a lightweight broker such as RabbitMQ) just move messages.",
    logic: "Logic lives in the services that own the domain.",
  },
  {
    id: "today",
    title: "A mix of layers",
    when: "today",
    text: "API gateways in front of systems, event brokers between them, integration platforms (iPaaS) for SaaS connections and workflows.",
    logic: "Domain logic in services; connectivity in shared platforms, run by platform teams.",
  },
];

/** The change: "When an order is placed, also award loyalty points." */
export const TRACE: Record<
  Era,
  { who: string[]; wait: string; note: string; tone: "good" | "bad" | "neutral" }
> = {
  p2p: {
    who: ["Orders team adds a call to Loyalty", "Loyalty team builds an endpoint for Orders"],
    wait: "2 teams",
    note: "Works, and adds another wire to the tangle.",
    tone: "neutral",
  },
  esb: {
    who: [
      "Raise a ticket with the integration team",
      "They change the order flow in the bus",
      "Regression-test every flow that shares it",
    ],
    wait: "the bus team's queue",
    note: "Every change in the company queues for the same small team.",
    tone: "bad",
  },
  micro: {
    who: ["Loyalty team subscribes to OrderPlaced", "Nobody else changes"],
    wait: "1 team",
    note: "The owner of the new behaviour does all the work.",
    tone: "good",
  },
  today: {
    who: [
      "Loyalty team subscribes to OrderPlaced on the event broker",
      "Platform team only grants access",
    ],
    wait: "1 team, plus a self-service request",
    note: "Shared platform for transport and governance; logic stays with the owner.",
    tone: "good",
  },
};
