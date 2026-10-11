/**
 * Three designs for a made-up café's happy-hour discount, and three requirement changes. Costs are
 * illustrative hours and line counts, chosen to show the shape of the trade-off.
 */

export type Design = "simple" | "config" | "engine";

export const DESIGNS: {
  id: Design;
  label: string;
  lines: number;
  build: number;
  blurb: string;
  code: string[];
}[] = [
  {
    id: "simple",
    label: "Just enough",
    lines: 8,
    build: 1,
    blurb: "One function for today's rule.",
    code: [
      "function happyHourDiscount(item, time) {",
      "  const hour = time.getHours();",
      "  const isHappyHour = hour >= 16 && hour < 18;",
      "  return isHappyHour && item.isDrink ? 0.2 : 0;",
      "}",
    ],
  },
  {
    id: "config",
    label: "Configurable",
    lines: 60,
    build: 6,
    blurb: "A promotions table with start time, end time and category.",
    code: [
      "promotions: [",
      '  { name: "happy hour", from: "16:00", to: "18:00",',
      '    category: "drinks", percent: 20 }',
      "]",
      "// + loader, validator, admin screen …",
    ],
  },
  {
    id: "engine",
    label: "Rules engine",
    lines: 250,
    build: 20,
    blurb: "A plugin system with its own little rule language, ready for anything.",
    code: [
      'rule "happy-hour" {',
      '  when time in 16:00..18:00 and item.category == "drinks"',
      "  then discount 20%",
      "}",
      "// + parser, plugin registry, rule editor …",
    ],
  },
];

export const CHANGES: {
  label: string;
  cost: Record<Design, number>;
  note: Record<Design, string>;
}[] = [
  {
    label: "Happy hour moves to 5–7 pm",
    cost: { simple: 0.2, config: 0.1, engine: 0.1 },
    note: { simple: "Change two numbers.", config: "Edit the table.", engine: "Edit the rule." },
  },
  {
    label: "Not on weekends",
    cost: { simple: 0.3, config: 4, engine: 0.5 },
    note: {
      simple: "Add one condition.",
      config:
        "The table has no idea of weekdays: change the schema, loader, validator and admin screen.",
      engine: "The rule language happens to support it.",
    },
  },
  {
    label: "Happy hour is scrapped for a loyalty stamp card",
    cost: { simple: 0.1, config: 1, engine: 3 },
    note: {
      simple: "Delete a function.",
      config: "Remove the table, screens and migrations.",
      engine:
        "Nobody dares delete the engine. It stays, unused, and every newcomer has to learn it.",
    },
  },
];
