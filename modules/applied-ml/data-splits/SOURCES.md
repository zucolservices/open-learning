# Sources: Training, validation and test sets (fact-checked 2026-10-06)

- scikit-learn 1.9 docs: `train_test_split` (test_size 0.25, stratify None), `KFold` (no shuffle by default), cross-validation default 5 folds, `GroupKFold`, `StratifiedKFold`, `StratifiedGroupKFold`, `TimeSeriesSplit` (gap).
- Google ML Crash Course: validation and test sets "wear out".
- Rajpurkar et al., CheXNet (arXiv 1711.05225 v1 14 Nov 2017: random image split; v2 25 Nov 2017: no patient overlap).
- Roberts et al., "Common pitfalls and recommendations for using machine learning to detect and prognosticate for COVID-19 using chest radiographs and CT scans", Nature Machine Intelligence (15 Mar 2021): 62 studies, none clinically usable; patient-level splits; "Frankenstein" datasets.

Customer grid and scores are illustrative.
