// Create this as a new file: src/utils/priceUtils.js

// Real-time price update utilities for stock market prediction

export class PriceManager {
  constructor() {
    this.priceCache = new Map();
    this.updateIntervals = new Map();
    this.lastUpdateTimes = new Map();
  }

  // Initialize real-time price updates for a stock
  startRealTimeUpdates(stockSymbol, callback, intervalMs = 30000) {
    // Clear existing interval if any
    this.stopRealTimeUpdates(stockSymbol);
    
    const interval = setInterval(() => {
      const updatedPrice = this.generateRealtimePrice(stockSymbol);
      callback(updatedPrice);
      this.lastUpdateTimes.set(stockSymbol, new Date());
    }, intervalMs);
    
    this.updateIntervals.set(stockSymbol, interval);
  }

  // Stop real-time updates for a stock
  stopRealTimeUpdates(stockSymbol) {
    const interval = this.updateIntervals.get(stockSymbol);
    if (interval) {
      clearInterval(interval);
      this.updateIntervals.delete(stockSymbol);
    }
  }

  // Generate realistic real-time price based on current market conditions
  generateRealtimePrice(stockSymbol) {
    const baseData = this.getCompanyBaseData(stockSymbol);
    const currentPrice = this.priceCache.get(stockSymbol) || baseData.currentPrice;
    
    // Market hours check (9:15 AM to 3:30 PM IST)
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();
    
    const isMarketOpen = (currentHour > 9 || (currentHour === 9 && currentMinute >= 15)) && 
                        (currentHour < 15 || (currentHour === 15 && currentMinute <= 30));
    
    let priceChange = 0;
    
    if (isMarketOpen) {
      // Active trading hours - more volatility
      const volatilityFactor = baseData.volatility / 100;
      const randomChange = (Math.random() - 0.5) * 2; // -1 to 1
      const timeBasedFactor = this.getTimeBasedFactor(currentHour, currentMinute);
      
      priceChange = currentPrice * volatilityFactor * randomChange * timeBasedFactor * 0.1;
    } else {
      // After hours - minimal movement
      const afterHoursVolatility = 0.001; // 0.1% max change
      priceChange = currentPrice * (Math.random() - 0.5) * 2 * afterHoursVolatility;
    }
    
    // Apply circuit breaker limits (10% max daily change for most stocks)
    const maxDailyChange = currentPrice * 0.1;
    priceChange = Math.max(-maxDailyChange, Math.min(maxDailyChange, priceChange));
    
    const newPrice = Math.max(currentPrice + priceChange, baseData.priceRange[0] * 0.9);
    const finalPrice = Math.min(newPrice, baseData.priceRange[1] * 1.1);
    
    // Cache the new price
    this.priceCache.set(stockSymbol, finalPrice);
    
    return {
      symbol: stockSymbol,
      price: parseFloat(finalPrice.toFixed(2)),
      change: parseFloat(priceChange.toFixed(2)),
      changePercent: parseFloat(((priceChange / currentPrice) * 100).toFixed(2)),
      timestamp: now,
      volume: this.generateRealtimeVolume(stockSymbol, isMarketOpen),
      isMarketOpen
    };
  }

  // Get time-based volatility factor
  getTimeBasedFactor(hour, minute) {
    // Higher volatility at market open and close
    if ((hour === 9 && minute < 45) || (hour === 15 && minute > 0)) {
      return 1.5; // 50% more volatile
    }
    // Lunch time - lower volatility
    if (hour >= 12 && hour <= 13) {
      return 0.7; // 30% less volatile
    }
    // Normal trading hours
    return 1.0;
  }

  // Generate realistic trading volume
  generateRealtimeVolume(stockSymbol, isMarketOpen) {
    const baseData = this.getCompanyBaseData(stockSymbol);
    const baseVolume = baseData.avgVolume || 500000;
    
    if (!isMarketOpen) {
      return Math.floor(baseVolume * 0.05); // Very low after-hours volume
    }
    
    // Random volume variation during market hours
    const volumeVariation = 0.3 + (Math.random() * 0.4); // 30% to 70% of base
    return Math.floor(baseVolume * volumeVariation);
  }

