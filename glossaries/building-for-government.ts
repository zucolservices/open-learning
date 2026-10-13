import type { GlossaryEntry } from "./types";

/** Building for Government track glossary. `module` slugs refer to this track. */
export const govTrack = {
  "common-services-centre": {
    term: "Common Services Centre (CSC)",
    definition:
      "A local centre, run by a village-level entrepreneur, where people can use hundreds of government and other services with an operator's help. India had about 5.3 lakh in mid-2026.",
    module: "gov-is-different",
  },
  "assisted-access": {
    term: "Assisted access",
    definition:
      "Using a digital service through a trained helper, such as a service-centre operator, rather than on your own device. Government services must work well for helpers as well as for citizens.",
    module: "gov-is-different",
  },
  "digital-divide": {
    term: "Digital divide",
    definition:
      "The gap between people who can easily use digital services and those who can't, because of devices, connectivity, language, literacy, disability or cost.",
    module: "gov-is-different",
  },
  "digital-public-infrastructure": {
    term: "Digital public infrastructure (DPI)",
    definition:
      "Shared digital systems, such as identity, payments and consent-based data sharing, that public and private services build on, much as vehicles use shared roads.",
    module: "digital-public-infrastructure",
  },
  "india-stack": {
    term: "India Stack",
    definition:
      "An informal name for India's layers of digital public infrastructure: Aadhaar and eKYC for identity, UPI for payments, and DigiLocker and Account Aggregators for consent-based data sharing. Each has a different owner.",
    module: "digital-public-infrastructure",
  },
  "public-procurement": {
    term: "Public procurement",
    definition:
      "How government bodies buy goods, services and works with public money, under rules that require fair competition, openness and a record of why each choice was made.",
    module: "how-gov-buys",
  },
  gem: {
    term: "GeM (Government e-Marketplace)",
    definition:
      "India's online marketplace for government purchases, launched in 2016. Central bodies must buy goods and services listed on it through GeM.",
    module: "how-gov-buys",
  },
  qcbs: {
    term: "QCBS (quality and cost based selection)",
    definition:
      "A way to choose a winning bid that blends a technical-quality score with the price, instead of simply picking the cheapest qualified bid (L1).",
    module: "how-gov-buys",
  },
  gigw: {
    term: "GIGW",
    definition:
      "Guidelines for Indian Government Websites and Apps: the common rulebook for quality, accessibility, security and upkeep of every Indian government website and app. Version 3.0 dates from 2023.",
    module: "gigw",
  },
  "web-information-manager": {
    term: "Web Information Manager (WIM)",
    definition:
      "A senior official a department nominates under GIGW to own its website or app, approve its content and policies, and answer for its upkeep.",
    module: "gigw",
  },
  "rpwd-act": {
    term: "RPwD Act",
    definition:
      "India's Rights of Persons with Disabilities Act, 2016. Its sections 40–46 require accessible buildings, transport, information and communication technology and services.",
    module: "accessibility-law",
  },
  "is-17802": {
    term: "IS 17802",
    definition:
      "The Indian standard for accessible ICT products and services (Part 1, 2021: requirements; Part 2, 2022: testing), based on Europe's EN 301 549 and WCAG 2.1. Required under the RPwD Rules since 2023.",
    module: "accessibility-law",
  },
  "scheduled-languages": {
    term: "Scheduled languages",
    definition:
      "The 22 languages listed in the Eighth Schedule of India's Constitution, from Assamese to Urdu, written in many different scripts.",
    module: "multilingual",
  },
  bhashini: {
    term: "Bhashini",
    definition:
      "India's national language technology platform (launched 2022, under MeitY), offering translation, speech recognition, text-to-speech and transliteration for Indian languages.",
    module: "multilingual",
  },
  unicode: {
    term: "Unicode",
    definition:
      "The worldwide standard that gives every character in every script, including all Indian scripts, its own code, so text displays and searches correctly on any device.",
    module: "multilingual",
  },
  "cloud-empanelment": {
    term: "Cloud empanelment",
    definition:
      "MeitY's approval of specific cloud service offerings for Indian government use, after an STQC audit against security standards. Empanelled offerings run from data centres in India and are bought through GeM.",
    module: "gov-cloud-hosting",
  },
  "data-localisation": {
    term: "Data localisation",
    definition:
      "Rules requiring certain data to be stored, and sometimes processed, within a country. In India these come from several sources, such as RBI payment rules and government cloud terms, rather than one law.",
    module: "gov-cloud-hosting",
  },
  "digital-identity": {
    term: "Digital identity",
    definition:
      "A way for an online service to know who it is dealing with, from a simple sign-in to strong checks against a national identity system.",
    module: "digital-identity",
  },
  aadhaar: {
    term: "Aadhaar",
    definition:
      "India's 12-digit identity number, issued by UIDAI and linked to a person's fingerprints, iris and face. Services can ask UIDAI to confirm a person is who they claim; UIDAI answers yes or no and never shares biometrics.",
    module: "digital-identity",
  },
  digilocker: {
    term: "DigiLocker",
    definition:
      "India's government document wallet. Departments fetch certificates straight from the office that issued them; such issued documents are legally at par with physical originals.",
    module: "digilocker-esign",
  },
  esign: {
    term: "eSign",
    definition:
      "An online electronic signature in India: the signer confirms identity with an OTP or biometric, and a one-time certificate signs the document. Valid under the IT Act.",
    module: "digilocker-esign",
  },
} satisfies Record<string, GlossaryEntry>;
