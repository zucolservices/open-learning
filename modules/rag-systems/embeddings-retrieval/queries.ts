/** The same four questions in three forms. `target` is the help passage that answers them. */
export const LANGS = ["English", "Hindi", "Romanised Hindi"] as const;

export const QUERIES: { target: string; forms: [string, string, string] }[] = [
  {
    target: "waste-1",
    forms: [
      "Which days is dry waste collected?",
      "सूखा कचरा किन दिनों में उठाया जाता है?",
      "sukha kachra kis din uthaya jata hai?",
    ],
  },
  {
    target: "water-1",
    forms: [
      "What documents do I need for a new water connection?",
      "नए पानी के कनेक्शन के लिए कौन से दस्तावेज़ चाहिए?",
      "naye paani connection ke liye kaunse documents chahiye?",
    ],
  },
  {
    target: "property-tax-1",
    forms: [
      "Is there a discount for paying property tax early?",
      "संपत्ति कर जल्दी भरने पर छूट मिलती है क्या?",
      "property tax jaldi bharne par chhoot milti hai kya?",
    ],
  },
  {
    target: "waste-1",
    forms: [
      "When will they pick up my rubbish?",
      "मेरा कूड़ा कब ले जाएंगे?",
      "mera kooda kab le jayenge?",
    ],
  },
];

export const MODELS = [
  {
    id: "minilm",
    name: "all-MiniLM-L6-v2",
    note: "Small and fast; trained on English",
  },
  {
    id: "para",
    name: "paraphrase-multilingual-MiniLM-L12-v2",
    note: "Multilingual; built for sentence similarity, not search",
  },
  {
    id: "e5",
    name: "multilingual-e5-small",
    note: "Multilingual; used in the earlier modules",
  },
  {
    id: "bgem3",
    name: "bge-m3",
    note: "Larger multilingual model (about 568M parameters)",
  },
] as const;
