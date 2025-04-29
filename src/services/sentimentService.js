// // // src/services/sentimentService.js

// // // Simple sentiment analysis service
// export class SentimentAnalysisService {
//     constructor() {
//       // Positive and negative word dictionaries with weights
//       this.positiveWords = {
//         'up': 0.5, 'rise': 0.6, 'bull': 0.7, 'bullish': 0.8, 'rally': 0.7,
//         'gain': 0.5, 'profit': 0.6, 'growth': 0.7, 'strong': 0.6, 'positive': 0.7,
//         'beat': 0.6, 'exceed': 0.7, 'surpass': 0.7, 'outperform': 0.8, 'record': 0.6,
//         'high': 0.5, 'higher': 0.6, 'increase': 0.5, 'expanding': 0.6, 'expansion': 0.6,
//         'improved': 0.6, 'improving': 0.6, 'upgrade': 0.7, 'buy': 0.6, 'recommend': 0.6,
//         'opportunity': 0.5, 'optimistic': 0.7, 'confident': 0.6, 'innovative': 0.5,
//         'successful': 0.7, 'success': 0.7, 'partnership': 0.5, 'collaboration': 0.5,
//         'launch': 0.5, 'dividend': 0.6, 'bonus': 0.7, 'promising': 0.6, 'potential': 0.4
//       };
      
//       this.negativeWords = {
//         'down': 0.5, 'fall': 0.6, 'bear': 0.7, 'bearish': 0.8, 'decline': 0.6,
//         'drop': 0.6, 'loss': 0.7, 'lose': 0.6, 'weak': 0.6, 'negative': 0.7,
//         'miss': 0.6, 'below': 0.5, 'underperform': 0.7, 'downturn': 0.7, 'low': 0.5,
//         'lower': 0.6, 'decrease': 0.5, 'contracting': 0.6, 'contraction': 0.6,
//         'deteriorated': 0.7, 'deteriorating': 0.7, 'downgrade': 0.7, 'sell': 0.6, 'avoid': 0.6,
//         'risk': 0.5, 'risky': 0.6, 'pessimistic': 0.7, 'concern': 0.5, 'concerned': 0.5,
//         'problem': 0.6, 'issue': 0.5, 'challenge': 0.4, 'challenging': 0.4, 'difficult': 0.5,
//         'lawsuit': 0.7, 'legal': 0.4, 'investigation': 0.6, 'regulatory': 0.4, 'scandal': 0.8,
//         'fraud': 0.9, 'debt': 0.6, 'bankrupt': 0.9, 'bankruptcy': 0.9, 'layoff': 0.7
//       };
//     }
  
//     // Analyze sentiment from text
//     analyzeText(text) {
//       if (!text) return 0;
      
//       // Convert to lowercase for comparison
//       const lowerText = text.toLowerCase();
      
//       // Tokenize into words (remove punctuation and split by spaces)
//       const words = lowerText
//         .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
//         .replace(/\s{2,}/g, " ")
//         .split(" ");
      
//       let sentimentScore = 0;
//       let wordsAnalyzed = 0;
      
//       // Check for positive words
//       for (const word of words) {
//         if (this.positiveWords[word]) {
//           sentimentScore += this.positiveWords[word];
//           wordsAnalyzed++;
//         } else if (this.negativeWords[word]) {
//           sentimentScore -= this.negativeWords[word];
//           wordsAnalyzed++;
//         }
//       }
      
//       // If no sentiment words were found, return neutral sentiment
//       if (wordsAnalyzed === 0) return 0;
      
//       // Normalize to [-1, 1] range
//       return sentimentScore / wordsAnalyzed;
//     }
  
//     // Analyze sentiment from news articles
//     analyzeNews(newsData) {
//       if (!newsData || !newsData.length) {
//         return {
//           score: 0,
//           positive: 0,
//           negative: 0,
//           neutral: 0,
//           details: []
//         };
//       }
      
