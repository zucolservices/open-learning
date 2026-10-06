# Sources: Data leakage (fact-checked 2026-10-06)

- Kaufman, Rosset, Perlich & Stitelman, "Leakage in Data Mining: Formulation, Detection, and Avoidance" (KDD 2011; ACM TKDD Dec 2012): "leakage in features" and "leakage in training examples"; usually subtle, indirect and unintentional; KDD Cup 2008 patient-ID leak (36% vs ~1–2%).
- Kaggle Learn, "Data Leakage": target leakage, train-test contamination; antibiotics/pneumonia example.
- Kapoor & Narayanan, "Leakage and the reproducibility crisis in machine-learning-based science", Patterns (4 Aug 2023): 294 papers, 17 fields; civil-war prediction.
- Roberts et al., Nature Machine Intelligence (15 Mar 2021): 62 studies; paediatric control images.
- scikit-learn "Common pitfalls and recommended practices": feature selection before splitting on random labels, 0.76 vs 0.5.
- Clever Hans: Oskar Pfungst's investigation (1907).

The churn features and AUC figures are illustrative.
