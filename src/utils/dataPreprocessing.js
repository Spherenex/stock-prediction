// src/utils/dataPreprocessing.js

import Papa from 'papaparse';

/**
 * Clean and format stock data
 * @param {Array} stockData - Raw stock data array
 * @returns {Array} - Cleaned stock data
 */
export const cleanStockData = (stockData) => {
  return stockData
    .filter(row => {
      // Remove rows with missing values
      return row.date && row.open && row.high && row.low && row.close && row.volume;
    })
    .map(row => {
      // Ensure numeric values are converted properly
      return {
        date: new Date(row.date),
        open: parseFloat(row.open),
        high: parseFloat(row.high),
        low: parseFloat(row.low),
        close: parseFloat(row.close),
        volume: parseInt(row.volume),
        // Add any additional transformations like calculating daily returns
        dailyReturn: row.previousClose ? 
          (parseFloat(row.close) - parseFloat(row.previousClose)) / parseFloat(row.previousClose) : 0
      };
    })
    .sort((a, b) => a.date - b.date); // Ensure data is sorted by date
};

/**
 * Process news data and extract sentiment scores
 * @param {Array} newsData - Raw news data array
 * @returns {Array} - Processed news with sentiment scores
 */
export const processNewsData = (newsData) => {
  return newsData
    .filter(article => {
      // Remove articles with missing critical information
      return article.headline && article.date;
    })
    .map(article => {
      // Ensure article has proper sentiment score
      return {
        ...article,
        date: new Date(article.date),
        // If sentiment is not provided, set it to neutral (0)
        sentiment: article.sentiment !== undefined ? parseFloat(article.sentiment) : 0,
      };
    })
    .sort((a, b) => a.date - b.date); // Sort by date
};

/**
 * Aggregate news sentiment scores by date
 * @param {Array} newsData - Processed news data with sentiment scores
 * @returns {Object} - Mapping of dates to aggregated sentiment scores
 */
export const aggregateNewsSentimentByDate = (newsData) => {
  const sentimentByDate = {};
  
  newsData.forEach(article => {
    const dateStr = article.date.toISOString().split('T')[0];
    
    if (!sentimentByDate[dateStr]) {
      sentimentByDate[dateStr] = {
        totalSentiment: 0,
        count: 0,
        articles: []
      };
    }
    
    sentimentByDate[dateStr].totalSentiment += article.sentiment;
    sentimentByDate[dateStr].count += 1;
    sentimentByDate[dateStr].articles.push(article);
  });
  
  // Calculate average sentiment for each date
  Object.keys(sentimentByDate).forEach(date => {
    sentimentByDate[date].averageSentiment = 
      sentimentByDate[date].totalSentiment / sentimentByDate[date].count;
  });
  
  return sentimentByDate;
};

/**
 * Merge stock data with sentiment scores on a daily basis
 * @param {Array} stockData - Cleaned stock data
 * @param {Object} sentimentByDate - Aggregated sentiment scores by date
 * @returns {Array} - Merged data with stock and sentiment information
 */
export const mergeStockAndSentimentData = (stockData, sentimentByDate) => {
  return stockData.map(stockDay => {
    const dateStr = stockDay.date.toISOString().split('T')[0];
    const sentiment = sentimentByDate[dateStr] || { averageSentiment: 0, count: 0 };
    
    return {
      ...stockDay,
      sentiment: sentiment.averageSentiment,
      newsCount: sentiment.count,
      newsArticles: sentiment.articles || []
    };
  });
};

/**
 * Normalize/scale the data for LSTM input
 * @param {Array} mergedData - Merged stock and sentiment data
 * @returns {Object} - Normalized data and normalization parameters
 */
