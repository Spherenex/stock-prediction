// // src/services/stockApi.js
// import Papa from 'papaparse';

// // Stock API service to fetch stock data from external APIs
// export class StockApiService {
//   constructor(apiKey = '') {
//     this.apiKey = apiKey;
//     // Common API endpoints
//     this.endpoints = {
//       // Alpha Vantage API
//       alphaVantage: 'https://www.alphavantage.co/query',
//       // Financial Modeling Prep API
//       fmp: 'https://financialmodelingprep.com/api/v3',
//       // News API
//       newsApi: 'https://newsapi.org/v2'
//     };
//   }

//   // Get Nifty 50 companies list
//   async getNifty50Companies() {
//     try {
//       // In a real app, you would fetch this from an API
//       // Example: const response = await fetch(`${this.endpoints.fmp}/nifty_fifty?apikey=${this.apiKey}`);
      
//       // For demo, return a static list
//       return [
//         { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
//         { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
//         { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
//         { symbol: 'INFY', name: 'Infosys Ltd.' },
//         { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
//         { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
//         { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' },
//         { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
//         { symbol: 'ITC', name: 'ITC Ltd.' },
//         { symbol: 'SBIN', name: 'State Bank of India' },
//         { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.' },
//         { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' },
//         { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.' },
//         { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.' },
//         { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.' },
//         { symbol: 'WIPRO', name: 'Wipro Ltd.' },
//         { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.' },
//         { symbol: 'TITAN', name: 'Titan Company Ltd.' },
//         { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.' },
//         { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Ltd.' },
//         { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.' },
//         { symbol: 'NTPC', name: 'NTPC Ltd.' },
//         { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.' },
//         { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.' },
//         { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.' },
//         { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.' },
//         { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.' },
//         { symbol: 'TECHM', name: 'Tech Mahindra Ltd.' },
//         { symbol: 'NESTLEIND', name: 'Nestle India Ltd.' },
//         { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.' },
//         { symbol: 'CIPLA', name: 'Cipla Ltd.' },
//         { symbol: 'GRASIM', name: 'Grasim Industries Ltd.' },
//         { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.' },
//         { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Ltd.' },
//         { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Ltd.' },
//         { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd.' },
//         { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.' },
//         { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd.' },
//         { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.' },
//         { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Ltd.' },
//         { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.' },
//         { symbol: 'IOC', name: 'Indian Oil Corporation Ltd.' },
//         { symbol: 'UPL', name: 'UPL Ltd.' },
//         { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd.' },
//         { symbol: 'COALINDIA', name: 'Coal India Ltd.' },
//         { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.' },
//         { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.' },
//         { symbol: 'SHREECEM', name: 'Shree Cement Ltd.' },
//         { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.' },
//         { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd.' }
//       ];
//     } catch (error) {
//       console.error('Error fetching Nifty 50 companies:', error);
//       throw error;
//     }
//   }

//   // Get historical stock data
//   async getHistoricalData(symbol, days = 365) {
//     try {
//       // In a real app, you would fetch this from an API
//       // Example: const response = await fetch(
//       //   `${this.endpoints.alphaVantage}?function=TIME_SERIES_DAILY&symbol=${symbol}.NS&outputsize=full&apikey=${this.apiKey}`
//       // );
      
//       // For demo, generate mock data
//       const mockData = this.generateMockHistoricalData(symbol, days);
//       return mockData;
//     } catch (error) {
//       console.error(`Error fetching historical data for ${symbol}:`, error);
//       throw error;
//     }
//   }

//   // Get latest stock quote
//   async getStockQuote(symbol) {
//     try {
//       // In a real app, you would fetch this from an API
//       // Example: const response = await fetch(
//       //   `${this.endpoints.alphaVantage}?function=GLOBAL_QUOTE&symbol=${symbol}.NS&apikey=${this.apiKey}`
//       // );
      
//       // For demo, generate a mock quote
//       const mockQuote = this.generateMockStockQuote(symbol);
//       return mockQuote;
//     } catch (error) {
//       console.error(`Error fetching quote for ${symbol}:`, error);
//       throw error;
//     }
//   }

//   // Get stock news with sentiment
//   async getStockNews(symbol, count = 10) {
//     try {
//       // In a real app, you would fetch this from a news API
//       // Example: const response = await fetch(
//       //   `${this.endpoints.newsApi}/everything?q=${symbol}&apiKey=${this.apiKey}&pageSize=${count}`
//       // );
      
//       // For demo, generate mock news data
//       const mockNews = this.generateMockNewsData(symbol, count);
//       return mockNews;
//     } catch (error) {
//       console.error(`Error fetching news for ${symbol}:`, error);
//       throw error;
//     }
//   }

