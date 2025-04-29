import React from 'react';

function PredictionMetrics({ metrics }) {
  const getRMSEClass = (rmse) => {
    const rmseValue = parseFloat(rmse);
    if (rmseValue < 10) return 'good';
    if (rmseValue < 30) return 'average';
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

// src/components/PredictionMetrics/PredictionMetrics.js

// import React from 'react';
// import './PredictionMetrics.css';

// const PredictionMetrics = ({ 
//   currentPrice = '2331.86', 
//   predictedPrice = '2722.45', 
//   expectedChange = '8.98',
//   metrics = { rmse: '56.76', r2: '-0.20', f1: '0.50' },
//   lstmParams = {
//     sequenceLength: 10,
//     lstmUnits: 50,
//     dropoutRate: 0.2,
//     learningRate: 0.001
//   }
// }) => {
//   return (
//     <div className="prediction-metrics">
//       <h2 className="prediction-metrics-title">Market Analysis Using LSTM</h2>
      
//       <div className="lstm-parameters-section">
//         <h3 className="lstm-parameters-title">LSTM Model Parameters</h3>
//         <ul className="parameters-list">
//           <li className="parameter-item">
//             <span className="parameter-label">Sequence Length:</span>
//             <span className="parameter-value">{lstmParams.sequenceLength}</span>
//           </li>
//           <li className="parameter-item">
//             <span className="parameter-label">LSTM Units:</span>
//             <span className="parameter-value">{lstmParams.lstmUnits}</span>
//           </li>
//           <li className="parameter-item">
//             <span className="parameter-label">Dropout Rate:</span>
//             <span className="parameter-value">{lstmParams.dropoutRate}</span>
//           </li>
//           <li className="parameter-item">
//             <span className="parameter-label">Learning Rate:</span>
//             <span className="parameter-value">{lstmParams.learningRate}</span>
//           </li>
//         </ul>
//       </div>
      
//       {/* Model Performance */}
//       <div className="model-performance-section">
//         <h3 className="model-performance-title">Model Performance</h3>
//         <div className="metrics-list">
//           <div className="metric-item">
//             <div className="metric-label">RMSE:</div>
//             <div className="metric-value">{metrics.rmse}</div>
//             <div className="metric-description">Lower values indicate better prediction accuracy</div>
//           </div>
//           <div className="metric-item">
//             <div className="metric-label">R² Score:</div>
//             <div className="metric-value">{metrics.r2}</div>
//             <div className="metric-description">Higher values (closer to 1) indicate better model fit</div>
//           </div>
//           <div className="metric-item">
//             <div className="metric-label">Directional Accuracy (F1):</div>
//             <div className="metric-value">{metrics.f1}</div>
//             <div className="metric-description">Higher values indicate better prediction of price movement direction</div>
//           </div>
//         </div>
//       </div>
      
//       {/* Price Trend Analysis */}
//       <div className="price-trend-section">
//         <h4 className="forecast-title">30-Day Forecast:</h4>
//         <div className="forecast-details">
//           <div className="forecast-row">
//             <span className="forecast-label">Current Price:</span>
//             <span className="forecast-value">₹{currentPrice}</span>
//           </div>
//           <div className="forecast-row">
//             <span className="forecast-label">Predicted Price (30 days):</span>
//             <span className="forecast-value">₹{predictedPrice}</span>
//           </div>
//           <div className="forecast-row">
//             <span className="forecast-label">Expected Change:</span>
//             <span className={`forecast-value ${parseFloat(expectedChange) >= 0 ? 'positive' : 'negative'}`}>
//               {parseFloat(expectedChange) >= 0 ? '+' : ''}{expectedChange}%
//             </span>
//           </div>
//         </div>
//       </div>
      
//       <div className="data-preprocessing-section">
//         <h3 className="data-preprocessing-title">Data Preprocessing Steps</h3>
//         <div className="preprocessing-steps">
//           <div className="preprocessing-step">
//             <div className="step-number">1</div>
//             <div className="step-content">
//               <div className="step-title">Clean and format stock data and news data</div>
//               <div className="step-description">
//                 Remove missing values, standardize formats, and ensure data integrity
//               </div>
//             </div>
//           </div>
          
//           <div className="preprocessing-step">
//             <div className="step-number">2</div>
//             <div className="step-content">
//               <div className="step-title">Merge stock data with sentiment scores on a daily basis</div>
//               <div className="step-description">
//                 Combine price movement data with aggregated sentiment from news sources
//               </div>
//             </div>
//           </div>
          
//           <div className="preprocessing-step">
//             <div className="step-number">3</div>
//             <div className="step-content">
//               <div className="step-title">Normalize/scale the data for LSTM input</div>
//               <div className="step-description">
//                 Apply min-max normalization to ensure all features have equal influence
//               </div>
//             </div>
//           </div>
          
//           <div className="preprocessing-step">
//             <div className="step-number">4</div>
//             <div className="step-content">
//               <div className="step-title">Create time series sequences for LSTM training</div>
//               <div className="step-description">
//                 Generate sliding window sequences of length {lstmParams.sequenceLength} for model training
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PredictionMetrics;