//       const results = newsData.map(news => {
//         // Analyze headline (more important) and summary
//         const headlineScore = this.analyzeText(news.headline) * 2; // Double weight for headline
//         const summaryScore = this.analyzeText(news.summary);
        
//         // Calculate weighted average
//         const weightedScore = (headlineScore * 2 + summaryScore) / 3;
        
//         return {
//           id: news.id,
//           headline: news.headline,
//           score: parseFloat(weightedScore.toFixed(2)),
//           sentiment: weightedScore > 0.1 ? 'positive' : 
//                     weightedScore < -0.1 ? 'negative' : 'neutral'
//         };
//       });
      
//       // Count sentiment categories
//       const positive = results.filter(r => r.sentiment === 'positive').length;
//       const negative = results.filter(r => r.sentiment === 'negative').length;
//       const neutral = results.filter(r => r.sentiment === 'neutral').length;
      
//       // Calculate overall score
//       const overallScore = results.reduce((sum, item) => sum + item.score, 0) / results.length;
      
//       return {
//         score: parseFloat(overallScore.toFixed(2)),
//         positive,
//         negative,
//         neutral,
//         details: results
//       };
//     }
  
//     // Get sentiment description based on score
//     getSentimentDescription(score) {
//       if (score > 0.5) return 'Very Bullish';
//       if (score > 0.2) return 'Bullish';
//       if (score > 0.1) return 'Slightly Bullish';
//       if (score > -0.1) return 'Neutral';
//       if (score > -0.2) return 'Slightly Bearish';
//       if (score > -0.5) return 'Bearish';
//       return 'Very Bearish';
//     }
  
//     // Get sentiment color based on score (for UI)
//     getSentimentColor(score) {
//       if (score > 0.5) return '#10B981'; // Green
//       if (score > 0.2) return '#34D399';
//       if (score > 0.1) return '#6EE7B7';
//       if (score > -0.1) return '#9CA3AF'; // Gray
//       if (score > -0.2) return '#F87171';
//       if (score > -0.5) return '#EF4444';
//       return '#DC2626'; // Red
//     }
//   }
  
//   // Export a single instance to be used throughout the app
//   export default new SentimentAnalysisService();

// Sentiment Analysis Service
class SentimentAnalysisService {
    constructor() {
      // Dictionary of positive words with weights
      this.positiveWords = {
        'up': 0.5, 
        'rise': 0.6, 
        'rising': 0.6,
        'bull': 0.7, 
        'bullish': 0.8, 
        'rally': 0.7,
        'gain': 0.5, 
        'gains': 0.5,
        'profit': 0.6, 
        'profitable': 0.6,
        'growth': 0.7, 
        'growing': 0.6,
        'strong': 0.6, 
        'positive': 0.7,
        'beat': 0.6, 
        'beats': 0.6,
        'exceed': 0.7, 
        'exceeds': 0.7,
        'surpass': 0.7, 
        'outperform': 0.8,
        'record': 0.6, 
        'high': 0.5,
        'higher': 0.6, 
        'increase': 0.5,
        'increasing': 0.5,
        'upgrade': 0.7, 
        'buy': 0.6,
        'opportunity': 0.5, 
        'optimistic': 0.7,
        'success': 0.7, 
        'successful': 0.7,
        'innovation': 0.6, 
        'innovative': 0.6,
        'dividend': 0.6, 
        'dividends': 0.6
      };
      
      // Dictionary of negative words with weights
      this.negativeWords = {
        'down': 0.5, 
        'fall': 0.6, 
        'falling': 0.6,
        'bear': 0.7, 
        'bearish': 0.8, 
        'decline': 0.6,
        'declining': 0.6,
        'drop': 0.6, 
        'drops': 0.6,
        'loss': 0.7, 
        'losses': 0.7,
        'lose': 0.6, 
        'loses': 0.6,
        'weak': 0.6, 
        'negative': 0.7,
        'miss': 0.6, 
        'misses': 0.6,
        'below': 0.5, 
        'underperform': 0.7,
        'concern': 0.5, 
        'concerns': 0.5,
        'worried': 0.6, 
        'worry': 0.6,
        'risk': 0.5, 
        'risks': 0.5,
        'risky': 0.6, 
        'regulation': 0.4,
        'lawsuit': 0.7, 
        'legal': 0.4,
        'challenge': 0.4, 
        'challenges': 0.4,
        'difficult': 0.5, 
        'debt': 0.6,
        'investigation': 0.6, 
        'penalty': 0.7,
        'cut': 0.5, 
        'cuts': 0.5,
        'downgrade': 0.7, 
        'sell': 0.6
      };
    }
  
