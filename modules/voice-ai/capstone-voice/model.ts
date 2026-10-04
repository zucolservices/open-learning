/** Capstone: a fictional clinic's appointment line. Design choices, then the first week's complaints. */

export interface Choice {
  id: string;
  label: string;
  good: boolean;
}

export const DESIGN: { id: string; prompt: string; choices: Choice[]; prevents: string }[] = [
  {
    id: "pipeline",
    prompt: "How does audio flow through the system?",
    choices: [
      {
        id: "stream",
        label:
          "Stream every stage and start speaking from the first sentence, within a latency budget",
        good: true,
      },
      { id: "wait", label: "Let each stage finish before the next one starts", good: false },
    ],
    prevents: "slow",
  },
  {
    id: "turns",
    prompt: "How does it know whose turn it is?",
    choices: [
      {
        id: "semantic",
        label:
          "Semantic turn detection; stop at once on barge-in and trim memory to what was heard",
        good: true,
      },
      {
        id: "timer",
        label: "A fixed short silence timer; keep talking if the caller cuts in",
        good: false,
      },
    ],
    prevents: "cutoff",
  },
  {
    id: "conversation",
    prompt: "How does the conversation go?",
    choices: [
      {
        id: "open",
        label:
          "Say it's an AI, ask an open question, repeat details back, offer a person after two misses",
        good: true,
      },
      {
        id: "menu",
        label: "Menu-style prompts; confirm every detail with a yes/no question",
        good: false,
      },
    ],
    prevents: "trapped",
  },
  {
    id: "tools",
    prompt: "How does it book appointments?",
    choices: [
      {
        id: "readback",
        label: "Read back before booking; say “done” only after the system confirms; sanity limits",
        good: true,
      },
      { id: "fast", label: "Book as soon as it hears a time, to keep calls short", good: false },
    ],
    prevents: "wrong",
  },
  {
    id: "testing",
    prompt: "How is it tested before launch?",
    choices: [
      {
        id: "sim",
        label: "Hundreds of simulated callers: accents, noise, interruptions, changes of mind",
        good: true,
      },
      { id: "team", label: "The team rings it a few times from the office", good: false },
    ],
    prevents: "accent",
  },
];

export const INCIDENTS: {
  id: string;
  title: string;
  detail: string;
  fixes: Choice[];
  real: string;
}[] = [
  {
    id: "slow",
    title: "Long silences",
    detail:
      "After each answer, callers hear about three seconds of nothing. Many say “hello?” or hang up.",
    fixes: [
      {
        id: "stream",
        label:
          "Stream every stage, speak from the first sentence, host near callers; track p95 latency",
        good: true,
      },
      { id: "music", label: "Play hold music during the pauses", good: false },
    ],
    real: "A VA study (2019) found that slower call answering made patients feel care was harder to reach.",
  },
  {
    id: "cutoff",
    title: "Cut off mid-sentence",
    detail:
      "Older callers who pause to think get interrupted, and the agent talks straight over “wait, no”.",
    fixes: [
      {
        id: "semantic",
        label: "Semantic turn detection, plus barge-in that stops audio and trims memory",
        good: true,
      },
      {
        id: "slow",
        label: "Make everyone wait three seconds of silence before the agent replies",
        good: false,
      },
    ],
    real: "Turn-taking and barge-in, modules 5 and 12.",
  },
  {
    id: "trapped",
    title: "Callers can't reach a person",
    detail:
      "Callers repeat “receptionist” over and over; one asks to book for 400 people just to break it.",
    fixes: [
      {
        id: "handover",
        label:
          "Recognise requests for a person, transfer warmly with the details, cap misses at two",
        good: true,
      },
      { id: "block", label: "Ignore the word “receptionist”", good: false },
    ],
    real: "Like Taco Bell's drive-through AI (2025), where someone ordered 18,000 water cups to reach a human.",
  },
  {
    id: "wrong",
    title: "Wrong bookings",
    detail:
      "It booked Tuesday after the caller corrected it to Thursday, and said “done” while the booking system was down.",
    fixes: [
      {
        id: "readback",
        label: "Accept one-step corrections, read back before booking, report only after success",
        good: true,
      },
      { id: "slowly", label: "Ask callers to speak more slowly", good: false },
    ],
    real: "Designing conversations and taking action mid-call, modules 14 and 15.",
  },
  {
    id: "accent",
    title: "Some callers fail far more often",
    detail:
      "Task completion is much lower for callers with certain regional accents. Names are misheard again and again.",
    fixes: [
      {
        id: "test",
        label:
          "Add those accents to simulated tests, compare speech models, add a spelling fallback for names",
        good: true,
      },
      { id: "zero", label: "Tell those callers to press 0 for the front desk", good: false },
    ],
    real: "McDonald's ended its IBM drive-through voice test in 2024; sources cited trouble with accents and dialects.",
  },
];
