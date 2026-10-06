import type { GlossaryEntry } from "./types";

/** Applied ML track glossary. `module` slugs refer to this track. */
export const appliedMl = {
  "machine-learning": {
    term: "Machine learning",
    definition:
      "Getting computers to learn patterns from examples instead of following rules a person wrote by hand.",
    module: "what-is-ml",
  },
  feature: {
    term: "Feature",
    definition:
      "One piece of information about an example that a model uses as input, such as a customer's age or the words in an email.",
    module: "what-is-ml",
  },
  label: {
    term: "Label",
    definition:
      "The answer attached to a training example, such as “spam” or a house's sale price, that a supervised model learns to predict.",
    module: "what-is-ml",
  },
  "supervised-learning": {
    term: "Supervised learning",
    definition:
      "Learning from examples that come with the right answer (a label), to predict answers for new examples.",
    module: "what-is-ml",
  },
  "unsupervised-learning": {
    term: "Unsupervised learning",
    definition: "Finding structure, such as groups or unusual items, in data that has no labels.",
    module: "what-is-ml",
  },
  "reinforcement-learning": {
    term: "Reinforcement learning",
    definition: "Learning which actions to take by trial and error, guided by rewards.",
    module: "what-is-ml",
  },
  "tabular-data": {
    term: "Tabular data",
    definition:
      "Data arranged in rows and columns, like a spreadsheet: one row per customer or transaction, one column per fact about it.",
    module: "what-is-ml",
  },
  churn: {
    term: "Churn",
    definition:
      "Customers leaving: cancelling a subscription or not coming back. Each business decides exactly what counts.",
    module: "ml-lifecycle",
  },
  mlops: {
    term: "MLOps",
    definition:
      "Engineering practices that automate training, testing, deploying and monitoring ML models, applying DevOps ideas to data and models.",
    module: "ml-lifecycle",
  },
  classification: {
    term: "Classification",
    definition:
      "Predicting which category something belongs to, such as spam or not spam, or which of several teams should handle a ticket.",
    module: "problem-framing",
  },
  regression: {
    term: "Regression",
    definition: "In machine learning, predicting a number, such as a price or a delivery time.",
    module: "problem-framing",
  },
  ranking: {
    term: "Ranking",
    definition:
      "Predicting an order for a list of items, such as which customers to call first or which products to show first.",
    module: "problem-framing",
  },
  baseline: {
    term: "Baseline",
    definition:
      "A simple reference answer, such as always guessing the most common outcome or a rule of thumb, that a model must clearly beat to be worth using.",
    module: "problem-framing",
  },
  "proxy-label": {
    term: "Proxy label",
    definition:
      "A measurable stand-in for what you really want to predict, such as clicks for enjoyment or cost for health need. Proxies can introduce bias.",
    module: "problem-framing",
  },
} satisfies Record<string, GlossaryEntry>;
