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
} satisfies Record<string, GlossaryEntry>;
