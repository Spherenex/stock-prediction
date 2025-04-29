


// import React, { useState, useEffect } from 'react';
// import StockChart from '../StockChart';
// import NewsSection from '../NewsSection';
// import SentimentAnalysis from '../SentimentAnalysis';
// import PredictionMetrics from '../PredictionMetrics';
// import Loader from '../UI/Loader';
// import stockApi from '../../services/stockApi';
// import sentimentService from '../../services/sentimentService';
// import { StockLSTM } from '../../utils/lstm';
// import { formatDate } from '../../utils/formatters';
// import './Dashboard.css';

// function Dashboard() {
//   const [selectedStock, setSelectedStock] = useState('RELIANCE');
//   const [historicalData, setHistoricalData] = useState([]);
//   const [predictedData, setPredictedData] = useState([]);
//   const [stockNews, setStockNews] = useState([]);
//   const [sentimentScore, setSentimentScore] = useState(0);
//   const [metrics, setMetrics] = useState({ rmse: 0, r2: 0, f1: 0 });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [nifty50Stocks, setNifty50Stocks] = useState([]);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [timeframe, setTimeframe] = useState('30');

//   // Fetch Nifty 50 companies on component mount
//   useEffect(() => {
//     async function fetchStocks() {
//       try {
//         setLoading(true);
//         const stocks = await stockApi.getNifty50Companies();
//         setNifty50Stocks(stocks);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch stock list');
//         setLoading(false);
//       }
//     }
//     fetchStocks();
//   }, []);

//   // Fetch data when selected stock changes
//   useEffect(() => {
//     if (selectedStock) {
//       fetchStockData(selectedStock);
//     }
//   }, [selectedStock]);

//   // Process data and make predictions when historical data changes
//   useEffect(() => {
//     if (historicalData.length > 0 && stockNews.length > 0) {
//       processDataAndPredict();
//     }
//   }, [historicalData, stockNews]);

//   const fetchStockData = async (symbol) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Fetch historical data
//       const histData = await stockApi.getHistoricalData(symbol, 365);
//       setHistoricalData(histData);
      
//       // Fetch news data
//       const newsData = await stockApi.getStockNews(symbol, 10);
//       setStockNews(newsData);
      
//       setLoading(false);
//     } catch (err) {
//       setError(`Error fetching data for ${symbol}`);
//       setLoading(false);
//     }
//   };

//   const processDataAndPredict = async () => {
//     try {
//       setLoading(true);
      
//       // Analyze sentiment from news
//       const sentimentData = sentimentService.analyzeNews(stockNews);
//       setSentimentScore(sentimentData.score);
      
//       // Initialize LSTM model with configuration from the provided file
//       const lstm = new StockLSTM({
//         sequenceLength: 10,
//         epochs: 50,
//         batchSize: 32,
//         units: 50,
//         dropoutRate: 0.2,
//         learningRate: 0.001
//       });
      
//       // Prepare data for LSTM (adds sentiment to stock data)
//       const stockDataWithSentiment = historicalData.map((item, index) => {
//         return {
//           ...item,
//           sentiment: index > historicalData.length - stockNews.length ? 
//                     stockNews[historicalData.length - index - 1]?.sentiment || 0 : 0
//         };
//       });
      
//       // Preprocess data for LSTM
//       const processedData = lstm.preprocessData(stockDataWithSentiment);
      
//       // Make predictions for next 30 days
//       const lastSequence = processedData.sequences.slice(-1)[0];
//       const predictedPrices = lstm.predict(lastSequence, new Array(30).fill(sentimentData.score), 30);
      
//       // Format predictions for display
//       const today = new Date();
//       const formattedPredictions = predictedPrices.map((price, index) => {
//         const date = new Date(today);
//         date.setDate(date.getDate() + index + 1);
//         return {
//           date: formatDate(date),
//           predicted: price,
//           actual: null // Will be filled when actual data becomes available
//         };
//       });
      
//       setPredictedData(formattedPredictions);
      
//       // Calculate accuracy metrics using last 30 days of historical data
//       const actualPrices = historicalData.slice(-30).map(item => item.close);
//       const previousSequence = processedData.sequences.slice(-31)[0];
//       const hindcastPrices = lstm.predict(previousSequence, stockNews.slice(0, 30).map(n => n.sentiment), 30);
      
//       // Calculate metrics
//       const accuracyMetrics = lstm.evaluateModel(actualPrices, hindcastPrices);
//       setMetrics(accuracyMetrics);
      
//       setLoading(false);
//     } catch (err) {
//       console.error('Prediction error:', err);
//       setError('Error processing data or making predictions');
//       setLoading(false);
//     }
//   };

//   const handleStockChange = (e) => {
//     setSelectedStock(e.target.value);
//   };

//   const handleTimeframeChange = (newTimeframe) => {
//     setTimeframe(newTimeframe);
//   };

//   const renderTabContent = () => {
//     if (loading) {
//       return <Loader message="Processing data..." />;
//     }

//     switch (activeTab) {
//       case 'dashboard':
//         return (
//           <>
//             <div className="dashboard-metrics">
//               <PredictionMetrics metrics={metrics} />
//             </div>
            
