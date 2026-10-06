# Sources: Random forests and gradient boosting (fact-checked 2026-10-06)

- F. Galton, "Vox populi", Nature (7 Mar 1907): 787 guesses; published median 1,207 lb vs 1,198 lb; mean from his reply letter. Wallis, Statistical Science (2014): worksheet figures 1,208 and 1,197. "Wisdom of crowds" framing: Surowiecki (2004).
- Breiman, "Bagging predictors" (1996); "Random forests" (2001).
- Freund & Schapire, AdaBoost (EuroCOLT 1995; JCSS 1997); Friedman, "Greedy function approximation: a gradient boosting machine" (2001).
- Chen & Guestrin, XGBoost (KDD 2016; Apache 2.0); Ke et al., LightGBM (NIPS 2017; MIT; moved to lightgbm-org Mar 2026); Prokhorenkova et al., CatBoost (NeurIPS 2018; open-sourced 2017; Apache 2.0); scikit-learn HistGradientBoosting.
- ML Contests, "State of Competitive ML" 2025 report: XGBoost 14, LightGBM 14, CatBoost 8 winning uses.
- Hollmann et al., TabPFN, Nature (Jan 2025).
- XGBoost docs: `early_stopping_rounds` on the constructor.

Applicants are made up; the forest (60 trees, depth 5, bootstrap, one random feature per split) and AdaBoost (60 stumps) are trained live.
