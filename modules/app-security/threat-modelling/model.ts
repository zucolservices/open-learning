/** A food-delivery app's data flow diagram, and the STRIDE threats at each element. */

export type Letter = "S" | "T" | "R" | "I" | "D" | "E";

export const STRIDE: { id: Letter; name: string; breaks: string; eg: string }[] = [
  {
    id: "S",
    name: "Spoofing",
    breaks: "authentication",
    eg: "Logging in as someone else with a stolen password.",
  },
  {
    id: "T",
    name: "Tampering",
    breaks: "integrity",
    eg: "Changing the price field in an order request.",
  },
  {
    id: "R",
    name: "Repudiation",
    breaks: "non-repudiation",
    eg: "A restaurant denying it marked an order ready, with no log to check.",
  },
  {
    id: "I",
    name: "Information disclosure",
    breaks: "confidentiality",
    eg: "Another customer's address showing up in an API response.",
  },
  {
    id: "D",
    name: "Denial of service",
    breaks: "availability",
    eg: "A flood of fake orders that stops real ones going through.",
  },
  {
    id: "E",
    name: "Elevation of privilege",
    breaks: "authorisation",
    eg: "A customer reaching the restaurant admin screens.",
  },
];

export interface Threat {
  letter: Letter;
  text: string;
  fix: string;
}

export interface Element {
  id: string;
  name: string;
  kind: "flow" | "process" | "store";
  crosses: boolean; // crosses a trust boundary
  threats: Threat[];
}

export const ELEMENTS: Element[] = [
  {
    id: "order",
    name: "Customer → web app: order and payment",
    kind: "flow",
    crosses: true,
    threats: [
      {
        letter: "S",
        text: "Someone logs in as a customer with a leaked password.",
        fix: "MFA or passkeys; breached-password checks.",
      },
      {
        letter: "T",
        text: "The request is edited to pay ₹1 for a ₹600 meal.",
        fix: "Work out prices on the server, never trust the client's total.",
      },
      {
        letter: "I",
        text: "Card details read on café Wi-Fi.",
        fix: "TLS everywhere; card details go straight to the payment provider.",
      },
    ],
  },
  {
    id: "ready",
    name: "Restaurant app → web app: “order ready”",
    kind: "flow",
    crosses: true,
    threats: [
      {
        letter: "S",
        text: "A fake restaurant app marks orders ready.",
        fix: "Authenticate each restaurant device.",
      },
      {
        letter: "R",
        text: "A restaurant says it never cancelled an order.",
        fix: "Log who did what and when, tamper-evidently.",
      },
    ],
  },
  {
    id: "web",
    name: "Web app",
    kind: "process",
    crosses: false,
    threats: [
      {
        letter: "E",
        text: "A customer opens /admin and changes menus.",
        fix: "Check permissions on the server for every request.",
      },
      {
        letter: "D",
        text: "A bot floods the checkout with fake orders.",
        fix: "Rate limits and bot protection at the edge.",
      },
    ],
  },
  {
    id: "db",
    name: "Orders database",
    kind: "store",
    crosses: false,
    threats: [
      {
        letter: "I",
        text: "A backup copy is left readable on the internet.",
        fix: "Encrypt at rest; block public access; least privilege.",
      },
      {
        letter: "T",
        text: "A support tool can quietly rewrite order history.",
        fix: "Separate write access; keep an audit log.",
      },
    ],
  },
  {
    id: "pay",
    name: "Web app → payment provider",
    kind: "flow",
    crosses: true,
    threats: [
      {
        letter: "S",
        text: "A fake “payment succeeded” callback is sent to the app.",
        fix: "Verify the provider's signature on every callback.",
      },
      {
        letter: "I",
        text: "The payment API key leaks from the code repository.",
        fix: "Keep keys in a secrets manager; rotate them.",
      },
    ],
  },
];

export const TOTAL = ELEMENTS.reduce((n, e) => n + e.threats.length, 0);

export const RESPONSES = ["Mitigate", "Eliminate", "Transfer", "Accept"] as const;
export type Response = (typeof RESPONSES)[number];

export const DECISIONS: {
  id: string;
  threat: string;
  best: Response[];
  why: Record<Response, string>;
}[] = [
  {
    id: "card",
    threat: "Card numbers could leak from our database.",
    best: ["Eliminate", "Transfer"],
    why: {
      Mitigate: "Encrypting helps, but you still hold the cards and the audit burden.",
      Eliminate:
        "Don't store cards at all: the provider tokenises them, so there's nothing to steal.",
      Transfer: "A certified payment provider holds the cards and the responsibility.",
      Accept: "Leaked card numbers are serious; accepting this isn't defensible.",
    },
  },
  {
    id: "flood",
    threat: "A bot could flood checkout with fake orders.",
    best: ["Mitigate"],
    why: {
      Mitigate: "Rate limits and bot checks reduce it to a nuisance.",
      Eliminate: "You can't remove checkout, so you can't eliminate the threat.",
      Transfer: "An edge provider can absorb floods, but you still need limits in the app.",
      Accept: "Lost orders cost money every minute; most teams would act.",
    },
  },
  {
    id: "theme",
    threat: "Someone could change their own colour theme preference by editing a request.",
    best: ["Accept"],
    why: {
      Mitigate: "Possible, but effort spent here is effort not spent on real risks.",
      Eliminate: "Overkill for a harmless setting.",
      Transfer: "Nobody to transfer it to, and no need.",
      Accept: "It only affects their own screen: write it down and move on.",
    },
  },
];
