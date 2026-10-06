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
  "training-set": {
    term: "Training set",
    definition: "The examples a model learns from.",
    module: "data-splits",
  },
  "validation-set": {
    term: "Validation set",
    definition: "Examples held back from training and used to compare models and choose settings.",
    module: "data-splits",
  },
  "test-set": {
    term: "Test set",
    definition:
      "Examples kept sealed until the end and used once to estimate how the final model will do on new data.",
    module: "data-splits",
  },
  "cross-validation": {
    term: "Cross-validation",
    definition:
      "Splitting the training data into k chunks, training k times with a different chunk held out each time, and averaging the scores.",
    module: "data-splits",
  },
  "feature-engineering": {
    term: "Feature engineering",
    definition:
      "Turning raw data such as dates, categories and event logs into numeric features that help a model learn.",
    module: "feature-engineering",
  },
  "one-hot-encoding": {
    term: "One-hot encoding",
    definition: "Turning one category column into several yes/no columns, one per possible value.",
    module: "feature-engineering",
  },
  "target-encoding": {
    term: "Target encoding",
    definition:
      "Replacing each category with the average outcome for that category. Must be computed out-of-fold, or it leaks the answer.",
    module: "feature-engineering",
  },
  "feature-scaling": {
    term: "Feature scaling",
    definition:
      "Putting numeric features on comparable ranges, for example mean 0 and spread 1, so no feature dominates just because of its units.",
    module: "feature-engineering",
  },
  "data-leakage": {
    term: "Data leakage",
    definition:
      "Information a model won't have in real use sneaking into training or evaluation, making test scores look far better than real performance.",
    module: "data-leakage",
  },
  "target-leakage": {
    term: "Target leakage",
    definition:
      "A feature that is only known after the outcome, such as a cancellation reason when predicting cancellations.",
    module: "data-leakage",
  },
  "train-test-contamination": {
    term: "Train–test contamination",
    definition:
      "Test data influencing training, for example by fitting a scaler, encoder or feature selector on all the data before splitting.",
    module: "data-leakage",
  },
  "linear-model": {
    term: "Linear model",
    definition:
      "A model whose prediction is a starting amount plus each feature multiplied by a learned weight.",
    module: "linear-models",
  },
  "loss-function": {
    term: "Loss function",
    definition:
      "A formula that scores how wrong a model's predictions are, such as the mean of squared errors. Training tries to make it as small as possible.",
    module: "linear-models",
  },
  "gradient-descent": {
    term: "Gradient descent",
    definition:
      "Training by repeatedly nudging the weights a small step in the direction that reduces the loss fastest.",
    module: "linear-models",
  },
  "learning-rate": {
    term: "Learning rate",
    definition:
      "How big each gradient-descent step is. Too small and training crawls; too big and it overshoots or diverges.",
    module: "linear-models",
  },
  "logistic-regression": {
    term: "Logistic regression",
    definition:
      "A linear model for yes/no outcomes: the weighted sum goes through an S-shaped sigmoid curve to give a probability.",
    module: "linear-models",
  },
  "odds-ratio": {
    term: "Odds ratio",
    definition:
      "How many times the odds of an outcome multiply when a feature goes up by one unit. In logistic regression it is e raised to the weight.",
    module: "linear-models",
  },
  "decision-tree": {
    term: "Decision tree",
    definition:
      "A model that makes predictions by asking a series of yes/no questions about the features, like a flowchart ending in leaves.",
    module: "decision-trees",
  },
  overfitting: {
    term: "Overfitting",
    definition:
      "When a model learns the quirks and noise of its training data so closely that it does worse on new data.",
    module: "decision-trees",
  },
  "gini-impurity": {
    term: "Gini impurity",
    definition:
      "A score for how mixed a group is: 0 when every example has the same outcome, highest for an even mix. Trees choose splits that reduce it.",
    module: "decision-trees",
  },
  ensemble: {
    term: "Ensemble",
    definition: "A model made by combining many models, whose errors partly cancel out.",
    module: "ensembles",
  },
  bagging: {
    term: "Bagging",
    definition:
      "Training many models on random resamples of the data and averaging their predictions, which smooths out jumpy models.",
    module: "ensembles",
  },
  "random-forest": {
    term: "Random forest",
    definition:
      "An ensemble of decision trees, each trained on a random resample of the data and limited to random features at each split, that vote on the answer.",
    module: "ensembles",
  },
  boosting: {
    term: "Boosting",
    definition:
      "Building an ensemble one model at a time, with each new model focusing on the examples the previous ones got wrong.",
    module: "ensembles",
  },
  "gradient-boosting": {
    term: "Gradient boosting",
    definition:
      "Boosting where each new tree is fitted to the ensemble's remaining errors, scaled by a learning rate. XGBoost, LightGBM and CatBoost implement it.",
    module: "ensembles",
  },
  underfitting: {
    term: "Underfitting",
    definition:
      "When a model is too simple to capture the real pattern, so it does poorly even on its training data.",
    module: "overfitting",
  },
  "bias-variance-tradeoff": {
    term: "Bias–variance trade-off",
    definition:
      "The tension between models that are too simple and consistently wrong (bias) and models so flexible they change with every sample (variance).",
    module: "overfitting",
  },
  regularisation: {
    term: "Regularisation",
    definition:
      "Adding a penalty for complexity, such as large weights, so a model can't bend too far to fit noise. Ridge (L2) and lasso (L1) are common forms.",
    module: "overfitting",
  },
  "learning-curve": {
    term: "Learning curve",
    definition:
      "A chart of training and validation error as the amount of training data grows, used to diagnose overfitting or underfitting.",
    module: "overfitting",
  },
  clustering: {
    term: "Clustering",
    definition:
      "Grouping similar items together without labels, for example splitting customers into segments.",
    module: "unsupervised",
  },
  "k-means": {
    term: "k-means",
    definition:
      "A clustering method that repeatedly assigns each point to the nearest of k centres and moves each centre to the average of its points.",
    module: "unsupervised",
  },
  pca: {
    term: "PCA",
    definition:
      "Principal component analysis: finds the directions in which data varies most, so many columns can be summarised by a few.",
    module: "unsupervised",
  },
  "decision-threshold": {
    term: "Decision threshold",
    definition:
      "The score above which a classifier says “yes”. Moving it trades false alarms against misses.",
    module: "classification-metrics",
  },
  "confusion-matrix": {
    term: "Confusion matrix",
    definition:
      "A table counting a classifier's true positives, false positives, false negatives and true negatives.",
    module: "classification-metrics",
  },
  precision: {
    term: "Precision",
    definition: "Of the cases a model flags as positive, the share that really are positive.",
    module: "classification-metrics",
  },
  recall: {
    term: "Recall",
    definition:
      "Of all the real positive cases, the share the model catches. Also called sensitivity or true positive rate.",
    module: "classification-metrics",
  },
  "roc-curve": {
    term: "ROC curve",
    definition:
      "A chart of true positive rate against false positive rate at every threshold, showing a classifier's whole trade-off.",
    module: "classification-metrics",
  },
  auc: {
    term: "AUC",
    definition:
      "Area under the ROC curve: the chance a randomly chosen positive gets a higher score than a randomly chosen negative. 0.5 is guessing, 1 is perfect ranking.",
    module: "classification-metrics",
  },
} satisfies Record<string, GlossaryEntry>;