//             <div className="dashboard-chart">
//               <div className="chart-header">
//                 <h2 className="chart-title">{selectedStock} Price Prediction</h2>
//                 <div className="timeframe-selector">
//                   <button 
//                     className={`timeframe-btn ${timeframe === '30' ? 'active' : ''}`}
//                     onClick={() => handleTimeframeChange('30')}
//                   >
//                     30 Days
//                   </button>
//                   <button 
//                     className={`timeframe-btn ${timeframe === '90' ? 'active' : ''}`}
//                     onClick={() => handleTimeframeChange('90')}
//                   >
//                     90 Days
//                   </button>
//                   <button 
//                     className={`timeframe-btn ${timeframe === '365' ? 'active' : ''}`}
//                     onClick={() => handleTimeframeChange('365')}
//                   >
//                     1 Year
//                   </button>
//                 </div>
//               </div>
//               <StockChart 
//                 historicalData={historicalData} 
//                 predictedData={predictedData}
//                 stockSymbol={selectedStock}
//                 timeframe={timeframe}
//               />
//               <div className="chart-legend">
//                 <div className="legend-item">
//                   <span className="legend-color actual"></span>
//                   <span className="legend-text">Actual Price</span>
//                 </div>
//                 <div className="legend-item">
//                   <span className="legend-color predicted"></span>
//                   <span className="legend-text">Predicted Price (Next 30 Days)</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="dashboard-bottom">
//               <div className="sentiment-section">
//                 <div className="model-performance-section">
//                   <h3 className="model-performance-title">Model Performance</h3>
//                   <div className="metrics-list">
//                     <div className="metric-item">
//                       <div className="metric-label">RMSE:</div>
//                       <div className="metric-value">{metrics.rmse}</div>
//                       <div className="metric-description">Lower values indicate better prediction accuracy</div>
//                     </div>
//                     <div className="metric-item">
//                       <div className="metric-label">R² Score:</div>
//                       <div className="metric-value">{metrics.r2}</div>
//                       <div className="metric-description">Higher values (closer to 1) indicate better model fit</div>
//                     </div>
//                     <div className="metric-item">
//                       <div className="metric-label">Directional Accuracy (F1):</div>
//                       <div className="metric-value">{metrics.f1}</div>
//                       <div className="metric-description">Higher values indicate better prediction of price movement direction</div>
//                     </div>
//                   </div>
//                   <button 
//                     className="view-more-btn"
//                     onClick={() => setActiveTab('analysis')}
//                   >
//                     Click here to view complete analysis
//                   </button>
//                 </div>
//               </div>
              
//               <div className="news-section">
//                 <div className="news-preview">
//                   <h3 className="news-preview-title">Latest News</h3>
//                   <div className="news-preview-items">
//                     {stockNews.slice(0, 3).map(item => (
//                       <div key={item.id} className="news-preview-item">
//                         <h4 className="news-preview-headline">{item.headline}</h4>
//                         <p className="news-preview-source">{item.source} • {formatDate(new Date(item.date))}</p>
//                       </div>
//                     ))}
//                   </div>
//                   <button 
//                     className="view-more-btn"
//                     onClick={() => setActiveTab('news')}
//                   >
//                     View all news and sentiment analysis
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         );
//       case 'analysis':
//         return (
//           <div className="analysis-container">
//             <h2 className="section-title">Market Analysis Using LSTM</h2>
//             {/* Removed the LSTM info section that contained model parameters and performance metrics */}
            
//             <div className="analysis-grid">
//               <div className="analysis-card price-trend">
//                 <h3>Price Trend Analysis</h3>
//                 <div className="trend-chart">
//                   <StockChart 
//                     historicalData={historicalData.slice(-60)} 
//                     predictedData={predictedData}
//                     stockSymbol={selectedStock}
//                     showVolume={true}
//                     height={300}
//                   />
//                 </div>
//                 <div className="trend-summary">
//                   {/* Removed the prediction summary section that contained the 30-day forecast */}
//                 </div>
//               </div>
              
//               <div className="analysis-card sentiment-analysis">
//                 <h3>Sentiment Analysis Impact</h3>
//                 <div className="sentiment-gauge-wrapper">
//                   <SentimentAnalysis 
//                     sentimentScore={sentimentScore}
//                     newsCount={stockNews.length}
//                     showDetails={true}
//                   />
//                 </div>
//                 <div className="sentiment-impact">
//                   <h4>Impact on Prediction:</h4>
//                   <p>
//                     The LSTM model incorporates sentiment scores from recent news articles, which are normalized and fed into the model alongside price data. 
//                     {sentimentScore > 0.2 ? 
//                       ' The current positive sentiment is contributing to an upward bias in the price prediction.' : 
//                       sentimentScore < -0.2 ? 
//                       ' The current negative sentiment is contributing to a downward bias in the price prediction.' :
//                       ' The current neutral sentiment has minimal impact on the price prediction.'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       case 'portfolio':
//         return (
//           <div className="portfolio-container">
//             <h2 className="section-title">Portfolio Analysis</h2>
            
