# Sources: Clustering and dimensionality reduction (fact-checked 2026-10-06)

- Lloyd (Bell Labs memo 1957; IEEE Trans. Information Theory 28(2), 1982); MacQueen (1967, "k-means"); Arthur & Vassilvitskii, k-means++ (2007).
- Rousseeuw, silhouettes (1987); elbow method (heuristic).
- Ester, Kriegel, Sander & Xu, DBSCAN (KDD 1996; Test of Time award 2014).
- Pearson (1901); Hotelling (1933): PCA.
- van der Maaten & Hinton, t-SNE (2008); McInnes et al., UMAP (2018).
- scikit-learn 1.9 docs: KMeans (`n_init="auto"` default since 1.4); DBSCAN; HDBSCAN (1.3).

Customers, rings and correlated data are made up; k-means, silhouette and PCA variance are computed live. The DBSCAN panel shows the expected grouping.
