/**
 * A made-up café table-booking app, three exploratory charters, and probes for each. Each session
 * is time-boxed to four probes. Which probes reveal bugs is scripted; the automated suite is green
 * throughout, because nobody wrote tests for these cases.
 */

export interface Probe {
  id: string;
  heuristic: string;
  action: string;
  bug?: string;
  fine?: string;
}

export const CHARTERS: { id: string; charter: string; probes: Probe[] }[] = [
  {
    id: "dates",
    charter:
      "Explore the booking form with unusual dates and times to discover how it handles edges",
    probes: [
      {
        id: "past",
        heuristic: "Time",
        action: "Book for 9 am today when it's already 3 pm",
        bug: "Accepted. A table is held for a time that has passed.",
      },
      {
        id: "limit",
        heuristic: "Boundaries",
        action: "Book exactly 30 days ahead (the rules say up to 30)",
        bug: "Refused: “Too far ahead”. Off by one day.",
      },
      {
        id: "monday",
        heuristic: "Data",
        action: "Book on a Monday, when the café is closed",
        fine: "Correctly refused with a clear message.",
      },
      {
        id: "tz",
        heuristic: "Platform",
        action: "Change the phone's time zone, then book 7 pm",
        bug: "Saved as 1:30 pm: the time was converted from the phone's zone.",
      },
      {
        id: "feb",
        heuristic: "Data",
        action: "Try 29 February 2027 (not a leap year)",
        fine: "The date picker doesn't offer it.",
      },
    ],
  },
  {
    id: "interrupt",
    charter:
      "Explore booking under interruptions and impatience to discover lost or doubled bookings",
    probes: [
      {
        id: "double",
        heuristic: "Interrupt it",
        action: "Double-click “Book table”",
        bug: "Two identical bookings created.",
      },
      {
        id: "back",
        heuristic: "Interrupt it",
        action: "Press Back right after paying the deposit",
        bug: "Deposit taken, but the booking form reappears empty and no booking exists.",
      },
      {
        id: "offline",
        heuristic: "Platform",
        action: "Switch off the network mid-booking",
        bug: "Spinner forever; no message, no retry.",
      },
      {
        id: "refresh",
        heuristic: "Interrupt it",
        action: "Refresh the confirmation page",
        fine: "Shows the same booking; nothing duplicated.",
      },
      {
        id: "tabs",
        heuristic: "Operations",
        action: "Book the last table in two tabs at once",
        fine: "The second tab is told the table has gone.",
      },
    ],
  },
  {
    id: "party",
    charter: "Explore party sizes with zero, one and many to discover limits",
    probes: [
      {
        id: "zero",
        heuristic: "Zero, one, many",
        action: "Book for 0 guests",
        bug: "Accepted: a table reserved for nobody.",
      },
      {
        id: "one",
        heuristic: "Zero, one, many",
        action: "Book for 1 guest",
        fine: "Works; offered a counter seat.",
      },
      {
        id: "twelve",
        heuristic: "Goldilocks",
        action: "Book for 12 guests (the maximum)",
        fine: "Works; asks for a deposit.",
      },
      {
        id: "word",
        heuristic: "Data",
        action: "Type “four” into the guests box",
        bug: "“NaN guests” shown on the confirmation.",
      },
      {
        id: "thirteen",
        heuristic: "Goldilocks",
        action: "Book for 13 guests",
        fine: "Told to phone for large groups.",
      },
    ],
  },
];

export const TIMEBOX = 4;