//             <div className="portfolio-summary">
//               <div className="portfolio-card">
//                 <h3>Stock Performance</h3>
//                 <div className="stock-stats">
//                   <div className="stat-row">
//                     <div className="stat-label">Selected Stock:</div>
//                     <div className="stat-value">{selectedStock}</div>
//                   </div>
//                   <div className="stat-row">
//                     <div className="stat-label">Current Price:</div>
//                     <div className="stat-value">₹{historicalData.length > 0 ? historicalData[historicalData.length - 1].close.toFixed(2) : 'N/A'}</div>
//                   </div>
//                   <div className="stat-row">
//                     <div className="stat-label">30-Day High:</div>
//                     <div className="stat-value">₹{historicalData.length > 0 ? Math.max(...historicalData.slice(-30).map(d => d.high)).toFixed(2) : 'N/A'}</div>
//                   </div>
//                   <div className="stat-row">
//                     <div className="stat-label">30-Day Low:</div>
//                     <div className="stat-value">₹{historicalData.length > 0 ? Math.min(...historicalData.slice(-30).map(d => d.low)).toFixed(2) : 'N/A'}</div>
//                   </div>
//                   <div className="stat-row">
//                     <div className="stat-label">30-Day Volatility:</div>
//                     <div className="stat-value">
//                       {historicalData.length > 0 ? 
//                         (Math.max(...historicalData.slice(-30).map(d => d.high)) - 
//                          Math.min(...historicalData.slice(-30).map(d => d.low))) / 
//                         Math.min(...historicalData.slice(-30).map(d => d.low)) * 100 : 'N/A'}%
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="forecast-card">
//                 <h3>Price Forecast</h3>
//                 <div className="forecast-chart">
//                   <div className="timeline-bars">
//                     {predictedData.slice(0, 10).map((item, index) => {
//                       const basePrice = historicalData.length > 0 ? historicalData[historicalData.length - 1].close : 0;
//                       const percentChange = ((item.predicted - basePrice) / basePrice) * 100;
//                       const barHeight = Math.abs(percentChange) * 5;
//                       const isPositive = percentChange >= 0;
                      
//                       return (
//                         <div className="timeline-bar-container" key={index}>
//                           <div className="day-label">{`Day ${index + 1}`}</div>
//                           <div className="timeline-bar-wrapper">
//                             <div 
//                               className={`timeline-bar ${isPositive ? 'positive' : 'negative'}`}
//                               style={{ height: `${barHeight}px`, marginTop: isPositive ? 'auto' : '0' }}
//                             ></div>
//                           </div>
//                           <div className="price-value">₹{item.predicted.toFixed(0)}</div>
//                           <div className={`percent-change ${isPositive ? 'positive' : 'negative'}`}>
//                             {percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//                 <div className="forecast-summary">
//                   <div className="summary-label">30-Day Forecast Trend:</div>
//                   <div className={`summary-value ${predictedData.length > 0 && predictedData[29].predicted > historicalData[historicalData.length - 1].close ? 'positive' : 'negative'}`}>
//                     {predictedData.length > 0 && predictedData[29].predicted > historicalData[historicalData.length - 1].close ? 'Upward' : 'Downward'}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       case 'news':
//         return (
//           <div className="full-news-container">
//             <h2 className="section-title">Market News & Sentiment</h2>
//             <div className="sentiment-distribution">
//               <div className="distribution-chart">
//                 <div className="distribution-label">News Sentiment Distribution:</div>
//                 <div className="distribution-bars">
//                   <div className="bar-container">
//                     <div className="bar-label">Positive</div>
//                     <div className="bar-wrapper">
//                       <div 
//                         className="bar-fill positive" 
//                         style={{ width: `${stockNews.filter(n => n.sentiment > 0.2).length / stockNews.length * 100}%` }}
//                       ></div>
//                     </div>
//                     <div className="bar-value">{stockNews.filter(n => n.sentiment > 0.2).length}</div>
//                   </div>
//                   <div className="bar-container">
//                     <div className="bar-label">Neutral</div>
//                     <div className="bar-wrapper">
//                       <div 
//                         className="bar-fill neutral" 
//                         style={{ width: `${stockNews.filter(n => n.sentiment >= -0.2 && n.sentiment <= 0.2).length / stockNews.length * 100}%` }}
//                       ></div>
//                     </div>
//                     <div className="bar-value">{stockNews.filter(n => n.sentiment >= -0.2 && n.sentiment <= 0.2).length}</div>
//                   </div>
//                   <div className="bar-container">
//                     <div className="bar-label">Negative</div>
//                     <div className="bar-wrapper">
//                       <div 
//                         className="bar-fill negative" 
//                         style={{ width: `${stockNews.filter(n => n.sentiment < -0.2).length / stockNews.length * 100}%` }}
//                       ></div>
//                     </div>
//                     <div className="bar-value">{stockNews.filter(n => n.sentiment < -0.2).length}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <NewsSection news={stockNews} />
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="page-wrapper">
 
//       <div className="dashboard">
//         <div className="container">
//           <div className="dashboard-header">
//             <h1 className="dashboard-title">Stock Market Prediction</h1>
            
//             <div className="navigation-tabs">
//               <button 
//                 className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('dashboard')}
//               >
//                 Dashboard
//               </button>
//               <button 
//                 className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('analysis')}
//               >
//                 Analysis
//               </button>
//               <button 
//                 className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('portfolio')}
//               >
//                 Portfolio
//               </button>
//               <button 
//                 className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('news')}
//               >
//                 News
//               </button>
//             </div>
//           </div>
          
//           <div className="stock-selector-container">
//             <div className="stock-selector">
//               <label htmlFor="stock-select">Select Stock:</label>
//               <select 
//                 id="stock-select" 
//                 value={selectedStock}
//                 onChange={handleStockChange}
//                 disabled={loading}
//                 className="stock-dropdown"
//               >
//                 {nifty50Stocks.map(stock => (
//                   <option key={stock.symbol} value={stock.symbol}>
//                     {stock.symbol} - {stock.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           {error && <div className="error-message">{error}</div>}
          
