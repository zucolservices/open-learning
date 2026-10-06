# Sources: Probabilities you can trust (fact-checked 2026-10-06)

- Murphy & Winkler (1977 and later): reliability of US NWS precipitation probability forecasts (abstract-level verification; no specific figures quoted).
- G. W. Brier, "Verification of forecasts expressed in terms of probability", Monthly Weather Review (1950).
- Platt (1999); Zadrozny & Elkan (2002) applying isotonic regression to calibration.
- Niculescu-Mizil & Caruana, "Predicting good probabilities with supervised learning", ICML 2005.
- Naeini, Cooper & Hauskrecht, expected calibration error, AAAI 2015.
- Guo et al., "On calibration of modern neural networks", ICML 2017.
- scikit-learn 1.9 docs: CalibratedClassifierCV (sigmoid, isotonic, temperature since 1.8), FrozenEstimator (cv="prefit" deprecated), CalibrationDisplay.

Predictions are made up; reliability bins, Brier score, ECE and Platt scaling are computed live.
