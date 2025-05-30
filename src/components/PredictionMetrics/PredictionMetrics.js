import React from 'react';

function PredictionMetrics({ metrics }) {
  const getRMSEClass = (rmse) => {
    const rmseValue = parseFloat(rmse);
    if (rmseValue < 0.05) return 'good';
    if (rmseValue < 0.10) return 'average';
    return 'poor';
  };

  const getR2Class = (r2) => {
    const r2Value = parseFloat(r2);
    if (r2Value > 0.8) return 'good';
    if (r2Value > 0.5) return 'average';
    return 'poor';
  };

  const getF1Class = (f1) => {
    const f1Value = parseFloat(f1);
    if (f1Value > 0.7) return 'good';
    if (f1Value > 0.5) return 'average';
    return 'poor';
  };

  return (
    <div className="prediction-metrics">
      <div className="metrics-container">
        <div className="metric-card">
          <h3 className="metric-title">RMSE</h3>
          <div className={`metric-value metric-${getRMSEClass(metrics.rmse)}`}>
            {metrics.rmse}
          </div>
          <div className="metric-description">
            Root Mean Square Error
            <span className="metric-tooltip" title="Lower is better. Measures the average magnitude of prediction errors.">ⓘ</span>
          </div>
        </div>

        <div className="metric-card">
          <h3 className="metric-title">R² Score</h3>
          <div className={`metric-value metric-${getR2Class(metrics.r2)}`}>
            {metrics.r2}
          </div>
          <div className="metric-description">
            Coefficient of Determination
            <span className="metric-tooltip" title="Higher is better. Measures how well the model explains the variance of the actual price.">ⓘ</span>
          </div>
        </div>

        <div className="metric-card">
          <h3 className="metric-title">F1 Score</h3>
          <div className={`metric-value metric-${getF1Class(metrics.f1)}`}>
            {metrics.f1}
          </div>
          <div className="metric-description">
            Directional Accuracy
            <span className="metric-tooltip" title="Higher is better. Measures how well the model predicts the price movement direction.">ⓘ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionMetrics;