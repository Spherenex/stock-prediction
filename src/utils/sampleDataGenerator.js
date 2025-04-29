// src/utils/sampleDataGenerator.js

/**
 * Generate sample stock data for testing
 * @param {number} days - Number of days of data to generate
 * @param {Date} endDate - End date of the data (defaults to current date)
 * @returns {Array} - Array of daily stock data
 */
export const generateSampleStockData = (days = 365, endDate = new Date()) => {
    const data = [];
    let currentPrice = 2000 + Math.random() * 500; // Start with a random price between 2000-2500
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      
      // Generate a random daily change (-2% to +2%)
      const dailyChange = (Math.random() * 4 - 2) / 100;
      const open = currentPrice;
      const close = open * (1 + dailyChange);
      
      // Generate high and low within a reasonable range
      const high = Math.max(open, close) * (1 + Math.random() * 0.02); // Up to 2% higher
      const low = Math.min(open, close) * (1 - Math.random() * 0.02); // Up to 2% lower
      
      // Generate realistic volume (higher on more volatile days)
      const volatility = Math.abs(dailyChange);
      const volume = Math.floor(1000000 + volatility * 10000000 + Math.random() * 5000000);
      
      data.push({
        date: date,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: volume,
        // Add previous close for calculating daily returns
        previousClose: i > 0 ? currentPrice : null
      });
      
      // Update current price for next iteration
      currentPrice = close;
    }
    
    return data;
  };
  
  /**
   * Generate sample news data with sentiment scores
   * @param {number} numArticles - Number of news articles to generate
   * @param {Array} stockData - Stock data to align news dates with
   * @returns {Array} - Array of news articles with sentiment scores
   */
  export const generateSampleNewsData = (numArticles = 500, stockData = []) => {
    if (!stockData || stockData.length === 0) {
      // If no stock data is provided, create a basic sample
      const today = new Date();
      stockData = Array(30).fill().map((_, i) => ({
        date: new Date(today.getTime() - (29 - i) * 24 * 60 * 60 * 1000),
        open: 2000,
        close: 2000
      }));
    }
    
    const news = [];
    const sources = ['Financial Times', 'Bloomberg', 'Reuters', 'CNBC', 'Wall Street Journal', 'MarketWatch'];
    
    // Sample positive headlines and their sentiment scores
    const positiveHeadlines = [
      { headline: "Company Reports Strong Quarterly Earnings", score: 0.75 },
      { headline: "New Product Launch Exceeds Expectations", score: 0.82 },
      { headline: "Analyst Upgrades Stock to 'Buy' Rating", score: 0.68 },
      { headline: "Company Announces Expansion Plans", score: 0.65 },
      { headline: "Strategic Partnership Formed with Industry Leader", score: 0.70 },
      { headline: "Record Revenue Reported for Fiscal Year", score: 0.85 },
      { headline: "Dividend Increase Announced for Shareholders", score: 0.60 },
      { headline: "Company Exceeds Market Expectations", score: 0.72 }
    ];
    
    // Sample neutral headlines and their sentiment scores
    const neutralHeadlines = [
      { headline: "Company Holds Annual Shareholder Meeting", score: 0.05 },
      { headline: "Industry Conference Highlights New Trends", score: -0.08 },
      { headline: "Market Analysts Predict Sideways Movement", score: 0.02 },
      { headline: "Interview with Company CEO Released", score: -0.05 },
      { headline: "Regulatory Filing Submitted on Schedule", score: 0.00 },
      { headline: "Company Maintains Current Outlook", score: 0.10 },
      { headline: "Industry Report Shows Mixed Results", score: -0.10 }
    ];
    
    // Sample negative headlines and their sentiment scores
    const negativeHeadlines = [
      { headline: "Company Misses Earnings Expectations", score: -0.65 },
      { headline: "Regulatory Investigation Announced", score: -0.80 },
      { headline: "Analyst Downgrades Stock Rating", score: -0.55 },
      { headline: "Supply Chain Issues Impact Production", score: -0.45 },
      { headline: "Competitor Gains Market Share", score: -0.50 },
      { headline: "Key Executive Announces Departure", score: -0.60 },
      { headline: "Product Recall Announced", score: -0.75 },
      { headline: "Revenue Falls Below Projections", score: -0.70 }
    ];
    
    // Sample summaries for different sentiment categories
    const positiveSummaries = [
      "The company reported earnings that exceeded analyst expectations by 15%.",
      "Market analysts have responded positively to recent company developments.",
      "The new product launch has been well-received by customers and critics alike.",
      "Institutional investors have increased their positions in the company.",
      "The expansion is expected to drive significant revenue growth in coming quarters."
    ];
    
    const neutralSummaries = [
      "The company provided updates on ongoing projects without significant changes to outlook.",
      "Most analysts maintain a 'hold' rating for the stock at current price levels.",
      "Industry trends remain consistent with previous quarters.",
      "The company's market position remains unchanged despite sector volatility.",
      "No significant developments were announced at the industry conference."
    ];
    
    const negativeSummaries = [
      "The earnings miss has raised concerns about the company's growth trajectory.",
      "Regulatory challenges may impact operations in the coming months.",
      "The analyst cited concerns about increasing competition in the downgrade.",
      "Supply chain disruptions continue to affect production capacity.",
      "The executive departure has created uncertainty about the company's leadership."
    ];
    
    // Generate news articles aligned with stock data dates
    // Limit to actual number of articles or stock data length, whichever is smaller
    const actualArticles = Math.min(numArticles, stockData.length * 3);
    
    for (let i = 0; i < actualArticles; i++) {
      // Randomly select a date from the stock data
      const dateIndex = Math.floor(Math.random() * stockData.length);
      const date = new Date(stockData[dateIndex].date);
      
      // Add a random time component to the date
      date.setHours(Math.floor(Math.random() * 14) + 8); // 8 AM to 10 PM
      date.setMinutes(Math.floor(Math.random() * 60));
      
      // Determine sentiment category based on stock performance that day
      let dayReturn = 0;
      if (stockData[dateIndex].open && stockData[dateIndex].close) {
        dayReturn = stockData[dateIndex].close / stockData[dateIndex].open - 1;
      }
      
      let sentimentCategory;
      
      // Bias the sentiment based on stock performance but allow for variety
      if (dayReturn > 0.01 || Math.random() < 0.4) {
        sentimentCategory = 'positive';
      } else if (dayReturn < -0.01 || Math.random() < 0.4) {
        sentimentCategory = 'negative';
      } else {
        sentimentCategory = 'neutral';
      }
      
      // Select a headline based on sentiment category
      let headlineObj;
      let summary;
      
      if (sentimentCategory === 'positive') {
        headlineObj = positiveHeadlines[Math.floor(Math.random() * positiveHeadlines.length)];
        summary = positiveSummaries[Math.floor(Math.random() * positiveSummaries.length)];
      } else if (sentimentCategory === 'negative') {
        headlineObj = negativeHeadlines[Math.floor(Math.random() * negativeHeadlines.length)];
        summary = negativeSummaries[Math.floor(Math.random() * negativeSummaries.length)];
      } else {
        headlineObj = neutralHeadlines[Math.floor(Math.random() * neutralHeadlines.length)];
        summary = neutralSummaries[Math.floor(Math.random() * neutralSummaries.length)];
      }
      
      // Add some variation to sentiment scores (±0.1)
      const sentimentVariation = (Math.random() * 0.2 - 0.1);
      const sentiment = Math.max(-1, Math.min(1, headlineObj.score + sentimentVariation));
      
      // Generate a news article
      news.push({
        id: i + 1,
        headline: headlineObj.headline,
        summary: summary,
        date: date,
        source: sources[Math.floor(Math.random() * sources.length)],
        sentiment: parseFloat(sentiment.toFixed(2))
      });
    }
    
    // Sort by date
    return news.sort((a, b) => a.date - b.date);
  };
  
  /**
   * Convert data to CSV format
   * @param {Array} data - Array of objects to convert to CSV
   * @param {Array} headers - Array of header names
   * @returns {string} - CSV string
   */
  export const convertToCSV = (data, headers) => {
    if (!data || !headers) {
      return '';
    }
    
    const headerRow = headers.join(',');
    const rows = data.map(item => {
      return headers.map(header => {
        if (!item) return '';
        
        if (item[header] instanceof Date) {
          return item[header].toISOString().split('T')[0]; // Format as YYYY-MM-DD
        } else if (typeof item[header] === 'number') {
          return item[header]; // Don't quote numbers
        } else if (item[header] === null || item[header] === undefined) {
          return ''; // Empty string for null/undefined
        } else {
          // Escape quotes in strings and wrap in quotes
          return `"${String(item[header]).replace(/"/g, '""')}"`;
        }
      }).join(',');
    });
    
    return [headerRow, ...rows].join('\n');
  };
  
  /**
   * Generate and save sample data files
   */
  export const generateAndSaveData = async () => {
    try {
      // Generate sample stock data
      const stockData = generateSampleStockData(365);
      
      // Generate sample news data aligned with stock dates
      const newsData = generateSampleNewsData(500, stockData);
      
      // Convert to CSV
      const stockHeaders = ['date', 'open', 'high', 'low', 'close', 'volume'];
      const stockCSV = convertToCSV(stockData, stockHeaders);
      
      const newsHeaders = ['id', 'headline', 'summary', 'date', 'source', 'sentiment'];
      const newsCSV = convertToCSV(newsData, newsHeaders);
      
      return {
        stockCSV,
        newsCSV,
        stockData,
        newsData
      };
    } catch (error) {
      console.error('Error generating sample data:', error);
      
      // Return empty datasets as fallback
      return {
        stockCSV: 'date,open,high,low,close,volume',
        newsCSV: 'id,headline,summary,date,source,sentiment',
        stockData: [],
        newsData: []
      };
    }
  };
  
  export default {
    generateSampleStockData,
    generateSampleNewsData,
    convertToCSV,
    generateAndSaveData
  };