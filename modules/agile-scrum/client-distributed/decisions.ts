/** Five moments in a Bengaluru team's work for a London client. Illustrative. */

export type Fit = "good" | "care" | "poor";

export interface Decision {
  id: string;
  title: string;
  situation: string;
  options: { id: string; label: string; fit: Fit; result: string }[];
}

export const DECISIONS: Decision[] = [
  {
    id: "po",
    title: "Who decides?",
    situation:
      "Emma, the client's head of product in London, owns the product but is in meetings all day. The account manager in Bengaluru, Rahul, offers to act as Product Owner so the team isn't kept waiting.",
    options: [
      {
        id: "relay",
        label: "Rahul becomes the team's Product Owner and passes questions to Emma",
        fit: "poor",
        result:
          "Rahul can't decide anything, so every question waits a day for London. He becomes a bottleneck, and Emma hears the team's trade-offs second-hand.",
      },
      {
        id: "agreed",
        label: "Emma stays Product Owner; Rahul handles agreed day-to-day calls",
        fit: "good",
        result:
          "Emma sets the Product Goal, orders the big items and comes to every Sprint Review. Rahul has real authority for small questions. The Scrum Guide lets a PO delegate but they “remain accountable”.",
      },
      {
        id: "email",
        label: "Emma stays Product Owner; the team emails her questions and waits",
        fit: "care",
        result:
          "Decisions stay with the right person, but answers take a day or more. Workable only if Emma commits to answering within the overlap hours.",
      },
    ],
  },
  {
    id: "daily",
    title: "The Daily Scrum",
    situation:
      "Emma wants to see daily progress. Someone suggests moving the Daily Scrum to 2:30 pm so she can join from London and tell people what to work on.",
    options: [
      {
        id: "emma",
        label: "Move it and let Emma direct the day's work",
        fit: "poor",
        result:
          "The Daily Scrum is for the Developers to plan their own day. With the client assigning tasks it becomes a status meeting, and the team stops self-managing.",
      },
      {
        id: "team",
        label: "Keep it at the team's time; share the board and use overlap hours for questions",
        fit: "good",
        result:
          "The team plans its own day. Emma sees progress on the shared board whenever she likes, and questions go to her in the afternoon overlap.",
      },
      {
        id: "skip",
        label: "Drop the Daily Scrum and email Emma a status report",
        fit: "poor",
        result:
          "The team loses its daily chance to inspect and adapt, and Emma gets a report nobody discusses.",
      },
    ],
  },
  {
    id: "direct",
    title: "A request on the side",
    situation:
      "Mid-Sprint, Emma's colleague messages a developer directly: “Quick one, can you add an export button today? It's urgent.”",
    options: [
      {
        id: "quiet",
        label: "Just do it; it's the client",
        fit: "poor",
        result:
          "The Sprint Goal slips quietly, nobody weighed the trade-off, and next time there'll be three “quick ones”.",
      },
      {
        id: "route",
        label: "Reply politely and route it to the Product Owner",
        fit: "good",
        result:
          "The PO decides whether it matters more than current work. If it's truly urgent it goes into the Product Backlog at the top. Only the PO can cancel a Sprint.",
      },
      {
        id: "refuse",
        label: "Refuse: it's not in the Sprint",
        fit: "care",
        result:
          "Right boundary, wrong tone. A flat “no” to a client costs trust; offer the route instead.",
      },
    ],
  },
  {
    id: "review",
    title: "The Sprint Review",
    situation: "End of Sprint. How does the client see the work?",
    options: [
      {
        id: "video",
        label: "Email a recorded demo and slides",
        fit: "care",
        result:
          "Better than nothing, and useful for people who can't attend. But the Review is a working session, and a video starts no conversation about what to do next.",
      },
      {
        id: "live",
        label: "A live Review in the overlap hours, with Emma and some real users",
        fit: "good",
        result:
          "Emma and users try the product and the Product Backlog is adjusted together. Take turns with the awkward slot so the inconvenience is shared.",
      },
      {
        id: "gate",
        label: "Rahul presents to Emma for formal sign-off before anything is released",
        fit: "poor",
        result:
          "The Scrum Guide says the Sprint Review “should never be considered a gate to releasing value”. And the team never hears the client directly.",
      },
    ],
  },
  {
    id: "no",
    title: "Saying “not yet”",
    situation:
      "In the Review, Emma asks: “Can you also squeeze the reporting module into next Sprint?” The team knows it won't fit alongside what's planned.",
    options: [
      {
        id: "yes",
        label: "Say yes; it's awkward to refuse a client",
        fit: "poor",
        result:
          "Martin Fowler, writing about ThoughtWorks' Bangalore teams: “polite acceptance is often a sign of an important issue not getting discussed”. The surprise comes later, and costs more.",
      },
      {
        id: "trade",
        label: "“Not alongside everything else. Here's what we could swap out.”",
        fit: "good",
        result:
          "An honest forecast plus options. Emma, as Product Owner, makes the trade-off with real information.",
      },
      {
        id: "cut",
        label: "Agree, then quietly skip testing to fit it in",
        fit: "poor",
        result: "That's undone work: the Definition of Done breaks and the debt surfaces later.",
      },
    ],
  },
];
