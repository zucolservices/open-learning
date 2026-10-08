/**
 * Roles in one made-up food order (DabbaGo is invented). Who decides the purpose and means of
 * processing is a Data Fiduciary (s.2(i)); anyone processing on its behalf is a Data Processor
 * (s.2(k)); the person the data is about is the Data Principal (s.2(j)).
 */

export type Role = "principal" | "fiduciary" | "processor" | "none";

export const ROLE_LABEL: Record<Role, string> = {
  principal: "Data Principal",
  fiduciary: "Data Fiduciary",
  processor: "Data Processor",
  none: "None of these",
};

export interface Actor {
  id: string;
  name: string;
  does: string;
  role: Role;
  why: string;
}

export const ACTORS: Actor[] = [
  {
    id: "you",
    name: "Asha, the customer",
    does: "Orders dinner and shares a name, phone number and address.",
    role: "principal",
    why: "The data is about Asha, so Asha is the Data Principal.",
  },
  {
    id: "app",
    name: "DabbaGo, the app",
    does: "Decides what to collect, why, and which vendors to use.",
    role: "fiduciary",
    why: "It decides the purpose and means of processing: the Data Fiduciary.",
  },
  {
    id: "cloud",
    name: "The cloud host",
    does: "Runs DabbaGo's servers and database, under contract.",
    role: "processor",
    why: "It stores and processes the data only on DabbaGo's behalf.",
  },
  {
    id: "sms",
    name: "The SMS gateway",
    does: "Sends 'your order is on its way' texts for DabbaGo.",
    role: "processor",
    why: "It uses the phone number only to send DabbaGo's messages.",
  },
  {
    id: "restaurant",
    name: "The restaurant",
    does: "Receives the order, then adds Asha to its own offers list.",
    role: "fiduciary",
    why: "Using the number for its own marketing is its own purpose, so for that it is a fiduciary.",
  },
  {
    id: "board",
    name: "The Data Protection Board",
    does: "Hears complaints and breach cases and can impose penalties.",
    role: "none",
    why: "It's the regulator, not a party to the order.",
  },
];

export type VendorMode = "instructions" | "own-ads" | "joint";

export const VENDOR_MODES: { id: VendorMode; label: string; role: string; detail: string }[] = [
  {
    id: "instructions",
    label: "Only does what DabbaGo asks",
    role: "Data Processor",
    detail:
      "It counts screens and taps for DabbaGo's reports and nothing else. DabbaGo decides the purpose and the means; the vendor works on its behalf.",
  },
  {
    id: "own-ads",
    label: "Also builds its own ad profiles",
    role: "Data Fiduciary (for its own use)",
    detail:
      "Once the vendor uses the data for a purpose it chose, building ad profiles, it decides purpose and means for that use. It is a fiduciary with its own duties, and DabbaGo must not share the data without a lawful basis.",
  },
  {
    id: "joint",
    label: "Decides the analysis together with DabbaGo",
    role: "Data Fiduciary (jointly)",
    detail:
      "The Act's definition covers anyone who decides purpose and means 'alone or in conjunction with other persons'. Two companies can both be fiduciaries for the same processing.",
  },
];

export const CHAIN: { id: string; title: string; body: string }[] = [
  {
    id: "leak",
    title: "The SMS gateway leaks phone numbers",
    body: "A misconfigured storage bucket at the vendor exposes recent order texts. Made-up scenario.",
  },
  {
    id: "tell",
    title: "DabbaGo must tell the Board and every affected customer",
    body: "Breach intimation is the fiduciary's duty, even when the breach happened at a processor.",
  },
  {
    id: "answer",
    title: "The Board looks to DabbaGo",
    body: "Section 8(1): the fiduciary is responsible for processing done on its behalf, 'irrespective of any agreement to the contrary'.",
  },
  {
    id: "contract",
    title: "DabbaGo turns to its contract",
    body: "It can claim its losses from the vendor under their contract. That's ordinary contract law; it doesn't move the duty under the DPDP Act.",
  },
];
