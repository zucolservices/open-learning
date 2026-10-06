# Sources: Decision trees (fact-checked 2026-10-06)

- Breiman, Friedman, Olshen & Stone, _Classification and Regression Trees_ (CART, 1984).
- Quinlan, "Induction of decision trees", Machine Learning 1(1):81–106 (ID3, 1986); _C4.5: Programs for Machine Learning_ (1993; gain ratio).
- scikit-learn 1.9 docs: DecisionTreeClassifier (optimised CART; criterion="gini", max_depth=None, ccp_alpha=0.0); entropy in bits; missing-value support since 1.3; trees need no scaling; instability.

Applicants are made up; the tree is grown live with Gini impurity on the training set and scored on a separate validation set.