//   // Import data from CSV
//   async importFromCSV(file) {
//     return new Promise((resolve, reject) => {
//       Papa.parse(file, {
//         header: true,
//         dynamicTyping: true,
//         skipEmptyLines: true,
//         complete: (results) => {
//           if (results.errors.length > 0) {
//             reject(results.errors);
//           } else {
//             resolve(results.data);
//           }
//         },
//         error: (error) => {
//           reject(error);
//         }
//       });
//     });
//   }

//   // Helper: Generate mock historical data
//   generateMockHistoricalData(symbol, days) {
//     const data = [];
//     const now = new Date();
//     let basePrice;
    
//     // Set different base prices for different stocks
//     switch(symbol) {
//       case 'RELIANCE': basePrice = 2500; break;
//       case 'TCS': basePrice = 3200; break;
//       case 'HDFCBANK': basePrice = 1600; break;
//       default: basePrice = 1000 + Math.random() * 2000;
//     }
    
//     let currentPrice = basePrice;
    
//     for (let i = days; i > 0; i--) {
//       const date = new Date(now);
//       date.setDate(date.getDate() - i);
      
//       // Skip weekends
//       if (date.getDay() === 0 || date.getDay() === 6) {
//         continue;
//       }
      
//       // Simulate some realistic price movements
//       const dailyChange = (Math.random() - 0.48) * (basePrice * 0.02); // Slightly bullish bias
//       currentPrice += dailyChange;
//       currentPrice = Math.max(currentPrice, basePrice * 0.5); // Prevent unrealistic crash
      
//       // Add some volatility based on day of week (higher on Mon/Fri)
//       const dayOfWeek = date.getDay();
//       const volatilityFactor = (dayOfWeek === 1 || dayOfWeek === 5) ? 1.5 : 1;
//       const volatility = (Math.random() - 0.5) * (basePrice * 0.01) * volatilityFactor;
      
//       const open = currentPrice;
//       const close = currentPrice + volatility;
//       const high = Math.max(open, close) + Math.random() * (basePrice * 0.01);
//       const low = Math.min(open, close) - Math.random() * (basePrice * 0.01);
//       const volume = Math.floor(1000000 + Math.random() * 5000000);
      
//       data.push({
//         date: date.toISOString().split('T')[0],
//         open: parseFloat(open.toFixed(2)),
//         high: parseFloat(high.toFixed(2)),
//         low: parseFloat(low.toFixed(2)),
//         close: parseFloat(close.toFixed(2)),
//         volume
//       });
//     }
    
//     return data;
//   }

//   // Helper: Generate mock stock quote
//   generateMockStockQuote(symbol) {
//     let basePrice;
    
//     // Set different base prices for different stocks
//     switch(symbol) {
//       case 'RELIANCE': basePrice = 2500; break;
//       case 'TCS': basePrice = 3200; break;
//       case 'HDFCBANK': basePrice = 1600; break;
//       default: basePrice = 1000 + Math.random() * 2000;
//     }
    
//     const price = basePrice + (Math.random() - 0.5) * (basePrice * 0.02);
//     const change = (Math.random() - 0.5) * (basePrice * 0.01);
//     const changePercent = (change / (price - change)) * 100;
    
//     return {
//       symbol,
//       price: parseFloat(price.toFixed(2)),
//       change: parseFloat(change.toFixed(2)),
//       changePercent: parseFloat(changePercent.toFixed(2)),
//       volume: Math.floor(1000000 + Math.random() * 5000000),
//       timestamp: new Date().toISOString()
//     };
//   }

//   // Helper: Generate mock news data
//   generateMockNewsData(symbol, count) {
//     const headlines = [
//       `${symbol} Reports Strong Quarterly Earnings`,
//       `${symbol} Announces New Product Line`,
//       `Analysts Upgrade ${symbol} to "Buy"`,
//       `${symbol} Expands Operations in International Markets`,
//       `${symbol} CEO Interviewed on Future Growth Strategy`,
//       `${symbol} Dividend Announcement Expected Soon`,
//       `Industry Challenges Affect ${symbol}'s Market Position`,
//       `${symbol} Forms Strategic Partnership with Tech Giant`,
//       `Regulatory Changes May Impact ${symbol}'s Business Model`,
//       `${symbol} Stock Rallies on Positive Economic Data`,
//       `Economic Outlook Favorable for ${symbol}`,
//       `${symbol} Faces Competition in Key Markets`,
//       `Investors Optimistic About ${symbol}'s Growth Prospects`,
//       `${symbol} Research and Development Pays Off`,
//       `Market Volatility Impacts ${symbol} Stock Price`
//     ];
    
