/**
 * The complaint path from an app's grievance desk to the Board and beyond (from May 2027), with the
 * Board's own procedure. As of October 2026 the Board has no appointed members and no portal.
 */

export const PATH: { id: string; who: string; title: string; body: string; when: string }[] = [
  {
    id: "desk",
    who: "The app",
    title: "Grievance to the app first",
    body: "Ravi complains through the grievance channel the app publishes: the app ignored an erasure request.",
    when: "Answered within the app's published period, at most 90 days",
  },
  {
    id: "exhaust",
    who: "Ravi",
    title: "Not satisfied? Now the Board",
    body: "A person must use the app's grievance route before going to the Board; they can't skip it.",
    when: "After the grievance route",
  },
  {
    id: "complain",
    who: "The Board",
    title: "A complaint to a digital office",
    body: "The Board is 'digital by design': complaints, hearings and orders happen online, without anyone having to appear in person.",
    when: "Filed online",
  },
  {
    id: "screen",
    who: "The Board",
    title: "Screening",
    body: "The Board decides whether there are sufficient grounds for an inquiry. If not, it closes the case with written reasons. It may also suggest mediation.",
    when: "First look",
  },
  {
    id: "inquiry",
    who: "The Board",
    title: "Inquiry",
    body: "Like a civil court, it can summon people and inspect documents. The app can offer a voluntary undertaking to fix things at any stage.",
    when: "Within 6 months, extendable 3 months at a time",
  },
  {
    id: "outcome",
    who: "The Board",
    title: "Outcome",
    body: "The Board closes the case or imposes a penalty from the Schedule. Penalties go to the government; the Act gives the complainant no compensation.",
    when: "Order issued",
  },
  {
    id: "appeal",
    who: "TDSAT, then Supreme Court",
    title: "Appeal",
    body: "Either side can appeal to the Telecom Disputes Settlement and Appellate Tribunal (TDSAT), and from there to the Supreme Court.",
    when: "Within 60 days; TDSAT aims to decide in 6 months",
  },
];

export const DUTIES: [string, string][] = [
  ["Follow the law", "Comply with applicable laws when using your rights."],
  ["Don't impersonate", "No pretending to be someone else when giving data."],
  [
    "Don't hide facts",
    "Don't suppress material information when giving data for an ID document, identifier or proof of identity or address issued by the State.",
  ],
  ["No false complaints", "Don't file false or frivolous grievances or complaints."],
  [
    "Be truthful when correcting",
    "Give only verifiably authentic information when asking for a correction or erasure.",
  ],
];
