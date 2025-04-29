// API constants
export const API_ENDPOINTS = {
    ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
    FINANCIAL_MODELING_PREP: 'https://financialmodelingprep.com/api/v3',
    NEWS_API: 'https://newsapi.org/v2'
  };
  
  // Timeframes for charts
  export const TIMEFRAMES = {
    ONE_WEEK: '7',
    ONE_MONTH: '30',
    THREE_MONTHS: '90',
    SIX_MONTHS: '180',
    ONE_YEAR: '365'
  };
  
  // Prediction types
  export const PREDICTION_TYPES = {
    PRICE: 'price',
    DIRECTION: 'direction',
    VOLATILITY: 'volatility'
  };
  
  // Sentiment thresholds
  export const SENTIMENT_THRESHOLDS = {
    VERY_BULLISH: 0.5,
    BULLISH: 0.2,
    SLIGHTLY_BULLISH: 0.1,
    NEUTRAL_UPPER: 0.1,
    NEUTRAL_LOWER: -0.1,
    SLIGHTLY_BEARISH: -0.1,
    BEARISH: -0.2,
    VERY_BEARISH: -0.5
  };
  
  // Chart colors
  export const CHART_COLORS = {
    ACTUAL: 'var(--primary-color)',
    PREDICTED: 'var(--secondary-color)',
    POSITIVE: 'var(--secondary-color)',
    NEGATIVE: 'var(--danger-color)',
    NEUTRAL: 'var(--gray-500)',
    GRID: 'var(--gray-200)'
  };
  
  // LSTM model configs
  export const LSTM_CONFIGS = {
    DEFAULT: {
      sequenceLength: 10,
      epochs: 50,
      batchSize: 32,
      units: 50,
      dropoutRate: 0.2
    },
    FAST: {
      sequenceLength: 5,
      epochs: 20,
      batchSize: 16,
      units: 32,
      dropoutRate: 0.1
    },
    ACCURATE: {
      sequenceLength: 20,
      epochs: 100,
      batchSize: 64,
      units: 100,
      dropoutRate: 0.3
    }
  };
  
  // Stock markets
  export const STOCK_MARKETS = {
    NSE: 'National Stock Exchange of India',
    BSE: 'Bombay Stock Exchange'
  };
  
  // Metrics thresholds for color coding
  export const METRICS_THRESHOLDS = {
    RMSE: {
      GOOD: 10,
      AVERAGE: 30
    },
    R2: {
      GOOD: 0.8,
      AVERAGE: 0.5
    },
    F1: {
      GOOD: 0.7,
      AVERAGE: 0.5
    }
  };