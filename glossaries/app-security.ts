import type { GlossaryEntry } from "./types";

/** Application Security track glossary. `module` slugs refer to this track. */
export const appSecurity = {
  vulnerability: {
    term: "Vulnerability",
    definition:
      "A weakness in software, configuration or process that someone could use to cause harm, such as an unpatched flaw or a missing check.",
    module: "why-appsec",
  },
  threat: {
    term: "Threat",
    definition:
      "Anyone or anything that could exploit a vulnerability to cause harm, such as a criminal group, a malicious insider or a careless mistake.",
    module: "why-appsec",
  },
  risk: {
    term: "Risk",
    definition:
      "How likely harm is combined with how bad it would be; used to decide which problems to fix first.",
    module: "why-appsec",
  },
  patch: {
    term: "Patch",
    definition:
      "An update that fixes a flaw in software. Many breaches use flaws whose patch was already available.",
    module: "why-appsec",
  },
  exploit: {
    term: "Exploit",
    definition:
      "To use a vulnerability to make a system do something it shouldn't; also the code or technique that does it.",
    module: "why-appsec",
  },
  "shift-left": {
    term: "Shift left",
    definition:
      "Doing security (and testing) earlier in building software, in design and coding rather than just before or after release.",
    module: "why-appsec",
  },
  "threat-modelling": {
    term: "Threat modelling",
    definition:
      "Looking at a design to find what could go wrong and decide what to do about it, ideally before building it.",
    module: "threat-modelling",
  },
  "data-flow-diagram": {
    term: "Data flow diagram",
    definition:
      "A sketch of a system showing outside people and systems, processes, data stores and the data flowing between them; the usual starting point for threat modelling.",
    module: "threat-modelling",
  },
  "trust-boundary": {
    term: "Trust boundary",
    definition:
      "A line in a system where data or control passes between parts with different levels of trust, such as from a user's browser to your server.",
    module: "threat-modelling",
  },
  stride: {
    term: "STRIDE",
    definition:
      "Six prompts for finding threats: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service and Elevation of privilege (Microsoft, 1999).",
    module: "threat-modelling",
  },
} satisfies Record<string, GlossaryEntry>;
