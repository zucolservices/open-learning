/** Public benchmarks: what each tests and how much life it has left. Model scores are fictional. */

export type Status = "saturated" | "retired" | "hard" | "useful";

export interface Bench {
  id: string;
  name: string;
  tests: string;
  size: string;
  born: string;
  status: Status;
  note: string;
  score: string; // fictional "Model X" score
}

export const BENCHES: Bench[] = [
  {
    id: "mmlu",
    name: "MMLU",
    tests: "Knowledge: four-option questions across 57 school and professional subjects",
    size: "about 15,900",
    born: "2020",
    status: "saturated",
    note: "Top models score so high it no longer separates them; one review estimated about 6.5% of questions have errors.",
    score: "92.1%",
  },
  {
    id: "mmlupro",
    name: "MMLU-Pro",
    tests: "Harder knowledge and reasoning, ten options so guessing is worth less",
    size: "about 12,000",
    born: "2024",
    status: "useful",
    note: "Built because MMLU wore out.",
    score: "84.0%",
  },
  {
    id: "gpqa",
    name: "GPQA Diamond",
    tests: "“Google-proof” graduate science questions",
    size: "198 (of 448)",
    born: "2023",
    status: "useful",
    note: "On the full set, PhD experts scored about 65%; skilled non-experts about 34% even with 30+ minutes of searching.",
    score: "81.5%",
  },
  {
    id: "humaneval",
    name: "HumanEval",
    tests: "Write Python functions that pass unit tests",
    size: "164",
    born: "2021",
    status: "saturated",
    note: "Small and widely seen; scores cluster near the top.",
    score: "96.3%",
  },
  {
    id: "gsm8k",
    name: "GSM8K",
    tests: "Grade-school maths word problems",
    size: "about 8,500",
    born: "2021",
    status: "saturated",
    note: "Saturated, and one review judged many questions flawed.",
    score: "97.0%",
  },
  {
    id: "swe",
    name: "SWE-bench Verified",
    tests: "Fix real GitHub issues; graded by the project's tests",
    size: "500",
    born: "2024",
    status: "retired",
    note: "In Feb 2026 OpenAI stopped reporting it, citing flawed tests and models having seen the answers in training.",
    score: "71.8%",
  },
  {
    id: "hle",
    name: "Humanity's Last Exam",
    tests: "Expert-written questions at the edge of human knowledge",
    size: "2,500",
    born: "2025",
    status: "hard",
    note: "A cleaned 1,000-question “Diamond” set followed in Sep 2026.",
    score: "34.2%",
  },
  {
    id: "arc",
    name: "ARC-AGI-3",
    tests: "Learn new skills on the fly in interactive puzzle games",
    size: "games",
    born: "2026",
    status: "hard",
    note: "At launch in Mar 2026: humans 100%, AI 0.51%.",
    score: "3.1%",
  },
  {
    id: "fm",
    name: "FrontierMath",
    tests: "Research-level mathematics",
    size: "hundreds",
    born: "2024",
    status: "hard",
    note: "Under 2% solved at launch. OpenAI funded it and owns most problems, disclosed later.",
    score: "18.7%",
  },
];

export const LIFESPANS: { name: string; born: number; saturated: number | null }[] = [
  { name: "GSM8K", born: 2021, saturated: 2024 },
  { name: "HumanEval", born: 2021, saturated: 2024 },
  { name: "MMLU", born: 2020, saturated: 2024 },
  { name: "GPQA", born: 2023.9, saturated: null },
  { name: "HLE", born: 2025.1, saturated: null },
  { name: "ARC-AGI-3", born: 2026.2, saturated: null },
];
