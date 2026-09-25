/**
 * The branching scenario: six design decisions for "Sahayak", an assistant that helps citizens
 * check their eligibility for a state welfare scheme. Each option carries its consequence and the
 * risks it leaves open. There is no score: the review at the end lists what each choice leads to.
 */

export type Verdict = "good" | "risky" | "harm";

export interface Option {
  id: string;
  label: string;
  consequence: string;
  verdict: Verdict;
  /** Short names of risks this choice leaves open. */
  risks: string[];
}

export interface Decision {
  id: string;
  area: "Role" | "Data" | "Consent" | "Bias" | "Oversight" | "Transparency";
  question: string;
  context: string;
  options: Option[];
}

export const DECISIONS: Decision[] = [
  {
    id: "role",
    area: "Role",
    question: "What job does the model do?",
    context:
      "The scheme has written rules: income and land limits, a few documents. Someone has to apply them to each applicant.",
    options: [
      {
        id: "decide",
        label: "The LLM reads the application and decides eligible or not",
        verdict: "harm",
        consequence:
          "Fast to build, but the model can get a clear case wrong and answer differently for the same facts. You'll see this with real models on the next step. A wrong “no” means a family misses support it's entitled to.",
        risks: ["Wrong refusals", "Inconsistent answers"],
      },
      {
        id: "assist",
        label:
          "Written rules in ordinary code decide; the LLM explains the scheme, asks for missing details and translates",
        verdict: "good",
        consequence:
          "The decision is predictable, testable and the same for everyone. The model does what it's good at: plain-language explanation in the citizen's own language.",
        risks: [],
      },
      {
        id: "decide-signoff",
        label: "The LLM decides, and an officer signs off every refusal",
        verdict: "risky",
        consequence:
          "Better than no review, but officers who see hundreds of AI refusals a day tend to agree with them (automation bias). Why ask a model to apply rules that code can apply exactly?",
        risks: ["Rubber-stamp reviews"],
      },
    ],
  },
  {
    id: "data",
    area: "Data",
    question: "What personal data does it collect?",
    context:
      "The scheme needs household income, land held and district. Some people suggest collecting more, “in case it's useful”.",
    options: [
      {
        id: "everything",
        label: "Everything: Aadhaar number, religion, caste, phone contacts, the full chat",
        verdict: "harm",
        consequence:
          "Data you don't need is data you can leak, and a model given religion or caste may lean on them. Under the DPDP Act, consent covers only the personal data necessary for the stated purpose.",
        risks: ["Breach exposure", "Sensitive attributes in the model's view"],
      },
      {
        id: "minimal",
        label: "Only the fields the rules need, deleted once the application is closed",
        verdict: "good",
        consequence:
          "Data minimisation: less to protect, less to leak, and nothing irrelevant for the model to be swayed by. The DPDP Act also expects data to be erased once its purpose is served.",
        risks: [],
      },
      {
        id: "keep",
        label: "Only the needed fields, but keep every chat forever to improve the model",
        verdict: "risky",
        consequence:
          "Collection is fine; keeping chats forever for a different purpose isn't covered by the reason you collected them. That needs its own clear basis, or proper anonymisation.",
        risks: ["Purpose creep", "Growing store of personal data"],
      },
    ],
  },
  {
    id: "consent",
    area: "Consent",
    question: "How do you tell citizens, and on what basis do you use their data?",
    context:
      "The users are citizens of Karnataka: many prefer Kannada, some Hindi or Urdu, some English. Some use a shared family phone.",
    options: [
      {
        id: "pretick",
        label: "A pre-ticked “I agree” box linked to a long English privacy policy",
        verdict: "harm",
        consequence:
          "Under the DPDP Act, consent must be free, specific, informed and given by a clear affirmative action; a box ticked in advance isn't the user acting. A policy most users can't read isn't informed either.",
        risks: ["Invalid consent", "Users can't understand the notice"],
      },
      {
        id: "notice",
        label:
          "Rely on the Act's allowance for State benefits, give a short notice in the user's language, and ask separately before reusing chats",
        verdict: "good",
        consequence:
          "The DPDP Act lets the State use personal data to provide listed benefits without fresh consent, where the person has already consented to a State scheme or the data is in a notified government database, following government standards. People still get a clear notice in a language they read. Reusing chats for a new purpose gets its own opt-in, easy to withdraw.",
        risks: [],
      },
      {
        id: "none",
        label: "No notice needed: it's a government service",
        verdict: "risky",
        consequence:
          "The State's allowance covers providing the benefit, not silence. People should know what's collected, why, and how to correct it or complain. Without that, trust (and grievance handling) suffers.",
        risks: ["Citizens unaware of what's collected"],
      },
    ],
  },
  {
    id: "bias",
    area: "Bias",
    question: "How do you check for bias before launch?",
    context:
      "The model will talk to women and men, in several languages, from every district and community.",
    options: [
      {
        id: "accuracy",
        label: "Measure overall accuracy on 200 test applications",
        verdict: "risky",
        consequence:
          "A single average hides groups. 95% overall can mean 99% for one language and 80% for another. You won't know unless you split results by group.",
        risks: ["Unequal errors hidden by averages"],
      },
      {
        id: "counterfactual",
        label:
          "Swap names, genders and languages on identical cases, and compare results for each group",
        verdict: "good",
        consequence:
          "Counterfactual tests show whether an irrelevant detail changes the answer. Splitting results by language and district shows who the assistant serves worse. Repeat after every model or prompt change.",
        risks: [],
      },
      {
        id: "vendor",
        label: "Rely on the model provider's published fairness report",
        verdict: "harm",
        consequence:
          "The provider tested their model on their tasks, not your scheme, your languages or your prompt. Bias depends on how you use the model, so you have to measure it yourself.",
        risks: ["Bias never measured for this use"],
      },
    ],
  },
  {
    id: "oversight",
    area: "Oversight",
    question: "Who has the final say, and what if someone disagrees?",
    context:
      "Some applicants will be told they're not eligible. Some of those answers will be wrong.",
    options: [
      {
        id: "auto",
        label: "Fully automatic: the assistant's answer is final",
        verdict: "harm",
        consequence:
          "This is how Australia's Robodebt and the Dutch childcare-benefits scandal went wrong: automated decisions about benefits with no easy way to be heard. Mistakes land hardest on the people least able to fight them.",
        risks: ["No route to correct mistakes"],
      },
      {
        id: "human",
        label:
          "Every “not eligible” or unsure case goes to an officer, with the reason shown and a simple appeal",
        verdict: "good",
        consequence:
          "People stay in charge of decisions that matter. Showing the reason lets officers check the logic instead of rubber-stamping, and appeals catch what everyone missed.",
        risks: [],
      },
      {
        id: "sample",
        label: "An officer spot-checks 1% of answers each week",
        verdict: "risky",
        consequence:
          "Spot checks help find patterns, but the other 99% of wrongly refused people still get a final “no” with nobody to talk to.",
        risks: ["Most refusals never reviewed"],
      },
    ],
  },
  {
    id: "transparency",
    area: "Transparency",
    question: "How does the assistant present itself?",
    context: "Many users have never used a chatbot before.",
    options: [
      {
        id: "persona",
        label: "As “Meena from the department”, a friendly officer",
        verdict: "harm",
        consequence:
          "People trust a human officer's word differently. Pretending to be one misleads them, and makes them less likely to question a wrong answer.",
        risks: ["Users misled about who they're talking to"],
      },
      {
        id: "clear",
        label:
          "Says it's an AI assistant, explains each answer in plain words, and shows how to reach a person",
        verdict: "good",
        consequence:
          "Users know what they're dealing with, understand why, and know where to go when it's wrong. That's what “understandable by design” means in practice.",
        risks: [],
      },
      {
        id: "footer",
        label: "A small “AI may make mistakes” line at the bottom",
        verdict: "risky",
        consequence:
          "Better than nothing, but a footnote doesn't explain the answer or offer a route to a human. Few people read it.",
        risks: ["Answers not explained"],
      },
    ],
  },
];
