/** One restaurant-menu API, four clients that depend on it, and six changes you might make (illustrative). */

export type Effect = "ok" | "broken";

export const CLIENTS: { id: string; name: string; note: string }[] = [
  { id: "app", name: "Your own app, latest version", note: "Updated by your team every week" },
  { id: "old", name: "Your app, a year-old version", note: "Still on 15% of phones" },
  { id: "partner", name: "A partner's kiosk", note: "Written by another company, two years ago" },
  {
    id: "script",
    name: "A restaurant's own script",
    note: "Someone's spreadsheet, nobody told you",
  },
];

export const BEFORE = `{
  "id": "dish_42",
  "name": "Masala dosa",
  "price": 120,
  "available": true
}`;

export const CHANGES: {
  id: string;
  label: string;
  after: string;
  effects: Record<string, Effect>;
  why: Record<string, string>;
  lesson: string;
}[] = [
  {
    id: "add",
    label: "Add a new field: spice level",
    after: `{
  "id": "dish_42",
  "name": "Masala dosa",
  "price": 120,
  "available": true,
  "spice": "medium"
}`,
    effects: { app: "ok", old: "ok", partner: "ok", script: "ok" },
    why: {
      app: "Shows the new spice badge.",
      old: "Ignores a field it doesn't know.",
      partner: "Ignores it too.",
      script: "Reads only the columns it wants.",
    },
    lesson:
      "Adding something new is usually safe, as long as clients ignore what they don't recognise.",
  },
  {
    id: "rename",
    label: "Rename price to cost",
    after: `{
  "id": "dish_42",
  "name": "Masala dosa",
  "cost": 120,
  "available": true
}`,
    effects: { app: "ok", old: "broken", partner: "broken", script: "broken" },
    why: {
      app: "Your team updated it in the same release.",
      old: "Shows ₹undefined. Nobody can update an app on someone else's phone.",
      partner: "Kiosk crashes reading price.",
      script: "Spreadsheet fills with blanks.",
    },
    lesson: "Renaming or removing anything breaks every client you don't control.",
  },
  {
    id: "type",
    label: 'Send price as text: "₹120.00"',
    after: `{
  "id": "dish_42",
  "name": "Masala dosa",
  "price": "₹120.00",
  "available": true
}`,
    effects: { app: "ok", old: "broken", partner: "broken", script: "broken" },
    why: {
      app: "Updated to parse the new format.",
      old: "Adds ₹120.00 to the bill as text: the total reads ₹120.00₹80.00.",
      partner: "Expects a number; rejects the whole menu.",
      script: "Sums become zero.",
    },
    lesson: "Changing a field's type is as breaking as removing it.",
  },
  {
    id: "internal",
    label: "Move the menu to a new database",
    after: BEFORE,
    effects: { app: "ok", old: "ok", partner: "ok", script: "ok" },
    why: {
      app: "Same response, same shape.",
      old: "Can't tell anything changed.",
      partner: "Can't tell.",
      script: "Can't tell.",
    },
    lesson: "Everything behind the API is yours to change: that's the point of having one.",
  },
  {
    id: "order",
    label: "Return the fields in a different order",
    after: `{
  "available": true,
  "price": 120,
  "name": "Masala dosa",
  "id": "dish_42"
}`,
    effects: { app: "ok", old: "ok", partner: "ok", script: "broken" },
    why: {
      app: "Reads fields by name.",
      old: "Reads fields by name.",
      partner: "Reads fields by name.",
      script:
        "Grabbed 'the third value' with a text search. Now it reads the dish name as the price.",
    },
    lesson:
      "JSON field order was never promised, but someone depended on it anyway. That's Hyrum's Law.",
  },
  {
    id: "slow",
    label: "Respond in 3 seconds instead of 0.1",
    after: BEFORE,
    effects: { app: "ok", old: "broken", partner: "broken", script: "ok" },
    why: {
      app: "Shows a loading spinner.",
      old: "Times out after 2 seconds and shows 'Menu unavailable'.",
      partner: "Kiosk gives up after 1 second.",
      script: "Runs overnight; doesn't care.",
    },
    lesson: "Speed isn't in the response, but clients still rely on it.",
  },
];