    // Analyze sentiment from text
    analyzeText(text) {
      if (!text) return 0;
      
      // Convert to lowercase for comparison
      const lowerText = text.toLowerCase();
      
      // Tokenize text (remove punctuation and split by spaces)
      const words = lowerText
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s{2,}/g, " ")
        .split(" ");
      
      let totalScore = 0;
      let matchedWords = 0;
      
      // Check each word against the dictionaries
      words.forEach(word => {
        if (this.positiveWords[word]) {
          totalScore += this.positiveWords[word];
          matchedWords++;
        } else if (this.negativeWords[word]) {
          totalScore -= this.negativeWords[word];
          matchedWords++;
        }
      });
      
      // Return neutral sentiment if no words matched
      if (matchedWords === 0) return 0;
      
      // Normalize to [-1, 1] range
      return totalScore / matchedWords;
    }
  
    // Analyze sentiment from news articles
    analyzeNews(newsData) {
      if (!newsData || newsData.length === 0) {
        return {
          score: 0,
          positive: 0,
          negative: 0,
          neutral: 0
        };
      }
      
      // If the news items already have sentiment scores, use those
      if (newsData[0].sentiment !== undefined) {
        const sentimentScores = newsData.map(item => item.sentiment);
        const avgSentiment = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
        
        return {
          score: parseFloat(avgSentiment.toFixed(2)),
          positive: sentimentScores.filter(score => score > 0.2).length,
          negative: sentimentScores.filter(score => score < -0.2).length,
          neutral: sentimentScores.filter(score => score >= -0.2 && score <= 0.2).length
        };
      }
      
      // Otherwise, analyze the text content
      const sentiments = newsData.map(item => {
        const headlineSentiment = this.analyzeText(item.headline) * 2; // Give headline double weight
        const summarySentiment = this.analyzeText(item.summary);
        
        // Calculate weighted average
        return (headlineSentiment * 2 + summarySentiment) / 3;
      });
      
      const avgSentiment = sentiments.reduce((sum, score) => sum + score, 0) / sentiments.length;
      
      return {
        score: parseFloat(avgSentiment.toFixed(2)),
        positive: sentiments.filter(score => score > 0.2).length,
        negative: sentiments.filter(score => score < -0.2).length,
        neutral: sentiments.filter(score => score >= -0.2 && score <= 0.2).length
      };
    }
  }
  
  // Export a singleton instance
  const sentimentService = new SentimentAnalysisService();
  export default sentimentService;

// src/services/sentimentService.js

// import { aggregateNewsSentimentByDate } from '../utils/dataPreprocessing';

// /**
//  * Calculate overall sentiment score from news data
//  * @param {Array} newsData - Array of news articles with sentiment scores
//  * @param {number} days - Number of recent days to consider (default: 30)
//  * @returns {number} - Overall sentiment score (-1 to 1)
//  */
// export const calculateOverallSentiment = (newsData, days = 30) => {
//   if (!newsData || newsData.length === 0) {
//     return 0;
//   }
  
//   // Sort news by date
//   const sortedNews = [...newsData].sort((a, b) => {
//     const dateA = a.date instanceof Date ? a.date : new Date(a.date);
//     const dateB = b.date instanceof Date ? b.date : new Date(b.date);
//     return dateA - dateB;
//   });
  
//   // Get recent news
//   const recentNews = sortedNews.slice(-days);
  
//   // Calculate weighted average of sentiment scores (more recent = higher weight)
//   let totalSentiment = 0;
//   let totalWeight = 0;
  
