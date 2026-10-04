/** Six cloning requests to a fictional voice platform, with recommended decisions. */

export type Decision = "accept" | "safeguards" | "decline";

export const REQUESTS: {
  id: string;
  who: string;
  ask: string;
  best: Decision;
  why: string;
  safeguards: string[];
}[] = [
  {
    id: "narrator",
    who: "An audiobook narrator",
    ask: "Clone my own voice so I can produce more books.",
    best: "safeguards",
    why: "Legitimate, but prove it's really their voice before cloning it.",
    safeguards: ["Live read-back check", "Documented consent", "Watermark output"],
  },
  {
    id: "politician",
    who: "Anonymous user",
    ask: "Clone a prime minister's voice from speeches, for satire.",
    best: "decline",
    why: "High-risk voices like politicians are blocked: the same clip works for disinformation.",
    safeguards: ["Blocklist of public figures"],
  },
  {
    id: "als",
    who: "A patient with motor neurone disease",
    ask: "Bank my voice now so my communication device sounds like me later.",
    best: "safeguards",
    why: "Exactly what cloning should be for, with the patient's own consent and access controls.",
    safeguards: ["Patient consent", "Private voice, no sharing"],
  },
  {
    id: "callcentre",
    who: "A call-centre company",
    ask: "Clone one of our agents so our voice bot sounds friendly.",
    best: "safeguards",
    why: "Only with the employee's free, written consent, and callers must be told they're talking to AI.",
    safeguards: ["Employee's written consent", "Right to withdraw", "Disclose AI to callers"],
  },
  {
    id: "boss",
    who: "An employee",
    ask: "Clone my boss from a meeting recording to send voice notes.",
    best: "decline",
    why: "Impersonating someone without consent: the pattern behind voice-fraud scams.",
    safeguards: ["Speaker verification"],
  },
  {
    id: "teacher",
    who: "A language teacher",
    ask: "Use a stock synthetic voice (not a real person) for lesson audio.",
    best: "accept",
    why: "No real person's voice is copied; normal content rules apply.",
    safeguards: [],
  },
];
