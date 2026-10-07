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
} satisfies Record<string, GlossaryEntry>;