//     const news = [];
    
//     for (let i = 0; i < count; i++) {
//       const headlineIndex = Math.floor(Math.random() * headlines.length);
//       // Generate sentiment between -1 and 1
//       // Make sentiment correlate somewhat with headline (positive headlines = positive sentiment)
//       let sentimentBias = 0;
//       const headline = headlines[headlineIndex];
//       if (headline.includes('Strong') || headline.includes('Upgrade') || 
//           headline.includes('Rallies') || headline.includes('Optimistic') ||
//           headline.includes('Favorable')) {
//         sentimentBias = 0.5;
//       } else if (headline.includes('Challenges') || headline.includes('Competition') || 
//                 headline.includes('Volatility') || headline.includes('Impact')) {
//         sentimentBias = -0.5;
//       }
      
//       const sentimentValue = Math.min(1, Math.max(-1, sentimentBias + (Math.random() - 0.5)));
//       const dayOffset = Math.floor(Math.random() * 7); // News from past week
//       const date = new Date();
//       date.setDate(date.getDate() - dayOffset);
      
//       news.push({
//         id: i,
//         headline: headline,
//         summary: `This is a detailed summary about ${headline.toLowerCase()}. It would contain more information about the news item and its potential impact on the company's stock price and market position.`,
//         source: ['Bloomberg', 'Reuters', 'CNBC', 'Financial Times', 'The Economic Times'][i % 5],
//         date: date.toISOString().split('T')[0],
//         url: '#',
//         sentiment: parseFloat(sentimentValue.toFixed(2))
//       });
//     }
    
//     return news;
//   }
// }

// // Export a single instance to be used throughout the app
// export default new StockApiService();

// Stock API service
class StockApiService {
    constructor() {
      // API endpoints - in a real app, these would be your actual API endpoints
      this.endpoints = {
        alphaVantage: 'https://www.alphavantage.co/query',
        financialModelingPrep: 'https://financialmodelingprep.com/api/v3',
        newsApi: 'https://newsapi.org/v2'
      };
      
      // API keys - in a real app, these would come from environment variables
      this.apiKeys = {
        alphaVantage: 'your_alpha_vantage_api_key',
        financialModelingPrep: 'your_fmp_api_key',
        newsApi: 'your_news_api_key'
      };
    }
  