  // Company-specific base data
  getCompanyBaseData(stockSymbol) {
    const companyData = {
      'INFY': { 
        currentPrice: 1520, 
        volatility: 2.5, 
        priceRange: [1400, 1650],
        avgVolume: 800000
      },
      'TCS': { 
        currentPrice: 3420, 
        volatility: 2.0, 
        priceRange: [3200, 3600],
        avgVolume: 600000
      },
      'ASIANPAINT': { 
        currentPrice: 2325, 
        volatility: 1.8, 
        priceRange: [2200, 2450],
        avgVolume: 400000
      },
      'RELIANCE': { 
        currentPrice: 2725, 
        volatility: 1.9, 
        priceRange: [2600, 2900],
        avgVolume: 1200000
      },
      'HDFCBANK': { 
        currentPrice: 1685, 
        volatility: 1.8, 
        priceRange: [1600, 1750],
        avgVolume: 900000
      },
      'ICICIBANK': { 
        currentPrice: 1155, 
        volatility: 2.0, 
        priceRange: [1100, 1220],
        avgVolume: 1000000
      },
      'MARUTI': { 
        currentPrice: 10950, 
        volatility: 2.2, 
        priceRange: [10500, 11500],
        avgVolume: 300000
      },
      'TATAMOTORS': { 
        currentPrice: 775, 
        volatility: 3.0, 
        priceRange: [720, 850],
        avgVolume: 1500000
      },
      'SBIN': { 
        currentPrice: 825, 
        volatility: 2.5, 
        priceRange: [780, 880],
        avgVolume: 1100000
      },
      'WIPRO': { 
        currentPrice: 445, 
        volatility: 2.3, 
        priceRange: [420, 480],
        avgVolume: 700000
      },
      'DEFAULT': { 
        currentPrice: 1500, 
        volatility: 2.0, 
        priceRange: [1400, 1600],
        avgVolume: 500000
      }
    };
    
    return companyData[stockSymbol] || companyData['DEFAULT'];
  }

  // Get current cached price or base price
  getCurrentPrice(stockSymbol) {
    return this.priceCache.get(stockSymbol) || this.getCompanyBaseData(stockSymbol).currentPrice;
  }

  // Set initial price
  setPrice(stockSymbol, price) {
    this.priceCache.set(stockSymbol, price);
  }

  // Get last update time
  getLastUpdateTime(stockSymbol) {
    return this.lastUpdateTimes.get(stockSymbol);
  }

  // Clear all data for a stock
  clearStock(stockSymbol) {
    this.stopRealTimeUpdates(stockSymbol);
    this.priceCache.delete(stockSymbol);
    this.lastUpdateTimes.delete(stockSymbol);
  }

  // Generate market summary data
  generateMarketSummary(stockSymbols) {
    const summary = {
      totalStocks: stockSymbols.length,
      gainers: 0,
      losers: 0,
      unchanged: 0,
      totalVolume: 0,
      timestamp: new Date()
    };

    stockSymbols.forEach(symbol => {
      const priceData = this.generateRealtimePrice(symbol);
      summary.totalVolume += priceData.volume;
      
      if (priceData.changePercent > 0.1) {
        summary.gainers++;
      } else if (priceData.changePercent < -0.1) {
        summary.losers++;
      } else {
        summary.unchanged++;
      }
    });

    return summary;
  }
}

// Export a singleton instance
export const priceManager = new PriceManager();

// Utility functions for price formatting
export const formatPrice = (price) => {
  if (price >= 10000) {
    return `₹${(price / 1000).toFixed(1)}K`;
  }
  return `₹${price.toFixed(2)}`;
};

export const formatChange = (change, changePercent) => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}₹${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
};

export const getPriceColor = (changePercent) => {
  if (changePercent > 0.1) return '#059669'; // Green
  if (changePercent < -0.1) return '#dc2626'; // Red
  return '#6b7280'; // Gray
};

// Market timing utilities
export const isMarketOpen = () => {
  const now = new Date();
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  const currentHour = istTime.getHours();
  const currentMinute = istTime.getMinutes();
  const dayOfWeek = istTime.getDay();
  
  // Market closed on weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;
  
  // Market hours: 9:15 AM to 3:30 PM IST
  return (currentHour > 9 || (currentHour === 9 && currentMinute >= 15)) && 
         (currentHour < 15 || (currentHour === 15 && currentMinute <= 30));
};

export const getMarketStatus = () => {
  if (isMarketOpen()) {
    return { status: 'OPEN', message: 'Market is currently open' };
  }
  
  const now = new Date();
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  const currentHour = istTime.getHours();
  
  if (currentHour < 9 || (currentHour === 9 && istTime.getMinutes() < 15)) {
    return { status: 'PRE_MARKET', message: 'Pre-market session' };
  }
  
  return { status: 'CLOSED', message: 'Market is closed' };
};

// Export default
export default {
  PriceManager,
  priceManager,
  formatPrice,
  formatChange,
  getPriceColor,
  isMarketOpen,
  getMarketStatus
};