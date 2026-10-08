/**
 * An hour-by-hour breach drill at a made-up pharmacy app (MediKart). DPDP (from May 2027): tell
 * each affected person and the Board without delay; detailed Board report within 72 hours (or
 * longer if the Board allows on written request). CERT-In (in force now): report listed incidents
 * within 6 hours of noticing. No harm or encryption threshold under DPDP.
 */

export interface Choice {
  id: string;
  label: string;
  good: boolean;
  result: string;
}

export interface Decision {
  id: string;
  hour: number;
  situation: string;
  choices: Choice[];
}

export const DECISIONS: Decision[] = [
  {
    id: "contain",
    hour: 0,
    situation:
      "Monday 09:00. An engineer finds a storage bucket of prescription scans that anyone with the link could open. What first?",
    choices: [
      {
        id: "close",
        label: "Close public access and preserve the access logs",
        good: true,
        result: "Exposure stops and the evidence of who accessed what is kept.",
      },
      {
        id: "delete",
        label: "Delete the bucket so the problem disappears",
        good: false,
        result:
          "The exposure stops, but so does any chance of knowing who was affected. Deleting evidence makes everything after harder.",
      },
      {
        id: "wait",
        label: "Wait until we're sure it was really accessed",
        good: false,
        result: "Every hour open is more exposure, and the clocks have already started.",
      },
    ],
  },
  {
    id: "reportable",
    hour: 2,
    situation:
      "11:00. Logs show a few unknown IP addresses listed the bucket. Is this a reportable personal data breach?",
    choices: [
      {
        id: "yes",
        label: "Yes. Any unauthorised access counts; there's no harm threshold",
        good: true,
        result:
          "Right. The DPDP Act has no 'unlikely to cause harm' exception and no exemption for encrypted data.",
      },
      {
        id: "download",
        label: "Only if we can prove files were downloaded",
        good: false,
        result:
          "Unauthorised access that compromises confidentiality is enough. Waiting for proof of download isn't the test.",
      },
      {
        id: "small",
        label: "No, only a few hundred people are affected",
        good: false,
        result: "There's no minimum size. One affected person is enough.",
      },
    ],
  },
  {
    id: "certin",
    hour: 5,
    situation: "14:00. Has anyone told CERT-In?",
    choices: [
      {
        id: "now",
        label: "Report to CERT-In now, within six hours of noticing",
        good: true,
        result:
          "A data leak is a listed incident. The six-hour clock runs from when it was noticed, and partial reports are allowed.",
      },
      {
        id: "later",
        label: "Fold it into the 72-hour DPDP report",
        good: false,
        result: "Separate regime, separate clock. CERT-In's six hours are already nearly up.",
      },
    ],
  },
  {
    id: "board",
    hour: 6,
    situation: "15:00. What goes to the Data Protection Board today?",
    choices: [
      {
        id: "initial",
        label:
          "A first intimation now: what happened, its extent, timing, location and likely impact",
        good: true,
        result:
          "The Rules ask for a first notice without delay, then a detailed report within 72 hours.",
      },
      {
        id: "hold",
        label: "Nothing until we have the full picture",
        good: false,
        result:
          "The first notice is due without delay; the full picture comes in the 72-hour report.",
      },
    ],
  },
  {
    id: "people",
    hour: 8,
    situation: "17:00. How do you tell affected customers?",
    choices: [
      {
        id: "direct",
        label:
          "A message to each customer's account, email or registered phone, covering the five items",
        good: true,
        result:
          "The Rules require a concise, clear notice to each person through their account or a registered channel.",
      },
      {
        id: "press",
        label: "A press release and a banner on the website",
        good: false,
        result: "Not enough on its own: each affected person must be told directly.",
      },
      {
        id: "vague",
        label: "An email saying 'we take your security seriously'",
        good: false,
        result:
          "Missing what happened, the likely consequences, what you're doing, what they can do and who to contact.",
      },
    ],
  },
  {
    id: "report",
    hour: 70,
    situation: "Thursday 07:00, 70 hours in. The investigation into the cause isn't finished.",
    choices: [
      {
        id: "file",
        label: "File the detailed report with what's known, plus remediation and the notices sent",
        good: true,
        result: "On time. You can keep updating as you learn more.",
      },
      {
        id: "extend",
        label: "Ask the Board in writing for more time, explaining why",
        good: true,
        result:
          "Allowed: the Board can grant a longer period on a written request. It isn't automatic, so ask before the deadline.",
      },
      {
        id: "miss",
        label: "Let the deadline pass and file next week",
        good: false,
        result: "A missed deadline. Failing breach notices can draw a penalty of up to ₹200 crore.",
      },
    ],
  },
];

export const NOTICE_ITEMS: { id: string; label: string; text: string }[] = [
  {
    id: "a",
    label: "(a) What happened, its extent and when",
    text: "On Monday we found that a storage folder of prescription scans could be opened by anyone with its link, for about 9 days.",
  },
  {
    id: "b",
    label: "(b) The likely consequences for you",
    text: "Your name and prescription details may have been seen by someone outside MediKart.",
  },
  {
    id: "c",
    label: "(c) What we're doing about it",
    text: "We closed access the same morning and are reviewing every storage folder.",
  },
  {
    id: "d",
    label: "(d) What you can do",
    text: "Be wary of calls or messages claiming to be from MediKart that ask for payment or OTPs.",
  },
  {
    id: "e",
    label: "(e) Who to contact",
    text: "Questions? Contact our grievance officer at privacy@medikart.example.",
  },
];

export const REGIMES: { aspect: string; dpdp: string; certin: string }[] = [
  { aspect: "In force", dpdp: "From May 2027", certin: "Now (since 2022)" },
  {
    aspect: "Covers",
    dpdp: "Any personal data breach",
    certin: "20 listed cyber incidents, personal data or not",
  },
  { aspect: "Who to tell", dpdp: "The Board and every affected person", certin: "CERT-In only" },
  {
    aspect: "How fast",
    dpdp: "Without delay; detailed Board report in 72 hours",
    certin: "Within 6 hours of noticing",
  },
  { aspect: "Threshold", dpdp: "None", certin: "Listed incident types" },
];