//           <div className="tab-content">
//             {renderTabContent()}
//           </div>
//         </div>
//       </div>
 
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import StockChart from '../StockChart';
import NewsSection from '../NewsSection';
import SentimentAnalysis from '../SentimentAnalysis';
import PredictionMetrics from '../PredictionMetrics';
import Loader from '../UI/Loader';
import stockApi from '../../services/stockApi';
import sentimentService from '../../services/sentimentService';
import { StockLSTM } from '../../utils/lstm';
import { formatDate } from '../../utils/formatters';
import './Dashboard.css';

function Dashboard() {
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [historicalData, setHistoricalData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [stockNews, setStockNews] = useState([]);
  const [sentimentScore, setSentimentScore] = useState(0);
  const [metrics, setMetrics] = useState({ rmse: 0, r2: 0, f1: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nifty50Stocks, setNifty50Stocks] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeframe, setTimeframe] = useState('30');
  
  // New state variables for data processing
  const [dataProcessingOption, setDataProcessingOption] = useState('cleaning');
  const [cleanedData, setCleanedData] = useState([]);
  const [normalizedData, setNormalizedData] = useState([]);
  const [showProcessedData, setShowProcessedData] = useState(false);

  // Fetch Nifty 50 companies on component mount
  useEffect(() => {
    async function fetchStocks() {
      try {
        setLoading(true);
        const stocks = await stockApi.getNifty50Companies();
        setNifty50Stocks(stocks);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch stock list');
        setLoading(false);
      }
    }
    fetchStocks();
  }, []);

  // Fetch data when selected stock changes
  useEffect(() => {
    if (selectedStock) {
      fetchStockData(selectedStock);
    }
  }, [selectedStock]);

  // Process data and make predictions when historical data changes
  useEffect(() => {
    if (historicalData.length > 0 && stockNews.length > 0) {
      processDataAndPredict();
    }
  }, [historicalData, stockNews]);

  // Process data for cleaning and normalization when historical data changes
  useEffect(() => {
    if (historicalData.length > 0) {
      processDataForCleaning();
      processDataForNormalization();
    }
  }, [historicalData]);

  const fetchStockData = async (symbol) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch historical data
      const histData = await stockApi.getHistoricalData(symbol, 365);
      setHistoricalData(histData);
      
      // Fetch news data
      const newsData = await stockApi.getStockNews(symbol, 10);
      setStockNews(newsData);
      
      setLoading(false);
    } catch (err) {
      setError(`Error fetching data for ${symbol}`);
      setLoading(false);
    }
  };

  const processDataAndPredict = async () => {
    try {
      setLoading(true);
      
      // Analyze sentiment from news
      const sentimentData = sentimentService.analyzeNews(stockNews);
      setSentimentScore(sentimentData.score);
      
      // Initialize LSTM model with configuration from the provided file
      const lstm = new StockLSTM({
        sequenceLength: 10,
        epochs: 50,
        batchSize: 32,
        units: 50,
        dropoutRate: 0.2,
        learningRate: 0.001
      });
      
      // Prepare data for LSTM (adds sentiment to stock data)
      const stockDataWithSentiment = historicalData.map((item, index) => {
        return {
          ...item,
          sentiment: index > historicalData.length - stockNews.length ? 
                    stockNews[historicalData.length - index - 1]?.sentiment || 0 : 0
        };
      });
      
      // Preprocess data for LSTM
      const processedData = lstm.preprocessData(stockDataWithSentiment);
      
      // Make predictions for next 30 days
      const lastSequence = processedData.sequences.slice(-1)[0];
      const predictedPrices = lstm.predict(lastSequence, new Array(30).fill(sentimentData.score), 30);
      
      // Format predictions for display
      const today = new Date();
      const formattedPredictions = predictedPrices.map((price, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() + index + 1);
        return {
          date: formatDate(date),
          predicted: price,
          actual: null // Will be filled when actual data becomes available
        };
      });
      
      setPredictedData(formattedPredictions);
      
      // Calculate accuracy metrics using last 30 days of historical data
      const actualPrices = historicalData.slice(-30).map(item => item.close);
      const previousSequence = processedData.sequences.slice(-31)[0];
      const hindcastPrices = lstm.predict(previousSequence, stockNews.slice(0, 30).map(n => n.sentiment), 30);
      
      // Calculate metrics
      const accuracyMetrics = lstm.evaluateModel(actualPrices, hindcastPrices);
      setMetrics(accuracyMetrics);
      
      setLoading(false);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Error processing data or making predictions');
      setLoading(false);
    }
  };

  // Data cleaning function
  const processDataForCleaning = () => {
    if (historicalData.length === 0) return;
    
    try {
      // Copy historical data to avoid mutation
      const dataToClean = [...historicalData];
      
      // Identify and handle outliers (using IQR method for close prices)
      const closePrices = dataToClean.map(item => item.close);
      const q1 = calculateQuartile(closePrices, 0.25);
      const q3 = calculateQuartile(closePrices, 0.75);
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      
      // Replace outliers with moving average
      const windowSize = 5; // 5-day moving average
      
      const cleanedData = dataToClean.map((item, index) => {
        let cleanedClose = item.close;
        
        // If price is an outlier, replace with moving average
        if (item.close < lowerBound || item.close > upperBound) {
          // Calculate moving average from surrounding days
          const startIdx = Math.max(0, index - Math.floor(windowSize / 2));
          const endIdx = Math.min(dataToClean.length - 1, index + Math.floor(windowSize / 2));
          const window = dataToClean.slice(startIdx, endIdx + 1);
          const sum = window.reduce((acc, curr) => acc + curr.close, 0);
          cleanedClose = sum / window.length;
        }
        
        return {
          ...item,
          close: cleanedClose,
          // Flag outliers for visualization
          isOutlier: item.close < lowerBound || item.close > upperBound
        };
      });
      
      setCleanedData(cleanedData);
    } catch (err) {
      console.error('Data cleaning error:', err);
      setError('Error during data cleaning process');
    }
  };
  
  // Data normalization function
  const processDataForNormalization = () => {
    if (historicalData.length === 0) return;
    
    try {
      // Copy historical data to avoid mutation
      const dataToNormalize = [...historicalData];
      
      // Min-Max normalization for closing prices
      const closePrices = dataToNormalize.map(item => item.close);
      const minPrice = Math.min(...closePrices);
      const maxPrice = Math.max(...closePrices);
      const priceRange = maxPrice - minPrice;
      
      // Apply min-max normalization to close, high, low, and open prices
      const normalizedData = dataToNormalize.map(item => {
        return {
          ...item,
          normalizedClose: (item.close - minPrice) / priceRange,
          normalizedHigh: (item.high - minPrice) / priceRange,
          normalizedLow: (item.low - minPrice) / priceRange,
          normalizedOpen: (item.open - minPrice) / priceRange,
          // Store original values for reference
          originalClose: item.close,
          originalHigh: item.high,
          originalLow: item.low,
          originalOpen: item.open
        };
      });
      
      setNormalizedData(normalizedData);
    } catch (err) {
      console.error('Data normalization error:', err);
      setError('Error during data normalization process');
    }
  };
  
  // Helper function to calculate quartiles
  const calculateQuartile = (arr, q) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  };

  // Function to export processed data as CSV
  const exportToCSV = (data, filename) => {
    // Determine which data to export based on the data processing option
    const exportData = dataProcessingOption === 'cleaning' ? cleanedData : normalizedData;
    
    if (exportData.length === 0) {
      setError('No processed data available to export');
      return;
    }
    
    try {
      // Create CSV header based on data structure
      let headers = Object.keys(exportData[0]);
      // Filter out any unnecessary fields
      headers = headers.filter(header => 
        header !== 'isOutlier' && 
        !header.startsWith('original')
      );
      
      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      
      // Add data rows
      exportData.forEach(item => {
        const row = headers.map(header => item[header]).join(',');
        csvContent += row + '\n';
      });
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedStock}_${dataProcessingOption}_data.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export error:', err);
      setError('Error exporting processed data to CSV');
    }
  };

  const handleStockChange = (e) => {
    setSelectedStock(e.target.value);
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };
  
  const handleDataProcessingOptionChange = (option) => {
    setDataProcessingOption(option);
    setShowProcessedData(true);
  };

  const renderTabContent = () => {
    if (loading) {
      return <Loader message="Processing data..." />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-metrics">
              <PredictionMetrics metrics={metrics} />
            </div>
            
            <div className="dashboard-chart">
              <div className="chart-header">
                <h2 className="chart-title">{selectedStock} Price Prediction</h2>
                <div className="timeframe-selector">
                  <button 
                    className={`timeframe-btn ${timeframe === '30' ? 'active' : ''}`}
                    onClick={() => handleTimeframeChange('30')}
                  >
                    30 Days
                  </button>
                  <button 
                    className={`timeframe-btn ${timeframe === '90' ? 'active' : ''}`}
                    onClick={() => handleTimeframeChange('90')}
                  >
                    90 Days
                  </button>
                  <button 
                    className={`timeframe-btn ${timeframe === '365' ? 'active' : ''}`}
                    onClick={() => handleTimeframeChange('365')}
                  >
                    1 Year
                  </button>
                </div>
              </div>
              <StockChart 
                historicalData={historicalData} 
                predictedData={predictedData}
                stockSymbol={selectedStock}
                timeframe={timeframe}
              />
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color actual"></span>
                  <span className="legend-text">Actual Price</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color predicted"></span>
                  <span className="legend-text">Predicted Price (Next 30 Days)</span>
                </div>
              </div>
            </div>
            
            <div className="dashboard-bottom">
              <div className="sentiment-section">
                <div className="model-performance-section">
                  <h3 className="model-performance-title">Model Performance</h3>
                  <div className="metrics-list">
                    <div className="metric-item">
                      <div className="metric-label">RMSE:</div>
                      <div className="metric-value">{metrics.rmse}</div>
                      <div className="metric-description">Lower values indicate better prediction accuracy</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-label">R² Score:</div>
                      <div className="metric-value">{metrics.r2}</div>
                      <div className="metric-description">Higher values (closer to 1) indicate better model fit</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-label">Directional Accuracy (F1):</div>
                      <div className="metric-value">{metrics.f1}</div>
                      <div className="metric-description">Higher values indicate better prediction of price movement direction</div>
                    </div>
                  </div>
                  <button 
                    className="view-more-btn"
                    onClick={() => setActiveTab('analysis')}
                  >
                    Click here to view complete analysis
                  </button>
                </div>
              </div>
              
              <div className="news-section">
                <div className="news-preview">
                  <h3 className="news-preview-title">Latest News</h3>
                  <div className="news-preview-items">
                    {stockNews.slice(0, 3).map(item => (
                      <div key={item.id} className="news-preview-item">
                        <h4 className="news-preview-headline">{item.headline}</h4>
                        <p className="news-preview-source">{item.source} • {formatDate(new Date(item.date))}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="view-more-btn"
                    onClick={() => setActiveTab('news')}
                  >
                    View all news and sentiment analysis
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case 'analysis':
        return (
          <div className="analysis-container">
            <h2 className="section-title">Market Analysis Using LSTM</h2>
            {/* Removed the LSTM info section that contained model parameters and performance metrics */}
            
            <div className="analysis-grid">
              <div className="analysis-card price-trend">
                <h3>Price Trend Analysis</h3>
                <div className="trend-chart">
                  <StockChart 
                    historicalData={historicalData.slice(-60)} 
                    predictedData={predictedData}
                    stockSymbol={selectedStock}
                    showVolume={true}
                    height={300}
                  />
                </div>
                <div className="trend-summary">
                  {/* Removed the prediction summary section that contained the 30-day forecast */}
                </div>
              </div>
              
              <div className="analysis-card sentiment-analysis">
                <h3>Sentiment Analysis Impact</h3>
                <div className="sentiment-gauge-wrapper">
                  <SentimentAnalysis 
                    sentimentScore={sentimentScore}
                    newsCount={stockNews.length}
                    showDetails={true}
                  />
                </div>
                <div className="sentiment-impact">
                  <h4>Impact on Prediction:</h4>
                  <p>
                    The LSTM model incorporates sentiment scores from recent news articles, which are normalized and fed into the model alongside price data. 
                    {sentimentScore > 0.2 ? 
                      ' The current positive sentiment is contributing to an upward bias in the price prediction.' : 
                      sentimentScore < -0.2 ? 
                      ' The current negative sentiment is contributing to a downward bias in the price prediction.' :
                      ' The current neutral sentiment has minimal impact on the price prediction.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="portfolio-container">
            <h2 className="section-title">Portfolio Analysis</h2>
            
            <div className="portfolio-summary">
              <div className="portfolio-card">
                <h3>Stock Performance</h3>
                <div className="stock-stats">
                  <div className="stat-row">
                    <div className="stat-label">Selected Stock:</div>
                    <div className="stat-value">{selectedStock}</div>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label">Current Price:</div>
                    <div className="stat-value">₹{historicalData.length > 0 ? historicalData[historicalData.length - 1].close.toFixed(2) : 'N/A'}</div>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label">30-Day High:</div>
                    <div className="stat-value">₹{historicalData.length > 0 ? Math.max(...historicalData.slice(-30).map(d => d.high)).toFixed(2) : 'N/A'}</div>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label">30-Day Low:</div>
                    <div className="stat-value">₹{historicalData.length > 0 ? Math.min(...historicalData.slice(-30).map(d => d.low)).toFixed(2) : 'N/A'}</div>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label">30-Day Volatility:</div>
                    <div className="stat-value">
                      {historicalData.length > 0 ? 
                        (Math.max(...historicalData.slice(-30).map(d => d.high)) - 
                         Math.min(...historicalData.slice(-30).map(d => d.low))) / 
                        Math.min(...historicalData.slice(-30).map(d => d.low)) * 100 : 'N/A'}%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="forecast-card">
                <h3>Price Forecast</h3>
                <div className="forecast-chart">
                  <div className="timeline-bars">
                    {predictedData.slice(0, 10).map((item, index) => {
                      const basePrice = historicalData.length > 0 ? historicalData[historicalData.length - 1].close : 0;
                      const percentChange = ((item.predicted - basePrice) / basePrice) * 100;
                      const barHeight = Math.abs(percentChange) * 5;
                      const isPositive = percentChange >= 0;
                      
                      return (
                        <div className="timeline-bar-container" key={index}>
                          <div className="day-label">{`Day ${index + 1}`}</div>
                          <div className="timeline-bar-wrapper">
                            <div 
                              className={`timeline-bar ${isPositive ? 'positive' : 'negative'}`}
                              style={{ height: `${barHeight}px`, marginTop: isPositive ? 'auto' : '0' }}
                            ></div>
                          </div>
                          <div className="price-value">₹{item.predicted.toFixed(0)}</div>
                          <div className={`percent-change ${isPositive ? 'positive' : 'negative'}`}>
                            {percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="forecast-summary">
                  <div className="summary-label">30-Day Forecast Trend:</div>
                  <div className={`summary-value ${predictedData.length > 0 && predictedData[29].predicted > historicalData[historicalData.length - 1].close ? 'positive' : 'negative'}`}>
                    {predictedData.length > 0 && predictedData[29].predicted > historicalData[historicalData.length - 1].close ? 'Upward' : 'Downward'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="full-news-container">
            <h2 className="section-title">Market News & Sentiment</h2>
            <div className="sentiment-distribution">
              <div className="distribution-chart">
                <div className="distribution-label">News Sentiment Distribution:</div>
                <div className="distribution-bars">
                  <div className="bar-container">
                    <div className="bar-label">Positive</div>
                    <div className="bar-wrapper">
                      <div 
                        className="bar-fill positive" 
                        style={{ width: `${stockNews.filter(n => n.sentiment > 0.2).length / stockNews.length * 100}%` }}
                      ></div>
                    </div>
                    <div className="bar-value">{stockNews.filter(n => n.sentiment > 0.2).length}</div>
                  </div>
                  <div className="bar-container">
                    <div className="bar-label">Neutral</div>
                    <div className="bar-wrapper">
                      <div 
                        className="bar-fill neutral" 
                        style={{ width: `${stockNews.filter(n => n.sentiment >= -0.2 && n.sentiment <= 0.2).length / stockNews.length * 100}%` }}
                      ></div>
                    </div>
                    <div className="bar-value">{stockNews.filter(n => n.sentiment >= -0.2 && n.sentiment <= 0.2).length}</div>
                  </div>
                  <div className="bar-container">
                    <div className="bar-label">Negative</div>
                    <div className="bar-wrapper">
                      <div 
                        className="bar-fill negative" 
                        style={{ width: `${stockNews.filter(n => n.sentiment < -0.2).length / stockNews.length * 100}%` }}
                      ></div>
                    </div>
                    <div className="bar-value">{stockNews.filter(n => n.sentiment < -0.2).length}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <NewsSection news={stockNews} />
          </div>
        );
      case 'dataProcessing':
        return (
          <div className="data-processing-container">
            <h2 className="section-title">Data Processing</h2>
            
            <div className="processing-options">
              <div className="option-buttons">
                <button 
                  className={`processing-btn ${dataProcessingOption === 'cleaning' ? 'active' : ''}`}
                  onClick={() => handleDataProcessingOptionChange('cleaning')}
                >
                  Data Cleaning
                </button>
                <button 
                  className={`processing-btn ${dataProcessingOption === 'normalization' ? 'active' : ''}`}
                  onClick={() => handleDataProcessingOptionChange('normalization')}
                >
                  Normalization
                </button>
              </div>
              
              <div className="processing-description">
                {dataProcessingOption === 'cleaning' ? (
                  <div className="processing-info cleaning-info">
                    <h3>Data Cleaning</h3>
                    <p>
                      This process removes outliers from the stock price data using the Interquartile Range (IQR) method.
                      Outliers are replaced with a 5-day moving average to maintain data continuity.
                    </p>
                    <div className="cleaning-steps">
                      <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                          <h4>Outlier Detection</h4>
                          <p>Identifies price points that fall outside 1.5 × IQR from the first and third quartiles.</p>
                        </div>
                      </div>
                      <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                          <h4>Moving Average Replacement</h4>
                          <p>Replaces outliers with a 5-day moving average to smooth the data while preserving trends.</p>
                        </div>
                      </div>
                      <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                          <h4>Data Verification</h4>
                          <p>Ensures all price data points are within reasonable bounds for high-quality analysis.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="processing-info normalization-info">
                    <h3>Data Normalization</h3>
                    <p>
                      This process scales all price values to a range between 0 and 1 using Min-Max normalization.
                      Normalization helps in comparing different stocks regardless of their absolute price levels.
                    </p>
                    <div className="normalization-steps">
                      <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                          <h4>Min-Max Calculation</h4>
                          <p>Identifies the minimum and maximum values in the dataset to establish the scaling range.</p>
                        </div>
                      </div>
                      <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                          <h4>Value Transformation</h4>
                          <p>Transforms each price value using the formula: (value - min) / (max - min)</p>
                        </div>
                      </div>
                      <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                          <h4>Scale Preservation</h4>
                          <p>Retains the original values alongside normalized ones for reference and analysis.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {showProcessedData && (
              <div className="processed-data-section">
                <div className="processed-data-chart">
                  <div className="chart-header">
                    <h3 className="chart-title">
                      {dataProcessingOption === 'cleaning' ? 'Cleaned Data Visualization' : 'Normalized Data Visualization'}
                    </h3>
                    <div className="chart-controls">
                      <button 
                        className="export-btn"
                        onClick={() => exportToCSV()}
                      >
                        Export to CSV
                      </button>
                    </div>
                  </div>
                  
                  {dataProcessingOption === 'cleaning' ? (
                    <div className="data-chart cleaning-chart">
                      <div className="chart-container">
                        <StockChart 
                          historicalData={historicalData.slice(-90)} 
                          cleanedData={cleanedData.slice(-90)}
                          stockSymbol={selectedStock}
                          showOutliers={true}
                          height={400}
                        />
                        <div className="chart-legend">
                          <div className="legend-item">
                            <span className="legend-color original"></span>
                            <span className="legend-text">Original Price</span>
                          </div>
                          <div className="legend-item">
                            <span className="legend-color cleaned"></span>
                            <span className="legend-text">Cleaned Price</span>
                          </div>
                          <div className="legend-item">
                            <span className="legend-marker outlier"></span>
                            <span className="legend-text">Outlier Points</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="cleaning-metrics">
                        <div className="metric-card">
                          <h4>Data Cleaning Summary</h4>
                          <div className="metric-row">
                            <div className="metric-name">Total Data Points:</div>
                            <div className="metric-value">{cleanedData.length}</div>
                          </div>
                          <div className="metric-row">
                            <div className="metric-name">Detected Outliers:</div>
                            <div className="metric-value">{cleanedData.filter(item => item.isOutlier).length}</div>
                          </div>
                          <div className="metric-row">
                            <div className="metric-name">Outlier Percentage:</div>
                            <div className="metric-value">
                              {((cleanedData.filter(item => item.isOutlier).length / cleanedData.length) * 100).toFixed(2)}%
                            </div>
                          </div>
                          <div className="metric-row">
                            <div className="metric-name">Price Range Before Cleaning:</div>
                            <div className="metric-value">
                              ₹{Math.min(...historicalData.map(d => d.close)).toFixed(2)} - 
                              ₹{Math.max(...historicalData.map(d => d.close)).toFixed(2)}
                            </div>
                          </div>
                          <div className="metric-row">
                            <div className="metric-name">Price Range After Cleaning:</div>
                            <div className="metric-value">
                              ₹{Math.min(...cleanedData.map(d => d.close)).toFixed(2)} - 
                              ₹{Math.max(...cleanedData.map(d => d.close)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="data-chart normalization-chart">
                      <div className="chart-container">
                        <div className="dual-chart">
                          <div className="original-chart">
                            <h4>Original Price Data</h4>
                            <StockChart 
                              historicalData={historicalData.slice(-90)} 
                              stockSymbol={selectedStock}
                              height={300}
                            />
                          </div>
                          <div className="normalized-chart">
                            <h4>Normalized Price Data (0-1 Scale)</h4>
                            <StockChart 
                              normalizedData={normalizedData.slice(-90)}
                              stockSymbol={selectedStock}
                              showNormalized={true}
                              height={300}
                            />
                          </div>
                        </div>
                        <div className="chart-legend">
                          <div className="legend-item">
                            <span className="legend-color original"></span>
                            <span className="legend-text">Original Price</span>
                          </div>
                          <div className="legend-item">
                            <span className="legend-color normalized"></span>
                            <span className="legend-text">Normalized Price (0-1 Scale)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="normalization-metrics">
                        <div className="metric-card">
                          <h4>Data Normalization Summary</h4>
                          <div className="metric-row">
                            <div className="metric-name">Total Data Points:</div>
                            <div className="metric-value">{normalizedData.length}</div>
                          </div>
                          <div className="metric-row">
                            <div className="metric-name">Original Min Price:</div>
                            <div className="metric-value">₹{Math.min(...historicalData.map(d => d.close)).toFixed(2)}</div>
                          </div>
                          <div className="metric-row">
                            <div className="metric-name">Original Max Price:</div>
                            <div className="metric-value">₹{Math.max(...historicalData.map(d => d.close)).toFixed(2)}</div>
                          </div>
                          <div className="metric-row">
                            <div className="metric-name">Normalized Range:</div>
                            <div className="metric-value">0.00 - 1.00</div>
                          </div>
                          <div className="metric-row">
                            <div className="metric-name">Normalization Method:</div>
                            <div className="metric-value">Min-Max Scaling</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="data-preview">
                  <h3>Data Preview</h3>
                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Original Close</th>
                          {dataProcessingOption === 'cleaning' ? (
                            <>
                              <th>Cleaned Close</th>
                              <th>Is Outlier</th>
                            </>
                          ) : (
                            <>
                              <th>Normalized Close</th>
                              <th>Normalized High</th>
                              <th>Normalized Low</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {dataProcessingOption === 'cleaning' 
                          ? cleanedData.slice(-10).map((item, index) => (
                              <tr key={index} className={item.isOutlier ? 'outlier-row' : ''}>
                                <td>{item.date}</td>
                                <td>₹{item.originalClose ? item.originalClose.toFixed(2) : historicalData[historicalData.length - 10 + index].close.toFixed(2)}</td>
                                <td>₹{item.close.toFixed(2)}</td>
                                <td>{item.isOutlier ? 'Yes' : 'No'}</td>
                              </tr>
                            ))
                          : normalizedData.slice(-10).map((item, index) => (
                              <tr key={index}>
                                <td>{item.date}</td>
                                <td>₹{item.originalClose.toFixed(2)}</td>
                                <td>{item.normalizedClose.toFixed(4)}</td>
                                <td>{item.normalizedHigh.toFixed(4)}</td>
                                <td>{item.normalizedLow.toFixed(4)}</td>
                              </tr>
                            ))
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className="export-action">
                    <button 
                      className="export-btn"
                      onClick={() => exportToCSV()}
                    >
                      Export Full Dataset to CSV
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-wrapper">
 
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Stock Market Prediction</h1>
            
            <div className="navigation-tabs">
              <button 
                className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
                onClick={() => setActiveTab('analysis')}
              >
                Analysis
              </button>
              <button 
                className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
                onClick={() => setActiveTab('portfolio')}
              >
                Portfolio
              </button>
              <button 
                className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
                onClick={() => setActiveTab('news')}
              >
                News
              </button>
              {/* New Data Processing Tab */}
              <button 
                className={`tab-btn ${activeTab === 'dataProcessing' ? 'active' : ''}`}
                onClick={() => setActiveTab('dataProcessing')}
              >
                Data Processing
              </button>
            </div>
          </div>
          
          <div className="stock-selector-container">
            <div className="stock-selector">
              <label htmlFor="stock-select">Select Stock:</label>
              <select 
                id="stock-select" 
                value={selectedStock}
                onChange={handleStockChange}
                disabled={loading}
                className="stock-dropdown"
              >
                {nifty50Stocks.map(stock => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
 
    </div>
  );
}

export default Dashboard;