export const normalizeData = (mergedData) => {
  // Extract features we want to normalize
  const features = ['open', 'high', 'low', 'close', 'volume', 'sentiment'];
  const normParams = {};
  
  // Calculate min and max for each feature
  features.forEach(feature => {
    const values = mergedData.map(row => row[feature]);
    normParams[feature] = {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  });
  
  // Apply min-max normalization
  const normalizedData = mergedData.map(row => {
    const normalizedRow = { ...row };
    
    features.forEach(feature => {
      const { min, max } = normParams[feature];
      // Prevent division by zero
      const range = max - min === 0 ? 1 : max - min;
      normalizedRow[`${feature}_norm`] = (row[feature] - min) / range;
    });
    
    return normalizedRow;
  });
  
  return { normalizedData, normParams };
};

/**
 * Create time series sequences for LSTM training
 * @param {Array} normalizedData - Normalized data
 * @param {number} sequenceLength - Length of each sequence (lookback period)
 * @returns {Object} - X (input sequences) and y (target values)
 */
export const createTimeSeriesSequences = (normalizedData, sequenceLength = 10) => {
  const X = [];
  const y = [];
  
  // Features to include in input sequences
  const inputFeatures = [
    'open_norm',
    'high_norm',
    'low_norm',
    'close_norm',
    'volume_norm',
    'sentiment_norm'
  ];
  
  // Create sequences
  for (let i = 0; i <= normalizedData.length - sequenceLength - 1; i++) {
    const sequence = [];
    
    for (let j = i; j < i + sequenceLength; j++) {
      // Extract relevant features for this time step
      const timeStep = inputFeatures.map(feature => normalizedData[j][feature]);
      sequence.push(timeStep);
    }
    
    // Target is the next day's closing price (normalized)
    const target = normalizedData[i + sequenceLength].close_norm;
    
    X.push(sequence);
    y.push(target);
  }
  
  return { X, y };
};

/**
 * Process CSV file containing stock data
 * @param {string} csvContent - CSV content as string
 * @returns {Array} - Parsed and cleaned stock data
 */
export const processStockCSV = (csvContent) => {
  const parsedData = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });
  
  if (parsedData.errors && parsedData.errors.length > 0) {
    console.error('Errors parsing CSV:', parsedData.errors);
  }
  
  return cleanStockData(parsedData.data);
};

/**
 * Process CSV file containing news data
 * @param {string} csvContent - CSV content as string
 * @returns {Array} - Parsed and processed news data
 */
export const processNewsCSV = (csvContent) => {
  const parsedData = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });
  
  if (parsedData.errors && parsedData.errors.length > 0) {
    console.error('Errors parsing CSV:', parsedData.errors);
  }
  
  return processNewsData(parsedData.data);
};

/**
 * Main function to preprocess data for LSTM model
 * @param {string} stockCSV - Stock data CSV content
 * @param {string} newsCSV - News data CSV content
 * @param {number} sequenceLength - Length of each sequence
 * @returns {Object} - Processed data ready for LSTM training
 */
export const preprocessDataForLSTM = async (stockCSV, newsCSV, sequenceLength = 10) => {
  try {
    // Process stock and news data
    const stockData = processStockCSV(stockCSV);
    const newsData = processNewsCSV(newsCSV);
    
    // Aggregate news sentiment by date
    const sentimentByDate = aggregateNewsSentimentByDate(newsData);
    
    // Merge stock and sentiment data
    const mergedData = mergeStockAndSentimentData(stockData, sentimentByDate);
    
    // Normalize the data
    const { normalizedData, normParams } = normalizeData(mergedData);
    
    // Create sequences for LSTM
    const { X, y } = createTimeSeriesSequences(normalizedData, sequenceLength);
    
    return {
      rawStockData: stockData,
      rawNewsData: newsData,
      mergedData,
      normalizedData,
      normParams,
      sequences: { X, y },
      sequenceLength
    };
  } catch (error) {
    console.error('Error preprocessing data:', error);
    throw error;
  }
};

/**
 * Denormalize predictions to get actual values
 * @param {Array} predictions - Normalized predictions from the model
 * @param {Object} normParams - Normalization parameters
 * @returns {Array} - Denormalized predictions
 */
export const denormalizePredictions = (predictions, normParams) => {
  const { min, max } = normParams.close;
  return predictions.map(pred => pred * (max - min) + min);
};

export default {
  cleanStockData,
  processNewsData,
  aggregateNewsSentimentByDate,
  mergeStockAndSentimentData,
  normalizeData,
  createTimeSeriesSequences,
  processStockCSV,
  processNewsCSV,
  preprocessDataForLSTM,
  denormalizePredictions
};