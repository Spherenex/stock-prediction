// class StockApiService {
//   constructor() {
//     // API endpoints
//     this.endpoints = {
//       alphavantage: 'https://www.alphavantage.co/query',
//       finnhub: 'https://finnhub.io/api/v1',
//       yahooFinance: 'https://query1.finance.yahoo.com/v8/finance/chart',
//       newsapi: 'https://newsapi.org/v2/everything'
//     };
    
//     // API keys - Replace with your actual API keys
//      this.apiKeys = {
//       alphavantage: process.env.REACT_APP_ALPHA_VANTAGE_KEY || 'GOGNJPP4Q7JQB2CD', 
//       finnhub: process.env.REACT_APP_FINNHUB_KEY || 'd0cepr9r01ql2j3cmg90d0cepr9r01ql2j3cmg9g',
//       newsapi: process.env.REACT_APP_NEWS_API_KEY || '98d770b0773342d681d7a00ccda8a826'
//     };
    
//     // Symbol mappings for Indian stocks to international format
//     this.symbolMappings = {
//       'RELIANCE': 'RELIANCE.NS',
//       'TCS': 'TCS.NS',
//       'HDFCBANK': 'HDFCBANK.NS',
//       'INFY': 'INFY.NS',
//       'ICICIBANK': 'ICICIBANK.NS',
//       'HINDUNILVR': 'HINDUNILVR.NS',
//       'KOTAKBANK': 'KOTAKBANK.NS',
//       'BHARTIARTL': 'BHARTIARTL.NS',
//       'ITC': 'ITC.NS',
//       'SBIN': 'SBIN.NS',
//       'BAJFINANCE': 'BAJFINANCE.NS',
//       'AXISBANK': 'AXISBANK.NS',
//       'ASIANPAINT': 'ASIANPAINT.NS',
//       'MARUTI': 'MARUTI.NS',
//       'HCLTECH': 'HCLTECH.NS',
//       'WIPRO': 'WIPRO.NS',
//       'ULTRACEMCO': 'ULTRACEMCO.NS',
//       'TITAN': 'TITAN.NS',
//       'SUNPHARMA': 'SUNPHARMA.NS',
//       'ADANIPORTS': 'ADANIPORTS.NS',
//       'LT': 'LT.NS',
//       'BAJAJFINSV': 'BAJAJFINSV.NS',
//       'NESTLEIND': 'NESTLEIND.NS',
//       'ONGC': 'ONGC.NS',
//       'JSWSTEEL': 'JSWSTEEL.NS',
//       'HINDALCO': 'HINDALCO.NS',
//       'M&M': 'M&M.NS',
//       'POWERGRID': 'POWERGRID.NS',
//       'NTPC': 'NTPC.NS',
//       'TATAMOTORS': 'TATAMOTORS.NS',
//       'GRASIM': 'GRASIM.NS',
//       'DIVISLAB': 'DIVISLAB.NS',
//       'TECHM': 'TECHM.NS',
//       'INDUSINDBK': 'INDUSINDBK.NS',
//       'BPCL': 'BPCL.NS',
//       'CIPLA': 'CIPLA.NS',
//       'BRITANNIA': 'BRITANNIA.NS',
//       'ADANIENT': 'ADANIENT.NS',
//       'EICHERMOT': 'EICHERMOT.NS',
//       'HEROMOTOCO': 'HEROMOTOCO.NS',
//       'DRREDDY': 'DRREDDY.NS',
//       'TATASTEEL': 'TATASTEEL.NS',
//       'COALINDIA': 'COALINDIA.NS',
//       'SBILIFE': 'SBILIFE.NS',
//       'BAJAJ-AUTO': 'BAJAJ-AUTO.NS',
//       'HDFCLIFE': 'HDFCLIFE.NS',
//       'APOLLOHOSP': 'APOLLOHOSP.NS',
//       'TATACONSUM': 'TATACONSUM.NS',
//       'UPL': 'UPL.NS',
//       'SHRIRAMFIN': 'SHRIRAMFIN.NS'
//     };
    
//     // Cache system to prevent excessive API calls
//     this.cache = {
//       historicalData: {},
//       currentPrice: {},
//       news: {},
//       lastUpdated: {}
//     };
    
//     // Cache expiry in milliseconds
//     this.cacheExpiry = {
//       historicalData: 60 * 60 * 1000, // 1 hour
//       currentPrice: 5 * 60 * 1000, // 5 minutes
//       news: 30 * 60 * 1000 // 30 minutes
//     };

//     // Base prices for fallback (approximate current prices as of 2025)
//     this.basePrices = {
//       'RELIANCE': 1700,
//       'TCS': 3850,
//       'HDFCBANK': 1720,
//       'INFY': 1950,
//       'ICICIBANK': 1100,
//       'HINDUNILVR': 2800,
//       'KOTAKBANK': 1950,
//       'BHARTIARTL': 950,
//       'ITC': 400,
//       'SBIN': 600,
//       'BAJFINANCE': 7500,
//       'AXISBANK': 950,
//       'ASIANPAINT': 2000,
//       'MARUTI': 11000,
//       'HCLTECH': 1500,
//       'WIPRO': 500,
//       'ULTRACEMCO': 9000,
//       'TITAN': 3800,
//       'SUNPHARMA': 1100,
//       'ADANIPORTS': 1400,
//       'LT': 3500,
//       'BAJAJFINSV': 1800,
//       'NESTLEIND': 25000,
//       'ONGC': 200,
//       'JSWSTEEL': 800,
//       'HINDALCO': 550,
//       'M&M': 2000,
//       'POWERGRID': 300,
//       'NTPC': 350,
//       'TATAMOTORS': 900,
//       'GRASIM': 2000,
//       'DIVISLAB': 4500,
//       'TECHM': 1400,
//       'INDUSINDBK': 1600,
//       'BPCL': 600,
//       'CIPLA': 1300,
//       'BRITANNIA': 5000,
//       'ADANIENT': 3000,
//       'EICHERMOT': 4500,
//       'HEROMOTOCO': 5000,
//       'DRREDDY': 6000,
//       'TATASTEEL': 150,
//       'COALINDIA': 400,
//       'SBILIFE': 1400,
//       'BAJAJ-AUTO': 9000,
//       'HDFCLIFE': 700,
//       'APOLLOHOSP': 6000,
//       'TATACONSUM': 1100,
//       'UPL': 550,
//       'SHRIRAMFIN': 2500
//     };
//   }

//   // Get Nifty 50 companies list
//   async getNifty50Companies() {
//     try {
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
//         { symbol: 'LT', name: 'Larsen & Toubro Ltd.' },
//         { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.' },
//         { symbol: 'NESTLEIND', name: 'Nestlé India Ltd.' },
//         { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Ltd.' },
//         { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.' },
//         { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.' },
//         { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.' },
//         { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.' },
//         { symbol: 'NTPC', name: 'NTPC Ltd.' },
//         { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.' },
//         { symbol: 'GRASIM', name: 'Grasim Industries Ltd.' },
//         { symbol: 'DIVISLAB', name: 'Divis Laboratories Ltd.' },
//         { symbol: 'TECHM', name: 'Tech Mahindra Ltd.' },
//         { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd.' },
//         { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.' },
//         { symbol: 'CIPLA', name: 'Cipla Ltd.' },
//         { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.' },
//         { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.' },
//         { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.' },
//         { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.' },
//         { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories Ltd.' },
//         { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.' },
//         { symbol: 'COALINDIA', name: 'Coal India Ltd.' },
//         { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd.' },
//         { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.' },
//         { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.' },
//         { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd.' },
//         { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd.' },
//         { symbol: 'UPL', name: 'UPL Ltd.' },
//         { symbol: 'SHRIRAMFIN', name: 'Shriram Finance Ltd.' }
//       ];
//     } catch (error) {
//       console.error('Error fetching Nifty 50 companies:', error);
//       throw error;
//     }
//   }

//   // Get current stock price in real-time
//   async getCurrentPrice(symbol) {
//     try {
//       const cacheKey = symbol;
//       const now = new Date().getTime();
      
//       // Check cache first
//       if (
//         this.cache.currentPrice[cacheKey] && 
//         this.cache.lastUpdated[`price_${cacheKey}`] && 
//         (now - this.cache.lastUpdated[`price_${cacheKey}`] < this.cacheExpiry.currentPrice)
//       ) {
//         console.log(`Using cached current price for ${symbol}`);
//         return this.cache.currentPrice[cacheKey];
//       }

//       // Try Yahoo Finance API first
//       const yahooSymbol = this.symbolMappings[symbol] || symbol;
//       const currentPrice = await this.fetchCurrentPriceFromYahoo(yahooSymbol);
      
//       if (currentPrice) {
//         this.cache.currentPrice[cacheKey] = currentPrice;
//         this.cache.lastUpdated[`price_${cacheKey}`] = now;
//         return currentPrice;
//       }

//       // Fallback to Alpha Vantage
//       const alphaPrice = await this.fetchCurrentPriceFromAlpha(symbol);
//       if (alphaPrice) {
//         this.cache.currentPrice[cacheKey] = alphaPrice;
//         this.cache.lastUpdated[`price_${cacheKey}`] = now;
//         return alphaPrice;
//       }

//       // Final fallback to base price with small random variation
//       const basePrice = this.basePrices[symbol] || 1000;
//       const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
//       const fallbackPrice = basePrice * (1 + variation);
      
//       console.log(`Using fallback price for ${symbol}: ${fallbackPrice}`);
//       return parseFloat(fallbackPrice.toFixed(2));

//     } catch (error) {
//       console.error(`Error fetching current price for ${symbol}:`, error);
//       const basePrice = this.basePrices[symbol] || 1000;
//       return parseFloat(basePrice.toFixed(2));
//     }
//   }

