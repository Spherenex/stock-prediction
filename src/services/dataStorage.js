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

// src/services/dataStorage.js

// import { preprocessDataForLSTM } from '../utils/dataPreprocessing';
// import { generateAndSaveData } from '../utils/sampleDataGenerator';

// // Cache for processed data
// let cachedData = null;

// /**
//  * Fetch stock and news data, process it and return the result
//  * @param {Object} options - Options for data retrieval
//  * @param {boolean} options.useCache - Whether to use cached data if available
//  * @param {number} options.sequenceLength - LSTM sequence length
//  * @returns {Promise<Object>} - Processed data
//  */
// export const getProcessedData = async (options = { useCache: true, sequenceLength: 10 }) => {
//   // Return cached data if available and requested
//   if (options.useCache && cachedData) {
//     return cachedData;
//   }
  
//   try {
//     let stockResponse, newsResponse;
    
//     try {
//       // Try to load data from files
//       stockResponse = await fetch('/data/stock_data.csv');
//       newsResponse = await fetch('/data/news_data.csv');
      
//       if (!stockResponse.ok || !newsResponse.ok) {
//         throw new Error('Failed to load data files');
//       }
      
//       stockResponse = await stockResponse.text();
//       newsResponse = await newsResponse.text();
//     } catch (err) {
//       console.log('Using generated sample data instead');
//       // Generate sample data if files aren't available
//       const sampleData = await generateAndSaveData();
//       stockResponse = sampleData.stockCSV;
//       newsResponse = sampleData.newsCSV;
//     }
    
//     // Process the data using our preprocessing utility
//     const processed = await preprocessDataForLSTM(
//       stockResponse, 
//       newsResponse, 
//       options.sequenceLength
//     );
    
//     // Cache the processed data
//     cachedData = processed;
    
//     return processed;
//   } catch (error) {
//     console.error('Error fetching or processing data:', error);
//     throw error;
//   }
// };

// /**
//  * Clear the data cache
//  */
// export const clearDataCache = () => {
//   cachedData = null;
// };

// /**
//  * Process uploaded CSV files
//  * @param {File} stockFile - Stock data CSV file
//  * @param {File} newsFile - News data CSV file
//  * @param {number} sequenceLength - LSTM sequence length
//  * @returns {Promise<Object>} - Processed data
//  */
// export const processUploadedFiles = async (stockFile, newsFile, sequenceLength = 10) => {
//   try {
//     // Read the uploaded files
//     const stockData = await readFileAsText(stockFile);
//     const newsData = await readFileAsText(newsFile);
    
//     // Process the data
//     const processed = await preprocessDataForLSTM(stockData, newsData, sequenceLength);
    
//     // Update the cache
//     cachedData = processed;
    
//     return processed;
//   } catch (error) {
//     console.error('Error processing uploaded files:', error);
//     throw error;
//   }
// };

// /**
//  * Read a file as text
//  * @param {File} file - File to read
//  * @returns {Promise<string>} - File content
//  */
// const readFileAsText = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (event) => resolve(event.target.result);
//     reader.onerror = (error) => reject(error);
//     reader.readAsText(file);
//   });
// };

// /**
//  * Generate sample data for visualization
//  * @param {number} days - Number of days to generate
//  * @returns {Promise<Object>} - Generated sample data
//  */
// export const generateSampleData = async (days = 365) => {
//   try {
//     const sampleData = await generateAndSaveData();
//     return sampleData;
//   } catch (error) {
//     console.error('Error generating sample data:', error);
//     throw error;
//   }
// };

// export default {
//   getProcessedData,
//   clearDataCache,
//   processUploadedFiles,
//   generateSampleData
// };