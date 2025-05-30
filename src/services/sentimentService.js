
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
