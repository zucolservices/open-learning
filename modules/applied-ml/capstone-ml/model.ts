/** Capstone: a churn model for a made-up phone and internet company. Design choices, then surprises. */

export interface Choice {
  id: string;
  label: string;
  good: boolean;
}

export const DESIGN: { id: string; prompt: string; choices: Choice[]; prevents: string }[] = [
  {
    id: "features",
    prompt: "Which data goes into the model?",
    choices: [
      {
        id: "known",
        label: "Only what we'd know on the day we predict, checked column by column",
        good: true,
      },
      {
        id: "all",
        label: "Every column in the customer warehouse: more data is better",
        good: false,
      },
    ],
    prevents: "leak",
  },
  {
    id: "judge",
    prompt: "How will we judge the model?",
    choices: [
      {
        id: "capacity",
        label:
          "Precision and recall among the 500 customers the team can call each week, against a simple contract-type rule",
        good: true,
      },
      { id: "accuracy", label: "Accuracy on a random test split", good: false },
    ],
    prevents: "accuracy",
  },
  {
    id: "action",
    prompt: "How do we use the scores?",
    choices: [
      {
        id: "control",
        label:
          "Offer discounts to a random half of high-risk customers; the other half is a control group",
        good: true,
      },
      {
        id: "all",
        label: "Call everyone above the threshold and count how many stay",
        good: false,
      },
    ],
    prevents: "uplift",
  },
  {
    id: "serving",
    prompt: "How do scores reach the call centre?",
    choices: [
      {
        id: "shared",
        label:
          "Nightly batch scoring with the same feature code as training, and the served features logged",
        good: true,
      },
      {
        id: "rewrite",
        label: "The CRM team re-implements the features in their own system",
        good: false,
      },
    ],
    prevents: "skew",
  },
  {
    id: "after",
    prompt: "What happens after launch?",
    choices: [
      {
        id: "monitor",
        label:
          "Monthly checks of input drift, score shares and actual churn, with a retraining plan",
        good: true,
      },
      { id: "yearly", label: "Retrain once a year", good: false },
    ],
    prevents: "drift",
  },
];

export interface Incident {
  id: string;
  title: string;
  detail: string;
  fixes: Choice[];
  real: string;
}

export const INCIDENTS: Incident[] = [
  {
    id: "leak",
    title: "A near-perfect model that's useless live",
    detail:
      "Validation AUC was 0.99. In the call centre, the flagged customers had mostly cancelled already: the top feature was “retention call logged”, filled in after a customer asked to leave.",
    fixes: [
      {
        id: "audit",
        label: "Drop the column, check every feature's timestamp, and rebuild the split by time",
        good: true,
      },
      { id: "drop", label: "Drop just that column and retrain", good: false },
    ],
    real: "Target leakage (module 6): any column filled in after the moment of prediction can leak the answer. Check them all, not just the one you caught.",
  },
  {
    id: "accuracy",
    title: "73% accurate, and no help at all",
    detail:
      "The dashboard proudly showed 73% accuracy. About 26.5% of customers leave, so predicting “nobody leaves” scores about 73% too.",
    fixes: [
      {
        id: "pr",
        label:
          "Report precision and recall at the team's weekly call capacity, against a baseline rule",
        good: true,
      },
      { id: "auc", label: "Report a higher-sounding number such as AUC instead", good: false },
    ],
    real: "Accuracy hides rare events (modules 12 and 14). Measure what the decision needs: how many of the 500 calls reach people who'd actually leave.",
  },
  {
    id: "uplift",
    title: "Calls went out; churn didn't fall",
    detail:
      "The team called the riskiest customers with offers. Churn among them stayed high, and some customers who'd forgotten about their contract cancelled after the call reminded them.",
    fixes: [
      {
        id: "test",
        label:
          "Run the offer as an experiment with a random control group, and target those whom the call actually helps",
        good: true,
      },
      { id: "bigger", label: "Make the discount bigger", good: false },
    ],
    real: "Predicting who will leave isn't knowing whom a call will change. Some stay anyway, some leave anyway, a few leave because you called. Only a control group shows the difference.",
  },
  {
    id: "skew",
    title: "Scores in the CRM don't match the notebook",
    detail:
      "The CRM's version of “tenure” counted days, not months. Long-standing customers suddenly looked brand new, and risky.",
    fixes: [
      {
        id: "share",
        label:
          "Use one shared feature definition for training and scoring, and log the features actually served",
        good: true,
      },
      { id: "convert", label: "Ask the CRM team to divide by 30", good: false },
    ],
    real: "Training-serving skew (module 19) fails silently. One definition, plus logs of what was served, stops this whole class of bug.",
  },
  {
    id: "drift",
    title: "Six months later, precision halves",
    detail:
      "A competitor launched cheap fibre plans, and the company introduced new contract types the model had never seen.",
    fixes: [
      {
        id: "watch",
        label: "Add drift and outcome monitoring, and retrain and re-test when it fires",
        good: true,
      },
      { id: "wait", label: "Wait for the yearly retrain", good: false },
    ],
    real: "The world moved (module 20). Monitoring catches it; a retraining plan, tested against the current model, fixes it.",
  },
];
