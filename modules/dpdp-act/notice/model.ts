/**
 * A flawed sign-up notice for a made-up fitness app, FitPulse. Each line has a flaw, the
 * provision it breaks, and a fixed version. Requirements: DPDP Act s.5 and s.6(3)-(4), and Rule 3
 * (in force from May 2027).
 */

export interface Line {
  id: string;
  bad: string;
  good: string;
  rule: string;
  why: string;
}

export const LINES: Line[] = [
  {
    id: "when",
    bad: "Shown on the settings page, after sign-up is complete.",
    good: "Shown on the sign-up screen, before the consent box.",
    rule: "s.5(1)",
    why: "A consent request must be 'accompanied or preceded by' the notice, not followed by it.",
  },
  {
    id: "standalone",
    bad: "By continuing you agree to our Privacy Policy.",
    good: "This notice explains everything you need to decide. You don't need to read anything else.",
    rule: "Rule 3(a)",
    why: "The notice must be understandable on its own, independent of other documents.",
  },
  {
    id: "data",
    bad: "We collect information you provide and information about your device.",
    good: "We'll collect: your name, mobile number, date of birth, height and weight, and step counts from your phone.",
    rule: "Rule 3(b)(i)",
    why: "The personal data must be itemised, not described in vague categories.",
  },
  {
    id: "purpose",
    bad: "To improve our services and for other business purposes.",
    good: "To build your workout plan and track your progress in the app. We won't use it for advertising.",
    rule: "Rule 3(b)(ii)",
    why: "Purposes must be specified, with a specific description of the service or use they enable.",
  },
  {
    id: "withdraw",
    bad: "To stop, email legal@fitpulse.example and allow 30 days.",
    good: "Change your mind any time: Settings → Privacy → Withdraw consent, one tap, just like giving it.",
    rule: "s.6(4), Rule 3(c)(i)",
    why: "Withdrawing must be as easy as consenting. A one-tap yes needs a comparable no.",
  },
  {
    id: "complain",
    bad: "Questions? Contact us.",
    good: "Use your rights or raise a grievance at fitpulse.example/privacy, or call our helpline. If we don't resolve it, you can complain to the Data Protection Board of India.",
    rule: "s.5(1), Rule 3(c)(ii)–(iii)",
    why: "The notice must say how to exercise rights and how to complain to the Board, with a link and any other means.",
  },
  {
    id: "language",
    bad: "English only.",
    good: "Read this notice in: English · हिन्दी · தமிழ் · বাংলা · and 19 more.",
    rule: "s.5(3)",
    why: "People must have the option to read the notice in English or any of the 22 languages in the Constitution's Eighth Schedule.",
  },
];

export const LANGUAGES = [
  "Assamese",
  "Bengali",
  "Bodo",
  "Dogri",
  "Gujarati",
  "Hindi",
  "Kannada",
  "Kashmiri",
  "Konkani",
  "Maithili",
  "Malayalam",
  "Manipuri",
  "Marathi",
  "Nepali",
  "Odia",
  "Punjabi",
  "Sanskrit",
  "Santali",
  "Sindhi",
  "Tamil",
  "Telugu",
  "Urdu",
];
