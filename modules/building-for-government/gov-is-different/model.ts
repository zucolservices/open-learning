/** Made-up people applying for the same service, and the design choices that let each of them finish. */

export type Feature = "language" | "light" | "assisted" | "altid" | "status";

export const FEATURES: [Feature, string, string][] = [
  [
    "language",
    "Offer Hindi and the state's language, not just English",
    "Most people read a language other than English best.",
  ],
  [
    "light",
    "Make the pages light enough for a slow 2G connection",
    "Rural internet access is far lower than urban.",
  ],
  [
    "assisted",
    "Let a service-centre operator apply on someone's behalf",
    "Not everyone has a smartphone or the confidence to use one.",
  ],
  [
    "altid",
    "Accept other proof when the Aadhaar OTP can't reach the person",
    "Phone numbers change; some were never linked.",
  ],
  [
    "status",
    "Send status by SMS, with a reference number",
    "People need to know what happened without logging in.",
  ],
];

export interface Person {
  id: string;
  name: string;
  situation: string;
  needs: Feature[];
}

export const PEOPLE: Person[] = [
  {
    id: "student",
    name: "A graduate in a city",
    situation: "Smartphone, fast data, reads English.",
    needs: [],
  },
  {
    id: "farmer",
    name: "A farmer in a village",
    situation: "Cheap phone, patchy 2G, reads Marathi.",
    needs: ["language", "light"],
  },
  {
    id: "elder",
    name: "A retired weaver",
    situation: "No smartphone; a service centre is nearby.",
    needs: ["assisted", "status"],
  },
  {
    id: "migrant",
    name: "A construction worker in another state",
    situation: "Smartphone, but the Aadhaar-linked number is an old one.",
    needs: ["altid", "language"],
  },
  {
    id: "parent",
    name: "A parent working two jobs",
    situation: "Can apply once, at night, then needs updates.",
    needs: ["status"],
  },
];

export function canFinish(p: Person, on: Set<Feature>) {
  return p.needs.every((n) => on.has(n));
}