//   recentNews.forEach((article, index) => {
//     const weight = index + 1; // More recent articles have higher index
//     totalSentiment += article.sentiment * weight;
//     totalWeight += weight;
//   });
  
//   return totalWeight > 0 ? totalSentiment / totalWeight : 0;
// };

// /**
//  * Get sentiment distribution from news data
//  * @param {Array} newsData - Array of news articles with sentiment scores
//  * @returns {Array} - Sentiment distribution data for visualization
//  */
// export const getSentimentDistribution = (newsData) => {
//   if (!newsData || newsData.length === 0) {
//     // Return default distribution if no data
//     return [
//       { label: 'Very Bearish', value: 0.1, color: '#ef4444' },
//       { label: 'Bearish', value: 0.15, color: '#f97316' },
//       { label: 'Slightly Bearish', value: 0.1, color: '#f59e0b' },
//       { label: 'Neutral', value: 0.2, color: '#64748b' },
//       { label: 'Slightly Bullish', value: 0.15, color: '#86efac' },
//       { label: 'Bullish', value: 0.2, color: '#22c55e' },
//       { label: 'Very Bullish', value: 0.1, color: '#10b981' }
//     ];
//   }
  
//   // Count articles in each sentiment category
//   const categories = {
//     'Very Bearish': { count: 0, color: '#ef4444' },
//     'Bearish': { count: 0, color: '#f97316' },
//     'Slightly Bearish': { count: 0, color: '#f59e0b' },
//     'Neutral': { count: 0, color: '#64748b' },
//     'Slightly Bullish': { count: 0, color: '#86efac' },
//     'Bullish': { count: 0, color: '#22c55e' },
//     'Very Bullish': { count: 0, color: '#10b981' }
//   };
  
//   // Categorize each article
//   newsData.forEach(article => {
//     const sentiment = article.sentiment;
    
//     if (sentiment <= -0.5) {
//       categories['Very Bearish'].count++;
//     } else if (sentiment <= -0.2) {
//       categories['Bearish'].count++;
//     } else if (sentiment <= -0.1) {
//       categories['Slightly Bearish'].count++;
//     } else if (sentiment <= 0.1) {
//       categories['Neutral'].count++;
//     } else if (sentiment <= 0.2) {
//       categories['Slightly Bullish'].count++;
//     } else if (sentiment <= 0.5) {
//       categories['Bullish'].count++;
//     } else {
//       categories['Very Bullish'].count++;
//     }
//   });
  
//   // Calculate percentages
//   const total = newsData.length;
//   const distribution = Object.entries(categories).map(([label, data]) => ({
//     label,
//     value: data.count / total,
//     color: data.color
//   }));
  
//   return distribution;
// };

// /**
//  * Process news data and extract sentiment by date
//  * @param {Array} newsData - Raw news data
//  * @returns {Object} - Sentiment aggregated by date
//  */
// export const processSentimentByDate = (newsData) => {
//   if (!newsData || newsData.length === 0) {
//     return {};
//   }
  
//   // Ensure dates are Date objects
//   const processedNews = newsData.map(article => ({
//     ...article,
//     date: article.date instanceof Date ? article.date : new Date(article.date)
//   }));
  
//   return aggregateNewsSentimentByDate(processedNews);
// };

// /**
//  * Get sentiment text based on score
//  * @param {number} score - Sentiment score (-1 to 1)
//  * @returns {string} - Text description of sentiment
//  */
// export const getSentimentText = (score) => {
//   if (score > 0.5) return 'Very Bullish';
//   if (score > 0.2) return 'Bullish';
//   if (score > 0.1) return 'Slightly Bullish';
//   if (score > -0.1) return 'Neutral';
//   if (score > -0.2) return 'Slightly Bearish';
//   if (score > -0.5) return 'Bearish';
//   return 'Very Bearish';
// };

// export default {
//   calculateOverallSentiment,
//   getSentimentDistribution,
//   processSentimentByDate,
//   getSentimentText
// };