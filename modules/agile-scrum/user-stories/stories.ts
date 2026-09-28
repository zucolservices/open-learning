/**
 * Weak stories for a citizen portal, each failing some INVEST letters (Bill Wake, 2003), with
 * candidate rewrites. Illustrative.
 */

export const INVEST: [string, string, string][] = [
  ["I", "Independent", "can be scheduled and built in any order"],
  ["N", "Negotiable", "captures the essence, not the details; not a contract"],
  ["V", "Valuable", "valuable to the customer, not just to developers"],
  ["E", "Estimable", "clear enough to size roughly"],
  ["S", "Small", "a few days to a couple of weeks of work, fits a Sprint"],
  ["T", "Testable", "you could write a test for it"],
];

export interface Rewrite {
  id: string;
  text: string;
  fails: string[];
  note: string;
}

export interface Weak {
  id: string;
  text: string;
  fails: string[];
  why: string;
  rewrites: Rewrite[];
}

export const WEAK: Weak[] = [
  {
    id: "dev",
    text: "As a developer, I want a REST API for certificates.",
    fails: ["V"],
    why: "Valuable to whom? Nothing here says what a citizen gets. It's a technical task in story clothing.",
    rewrites: [
      {
        id: "good",
        text: "As a student, I want to download my caste certificate, so that I can attach it to a scholarship application.",
        fails: [],
        note: "A real person, a real need, a reason. The API becomes part of how it's built.",
      },
      {
        id: "tech",
        text: "As a developer, I want a well-documented REST API for certificates, so that the code is clean.",
        fails: ["V"],
        note: "Still valuable only to developers. Mike Cohn suggests writing such work as a plain technical backlog item instead.",
      },
    ],
  },
  {
    id: "vague",
    text: "As a citizen, I want the portal to be easy to use.",
    fails: ["E", "T"],
    why: "How would you size it, or know when it's done? “Easy” can't be tested.",
    rewrites: [
      {
        id: "good",
        text: "As a first-time applicant, I want each form field to show an example in Kannada or English, so that I fill it in correctly the first time.",
        fails: [],
        note: "Specific enough to size and to test (“every field shows an example in the chosen language”).",
      },
      {
        id: "very",
        text: "As a citizen, I want the portal to be very, very easy to use, so that I'm happy.",
        fails: ["E", "T"],
        note: "Adding “very” doesn't make it testable.",
      },
    ],
  },
  {
    id: "huge",
    text: "As a citizen, I want to apply for, pay for, track, download and appeal every kind of certificate.",
    fails: ["S", "E"],
    why: "That's a whole product. Far too big for a Sprint, and impossible to size sensibly.",
    rewrites: [
      {
        id: "good",
        text: "As a citizen who has applied for an income certificate, I want to see its current status, so that I know whether to visit the office.",
        fails: [],
        note: "One thin slice of value. The rest become other stories (the next module is all about splitting).",
      },
      {
        id: "phases",
        text: "Phase 1: build all the forms. Phase 2: build all the payments. Phase 3: …",
        fails: ["V", "I"],
        note: "Splitting by layer or phase: no phase is usable on its own, and each depends on the last.",
      },
    ],
  },
  {
    id: "spec",
    text: "As an officer, I want a Spring Boot dropdown with exactly 14 options in #333 grey at 13px, so that I can pick a reason.",
    fails: ["N"],
    why: "It's a mini-specification. A story “is not an explicit contract for features”; details are worked out together.",
    rewrites: [
      {
        id: "good",
        text: "As an officer rejecting an application, I want to choose a standard reason, so that citizens get a clear, consistent explanation.",
        fails: [],
        note: "The need, not the design. The dropdown (or something better) comes out of the conversation.",
      },
      {
        id: "blue",
        text: "As an officer, I want a Spring Boot dropdown with exactly 14 options in blue, so that I can pick a reason.",
        fails: ["N"],
        note: "Changing the colour doesn't change the problem: it still dictates the solution.",
      },
    ],
  },
  {
    id: "table",
    text: "Create the database table for applications.",
    fails: ["V", "I"],
    why: "A task, not a story: no user, no value on its own, and it only matters together with other work.",
    rewrites: [
      {
        id: "good",
        text: "As a citizen, I want to save my application and come back to it later, so that I don't lose my work on a slow connection.",
        fails: [],
        note: "The table gets built as part of this slice: “slice vertically through the layers”, in Wake's words.",
      },
      {
        id: "big",
        text: "Create all the database tables for the whole portal.",
        fails: ["V", "I", "S"],
        note: "Bigger, and still no value until much else is built.",
      },
    ],
  },
];

/** Given/When/Then builder for an OTP story (time limits relate to GIGW 3.0 checkpoint 5.2.24 / WCAG 2.2.1). */
export const OTP_STORY =
  "As a citizen signing in with an OTP, I want to be warned before my session times out and be able to get more time, so that I don't lose a half-filled application.";

export const GWT: {
  part: "Given" | "When" | "Then";
  options: { id: string; text: string; ok: boolean; why: string }[];
}[] = [
  {
    part: "Given",
    options: [
      {
        id: "g1",
        text: "I am signed in and part-way through an application",
        ok: true,
        why: "A concrete starting context the tester can set up.",
      },
      {
        id: "g2",
        text: "the sessions table is in PostgreSQL",
        ok: false,
        why: "An implementation detail, not the user's situation.",
      },
      { id: "g3", text: "the system is working", ok: false, why: "Too vague to set up or check." },
    ],
  },
  {
    part: "When",
    options: [
      {
        id: "w1",
        text: "my session is 20 seconds from timing out",
        ok: true,
        why: "A clear event at a precise moment.",
      },
      {
        id: "w2",
        text: "the developer runs the cleanup job",
        ok: false,
        why: "That's the system's inner workings, not the user's event.",
      },
      { id: "w3", text: "some time passes", ok: false, why: "How much time? Not testable." },
    ],
  },
  {
    part: "Then",
    options: [
      {
        id: "t1",
        text: "I see a warning with a “More time” button, and pressing it keeps my answers",
        ok: true,
        why: "Observable outcomes a tester can check.",
      },
      {
        id: "t2",
        text: "it works properly",
        ok: false,
        why: "What does properly look like? Not testable.",
      },
      {
        id: "t3",
        text: "the session table row is updated",
        ok: false,
        why: "Checks the implementation, not what the user experiences.",
      },
    ],
  },
];
