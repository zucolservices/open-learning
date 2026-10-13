/** One application form in four languages, and the problems that break it. Translations are illustrative. */

export type Lang = "en" | "hi" | "ta" | "ur";

export const LANGS: [Lang, string][] = [
  ["en", "English"],
  ["hi", "हिन्दी"],
  ["ta", "தமிழ்"],
  ["ur", "اردو"],
];

export const STRINGS: Record<
  Lang,
  { name: string; income: string; submit: string; locale: string }
> = {
  en: {
    name: "Applicant's full name",
    income: "Annual family income (₹)",
    submit: "Submit application",
    locale: "en-IN",
  },
  hi: {
    name: "आवेदक का पूरा नाम",
    income: "वार्षिक पारिवारिक आय (₹)",
    submit: "आवेदन जमा करें",
    locale: "hi-IN",
  },
  ta: {
    name: "விண்ணப்பதாரரின் முழுப் பெயர்",
    income: "ஆண்டு குடும்ப வருமானம் (₹)",
    submit: "விண்ணப்பத்தைச் சமர்ப்பிக்கவும்",
    locale: "ta-IN",
  },
  ur: {
    name: "درخواست گزار کا پورا نام",
    income: "سالانہ خاندانی آمدنی (₹)",
    submit: "درخواست جمع کریں",
    locale: "ur-IN",
  },
};

export type Fix = "unicode" | "all" | "grow" | "rtl" | "numbers";

export const FIXES: [Fix, string, string][] = [
  [
    "unicode",
    "Store and show text as Unicode",
    "Old pages used custom fonts or images; text then shows as empty boxes without them.",
  ],
  [
    "all",
    "Translate every string, including buttons",
    "Half-translated screens confuse people most.",
  ],
  [
    "grow",
    "Let labels grow instead of fixing their width",
    "Many Indian-language strings are longer or taller than English.",
  ],
  [
    "rtl",
    "Lay out Urdu right to left",
    "Urdu, Kashmiri and Sindhi in Perso-Arabic script run right to left.",
  ],
  ["numbers", "Format numbers the Indian way", "₹2,50,000 (2.5 lakh), not 250000 or 250,000."],
];

export const INCOME = 250000;
