// Data Storage Service for caching API responses and storing user preferences
class DataStorageService {
    constructor() {
      this.storagePrefix = 'stock_predict_';
      this.cacheTTL = 3600000; // 1 hour in milliseconds
    }
  
    // Save data to localStorage with timestamp
    saveData(key, data) {
      const storageItem = {
        timestamp: Date.now(),
        data: data
      };
      
      try {
        localStorage.setItem(this.storagePrefix + key, JSON.stringify(storageItem));
        return true;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
      }
    }
  
    // Get data from localStorage if not expired
    getData(key) {
      try {
        const storageItem = localStorage.getItem(this.storagePrefix + key);
        
        if (!storageItem) return null;
        
        const { timestamp, data } = JSON.parse(storageItem);
        
        // Check if data is expired
        if (Date.now() - timestamp > this.cacheTTL) {
          this.removeData(key);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    }
  
    // Remove data from localStorage
    removeData(key) {
      try {
        localStorage.removeItem(this.storagePrefix + key);
        return true;
      } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
      }
    }
  
    // Save user preferences
    savePreferences(preferences) {
      return this.saveData('user_preferences', preferences);
    }
  
    // Get user preferences
    getPreferences() {
      return this.getData('user_preferences') || {};
    }
  
    // Cache stock historical data
    cacheStockData(symbol, data) {
      return this.saveData(`stock_${symbol}`, data);
    }
  
    // Get cached stock data
    getCachedStockData(symbol) {
      return this.getData(`stock_${symbol}`);
    }
  
    // Cache news data
    cacheNewsData(symbol, data) {
      return this.saveData(`news_${symbol}`, data);
    }
  
    // Get cached news data
    getCachedNewsData(symbol) {
      return this.getData(`news_${symbol}`);
    }
  
    // Clear all cached data
    clearCache() {
      try {
        Object.keys(localStorage)
          .filter(key => key.startsWith(this.storagePrefix) && key !== this.storagePrefix + 'user_preferences')
          .forEach(key => localStorage.removeItem(key));
        return true;
      } catch (error) {
        console.error('Error clearing cache:', error);
        return false;
      }
    }
  }
  
  // Export a singleton instance
  const dataStorage = new DataStorageService();
  export default dataStorage;