    // Get Nifty 50 companies list
    async getNifty50Companies() {
      try {
        // In a real app, you would fetch this from an API
        // const response = await fetch(`${this.endpoints.financialModelingPrep}/stock/list?apikey=${this.apiKeys.financialModelingPrep}`);
        // const data = await response.json();
        // return data.filter(stock => stock.exchange === 'NSE' && stock.isNifty50);
        
        // For demo purposes, return a static list
        return [
                    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
                    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
                    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
                    { symbol: 'INFY', name: 'Infosys Ltd.' },
                    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
                    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
                    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' },
                    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
                    { symbol: 'ITC', name: 'ITC Ltd.' },
                    { symbol: 'SBIN', name: 'State Bank of India' },
                    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.' },
                    { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' },
                    { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.' },
                    { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.' },
                    { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.' },
                    { symbol: 'WIPRO', name: 'Wipro Ltd.' },
                    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.' },
                    { symbol: 'TITAN', name: 'Titan Company Ltd.' },
                    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.' },
                    { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Ltd.' },
                    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.' },
                    { symbol: 'NTPC', name: 'NTPC Ltd.' },
                    { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.' },
                    { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.' },
                    { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.' },
                    { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.' },
                    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.' },
                    { symbol: 'TECHM', name: 'Tech Mahindra Ltd.' },
                    { symbol: 'NESTLEIND', name: 'Nestle India Ltd.' },
                    { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.' },
                    { symbol: 'CIPLA', name: 'Cipla Ltd.' },
                    { symbol: 'GRASIM', name: 'Grasim Industries Ltd.' },
                    { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.' },
                    { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Ltd.' },
                    { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Ltd.' },
                    { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd.' },
                    { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.' },
                    { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd.' },
                    { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.' },
                    { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Ltd.' },
                    { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.' },
                    { symbol: 'IOC', name: 'Indian Oil Corporation Ltd.' },
                    { symbol: 'UPL', name: 'UPL Ltd.' },
                    { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd.' },
                    { symbol: 'COALINDIA', name: 'Coal India Ltd.' },
                    { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.' },
                    { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.' },
                    { symbol: 'SHREECEM', name: 'Shree Cement Ltd.' },
                    { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.' },
                    { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd.' }
                  ];
      } catch (error) {
        console.error('Error fetching Nifty 50 companies:', error);
        throw error;
      }
    }
  
    // Get historical stock data
    async getHistoricalData(symbol, days = 365) {
      try {
        // In a real app, you would fetch this from an API
        // const response = await fetch(
        //   `${this.endpoints.alphaVantage}?function=TIME_SERIES_DAILY&symbol=${symbol}.NS&outputsize=full&apikey=${this.apiKeys.alphaVantage}`
        // );
        // const data = await response.json();
        // Process the data...
        
        // For demo, generate mock data
        return this.generateMockHistoricalData(symbol, days);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
      }
    }
  
    // Get stock news with sentiment
    async getStockNews(symbol, count = 10) {
      try {
        // In a real app, you would fetch this from an API
        // const response = await fetch(
        //   `${this.endpoints.newsApi}/everything?q=${symbol}&apiKey=${this.apiKeys.newsApi}&pageSize=${count}`
        // );
        // const data = await response.json();
        // Process the data...
        
        // For demo, generate mock news
        return this.generateMockNewsData(symbol, count);
      } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
    }
  
    // Helper method to generate mock historical data
    generateMockHistoricalData(symbol, days) {
      const data = [];
      const today = new Date();
      
      // Set different base prices for different stocks
      let basePrice = 0;
      
      switch (symbol) {
        case 'RELIANCE':
          basePrice = 2500;
          break;
        case 'TCS':
          basePrice = 3500;
          break;
        case 'HDFCBANK':
          basePrice = 1600;
          break;
        case 'INFY':
          basePrice = 1800;
          break;
        default:
          basePrice = 1000 + Math.random() * 2000;
      }
      
      let currentPrice = basePrice;
      
      for (let i = days; i > 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) {
          continue;
        }
        
        // Simulate price movement with a slight upward bias
        const dailyChange = (Math.random() - 0.48) * (basePrice * 0.02);
        currentPrice += dailyChange;
        
        // Add some volatility based on day of week
        const dayOfWeek = date.getDay();
        const volatilityFactor = (dayOfWeek === 1 || dayOfWeek === 5) ? 1.5 : 1;
        const volatility = (Math.random() - 0.5) * (basePrice * 0.01) * volatilityFactor;
        
        const open = currentPrice;
        const close = currentPrice + volatility;
        const high = Math.max(open, close) + (Math.random() * basePrice * 0.005);
        const low = Math.min(open, close) - (Math.random() * basePrice * 0.005);
        const volume = Math.floor(100000 + Math.random() * 1000000);
        
        data.push({
          date: date.toISOString().split('T')[0],
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume
        });
      }
      
      return data;
    }
  
    // Helper method to generate mock news data
    generateMockNewsData(symbol, count) {
      const headlines = [
        `${symbol} Reports Strong Quarterly Earnings`,
        `${symbol} Announces New Product Line`,
        `Analysts Upgrade ${symbol} Stock to Buy`,
        `${symbol} Expands Operations in International Markets`,
        `${symbol} CEO Discusses Future Growth Strategy`,
        `${symbol} Dividend Announcement Expected Soon`,
        `Industry Challenges May Impact ${symbol}`,
        `${symbol} Forms Strategic Partnership`,
        `Regulatory Changes Affect ${symbol}'s Business Model`,
        `${symbol} Stock Rallies on Positive Economic Data`
      ];
      
      const news = [];
      
      for (let i = 0; i < count; i++) {
        // Randomize sentiment between -1 and 1 with bias towards headline
        const headlineIndex = i % headlines.length;
        let sentimentBias = 0;
        
        // Determine sentiment bias based on headline content
        const headline = headlines[headlineIndex];
        if (headline.includes('Strong') || headline.includes('Upgrade') || headline.includes('Rallies')) {
          sentimentBias = 0.5;
        } else if (headline.includes('Challenges') || headline.includes('Impact')) {
          sentimentBias = -0.5;
        }
        
        const sentiment = Math.min(1, Math.max(-1, sentimentBias + (Math.random() - 0.5)));
        
        // Random date within the last week
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7));
        
        news.push({
          id: i,
          headline: headlines[headlineIndex],
          summary: `This is a detailed summary about the ${headline.toLowerCase()}. It provides more context and information about how this news might affect investors and the stock price.`,
          source: ['Bloomberg', 'Reuters', 'CNBC', 'Financial Times', 'Economic Times'][i % 5],
          date: date.toISOString().split('T')[0],
          url: '#',
          sentiment: parseFloat(sentiment.toFixed(2))
        });
      }
      
      return news;
    }
  }
  
  // Export a singleton instance
  const stockApi = new StockApiService();
  export default stockApi;