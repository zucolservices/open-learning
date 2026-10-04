/** A travel agent delegating to a hotel chain's agent over A2A. Illustrative and simplified. */

export const STATES = ["submitted", "working", "input-required", "completed"] as const;

export interface Frame {
  title: string;
  caption: string;
  state: (typeof STATES)[number] | null;
  from: "travel" | "hotel" | "user" | null;
  msg: string;
}

export const FRAMES: Frame[] = [
  {
    title: "Discover: read the Agent Card",
    caption:
      "The travel agent fetches the hotel chain's Agent Card from a well-known web address: what it can do, where to send work and how to authenticate.",
    state: null,
    from: "travel",
    msg: `GET https://hotels.example/.well-known/agent-card.json
{ "name": "Seaside Hotels booking agent",
  "skills": [{ "id": "book_room", "description": "Book rooms at any Seaside hotel" }],
  "url": "https://hotels.example/a2a",
  "securitySchemes": { ... } }`,
  },
  {
    title: "Send a message to start a task",
    caption:
      "The request is a message made of parts: some text and some structured data. The hotel agent creates a task to track the work.",
    state: "submitted",
    from: "travel",
    msg: `SendMessage
{ "role": "user", "parts": [
    { "text": "Book 2 nights in Goa for 12 Nov, under ₹9,000/night" },
    { "data": { "guests": 2, "checkin": "2026-11-12", "nights": 2 } } ] }`,
  },
  {
    title: "The hotel agent works on it",
    caption:
      "The task moves to working. Progress can stream back as live events, or arrive later by webhook for long jobs.",
    state: "working",
    from: "hotel",
    msg: `{ "task": { "id": "t-5521", "status": { "state": "working" } } }`,
  },
  {
    title: "It needs more input",
    caption:
      "Two room types fit the budget, so the task pauses in input-required. The travel agent can ask its user, then reply on the same task.",
    state: "input-required",
    from: "hotel",
    msg: `{ "status": { "state": "input-required",
    "message": { "parts": [{ "text": "Sea view (₹8,600) or garden (₹7,200)?" }] } } }`,
  },
  {
    title: "Done, with an artifact",
    caption:
      "After the reply, the task completes. The result comes back as an artifact: here, a booking confirmation the travel agent can show the user.",
    state: "completed",
    from: "hotel",
    msg: `{ "status": { "state": "completed" },
  "artifacts": [{ "name": "confirmation",
    "parts": [{ "data": { "booking": "SH-88231", "room": "garden", "total": 14400 } }] }] }`,
  },
];
