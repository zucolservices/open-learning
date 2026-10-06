# Sources: Rare events and imbalanced data (fact-checked 2026-10-06)

- Kaggle / ULB "Credit Card Fraud Detection" dataset (OpenML 1597): 492 frauds in 284,807 transactions (0.172%), two days in Sept 2013; publishers recommend AUPRC.
- scikit-learn docs: class_weight="balanced" formula; TunedThresholdClassifierCV.
- Chawla et al., "SMOTE: Synthetic Minority Over-sampling Technique", JAIR (2002).
- Elor & Averbuch-Elor, "To SMOTE, or not to SMOTE?" (arXiv preprint, 2022): 73 datasets; no gain for XGBoost/CatBoost; duplication ≈ SMOTE.
- van den Goorbergh et al., "The harm of class imbalance corrections for risk prediction models", JAMIA (2022): logistic regression.
- imbalanced-learn (scikit-learn-contrib, 0.14.x) Pipeline.
- Elkan, "The foundations of cost-sensitive learning" (2001): threshold p* = C_FP / (C_FP + C_FN).

Outcomes per 100,000 transactions and costs are illustrative.
