# Sources: Measuring regression errors (fact-checked 2026-10-06)

- Hyndman & Koehler, "Another look at measures of forecast accuracy", IJF 22(4):679–688 (2006): MASE; recommend against sMAPE. Hyndman blog (16 Apr 2014): MAPE penalises over-forecasts more (correcting the 2006 paper).
- scikit-learn 1.9 docs: mean_absolute_error, root_mean_squared_error (≥ 1.4; `squared=False` removed), mean_absolute_percentage_error (returns a fraction), r2_score (can be negative).
- MAE minimised by the median, MSE by the mean (standard result).

Delivery times, the skewed set and residual patterns are made up; metrics computed live.