//   // Fetch current price from Yahoo Finance
//   async fetchCurrentPriceFromYahoo(symbol) {
//     try {
//       const response = await fetch(
//         `${this.endpoints.yahooFinance}/${symbol}?interval=1d&range=1d`,
//         {
//           method: 'GET',
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Yahoo Finance API error: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data.chart && data.chart.result && data.chart.result[0]) {
//         const result = data.chart.result[0];
//         const prices = result.indicators.quote[0];
//         const latestClose = prices.close[prices.close.length - 1];
        
//         if (latestClose && !isNaN(latestClose)) {
//           console.log(`Fetched current price from Yahoo for ${symbol}: ${latestClose}`);
//           return parseFloat(latestClose.toFixed(2));
//         }
//       }

//       return null;
//     } catch (error) {
//       console.error(`Yahoo Finance API error for ${symbol}:`, error);
//       return null;
//     }
//   }

//   // Fetch current price from Alpha Vantage
//   async fetchCurrentPriceFromAlpha(symbol) {
//     try {
//       if (this.apiKeys.alphavantage === 'demo') {
//         return null; // Skip if no real API key
//       }

//       const response = await fetch(
//         `${this.endpoints.alphavantage}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKeys.alphavantage}`
//       );

//       if (!response.ok) {
//         throw new Error(`Alpha Vantage API error: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data['Global Quote'] && data['Global Quote']['05. price']) {
//         const price = parseFloat(data['Global Quote']['05. price']);
//         console.log(`Fetched current price from Alpha Vantage for ${symbol}: ${price}`);
//         return price;
//       }

//       return null;
//     } catch (error) {
//       console.error(`Alpha Vantage API error for ${symbol}:`, error);
//       return null;
//     }
//   }

//   // Get historical stock data with real-time updates
//   async getHistoricalData(symbol, days = 365) {
//     try {
//       const cacheKey = `${symbol}_${days}`;
//       const now = new Date().getTime();
      
//       // Check if we have valid cached data
//       if (
//         this.cache.historicalData[cacheKey] && 
//         this.cache.lastUpdated[cacheKey] && 
//         (now - this.cache.lastUpdated[cacheKey] < this.cacheExpiry.historicalData)
//       ) {
//         console.log(`Using cached historical data for ${symbol}`);
//         return this.cache.historicalData[cacheKey];
//       }

//       // Try to fetch real data
//       let realData = await this.fetchRealHistoricalData(symbol, days);
      
//       if (!realData || realData.length === 0) {
//         console.log(`Failed to fetch real data for ${symbol}, generating realistic mock data`);
//         realData = await this.generateRealisticHistoricalData(symbol, days);
//       }

//       // Update cache
//       this.cache.historicalData[cacheKey] = realData;
//       this.cache.lastUpdated[cacheKey] = now;
      
//       return realData;
//     } catch (error) {
//       console.error('Error fetching historical data:', error);
      
//       // Fallback to cached data if available
//       const cacheKey = `${symbol}_${days}`;
//       if (this.cache.historicalData[cacheKey]) {
//         return this.cache.historicalData[cacheKey];
//       }
      
//       // Last resort - generate consistent mock data
//       return this.generateRealisticHistoricalData(symbol, days);
//     }
//   }

//   // Fetch real historical data from APIs
//   async fetchRealHistoricalData(symbol, days) {
//     try {
//       // Try Yahoo Finance first
//       const yahooSymbol = this.symbolMappings[symbol] || symbol;
//       let data = await this.fetchHistoricalFromYahoo(yahooSymbol, days);
      
//       if (data && data.length > 0) {
//         return data;
//       }

//       // Try Alpha Vantage as backup
//       data = await this.fetchHistoricalFromAlpha(symbol, days);
      
//       return data;
//     } catch (error) {
//       console.error(`Error fetching real historical data for ${symbol}:`, error);
//       return null;
//     }
//   }

//   // Fetch historical data from Yahoo Finance
//   async fetchHistoricalFromYahoo(symbol, days) {
//     try {
//       const endDate = Math.floor(Date.now() / 1000);
//       const startDate = endDate - (days * 24 * 60 * 60);
      
//       const response = await fetch(
//         `${this.endpoints.yahooFinance}/${symbol}?period1=${startDate}&period2=${endDate}&interval=1d`,
//         {
//           method: 'GET',
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Yahoo Finance API error: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data.chart && data.chart.result && data.chart.result[0]) {
//         const result = data.chart.result[0];
//         const timestamps = result.timestamp;
//         const prices = result.indicators.quote[0];
        
//         const historicalData = timestamps.map((timestamp, index) => {
//           const date = new Date(timestamp * 1000);
//           // Skip weekends
//           if (date.getDay() === 0 || date.getDay() === 6) {
//             return null;
//           }
          
//           return {
//             date: date.toISOString().split('T')[0],
//             open: parseFloat((prices.open[index] || 0).toFixed(2)),
//             high: parseFloat((prices.high[index] || 0).toFixed(2)),
//             low: parseFloat((prices.low[index] || 0).toFixed(2)),
//             close: parseFloat((prices.close[index] || 0).toFixed(2)),
//             volume: prices.volume[index] || 0
//           };
//         }).filter(item => item !== null && item.close > 0);

//         console.log(`Fetched ${historicalData.length} historical data points from Yahoo for ${symbol}`);
//         return historicalData;
//       }

//       return null;
//     } catch (error) {
//       console.error(`Yahoo Finance historical data error for ${symbol}:`, error);
//       return null;
//     }
//   }

//   // Fetch historical data from Alpha Vantage
//   async fetchHistoricalFromAlpha(symbol, days) {
//     try {
//       if (this.apiKeys.alphavantage === 'demo') {
//         return null;
//       }

//       const response = await fetch(
//         `${this.endpoints.alphavantage}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${this.apiKeys.alphavantage}`
//       );

//       if (!response.ok) {
//         throw new Error(`Alpha Vantage API error: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data['Time Series (Daily)']) {
//         const timeSeries = data['Time Series (Daily)'];
//         const historicalData = [];
        
//         const sortedDates = Object.keys(timeSeries).sort((a, b) => new Date(a) - new Date(b));
//         const recentDates = sortedDates.slice(-days);
        
//         recentDates.forEach(date => {
//           const dayData = timeSeries[date];
//           const dateObj = new Date(date);
          
//           // Skip weekends
//           if (dateObj.getDay() === 0 || dateObj.getDay() === 6) {
//             return;
//           }
          
//           historicalData.push({
//             date: date,
//             open: parseFloat(dayData['1. open']),
//             high: parseFloat(dayData['2. high']),
//             low: parseFloat(dayData['3. low']),
//             close: parseFloat(dayData['4. close']),
//             volume: parseInt(dayData['5. volume'])
//           });
//         });

//         console.log(`Fetched ${historicalData.length} historical data points from Alpha Vantage for ${symbol}`);
//         return historicalData;
//       }

//       return null;
//     } catch (error) {
//       console.error(`Alpha Vantage historical data error for ${symbol}:`, error);
//       return null;
//     }
//   }

//   // Generate realistic historical data based on current market conditions
//   async generateRealisticHistoricalData(symbol, days) {
//     try {
//       // Get current real price if possible
//       const currentPrice = await this.getCurrentPrice(symbol);
//       const basePrice = currentPrice || this.basePrices[symbol] || 1000;
      
//       console.log(`Generating realistic historical data for ${symbol} with current price: ${currentPrice}`);
      
//       const today = new Date();
//       const endDate = new Date(today);
//       endDate.setHours(0, 0, 0, 0);
      
//       // Set volatility based on stock type
//       let volatility = 0.01; // 1% default
//       if (['ADANIENT', 'TATAMOTORS', 'JSWSTEEL'].includes(symbol)) {
//         volatility = 0.015; // Higher volatility stocks
//       } else if (['NESTLEIND', 'HDFCBANK', 'TCS'].includes(symbol)) {
//         volatility = 0.007; // Lower volatility stocks
//       }
      
//       const data = [];
//       let price = basePrice;
      
//       // Use deterministic seed for consistency
//       const seedValue = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
//       let seed = seedValue;
      
//       // Simple deterministic random function
//       const seededRandom = (s) => {
//         const x = Math.sin(s) * 10000;
//         return x - Math.floor(x);
//       };
      
//       for (let i = days; i >= 0; i--) {
//         const date = new Date(endDate);
//         date.setDate(date.getDate() - i);
        
//         // Skip weekends
//         const dayOfWeek = date.getDay();
//         if (dayOfWeek === 0 || dayOfWeek === 6) {
//           continue;
//         }
        
//         seed = (seed * 9301 + 49297) % 233280;
        
//         // Create realistic daily movement
//         const randomFactor = seededRandom(seed) * 2 - 1;
//         const dailyChange = randomFactor * volatility * basePrice;
        
//         // Add slight upward trend (market growth)
//         const trendFactor = 1 + (0.08 / 365); // ~8% annual growth
//         price = price * trendFactor + dailyChange;
//         price = Math.max(price, basePrice * 0.2); // Prevent negative prices
        
//         // Generate OHLC data
//         const prevClose = data.length > 0 ? data[data.length - 1].close : price;
//         const overnightChange = (seededRandom(seed + 1) - 0.5) * volatility * basePrice * 0.5;
//         const open = prevClose + overnightChange;
        
//         const dayVolatility = seededRandom(seed + 2) * volatility * basePrice * 1.5;
//         const high = Math.max(open, price) + dayVolatility * 0.6;
//         const low = Math.min(open, price) - dayVolatility * 0.5;
        
//         const actualHigh = Math.max(open, price, high);
//         const actualLow = Math.min(open, price, low);
        
//         // Generate realistic volume
//         const avgVolume = basePrice * 10000;
//         const volumeVariation = seededRandom(seed + 3) * 0.4 + 0.8;
//         const volume = Math.floor(avgVolume * volumeVariation);
        
//         data.push({
//           date: date.toISOString().split('T')[0],
//           open: parseFloat(open.toFixed(2)),
//           high: parseFloat(actualHigh.toFixed(2)),
//           low: parseFloat(actualLow.toFixed(2)),
//           close: parseFloat(price.toFixed(2)),
//           volume
//         });
//       }
      
//       return data;
//     } catch (error) {
//       console.error(`Error generating realistic data for ${symbol}:`, error);
//       return [];
//     }
//   }

//   // Get stock news with sentiment
//   async getStockNews(symbol, count = 10) {
//     try {
//       const cacheKey = symbol;
//       const now = new Date().getTime();
      
//       if (
//         this.cache.news[cacheKey] && 
//         this.cache.lastUpdated[`news_${cacheKey}`] && 
//         (now - this.cache.lastUpdated[`news_${cacheKey}`] < this.cacheExpiry.news)
//       ) {
//         console.log(`Using cached news for ${symbol}`);
//         return this.cache.news[cacheKey].slice(0, count);
//       }
      
//       // Try to fetch real news
//       let realNews = await this.fetchRealNews(symbol, count);
      
//       if (!realNews || realNews.length === 0) {
//         console.log(`Failed to fetch real news for ${symbol}, generating mock news`);
//         realNews = this.generateRealisticNewsData(symbol, Math.max(count, 30));
//       }
      
//       this.cache.news[cacheKey] = realNews;
//       this.cache.lastUpdated[`news_${cacheKey}`] = now;
      
//       return realNews.slice(0, count);
//     } catch (error) {
//       console.error(`Error fetching news for ${symbol}:`, error);
      
//       const cacheKey = symbol;
//       if (this.cache.news[cacheKey]) {
//         return this.cache.news[cacheKey].slice(0, count);
//       }
      
//       return this.generateRealisticNewsData(symbol, count);
//     }
//   }

//   // Fetch real news from NewsAPI
//   async fetchRealNews(symbol, count) {
//     try {
//       if (this.apiKeys.newsapi === 'demo') {
//         return null;
//       }

//       const companyNames = {
//         'RELIANCE': 'Reliance Industries',
//         'TCS': 'Tata Consultancy Services',
//         'HDFCBANK': 'HDFC Bank',
//         'INFY': 'Infosys',
//         'ICICIBANK': 'ICICI Bank'
//         // Add more as needed
//       };

//       const searchQuery = companyNames[symbol] || symbol;
//       const response = await fetch(
//         `${this.endpoints.newsapi}?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=${count}&apiKey=${this.apiKeys.newsapi}`
//       );

//       if (!response.ok) {
//         throw new Error(`NewsAPI error: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data.articles && data.articles.length > 0) {
//         const news = data.articles.map((article, index) => ({
//           id: index,
//           headline: article.title,
//           summary: article.description || article.title,
//           source: article.source.name,
//           date: article.publishedAt.split('T')[0],
//           url: article.url,
//           sentiment: this.calculateSentiment(article.title + ' ' + (article.description || ''))
//         }));

//         console.log(`Fetched ${news.length} real news articles for ${symbol}`);
//         return news;
//       }

//       return null;
//     } catch (error) {
//       console.error(`NewsAPI error for ${symbol}:`, error);
//       return null;
//     }
//   }
  
//   // Generate realistic mock news with more stable sentiment
//   generateRealisticNewsData(symbol, count) {
//     const newsTemplates = [
//       {
//         headline: `${symbol} Reports Quarterly Results`,
//         sentiment: (s) => 0.2 + (this.getStockSeed(s) * 0.6 - 0.3)
//       },
//       {
//         headline: `${symbol} Announces Strategic Partnership`,
//         sentiment: (s) => 0.3 + (this.getStockSeed(s + 1) * 0.4)
//       },
//       {
//         headline: `Analyst Updates Price Target for ${symbol}`,
//         sentiment: (s) => this.getStockSeed(s + 2) * 0.8 - 0.4
//       },
//       {
//         headline: `${symbol} Addresses Supply Chain Challenges`,
//         sentiment: (s) => -0.2 + (this.getStockSeed(s + 3) * 0.4)
//       },
//       {
//         headline: `${symbol} Announces New Product Development`,
//         sentiment: (s) => 0.4 + (this.getStockSeed(s + 4) * 0.4 - 0.2)
//       },
//       {
//         headline: `Regulatory Changes Impact ${symbol}`,
//         sentiment: (s) => -0.3 + (this.getStockSeed(s + 5) * 0.6)
//       },
//       {
//         headline: `${symbol} Expands International Market Presence`,
//         sentiment: (s) => 0.3 + (this.getStockSeed(s + 6) * 0.4 - 0.2)
//       },
//       {
//         headline: `Earnings Report: ${symbol} Performance Analysis`,
//         sentiment: (s) => this.getStockSeed(s + 7) * 0.6 - 0.3
//       },
//       {
//         headline: `${symbol} CEO Discusses Future Growth Strategy`,
//         sentiment: (s) => 0.1 + (this.getStockSeed(s + 8) * 0.6)
//       },
//       {
//         headline: `Economic Outlook and Implications for ${symbol}`,
//         sentiment: (s) => this.getStockSeed(s + 9) * 0.6 - 0.3
//       }
//     ];
    
//     const sources = [
//       'Bloomberg', 'Reuters', 'Economic Times', 
//       'Financial Express', 'Mint', 'CNBC', 
//       'Business Standard', 'Financial Times'
//     ];
    
//     const news = [];
//     const today = new Date();
    
//     const seedValue = this.getStockSeed(symbol);
    
//     for (let i = 0; i < count; i++) {
//       const templateIndex = Math.floor((seedValue * 997 + i * 97) % newsTemplates.length);
//       const template = newsTemplates[templateIndex];
      
//       const daysAgo = Math.floor((i / count) * 30);
//       const newsDate = new Date(today);
//       newsDate.setDate(today.getDate() - daysAgo);
      
//       if (newsDate.getDay() === 0) newsDate.setDate(newsDate.getDate() - 2);
//       if (newsDate.getDay() === 6) newsDate.setDate(newsDate.getDate() - 1);
      
//       const sourceIndex = Math.floor((seedValue * 877 + i * 123) % sources.length);
      
//       const sentiment = parseFloat(template.sentiment(symbol).toFixed(2));
      
//       let summary = `This news discusses ${template.headline.toLowerCase()}. `;
      
//       if (sentiment > 0.2) {
//         summary += `The development is viewed positively and could strengthen ${symbol}'s market position.`;
//       } else if (sentiment < -0.2) {
//         summary += `The news raises some concerns and might present challenges for ${symbol} in the near term.`;
//       } else {
//         summary += `The implications are balanced, with some positive aspects and potential challenges for ${symbol}.`;
//       }
      
//       news.push({
//         id: i,
//         headline: template.headline,
//         summary: summary,
//         source: sources[sourceIndex],
//         date: newsDate.toISOString().split('T')[0],
//         url: '#',
//         sentiment: sentiment
//       });
//     }
    
//     return news.sort((a, b) => new Date(b.date) - new Date(a.date));
//   }
  
//   // Get a consistent seed value for a stock
//   getStockSeed(symbol) {
//     if (typeof symbol === 'string') {
//       return symbol.split('').reduce((acc, char, i) => 
//         acc + char.charCodeAt(0) / (i + 100), 0) % 1;
//     }
//     return (Math.sin(symbol * 10000) * 0.5 + 0.5);
//   }
  
//   // More robust sentiment analysis
//   calculateSentiment(text) {
//     if (!text) return 0;
    
//     const positiveWords = [
//       'up', 'rise', 'rising', 'bull', 'bullish', 'rally',
//       'gain', 'gains', 'profit', 'profitable', 'growth', 'growing',
//       'strong', 'positive', 'beat', 'beats', 'exceed', 'exceeds',
//       'surpass', 'outperform', 'record', 'high', 'higher', 'increase',
//       'opportunity', 'optimistic', 'confident', 'advantage', 'innovative'
//     ];
    
//     const negativeWords = [
//       'down', 'fall', 'falling', 'bear', 'bearish', 'decline',
//       'declining', 'drop', 'drops', 'loss', 'losses', 'lose',
//       'loses', 'weak', 'negative', 'miss', 'misses', 'below',
//       'underperform', 'concern', 'concerns', 'worried', 'worry',
//       'challenging', 'risk', 'uncertain', 'caution', 'downgrade'
//     ];
    
//     const cleanedText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
    
//     let positiveCount = 0;
//     let negativeCount = 0;
    
//     positiveWords.forEach(word => {
//       const regex = new RegExp('\\b' + word + '\\b', 'g');
//       const matches = cleanedText.match(regex);
//       if (matches) positiveCount += matches.length;
//     });
    
//     negativeWords.forEach(word => {
//       const regex = new RegExp('\\b' + word + '\\b', 'g');
//       const matches = cleanedText.match(regex);
//       if (matches) negativeCount += matches.length;
//     });
    
//     if (positiveCount === 0 && negativeCount === 0) {
//       return 0;
//     }
    
//     const rawSentiment = (positiveCount - negativeCount) / (positiveCount + negativeCount);
//     return rawSentiment * 0.8;
//   }

//   // Get intraday stock data (hourly/minute-level data for current day)
//   async getIntradayData(symbol, interval = '30min') {
//     try {
//       const cacheKey = `${symbol}_intraday_${interval}`;
//       const now = new Date().getTime();
      
//       // Check cache first (5 minute expiry for intraday data)
//       if (
//         this.cache.historicalData[cacheKey] && 
//         this.cache.lastUpdated[cacheKey] && 
//         (now - this.cache.lastUpdated[cacheKey] < 300000) // 5 minutes
//       ) {
//         console.log(`Using cached intraday data for ${symbol}`);
//         return this.cache.historicalData[cacheKey];
//       }

//       // Try to fetch real intraday data
//       let realData = await this.fetchRealIntradayData(symbol, interval);
      
//       if (!realData || realData.length === 0) {
//         console.log(`Failed to fetch real intraday data for ${symbol}, generating realistic data`);
//         realData = await this.generateRealisticIntradayData(symbol);
//       }

//       // Update cache
//       this.cache.historicalData[cacheKey] = realData;
//       this.cache.lastUpdated[cacheKey] = now;
      
//       return realData;
//     } catch (error) {
//       console.error(`Error fetching intraday data for ${symbol}:`, error);
//       return this.generateRealisticIntradayData(symbol);
//     }
//   }

//   // Fetch real intraday data from APIs
//   async fetchRealIntradayData(symbol, interval) {
//     try {
//       // Try Alpha Vantage first
//       if (this.apiKeys.alphavantage !== 'demo') {
//         const alphaData = await this.fetchIntradayFromAlpha(symbol, interval);
//         if (alphaData && alphaData.length > 0) {
//           return alphaData;
//         }
//       }

//       // Try Yahoo Finance as fallback
//       const yahooSymbol = this.symbolMappings[symbol] || symbol;
//       const yahooData = await this.fetchIntradayFromYahoo(yahooSymbol);
      
//       return yahooData;
//     } catch (error) {
//       console.error(`Error fetching real intraday data for ${symbol}:`, error);
//       return null;
//     }
//   }

//   // Fetch intraday data from Alpha Vantage
//   async fetchIntradayFromAlpha(symbol, interval) {
//     try {
//       const response = await fetch(
//         `${this.endpoints.alphavantage}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${this.apiKeys.alphavantage}`
//       );

//       if (!response.ok) {
//         throw new Error(`Alpha Vantage intraday API error: ${response.status}`);
//       }

//       const data = await response.json();
//       const timeSeriesKey = `Time Series (${interval})`;
      
//       if (data[timeSeriesKey]) {
//         const timeSeries = data[timeSeriesKey];
//         const intradayData = [];
        
//         // Get today's data only
//         const today = new Date().toISOString().split('T')[0];
        
//         Object.keys(timeSeries)
//           .filter(datetime => datetime.startsWith(today))
//           .sort()
//           .forEach(datetime => {
//             const entry = timeSeries[datetime];
//             intradayData.push({
//               time: new Date(datetime),
//               price: parseFloat(entry['4. close']),
//               open: parseFloat(entry['1. open']),
//               high: parseFloat(entry['2. high']),
//               low: parseFloat(entry['3. low']),
//               volume: parseInt(entry['5. volume'])
//             });
//           });

//         console.log(`Fetched ${intradayData.length} intraday data points from Alpha Vantage for ${symbol}`);
//         return intradayData;
//       }

//       return null;
//     } catch (error) {
//       console.error(`Alpha Vantage intraday error for ${symbol}:`, error);
//       return null;
//     }
//   }

//   // Fetch intraday data from Yahoo Finance
//   async fetchIntradayFromYahoo(symbol) {
//     try {
//       // Get today's start and end timestamps
//       const today = new Date();
//       const startOfDay = new Date(today);
//       startOfDay.setHours(0, 0, 0, 0);
//       const endOfDay = new Date(today);
//       endOfDay.setHours(23, 59, 59, 999);
      
//       const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
//       const endTimestamp = Math.floor(endOfDay.getTime() / 1000);
      
//       const response = await fetch(
//         `${this.endpoints.yahooFinance}/${symbol}?period1=${startTimestamp}&period2=${endTimestamp}&interval=30m`,
//         {
//           method: 'GET',
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Yahoo Finance intraday API error: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data.chart && data.chart.result && data.chart.result[0]) {
//         const result = data.chart.result[0];
//         const timestamps = result.timestamp;
//         const prices = result.indicators.quote[0];
        
//         const intradayData = timestamps.map((timestamp, index) => {
//           return {
//             time: new Date(timestamp * 1000),
//             price: parseFloat((prices.close[index] || 0).toFixed(2)),
//             open: parseFloat((prices.open[index] || 0).toFixed(2)),
//             high: parseFloat((prices.high[index] || 0).toFixed(2)),
//             low: parseFloat((prices.low[index] || 0).toFixed(2)),
//             volume: prices.volume[index] || 0
//           };
//         }).filter(item => item.price > 0);

//         console.log(`Fetched ${intradayData.length} intraday data points from Yahoo for ${symbol}`);
//         return intradayData;
//       }

//       return null;
//     } catch (error) {
//       console.error(`Yahoo Finance intraday error for ${symbol}:`, error);
//       return null;
//     }
//   }

//   // Generate realistic intraday data based on current market conditions
//   async generateRealisticIntradayData(symbol) {
//     try {
//       // Get current price for realistic base
//       const currentPrice = await this.getCurrentPrice(symbol);
//       const basePrice = currentPrice || this.basePrices[symbol] || 1000;
      
//       const today = new Date();
//       const isMarketDay = today.getDay() >= 1 && today.getDay() <= 5;
      
//       if (!isMarketDay) {
//         return []; // No intraday data for weekends
//       }
      
//       // Market hours: 9:15 AM to 3:30 PM (IST)
//       const marketStart = new Date(today);
//       marketStart.setHours(9, 15, 0, 0);
      
//       const now = new Date();
//       const marketEnd = new Date(today);
//       marketEnd.setHours(15, 30, 0, 0);
      
//       // Use current time if market is open, otherwise use market end
//       const endTime = now < marketEnd ? now : marketEnd;
      
//       const data = [];
//       const timePoints = [];
//       let currentTime = new Date(marketStart);
      
//       // Generate 30-minute intervals
//       while (currentTime <= endTime) {
//         timePoints.push(new Date(currentTime));
//         currentTime.setMinutes(currentTime.getMinutes() + 30);
//       }
      
//       if (timePoints.length === 0) return [];
      
//       // Set volatility based on stock type
//       let hourlyVolatility = 0.008; // 0.8% hourly volatility
//       if (['ADANIENT', 'TATAMOTORS', 'JSWSTEEL'].includes(symbol)) {
//         hourlyVolatility = 0.012; // Higher volatility stocks
//       } else if (['NESTLEIND', 'HDFCBANK', 'TCS'].includes(symbol)) {
//         hourlyVolatility = 0.005; // Lower volatility stocks
//       }
      
//       // Create deterministic seed for consistent data
//       const seedValue = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
//       let seed = seedValue + today.getDate(); // Include date for daily variation
      
//       const seededRandom = () => {
//         seed = (seed * 9301 + 49297) % 233280;
//         return seed / 233280;
//       };
      
//       let price = basePrice * (0.998 + seededRandom() * 0.004); // Start within 0.2% of base
      
//       timePoints.forEach((time, index) => {
//         const timeOfDay = time.getHours() + time.getMinutes() / 60;
        
//         // Market opening volatility patterns
//         let volatilityMultiplier = 1;
//         if (timeOfDay < 10) {
//           volatilityMultiplier = 1.5; // Higher volatility at market open
//         } else if (timeOfDay > 14.5) {
//           volatilityMultiplier = 1.3; // Higher volatility near market close
//         } else {
//           volatilityMultiplier = 0.7; // Lower volatility during mid-day
//         }
        
//         // Generate realistic price movement
//         const randomFactor = (seededRandom() - 0.5) * 2;
//         const priceChange = randomFactor * hourlyVolatility * basePrice * volatilityMultiplier;
        
//         // Add mean reversion
//         const meanReversion = (basePrice - price) * 0.1;
        
//         price += priceChange + meanReversion;
        
//         // Ensure price stays within reasonable bounds
//         const maxDeviation = basePrice * 0.03; // 3% max deviation
//         price = Math.max(basePrice - maxDeviation, Math.min(basePrice + maxDeviation, price));
        
//         // If this is the last point and we have current price, use it
//         if (index === timePoints.length - 1 && currentPrice && time <= now) {
//           price = currentPrice;
//         }
        
//         // Generate OHLC data
//         const priceVariation = price * hourlyVolatility * 0.5;
//         const high = price + seededRandom() * priceVariation;
//         const low = price - seededRandom() * priceVariation;
//         const open = index === 0 ? price : data[index - 1].price;
        
//         const volume = Math.floor(20000 + seededRandom() * 180000);
        
//         data.push({
//           time: time,
//           price: parseFloat(price.toFixed(2)),
//           open: parseFloat(open.toFixed(2)),
//           high: parseFloat(Math.max(open, price, high).toFixed(2)),
//           low: parseFloat(Math.min(open, price, low).toFixed(2)),
//           volume: volume,
//           isCurrentPrice: index === timePoints.length - 1 && currentPrice
//         });
//       });
      
//       console.log(`Generated ${data.length} intraday data points for ${symbol}`);
//       return data;
//     } catch (error) {
//       console.error(`Error generating intraday data for ${symbol}:`, error);
//       return [];
//     }
//   }

//   // Get real-time market status
//   async getMarketStatus() {
//     try {
//       const now = new Date();
//       const day = now.getDay();
//       const hour = now.getHours();
//       const minutes = now.getMinutes();
//       const timeInMinutes = hour * 60 + minutes;
      
//       // Indian market hours: 9:15 AM to 3:30 PM (IST)
//       const marketOpen = 9 * 60 + 15; // 9:15 AM
//       const marketClose = 15 * 60 + 30; // 3:30 PM
      
//       // Weekend check
//       if (day === 0 || day === 6) {
//         return {
//           isOpen: false,
//           status: 'Closed - Weekend',
//           nextOpen: this.getNextMarketOpen()
//         };
//       }
      
//       // Market hours check
//       if (timeInMinutes >= marketOpen && timeInMinutes <= marketClose) {
//         return {
//           isOpen: true,
//           status: 'Open',
//           nextClose: this.getNextMarketClose()
//         };
//       } else {
//         return {
//           isOpen: false,
//           status: 'Closed',
//           nextOpen: this.getNextMarketOpen()
//         };
//       }
//     } catch (error) {
//       console.error('Error checking market status:', error);
//       return {
//         isOpen: false,
//         status: 'Unknown',
//         nextOpen: null
//       };
//     }
//   }

//   getNextMarketOpen() {
//     const now = new Date();
//     const tomorrow = new Date(now);
//     tomorrow.setDate(now.getDate() + 1);
//     tomorrow.setHours(9, 15, 0, 0);
    
//     // If tomorrow is weekend, move to Monday
//     while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
//       tomorrow.setDate(tomorrow.getDate() + 1);
//     }
    
//     return tomorrow;
//   }

//   getNextMarketClose() {
//     const now = new Date();
//     const today = new Date(now);
//     today.setHours(15, 30, 0, 0);
//     return today;
//   }
// }

// const stockApi = new StockApiService();
// export default stockApi;



class StockApiService {
  constructor() {
    // API endpoints
    this.endpoints = {
      alphavantage: 'https://www.alphavantage.co/query',
      finnhub: 'https://finnhub.io/api/v1',
      yahooFinance: 'https://query1.finance.yahoo.com/v8/finance/chart',
      newsapi: 'https://newsapi.org/v2/everything'
    };
    
    // CORS Proxies
    this.corsProxies = [
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url='
    ];
    this.currentProxyIndex = 0;
    
    // API keys - Replace with your actual API keys
     this.apiKeys = {
      alphavantage: process.env.REACT_APP_ALPHA_VANTAGE_KEY || 'GOGNJPP4Q7JQB2CD', 
      finnhub: process.env.REACT_APP_FINNHUB_KEY || 'd0cepr9r01ql2j3cmg90d0cepr9r01ql2j3cmg9g',
      newsapi: process.env.REACT_APP_NEWS_API_KEY || '98d770b0773342d681d7a00ccda8a826'
    };
    
    // Symbol mappings for Indian stocks to international format
    this.symbolMappings = {
      'RELIANCE': 'RELIANCE.NS',
      'TCS': 'TCS.NS',
      'HDFCBANK': 'HDFCBANK.NS',
      'INFY': 'INFY.NS',
      'ICICIBANK': 'ICICIBANK.NS',
      'HINDUNILVR': 'HINDUNILVR.NS',
      'KOTAKBANK': 'KOTAKBANK.NS',
      'BHARTIARTL': 'BHARTIARTL.NS',
      'ITC': 'ITC.NS',
      'SBIN': 'SBIN.NS',
      'BAJFINANCE': 'BAJFINANCE.NS',
      'AXISBANK': 'AXISBANK.NS',
      'ASIANPAINT': 'ASIANPAINT.NS',
      'MARUTI': 'MARUTI.NS',
      'HCLTECH': 'HCLTECH.NS',
      'WIPRO': 'WIPRO.NS',
      'ULTRACEMCO': 'ULTRACEMCO.NS',
      'TITAN': 'TITAN.NS',
      'SUNPHARMA': 'SUNPHARMA.NS',
      'ADANIPORTS': 'ADANIPORTS.NS',
      'LT': 'LT.NS',
      'BAJAJFINSV': 'BAJAJFINSV.NS',
      'NESTLEIND': 'NESTLEIND.NS',
      'ONGC': 'ONGC.NS',
      'JSWSTEEL': 'JSWSTEEL.NS',
      'HINDALCO': 'HINDALCO.NS',
      'M&M': 'M&M.NS',
      'POWERGRID': 'POWERGRID.NS',
      'NTPC': 'NTPC.NS',
      'TATAMOTORS': 'TATAMOTORS.NS',
      'GRASIM': 'GRASIM.NS',
      'DIVISLAB': 'DIVISLAB.NS',
      'TECHM': 'TECHM.NS',
      'INDUSINDBK': 'INDUSINDBK.NS',
      'BPCL': 'BPCL.NS',
      'CIPLA': 'CIPLA.NS',
      'BRITANNIA': 'BRITANNIA.NS',
      'ADANIENT': 'ADANIENT.NS',
      'EICHERMOT': 'EICHERMOT.NS',
      'HEROMOTOCO': 'HEROMOTOCO.NS',
      'DRREDDY': 'DRREDDY.NS',
      'TATASTEEL': 'TATASTEEL.NS',
      'COALINDIA': 'COALINDIA.NS',
      'SBILIFE': 'SBILIFE.NS',
      'BAJAJ-AUTO': 'BAJAJ-AUTO.NS',
      'HDFCLIFE': 'HDFCLIFE.NS',
      'APOLLOHOSP': 'APOLLOHOSP.NS',
      'TATACONSUM': 'TATACONSUM.NS',
      'UPL': 'UPL.NS',
      'SHRIRAMFIN': 'SHRIRAMFIN.NS'
    };
    
    // Cache system to prevent excessive API calls
    this.cache = {
      historicalData: {},
      currentPrice: {},
      news: {},
      lastUpdated: {}
    };
    
    // Cache expiry in milliseconds
    this.cacheExpiry = {
      historicalData: 60 * 60 * 1000, // 1 hour
      currentPrice: 5 * 60 * 1000, // 5 minutes
      news: 30 * 60 * 1000 // 30 minutes
    };

    // Base prices for fallback (approximate current prices as of 2025)
    this.basePrices = {
      'RELIANCE': 1300,
      'TCS': 3250,
      'HDFCBANK': 1720,
      'INFY': 1450,
      'ICICIBANK': 1300,
      'HINDUNILVR': 2200,
      'KOTAKBANK': 1950,
      'BHARTIARTL': 1750,
      'ITC': 400,
      'SBIN': 600,
      'BAJFINANCE': 8500,
      'AXISBANK': 1050,
      'ASIANPAINT': 2200,
      'MARUTI': 12000,
      'HCLTECH': 1500,
      'WIPRO': 150,
      'ULTRACEMCO': 11000,
      'TITAN': 3400,
      'SUNPHARMA': 1500,
      'ADANIPORTS': 1400,
      'LT': 3500,
      'BAJAJFINSV': 1900,
      'NESTLEIND': 2350,
      'ONGC': 200,
      'JSWSTEEL': 850,
      'HINDALCO': 550,
      'M&M': 2700,
      'POWERGRID': 270,
      'NTPC': 320,
      'TATAMOTORS': 800,
      'GRASIM': 2400,
      'DIVISLAB': 5500,
      'TECHM': 1400,
      'INDUSINDBK': 750,
      'BPCL': 250,
      'CIPLA': 1300,
      'BRITANNIA': 5000,
      'ADANIENT': 2300,
      'EICHERMOT': 4500,
      'HEROMOTOCO': 4000,
      'DRREDDY': 1000,
      'TATASTEEL': 150,
      'COALINDIA': 350,
      'SBILIFE': 1500,
      'BAJAJ-AUTO': 8300,
      'HDFCLIFE': 700,
      'APOLLOHOSP': 6500,
      'TATACONSUM': 1000,
      'UPL': 600,
      'SHRIRAMFIN': 600
    };
  }

  // Helper method to get a CORS proxy URL
  getProxyUrl(originalUrl) {
    const proxy = this.corsProxies[this.currentProxyIndex];
    // Rotate through available proxies
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxies.length;
    return proxy + encodeURIComponent(originalUrl);
  }

  // Get Nifty 50 companies list
  async getNifty50Companies() {
    try {
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
        { symbol: 'LT', name: 'Larsen & Toubro Ltd.' },
        { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.' },
        { symbol: 'NESTLEIND', name: 'Nestlé India Ltd.' },
        { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Ltd.' },
        { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.' },
        { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.' },
        { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.' },
        { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.' },
        { symbol: 'NTPC', name: 'NTPC Ltd.' },
        { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.' },
        { symbol: 'GRASIM', name: 'Grasim Industries Ltd.' },
        { symbol: 'DIVISLAB', name: 'Divis Laboratories Ltd.' },
        { symbol: 'TECHM', name: 'Tech Mahindra Ltd.' },
        { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd.' },
        { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.' },
        { symbol: 'CIPLA', name: 'Cipla Ltd.' },
        { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.' },
        { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.' },
        { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.' },
        { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.' },
        { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories Ltd.' },
        { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.' },
        { symbol: 'COALINDIA', name: 'Coal India Ltd.' },
        { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd.' },
        { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.' },
        { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.' },
        { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd.' },
        { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd.' },
        { symbol: 'UPL', name: 'UPL Ltd.' },
        { symbol: 'SHRIRAMFIN', name: 'Shriram Finance Ltd.' }
      ];
    } catch (error) {
      console.error('Error fetching Nifty 50 companies:', error);
      throw error;
    }
  }

  // Get current stock price in real-time
  async getCurrentPrice(symbol) {
    try {
      const cacheKey = symbol;
      const now = new Date().getTime();
      
      // Check cache first
      if (
        this.cache.currentPrice[cacheKey] && 
        this.cache.lastUpdated[`price_${cacheKey}`] && 
        (now - this.cache.lastUpdated[`price_${cacheKey}`] < this.cacheExpiry.currentPrice)
      ) {
        console.log(`Using cached current price for ${symbol}`);
        return this.cache.currentPrice[cacheKey];
      }

      // Try Yahoo Finance API first
      const yahooSymbol = this.symbolMappings[symbol] || symbol;
      console.log(`Fetching current price for ${symbol} using Yahoo symbol ${yahooSymbol}`);
      const currentPrice = await this.fetchCurrentPriceFromYahoo(yahooSymbol);
      
      if (currentPrice) {
        this.cache.currentPrice[cacheKey] = currentPrice;
        this.cache.lastUpdated[`price_${cacheKey}`] = now;
        return currentPrice;
      }

      // Fallback to Alpha Vantage
      console.log(`Yahoo Finance failed, trying Alpha Vantage for ${symbol}`);
      const alphaPrice = await this.fetchCurrentPriceFromAlpha(symbol);
      if (alphaPrice) {
        this.cache.currentPrice[cacheKey] = alphaPrice;
        this.cache.lastUpdated[`price_${cacheKey}`] = now;
        return alphaPrice;
      }

      // Final fallback to base price with small random variation
      console.log(`All APIs failed, using fallback price for ${symbol}`);
      const basePrice = this.basePrices[symbol] || 1000;
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const fallbackPrice = basePrice * (1 + variation);
      
      console.log(`Using fallback price for ${symbol}: ${fallbackPrice}`);
      
      // Cache the fallback price too
      this.cache.currentPrice[cacheKey] = parseFloat(fallbackPrice.toFixed(2));
      this.cache.lastUpdated[`price_${cacheKey}`] = now;
      
      return parseFloat(fallbackPrice.toFixed(2));

    } catch (error) {
      console.error(`Error fetching current price for ${symbol}:`, error);
      const basePrice = this.basePrices[symbol] || 1000;
      const fallbackPrice = parseFloat(basePrice.toFixed(2));
      
      // Cache the fallback price on error
      this.cache.currentPrice[symbol] = fallbackPrice;
      this.cache.lastUpdated[`price_${symbol}`] = new Date().getTime();
      
      return fallbackPrice;
    }
  }

  // Fetch current price from Yahoo Finance with CORS proxy
  async fetchCurrentPriceFromYahoo(symbol) {
    let retries = 0;
    const maxRetries = this.corsProxies.length;
    
    while (retries < maxRetries) {
      try {
        const originalUrl = `${this.endpoints.yahooFinance}/${symbol}?interval=1d&range=1d`;
        const proxyUrl = this.getProxyUrl(originalUrl);
        
        console.log(`Attempt ${retries + 1}: Fetching from Yahoo via proxy: ${proxyUrl}`);
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000 // 10 second timeout
        });

        if (!response.ok) {
          throw new Error(`Yahoo Finance API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.chart && data.chart.result && data.chart.result[0]) {
          const result = data.chart.result[0];
          const prices = result.indicators.quote[0];
          const latestClose = prices.close[prices.close.length - 1];
          
          if (latestClose && !isNaN(latestClose)) {
            console.log(`Successfully fetched current price from Yahoo for ${symbol}: ${latestClose}`);
            return parseFloat(latestClose.toFixed(2));
          }
        }

        console.log(`No valid price data found in Yahoo response for ${symbol}`);
        retries++;
      } catch (error) {
        console.error(`Yahoo Finance API error for ${symbol} (attempt ${retries + 1}):`, error);
        retries++;
        
        // Small delay before next retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`All Yahoo Finance attempts failed for ${symbol}`);
    return null;
  }

  // Fetch current price from Alpha Vantage
  async fetchCurrentPriceFromAlpha(symbol) {
    try {
      if (this.apiKeys.alphavantage === 'demo') {
        console.log('Skipping Alpha Vantage due to demo API key');
        return null;
      }

      const url = `${this.endpoints.alphavantage}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKeys.alphavantage}`;
      console.log(`Fetching from Alpha Vantage: ${url}`);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        const price = parseFloat(data['Global Quote']['05. price']);
        console.log(`Fetched current price from Alpha Vantage for ${symbol}: ${price}`);
        return price;
      }

      console.log(`No valid price data found in Alpha Vantage response for ${symbol}`);
      return null;
    } catch (error) {
      console.error(`Alpha Vantage API error for ${symbol}:`, error);
      return null;
    }
  }

  // Get historical stock data with real-time updates
  async getHistoricalData(symbol, days = 365) {
    try {
      const cacheKey = `${symbol}_${days}`;
      const now = new Date().getTime();
      
      // Check if we have valid cached data
      if (
        this.cache.historicalData[cacheKey] && 
        this.cache.lastUpdated[cacheKey] && 
        (now - this.cache.lastUpdated[cacheKey] < this.cacheExpiry.historicalData)
      ) {
        console.log(`Using cached historical data for ${symbol}`);
        return this.cache.historicalData[cacheKey];
      }

      // Try to fetch real data
      let realData = await this.fetchRealHistoricalData(symbol, days);
      
      if (!realData || realData.length === 0) {
        console.log(`Failed to fetch real data for ${symbol}, generating realistic mock data`);
        realData = await this.generateRealisticHistoricalData(symbol, days);
      }

      // Update cache
      this.cache.historicalData[cacheKey] = realData;
      this.cache.lastUpdated[cacheKey] = now;
      
      return realData;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      
      // Fallback to cached data if available
      const cacheKey = `${symbol}_${days}`;
      if (this.cache.historicalData[cacheKey]) {
        return this.cache.historicalData[cacheKey];
      }
      
      // Last resort - generate consistent mock data
      return this.generateRealisticHistoricalData(symbol, days);
    }
  }

  // Fetch real historical data from APIs
  async fetchRealHistoricalData(symbol, days) {
    try {
      // Try Yahoo Finance first
      const yahooSymbol = this.symbolMappings[symbol] || symbol;
      let data = await this.fetchHistoricalFromYahoo(yahooSymbol, days);
      
      if (data && data.length > 0) {
        return data;
      }

      // Try Alpha Vantage as backup
      data = await this.fetchHistoricalFromAlpha(symbol, days);
      
      return data;
    } catch (error) {
      console.error(`Error fetching real historical data for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch historical data from Yahoo Finance with CORS proxy
  async fetchHistoricalFromYahoo(symbol, days) {
    let retries = 0;
    const maxRetries = this.corsProxies.length;
    
    while (retries < maxRetries) {
      try {
        const endDate = Math.floor(Date.now() / 1000);
        const startDate = endDate - (days * 24 * 60 * 60);
        
        const originalUrl = `${this.endpoints.yahooFinance}/${symbol}?period1=${startDate}&period2=${endDate}&interval=1d`;
        const proxyUrl = this.getProxyUrl(originalUrl);
        
        console.log(`Attempt ${retries + 1}: Fetching historical data from Yahoo via proxy: ${proxyUrl}`);
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 15000 // 15 second timeout for historical data
        });

        if (!response.ok) {
          throw new Error(`Yahoo Finance API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.chart && data.chart.result && data.chart.result[0]) {
          const result = data.chart.result[0];
          const timestamps = result.timestamp;
          const prices = result.indicators.quote[0];
          
          const historicalData = timestamps.map((timestamp, index) => {
            const date = new Date(timestamp * 1000);
            // Skip weekends
            if (date.getDay() === 0 || date.getDay() === 6) {
              return null;
            }
            
            return {
              date: date.toISOString().split('T')[0],
              open: parseFloat((prices.open[index] || 0).toFixed(2)),
              high: parseFloat((prices.high[index] || 0).toFixed(2)),
              low: parseFloat((prices.low[index] || 0).toFixed(2)),
              close: parseFloat((prices.close[index] || 0).toFixed(2)),
              volume: prices.volume[index] || 0
            };
          }).filter(item => item !== null && item.close > 0);

          console.log(`Fetched ${historicalData.length} historical data points from Yahoo for ${symbol}`);
          return historicalData;
        }

        console.log(`No valid historical data found in Yahoo response for ${symbol}`);
        retries++;
      } catch (error) {
        console.error(`Yahoo Finance historical data error for ${symbol} (attempt ${retries + 1}):`, error);
        retries++;
        
        // Small delay before next retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`All Yahoo Finance historical data attempts failed for ${symbol}`);
    return null;
  }

  // Fetch historical data from Alpha Vantage
  async fetchHistoricalFromAlpha(symbol, days) {
    try {
      if (this.apiKeys.alphavantage === 'demo') {
        console.log('Skipping Alpha Vantage historical data due to demo API key');
        return null;
      }

      const url = `${this.endpoints.alphavantage}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${this.apiKeys.alphavantage}`;
      console.log(`Fetching historical data from Alpha Vantage: ${url}`);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Time Series (Daily)']) {
        const timeSeries = data['Time Series (Daily)'];
        const historicalData = [];
        
        const sortedDates = Object.keys(timeSeries).sort((a, b) => new Date(a) - new Date(b));
        const recentDates = sortedDates.slice(-days);
        
        recentDates.forEach(date => {
          const dayData = timeSeries[date];
          const dateObj = new Date(date);
          
          // Skip weekends
          if (dateObj.getDay() === 0 || dateObj.getDay() === 6) {
            return;
          }
          
          historicalData.push({
            date: date,
            open: parseFloat(dayData['1. open']),
            high: parseFloat(dayData['2. high']),
            low: parseFloat(dayData['3. low']),
            close: parseFloat(dayData['4. close']),
            volume: parseInt(dayData['5. volume'])
          });
        });

        console.log(`Fetched ${historicalData.length} historical data points from Alpha Vantage for ${symbol}`);
        return historicalData;
      }

      console.log(`No valid historical data found in Alpha Vantage response for ${symbol}`);
      return null;
    } catch (error) {
      console.error(`Alpha Vantage historical data error for ${symbol}:`, error);
      return null;
    }
  }

  // Generate realistic historical data based on current market conditions
  async generateRealisticHistoricalData(symbol, days) {
    try {
      // Get current real price if possible
      const currentPrice = await this.getCurrentPrice(symbol);
      const basePrice = currentPrice || this.basePrices[symbol] || 1000;
      
      console.log(`Generating realistic historical data for ${symbol} with current price: ${currentPrice}`);
      
      const today = new Date();
      const endDate = new Date(today);
      endDate.setHours(0, 0, 0, 0);
      
      // Set volatility based on stock type
      let volatility = 0.01; // 1% default
      if (['ADANIENT', 'TATAMOTORS', 'JSWSTEEL'].includes(symbol)) {
        volatility = 0.015; // Higher volatility stocks
      } else if (['NESTLEIND', 'HDFCBANK', 'TCS'].includes(symbol)) {
        volatility = 0.007; // Lower volatility stocks
      }
      
      const data = [];
      let price = basePrice;
      
      // Use deterministic seed for consistency
      const seedValue = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      let seed = seedValue;
      
      // Simple deterministic random function
      const seededRandom = (s) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
      };
      
      for (let i = days; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);
        
        // Skip weekends
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          continue;
        }
        
        seed = (seed * 9301 + 49297) % 233280;
        
        // Create realistic daily movement
        const randomFactor = seededRandom(seed) * 2 - 1;
        const dailyChange = randomFactor * volatility * basePrice;
        
        // Add slight upward trend (market growth)
        const trendFactor = 1 + (0.08 / 365); // ~8% annual growth
        price = price * trendFactor + dailyChange;
        price = Math.max(price, basePrice * 0.2); // Prevent negative prices
        
        // Generate OHLC data
        const prevClose = data.length > 0 ? data[data.length - 1].close : price;
        const overnightChange = (seededRandom(seed + 1) - 0.5) * volatility * basePrice * 0.5;
        const open = prevClose + overnightChange;
        
        const dayVolatility = seededRandom(seed + 2) * volatility * basePrice * 1.5;
        const high = Math.max(open, price) + dayVolatility * 0.6;
        const low = Math.min(open, price) - dayVolatility * 0.5;
        
        const actualHigh = Math.max(open, price, high);
        const actualLow = Math.min(open, price, low);
        
        // Generate realistic volume
        const avgVolume = basePrice * 10000;
        const volumeVariation = seededRandom(seed + 3) * 0.4 + 0.8;
        const volume = Math.floor(avgVolume * volumeVariation);
        
        data.push({
          date: date.toISOString().split('T')[0],
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(actualHigh.toFixed(2)),
          low: parseFloat(actualLow.toFixed(2)),
          close: parseFloat(price.toFixed(2)),
          volume
        });
      }
      
      return data;
    } catch (error) {
      console.error(`Error generating realistic data for ${symbol}:`, error);
      return [];
    }
  }

  // Get stock news with sentiment
  async getStockNews(symbol, count = 10) {
    try {
      const cacheKey = symbol;
      const now = new Date().getTime();
      
      if (
        this.cache.news[cacheKey] && 
        this.cache.lastUpdated[`news_${cacheKey}`] && 
        (now - this.cache.lastUpdated[`news_${cacheKey}`] < this.cacheExpiry.news)
      ) {
        console.log(`Using cached news for ${symbol}`);
        return this.cache.news[cacheKey].slice(0, count);
      }
      
      // Try to fetch real news
      let realNews = await this.fetchRealNews(symbol, count);
      
      if (!realNews || realNews.length === 0) {
        console.log(`Failed to fetch real news for ${symbol}, generating mock news`);
        realNews = this.generateRealisticNewsData(symbol, Math.max(count, 30));
      }
      
      this.cache.news[cacheKey] = realNews;
      this.cache.lastUpdated[`news_${cacheKey}`] = now;
      
      return realNews.slice(0, count);
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      
      const cacheKey = symbol;
      if (this.cache.news[cacheKey]) {
        return this.cache.news[cacheKey].slice(0, count);
      }
      
      return this.generateRealisticNewsData(symbol, count);
    }
  }

  // Fetch real news from NewsAPI with CORS proxy if needed
  async fetchRealNews(symbol, count) {
    try {
      if (this.apiKeys.newsapi === 'demo') {
        console.log('Skipping NewsAPI due to demo API key');
        return null;
      }

      const companyNames = {
        'RELIANCE': 'Reliance Industries',
        'TCS': 'Tata Consultancy Services',
        'HDFCBANK': 'HDFC Bank',
        'INFY': 'Infosys',
        'ICICIBANK': 'ICICI Bank',
        'ASIANPAINT': 'Asian Paints',
        // Add more as needed
      };

      const searchQuery = companyNames[symbol] || symbol;
      const originalUrl = `${this.endpoints.newsapi}?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=${count}&apiKey=${this.apiKeys.newsapi}`;
      
      // First try direct request
      try {
        console.log(`Fetching news from NewsAPI directly: ${originalUrl}`);
        const directResponse = await fetch(originalUrl);
        
        if (directResponse.ok) {
          const data = await directResponse.json();
          if (data.articles && data.articles.length > 0) {
            return this.processNewsData(data, symbol);
          }
        }
      } catch (directError) {
        console.log('Direct news API request failed, trying via proxy:', directError);
      }
      
      // Try with proxy
      const proxyUrl = this.getProxyUrl(originalUrl);
      console.log(`Fetching news via proxy: ${proxyUrl}`);
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }

      const data = await response.json();
      return this.processNewsData(data, symbol);
    } catch (error) {
      console.error(`NewsAPI error for ${symbol}:`, error);
      return null;
    }
  }
  
  // Process news API response
  processNewsData(data, symbol) {
    if (data.articles && data.articles.length > 0) {
      const news = data.articles.map((article, index) => ({
        id: index,
        headline: article.title,
        summary: article.description || article.title,
        source: article.source.name,
        date: article.publishedAt.split('T')[0],
        url: article.url,
        sentiment: this.calculateSentiment(article.title + ' ' + (article.description || ''))
      }));

      console.log(`Fetched ${news.length} real news articles for ${symbol}`);
      return news;
    }
    return null;
  }
  
  // Generate realistic mock news with more stable sentiment
  generateRealisticNewsData(symbol, count) {
    const newsTemplates = [
      {
        headline: `${symbol} Reports Quarterly Results`,
        sentiment: (s) => 0.2 + (this.getStockSeed(s) * 0.6 - 0.3)
      },
      {
        headline: `${symbol} Announces Strategic Partnership`,
        sentiment: (s) => 0.3 + (this.getStockSeed(s + 1) * 0.4)
      },
      {
        headline: `Analyst Updates Price Target for ${symbol}`,
        sentiment: (s) => this.getStockSeed(s + 2) * 0.8 - 0.4
      },
      {
        headline: `${symbol} Addresses Supply Chain Challenges`,
        sentiment: (s) => -0.2 + (this.getStockSeed(s + 3) * 0.4)
      },
      {
        headline: `${symbol} Announces New Product Development`,
        sentiment: (s) => 0.4 + (this.getStockSeed(s + 4) * 0.4 - 0.2)
      },
      {
        headline: `Regulatory Changes Impact ${symbol}`,
        sentiment: (s) => -0.3 + (this.getStockSeed(s + 5) * 0.6)
      },
      {
        headline: `${symbol} Expands International Market Presence`,
        sentiment: (s) => 0.3 + (this.getStockSeed(s + 6) * 0.4 - 0.2)
      },
      {
        headline: `Earnings Report: ${symbol} Performance Analysis`,
        sentiment: (s) => this.getStockSeed(s + 7) * 0.6 - 0.3
      },
      {
        headline: `${symbol} CEO Discusses Future Growth Strategy`,
        sentiment: (s) => 0.1 + (this.getStockSeed(s + 8) * 0.6)
      },
      {
        headline: `Economic Outlook and Implications for ${symbol}`,
        sentiment: (s) => this.getStockSeed(s + 9) * 0.6 - 0.3
      }
    ];
    
    const sources = [
      'Bloomberg', 'Reuters', 'Economic Times', 
      'Financial Express', 'Mint', 'CNBC', 
      'Business Standard', 'Financial Times'
    ];
    
    const news = [];
    const today = new Date();
    
    const seedValue = this.getStockSeed(symbol);
    
    for (let i = 0; i < count; i++) {
      const templateIndex = Math.floor((seedValue * 997 + i * 97) % newsTemplates.length);
      const template = newsTemplates[templateIndex];
      
      const daysAgo = Math.floor((i / count) * 30);
      const newsDate = new Date(today);
      newsDate.setDate(today.getDate() - daysAgo);
      
      if (newsDate.getDay() === 0) newsDate.setDate(newsDate.getDate() - 2);
      if (newsDate.getDay() === 6) newsDate.setDate(newsDate.getDate() - 1);
      
      const sourceIndex = Math.floor((seedValue * 877 + i * 123) % sources.length);
      
      const sentiment = parseFloat(template.sentiment(symbol).toFixed(2));
      
      let summary = `This news discusses ${template.headline.toLowerCase()}. `;
      
      if (sentiment > 0.2) {
        summary += `The development is viewed positively and could strengthen ${symbol}'s market position.`;
      } else if (sentiment < -0.2) {
        summary += `The news raises some concerns and might present challenges for ${symbol} in the near term.`;
      } else {
        summary += `The implications are balanced, with some positive aspects and potential challenges for ${symbol}.`;
      }
      
      news.push({
        id: i,
        headline: template.headline,
        summary: summary,
        source: sources[sourceIndex],
        date: newsDate.toISOString().split('T')[0],
        url: '#',
        sentiment: sentiment
      });
    }
    
    return news.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  // Get a consistent seed value for a stock
  getStockSeed(symbol) {
    if (typeof symbol === 'string') {
      return symbol.split('').reduce((acc, char, i) => 
        acc + char.charCodeAt(0) / (i + 100), 0) % 1;
    }
    return (Math.sin(symbol * 10000) * 0.5 + 0.5);
  }
  
  // More robust sentiment analysis
  calculateSentiment(text) {
    if (!text) return 0;
    
    const positiveWords = [
      'up', 'rise', 'rising', 'bull', 'bullish', 'rally',
      'gain', 'gains', 'profit', 'profitable', 'growth', 'growing',
      'strong', 'positive', 'beat', 'beats', 'exceed', 'exceeds',
      'surpass', 'outperform', 'record', 'high', 'higher', 'increase',
      'opportunity', 'optimistic', 'confident', 'advantage', 'innovative'
    ];
    
    const negativeWords = [
      'down', 'fall', 'falling', 'bear', 'bearish', 'decline',
      'declining', 'drop', 'drops', 'loss', 'losses', 'lose',
      'loses', 'weak', 'negative', 'miss', 'misses', 'below',
      'underperform', 'concern', 'concerns', 'worried', 'worry',
      'challenging', 'risk', 'uncertain', 'caution', 'downgrade'
    ];
    
    const cleanedText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      const regex = new RegExp('\\b' + word + '\\b', 'g');
      const matches = cleanedText.match(regex);
      if (matches) positiveCount += matches.length;
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp('\\b' + word + '\\b', 'g');
      const matches = cleanedText.match(regex);
      if (matches) negativeCount += matches.length;
    });
    
    if (positiveCount === 0 && negativeCount === 0) {
      return 0;
    }
    
    const rawSentiment = (positiveCount - negativeCount) / (positiveCount + negativeCount);
    return rawSentiment * 0.8;
  }

  // Get intraday stock data (hourly/minute-level data for current day)
  async getIntradayData(symbol, interval = '30min') {
    try {
      const cacheKey = `${symbol}_intraday_${interval}`;
      const now = new Date().getTime();
      
      // Check cache first (5 minute expiry for intraday data)
      if (
        this.cache.historicalData[cacheKey] && 
        this.cache.lastUpdated[cacheKey] && 
        (now - this.cache.lastUpdated[cacheKey] < 300000) // 5 minutes
      ) {
        console.log(`Using cached intraday data for ${symbol}`);
        return this.cache.historicalData[cacheKey];
      }

      // Try to fetch real intraday data
      let realData = await this.fetchRealIntradayData(symbol, interval);
      
      if (!realData || realData.length === 0) {
        console.log(`Failed to fetch real intraday data for ${symbol}, generating realistic data`);
        realData = await this.generateRealisticIntradayData(symbol);
      }

      // Update cache
      this.cache.historicalData[cacheKey] = realData;
      this.cache.lastUpdated[cacheKey] = now;
      
      return realData;
    } catch (error) {
      console.error(`Error fetching intraday data for ${symbol}:`, error);
      return this.generateRealisticIntradayData(symbol);
    }
  }

  // Fetch real intraday data from APIs
  async fetchRealIntradayData(symbol, interval) {
    try {
      // Try Alpha Vantage first
      if (this.apiKeys.alphavantage !== 'demo') {
        const alphaData = await this.fetchIntradayFromAlpha(symbol, interval);
        if (alphaData && alphaData.length > 0) {
          return alphaData;
        }
      }

      // Try Yahoo Finance as fallback
      const yahooSymbol = this.symbolMappings[symbol] || symbol;
      const yahooData = await this.fetchIntradayFromYahoo(yahooSymbol);
      
      return yahooData;
    } catch (error) {
      console.error(`Error fetching real intraday data for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch intraday data from Alpha Vantage
  async fetchIntradayFromAlpha(symbol, interval) {
    try {
      if (this.apiKeys.alphavantage === 'demo') {
        console.log('Skipping Alpha Vantage intraday due to demo API key');
        return null;
      }

      const url = `${this.endpoints.alphavantage}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${this.apiKeys.alphavantage}`;
      console.log(`Fetching intraday data from Alpha Vantage: ${url}`);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Alpha Vantage intraday API error: ${response.status}`);
      }

      const data = await response.json();
      const timeSeriesKey = `Time Series (${interval})`;
      
      if (data[timeSeriesKey]) {
        const timeSeries = data[timeSeriesKey];
        const intradayData = [];
        
        // Get today's data only
        const today = new Date().toISOString().split('T')[0];
        
        Object.keys(timeSeries)
          .filter(datetime => datetime.startsWith(today))
          .sort()
          .forEach(datetime => {
            const entry = timeSeries[datetime];
            intradayData.push({
              time: new Date(datetime),
              price: parseFloat(entry['4. close']),
              open: parseFloat(entry['1. open']),
              high: parseFloat(entry['2. high']),
              low: parseFloat(entry['3. low']),
              volume: parseInt(entry['5. volume'])
            });
          });

        console.log(`Fetched ${intradayData.length} intraday data points from Alpha Vantage for ${symbol}`);
        return intradayData;
      }

      console.log(`No valid intraday data found in Alpha Vantage response for ${symbol}`);
      return null;
    } catch (error) {
      console.error(`Alpha Vantage intraday error for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch intraday data from Yahoo Finance with CORS proxy
  async fetchIntradayFromYahoo(symbol) {
    let retries = 0;
    const maxRetries = this.corsProxies.length;
    
    while (retries < maxRetries) {
      try {
        // Get today's start and end timestamps
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        
        const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
        const endTimestamp = Math.floor(endOfDay.getTime() / 1000);
        
        const originalUrl = `${this.endpoints.yahooFinance}/${symbol}?period1=${startTimestamp}&period2=${endTimestamp}&interval=30m`;
        const proxyUrl = this.getProxyUrl(originalUrl);
        
        console.log(`Attempt ${retries + 1}: Fetching intraday data from Yahoo via proxy: ${proxyUrl}`);
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000 // 10 second timeout
        });

        if (!response.ok) {
          throw new Error(`Yahoo Finance intraday API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.chart && data.chart.result && data.chart.result[0]) {
          const result = data.chart.result[0];
          const timestamps = result.timestamp;
          const prices = result.indicators.quote[0];
          
          const intradayData = timestamps.map((timestamp, index) => {
            return {
              time: new Date(timestamp * 1000),
              price: parseFloat((prices.close[index] || 0).toFixed(2)),
              open: parseFloat((prices.open[index] || 0).toFixed(2)),
              high: parseFloat((prices.high[index] || 0).toFixed(2)),
              low: parseFloat((prices.low[index] || 0).toFixed(2)),
              volume: prices.volume[index] || 0
            };
          }).filter(item => item.price > 0);

          console.log(`Fetched ${intradayData.length} intraday data points from Yahoo for ${symbol}`);
          return intradayData;
        }

        console.log(`No valid intraday data found in Yahoo response for ${symbol}`);
        retries++;
      } catch (error) {
        console.error(`Yahoo Finance intraday error for ${symbol} (attempt ${retries + 1}):`, error);
        retries++;
        
        // Small delay before next retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`All Yahoo Finance intraday attempts failed for ${symbol}`);
    return null;
  }

  // Generate realistic intraday data based on current market conditions
  async generateRealisticIntradayData(symbol) {
    try {
      // Get current price for realistic base
      const currentPrice = await this.getCurrentPrice(symbol);
      const basePrice = currentPrice || this.basePrices[symbol] || 1000;
      
      const today = new Date();
      const isMarketDay = today.getDay() >= 1 && today.getDay() <= 5;
      
      if (!isMarketDay) {
        return []; // No intraday data for weekends
      }
      
      // Market hours: 9:15 AM to 3:30 PM (IST)
      const marketStart = new Date(today);
      marketStart.setHours(9, 15, 0, 0);
      
      const now = new Date();
      const marketEnd = new Date(today);
      marketEnd.setHours(15, 30, 0, 0);
      
      // Use current time if market is open, otherwise use market end
      const endTime = now < marketEnd ? now : marketEnd;
      
      const data = [];
      const timePoints = [];
      let currentTime = new Date(marketStart);
      
      // Generate 30-minute intervals
      while (currentTime <= endTime) {
        timePoints.push(new Date(currentTime));
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
      
      if (timePoints.length === 0) return [];
      
      // Set volatility based on stock type
      let hourlyVolatility = 0.008; // 0.8% hourly volatility
      if (['ADANIENT', 'TATAMOTORS', 'JSWSTEEL'].includes(symbol)) {
        hourlyVolatility = 0.012; // Higher volatility stocks
      } else if (['NESTLEIND', 'HDFCBANK', 'TCS'].includes(symbol)) {
        hourlyVolatility = 0.005; // Lower volatility stocks
      }
      
      // Create deterministic seed for consistent data
      const seedValue = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      let seed = seedValue + today.getDate(); // Include date for daily variation
      
      const seededRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      
      let price = basePrice * (0.998 + seededRandom() * 0.004); // Start within 0.2% of base
      
      timePoints.forEach((time, index) => {
        const timeOfDay = time.getHours() + time.getMinutes() / 60;
        
        // Market opening volatility patterns
        let volatilityMultiplier = 1;
        if (timeOfDay < 10) {
          volatilityMultiplier = 1.5; // Higher volatility at market open
        } else if (timeOfDay > 14.5) {
          volatilityMultiplier = 1.3; // Higher volatility near market close
        } else {
          volatilityMultiplier = 0.7; // Lower volatility during mid-day
        }
        
        // Generate realistic price movement
        const randomFactor = (seededRandom() - 0.5) * 2;
        const priceChange = randomFactor * hourlyVolatility * basePrice * volatilityMultiplier;
        
        // Add mean reversion
        const meanReversion = (basePrice - price) * 0.1;
        
        price += priceChange + meanReversion;
        
        // Ensure price stays within reasonable bounds
        const maxDeviation = basePrice * 0.03; // 3% max deviation
        price = Math.max(basePrice - maxDeviation, Math.min(basePrice + maxDeviation, price));
        
        // If this is the last point and we have current price, use it
        if (index === timePoints.length - 1 && currentPrice && time <= now) {
          price = currentPrice;
        }
        
        // Generate OHLC data
        const priceVariation = price * hourlyVolatility * 0.5;
        const high = price + seededRandom() * priceVariation;
        const low = price - seededRandom() * priceVariation;
        const open = index === 0 ? price : data[index - 1].price;
        
        const volume = Math.floor(20000 + seededRandom() * 180000);
        
        data.push({
          time: time,
          price: parseFloat(price.toFixed(2)),
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(Math.max(open, price, high).toFixed(2)),
          low: parseFloat(Math.min(open, price, low).toFixed(2)),
          volume: volume,
          isCurrentPrice: index === timePoints.length - 1 && currentPrice
        });
      });
      
      console.log(`Generated ${data.length} intraday data points for ${symbol}`);
      return data;
    } catch (error) {
      console.error(`Error generating intraday data for ${symbol}:`, error);
      return [];
    }
  }

  // Get real-time market status
  async getMarketStatus() {
    try {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const timeInMinutes = hour * 60 + minutes;
      
      // Indian market hours: 9:15 AM to 3:30 PM (IST)
      const marketOpen = 9 * 60 + 15; // 9:15 AM
      const marketClose = 15 * 60 + 30; // 3:30 PM
      
      // Weekend check
      if (day === 0 || day === 6) {
        return {
          isOpen: false,
          status: 'Closed - Weekend',
          nextOpen: this.getNextMarketOpen()
        };
      }
      
      // Market hours check
      if (timeInMinutes >= marketOpen && timeInMinutes <= marketClose) {
        return {
          isOpen: true,
          status: 'Open',
          nextClose: this.getNextMarketClose()
        };
      } else {
        return {
          isOpen: false,
          status: 'Closed',
          nextOpen: this.getNextMarketOpen()
        };
      }
    } catch (error) {
      console.error('Error checking market status:', error);
      return {
        isOpen: false,
        status: 'Unknown',
        nextOpen: null
      };
    }
  }

  getNextMarketOpen() {
    const now = new Date();
    const today = new Date(now);
    
    // If it's before market hours today
    if (now.getHours() < 9 || (now.getHours() === 9 && now.getMinutes() < 15)) {
      today.setHours(9, 15, 0, 0);
      return today;
    }
    
    // Otherwise set to tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(9, 15, 0, 0);
    
    // If tomorrow is weekend, move to Monday
    while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    
    return tomorrow;
  }

  getNextMarketClose() {
    const now = new Date();
    const today = new Date(now);
    today.setHours(15, 30, 0, 0);
    return today;
  }
}

// Create a singleton instance of the service
const stockApi = new StockApiService();

// Export the singleton instance
export default stockApi;