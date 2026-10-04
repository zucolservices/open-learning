/** Writing one ADR and guarding it with a fitness function (illustrative). */

export const TITLE = "ADR 7: Keep the claims rules independent of the database";

export const SECTIONS: {
  id: "context" | "decision" | "consequences";
  name: string;
  options: { text: string; good: boolean; why: string }[];
}[] = [
  {
    id: "context",
    name: "Context",
    options: [
      {
        text: "Claims rules change monthly; the policy data will move off the mainframe within two years; tests that need a database take 20 minutes.",
        good: true,
        why: "Describes the forces, neutrally, so a future reader can judge if they still apply.",
      },
      {
        text: "Hexagonal architecture is best practice.",
        good: false,
        why: "An opinion, not a context. Nobody can tell later whether it still holds.",
      },
    ],
  },
  {
    id: "decision",
    name: "Decision",
    options: [
      {
        text: "We will keep the domain package free of database and framework imports; storage is reached only through the PolicyStore port.",
        good: true,
        why: "Full sentences, active voice, specific enough to check.",
      },
      {
        text: "Try to keep things decoupled where possible.",
        good: false,
        why: "Too vague to follow or to test.",
      },
    ],
  },
  {
    id: "consequences",
    name: "Consequences",
    options: [
      {
        text: "Rules can be tested in milliseconds and the mainframe swapped later. We'll write more interfaces and mapping code, and newcomers must learn the layout.",
        good: true,
        why: "Lists the costs too, not just the benefits.",
      },
      {
        text: "Cleaner code and faster tests.",
        good: false,
        why: "Only the upside. Every decision has a price; record it.",
      },
    ],
  },
];

export const FITNESS = `@ArchTest
static final ArchRule domain_is_independent =
    noClasses().that().resideInAPackage("..claims.domain..")
        .should().dependOnClassesThat()
        .resideInAnyPackage("..jdbc..", "..springframework..", "..adapters..")
        .because("ADR 7: claims rules stay independent of storage");`;
