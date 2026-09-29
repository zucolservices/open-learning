/** Failing questions and the technique that fixes each. Passages are the hybrid-module set. */
export type Technique = "rewrite" | "decompose" | "expand" | "translate" | "hyde";

export const CASES: {
  id: string;
  title: string;
  history?: string[];
  q: string;
  gold: string[];
  technique: Technique;
  instruction: string;
}[] = [
  {
    id: "followup",
    title: "A vague follow-up",
    history: [
      "User: What documents do I need for a new water connection?",
      "Assistant: The latest property tax receipt, proof of ownership or a rent agreement, and an identity proof.",
    ],
    q: "How long does it take?",
    gold: ["water-3", "rules-2"],
    technique: "rewrite",
    instruction:
      "Rewrite the user's last message as one standalone search question that makes sense without the conversation. Reply with the question only.",
  },
  {
    id: "two",
    title: "Two questions in one",
    q: "What's the penalty for paying property tax late, and when do I have to renew my shop licence?",
    gold: ["property-tax-2", "trade-2"],
    technique: "decompose",
    instruction:
      "Split the question into separate, self-contained search questions, one per line. Reply with the questions only.",
  },
  {
    id: "jargon",
    title: "Words the documents don't use",
    q: "Is there any concession on house tax for paying in advance?",
    gold: ["property-tax-1"],
    technique: "expand",
    instruction:
      "Rewrite the question using the formal words a municipal corporation's documents would use. Reply with the rewritten question only.",
  },
  {
    id: "roman",
    title: "Hindi in English letters",
    q: "sukha kachra kab uthaya jata hai?",
    gold: ["waste-1"],
    technique: "translate",
    instruction:
      "The user is asking the Kalpanagar municipal help desk a question in Hindi written in Latin letters. Translate it into English. Reply with the English question only.",
  },
  {
    id: "hyde",
    title: "A short, abstract question",
    q: "What happens if my BPL card lapses?",
    gold: ["rules-3"],
    technique: "hyde",
    instruction:
      "Write a short paragraph (two or three sentences) that a municipal water-supply rulebook might contain to answer this question. It is only used for searching, so make it sound like the rulebook.",
  },
];
