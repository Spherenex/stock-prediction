

// import React, { useState, useEffect } from 'react';
// import { formatDate } from '../../utils/formatters';

// function NewsSection({ news, refreshInterval = 300000 }) { // 5 minutes refresh by default
//   const [filter, setFilter] = useState('all');
//   const [sortedNews, setSortedNews] = useState([]);
//   const [lastUpdated, setLastUpdated] = useState(new Date());
  
//   // Sort news by date (newest first) whenever the news prop changes
//   useEffect(() => {
//     if (!news || news.length === 0) {
//       setSortedNews([]);
//       return;
//     }
    
//     // Make a deep copy to avoid mutating props
//     const newsSorted = [...news].sort((a, b) => {
//       const dateA = new Date(a.date);
//       const dateB = new Date(b.date);
//       return dateB - dateA; // Sort in descending order (newest first)
//     });
    
//     setSortedNews(newsSorted);
//     setLastUpdated(new Date());
//   }, [news]);
  
//   // Set up polling for real-time updates
//   useEffect(() => {
//     // Function to trigger parent component to refresh news
//     const refreshNews = () => {
//       // This is a placeholder for now - in a real app, this would dispatch an action
//       // or call a callback function passed as a prop to fetch new data
//       console.log('Refreshing news data...');
//       setLastUpdated(new Date());
      
//       // If you have a refresh callback from the parent, call it here
//       // if (onRefresh) onRefresh();
      
//       // For demo purposes, we'll just update the last updated time
//       // In a real implementation, you would fetch new data here
//     };
    
//     // Set up interval for polling
//     const intervalId = setInterval(refreshNews, refreshInterval);
    
//     // Clean up interval on component unmount
//     return () => clearInterval(intervalId);
//   }, [refreshInterval]);
  
//   if (!sortedNews || sortedNews.length === 0) {
//     return (
//       <div className="news-section news-section--empty">
//         <h2 className="news-section__title">Recent News</h2>
//         <div className="news-section__empty">
//           No recent news available
//         </div>
//       </div>
//     );
//   }
  
//   const getSentimentClass = (sentiment) => {
//     if (sentiment > 0.2) return 'positive';
//     if (sentiment < -0.2) return 'negative';
//     return 'neutral';
//   };
  
//   const getSentimentText = (sentiment) => {
//     if (sentiment > 0.2) return 'Positive';
//     if (sentiment < -0.2) return 'Negative';
//     return 'Neutral';
//   };

//   const getSentimentIcon = (sentiment) => {
//     if (sentiment > 0.2) return '↑';
//     if (sentiment < -0.2) return '↓';
//     return '→';
//   };
  
//   const filteredNews = filter === 'all' 
//     ? sortedNews 
//     : filter === 'positive' 
//     ? sortedNews.filter(item => item.sentiment > 0.2)
//     : filter === 'negative'
//     ? sortedNews.filter(item => item.sentiment < -0.2)
//     : sortedNews.filter(item => item.sentiment >= -0.2 && item.sentiment <= 0.2);
  
//   // Calculate sentiment distribution
//   const positiveCount = sortedNews.filter(item => item.sentiment > 0.2).length;
//   const negativeCount = sortedNews.filter(item => item.sentiment < -0.2).length;
//   const neutralCount = sortedNews.filter(item => item.sentiment >= -0.2 && item.sentiment <= 0.2).length;
  
//   const positivePercentage = (positiveCount / sortedNews.length) * 100;
//   const negativePercentage = (negativeCount / sortedNews.length) * 100;
//   const neutralPercentage = (neutralCount / sortedNews.length) * 100;
  
//   return (
//     <div className="news-section">
//       <div className="news-section__header">
//         <h2 className="news-section__title">Recent News</h2>
//         <div className="news-update-info">
//           Last updated: {formatDate(lastUpdated, 'time')}
//         </div>
        
//         <div className="news-section__filters">
//           <button 
//             className={`filter-button ${filter === 'all' ? 'active' : ''}`}
//             onClick={() => setFilter('all')}
//           >
//             All
//           </button>
//           <button 
//             className={`filter-button ${filter === 'positive' ? 'active' : ''}`}
//             onClick={() => setFilter('positive')}
//           >
//             Positive
//           </button>
//           <button 
//             className={`filter-button ${filter === 'neutral' ? 'active' : ''}`}
//             onClick={() => setFilter('neutral')}
//           >
//             Neutral
//           </button>
//           <button 
//             className={`filter-button ${filter === 'negative' ? 'active' : ''}`}
//             onClick={() => setFilter('negative')}
//           >
//             Negative
//           </button>
//         </div>
//       </div>
      
//       <div className="news-section__distribution">
//         <div className="distribution-label">Sentiment Distribution:</div>
//         <div className="distribution-bar">
//           <div 
//             className="distribution-segment positive" 
//             style={{ width: `${positivePercentage}%` }}
//             title={`Positive: ${positiveCount} articles (${Math.round(positivePercentage)}%)`}
//           ></div>
//           <div 
//             className="distribution-segment neutral" 
//             style={{ width: `${neutralPercentage}%` }}
//             title={`Neutral: ${neutralCount} articles (${Math.round(neutralPercentage)}%)`}
//           ></div>
//           <div 
//             className="distribution-segment negative" 
//             style={{ width: `${negativePercentage}%` }}
//             title={`Negative: ${negativeCount} articles (${Math.round(negativePercentage)}%)`}
//           ></div>
//         </div>
//         <div className="distribution-legend">
//           <div className="legend-item">
//             <span className="legend-color positive"></span>
//             <span className="legend-text">Positive ({positiveCount})</span>
//           </div>
//           <div className="legend-item">
//             <span className="legend-color neutral"></span>
//             <span className="legend-text">Neutral ({neutralCount})</span>
//           </div>
//           <div className="legend-item">
//             <span className="legend-color negative"></span>
//             <span className="legend-text">Negative ({negativeCount})</span>
//           </div>
//         </div>
//       </div>
      
//       <div className="news-list">
//         {filteredNews.map(item => (
//           <div key={item.id} className={`news-item news-item--${getSentimentClass(item.sentiment)}`}>
//             <div className="news-item__sentiment">
//               <span className={`sentiment-indicator sentiment-indicator--${getSentimentClass(item.sentiment)}`}>
//                 {getSentimentIcon(item.sentiment)} {getSentimentText(item.sentiment)}
//               </span>
//             </div>
//             <h3 className="news-item__headline">{item.headline}</h3>
//             <p className="news-item__summary">{item.summary}</p>
//             <div className="news-item__meta">
//               <span className="news-item__source">
//                 {item.source} • {formatDate(new Date(item.date))}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {filteredNews.length === 0 && (
//         <div className="news-section__empty">
//           No {filter} news available
//         </div>
//       )}
//     </div>
//   );
// }

// export default NewsSection;




import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/formatters';

function NewsSection({ news = [], refreshInterval = 300000 }) {
  const [sortedNews, setSortedNews] = useState([]);
  const [filterOption, setFilterOption] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [countdown, setCountdown] = useState(refreshInterval / 1000);
  const [expandedArticles, setExpandedArticles] = useState({});

  // Sort and filter news when data changes or filters change
  useEffect(() => {
    let filteredNews = [...news];
    
    // Apply sentiment filtering
    if (filterOption === 'positive') {
      filteredNews = filteredNews.filter(item => item.sentiment > 0.2);
    } else if (filterOption === 'negative') {
      filteredNews = filteredNews.filter(item => item.sentiment < -0.2);
    } else if (filterOption === 'neutral') {
      filteredNews = filteredNews.filter(item => item.sentiment >= -0.2 && item.sentiment <= 0.2);
    }
    
    // Apply search term filtering if provided
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredNews = filteredNews.filter(item => 
        item.headline.toLowerCase().includes(term) || 
        item.summary.toLowerCase().includes(term) ||
        item.source.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (newest first)
    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setSortedNews(filteredNews);
  }, [news, filterOption, searchTerm]);

  // Set up countdown timer for next refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;
    
    setCountdown(refreshInterval / 1000);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return refreshInterval / 1000;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [refreshInterval]);

  // Toggle article expansion
  const toggleExpanded = (id) => {
    setExpandedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get CSS class for sentiment
  const getSentimentClass = (sentiment) => {
    if (sentiment > 0.2) return 'positive';
    if (sentiment < -0.2) return 'negative';
    return 'neutral';
  };

  // Get sentiment text label
  const getSentimentText = (sentiment) => {
    if (sentiment > 0.5) return 'Very Positive';
    if (sentiment > 0.2) return 'Positive';
    if (sentiment > 0.1) return 'Slightly Positive';
    if (sentiment > -0.1) return 'Neutral';
    if (sentiment > -0.2) return 'Slightly Negative';
    if (sentiment > -0.5) return 'Negative';
    return 'Very Negative';
  };

  return (
    <div className="news-section">
      <div className="news-controls">
        <div className="filter-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterOption === 'all' ? 'active' : ''}`}
              onClick={() => setFilterOption('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterOption === 'positive' ? 'active' : ''}`}
              onClick={() => setFilterOption('positive')}
            >
              Positive
            </button>
            <button
              className={`filter-btn ${filterOption === 'neutral' ? 'active' : ''}`}
              onClick={() => setFilterOption('neutral')}
            >
              Neutral
            </button>
            <button
              className={`filter-btn ${filterOption === 'negative' ? 'active' : ''}`}
              onClick={() => setFilterOption('negative')}
            >
              Negative
            </button>
          </div>
        </div>
        
        <div className="results-info">
          <span className="results-count">{sortedNews.length} articles</span>
          {refreshInterval > 0 && (
            <span className="refresh-countdown">
              Next refresh in {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
      
      {sortedNews.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">📰</div>
          <h3>No news articles found</h3>
          <p>Try adjusting your search criteria or check back later for updates.</p>
        </div>
      ) : (
        <div className="news-list">
          {sortedNews.map(article => (
            <div 
              key={article.id} 
              className={`news-item ${getSentimentClass(article.sentiment)}`}
            >
              <div className="news-header">
                <div className="news-metadata">
                  <span className="news-source">{article.source}</span>
                  <span className="news-date">{formatDate(new Date(article.date))}</span>
                </div>
                <div className={`sentiment-badge ${getSentimentClass(article.sentiment)}`}>
                  {getSentimentText(article.sentiment)}
                </div>
              </div>
              
              <h3 className="news-headline">{article.headline}</h3>
              
              <div className={`news-content ${expandedArticles[article.id] ? 'expanded' : ''}`}>
                <p className="news-summary">{article.summary}</p>
                {article.content && expandedArticles[article.id] && (
                  <div className="news-full-content">
                    {article.content.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="news-footer">
                <button 
                  className="expand-btn"
                  onClick={() => toggleExpanded(article.id)}
                >
                  {expandedArticles[article.id] ? 'Show Less' : 'Read More'}
                </button>
                
                <div className="sentiment-score">
                  Sentiment: 
                  <span className={`score-value ${getSentimentClass(article.sentiment)}`}>
                    {article.sentiment >= 0 ? '+' : ''}{(article.sentiment * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .news-section {
          padding: 15px 0;
        }
        
        .news-controls {
          margin-bottom: 20px;
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 15px;
        }
        
        .filter-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .search-bar {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        
        .search-input {
          width: 100%;
          padding: 10px 15px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .clear-search:hover {
          color: #64748b;
        }
        
        .filter-buttons {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background-color: white;
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .filter-btn:hover {
          background-color: #f1f5f9;
        }
        
        .filter-btn.active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .filter-btn.active.positive {
          background-color: #10b981;
          border-color: #10b981;
        }
        
        .filter-btn.active.neutral {
          background-color: #64748b;
          border-color: #64748b;
        }
        
        .filter-btn.active.negative {
          background-color: #ef4444;
          border-color: #ef4444;
        }
        
        .results-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #64748b;
        }
        
        .refresh-countdown {
          font-family: monospace;
        }
        
        .news-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .news-item {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border-left: 3px solid #e2e8f0;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .news-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .news-item.positive {
          border-left-color: #10b981;
        }
        
        .news-item.neutral {
          border-left-color: #64748b;
        }
        
        .news-item.negative {
          border-left-color: #ef4444;
        }
        
        .news-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .news-metadata {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: #64748b;
        }
        
        .news-source {
          font-weight: 600;
        }
        
        .news-date::before {
          content: '•';
          margin-right: 10px;
        }
        
        .sentiment-badge {
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 500;
        }
        
        .sentiment-badge.positive {
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        
        .sentiment-badge.neutral {
          background-color: rgba(100, 116, 139, 0.1);
          color: #64748b;
        }
        
        .sentiment-badge.negative {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        
        .news-headline {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 10px;
          line-height: 1.4;
        }
        
        .news-content {
          max-height: 80px;
          overflow: hidden;
          transition: max-height 0.3s;
        }
        
        .news-content.expanded {
          max-height: 2000px;
        }
        
        .news-summary {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 10px;
        }
        
        .news-full-content {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
          color: #334155;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        
        .news-full-content p {
          margin-bottom: 15px;
        }
        
        .news-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }
        
        .expand-btn {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          padding: 5px 0;
        }
        
        .expand-btn:hover {
          text-decoration: underline;
        }
        
        .sentiment-score {
          font-size: 0.85rem;
          color: #64748b;
        }
        
        .score-value {
          font-weight: 600;
          margin-left: 5px;
        }
        
        .score-value.positive {
          color: #10b981;
        }
        
        .score-value.neutral {
          color: #64748b;
        }
        
        .score-value.negative {
          color: #ef4444;
        }
        
        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 50px 20px;
          background-color: #f8fafc;
          border-radius: 8px;
          text-align: center;
        }
        
        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          color: #94a3b8;
        }
        
        .no-results h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 10px;
        }
        
        .no-results p {
          color: #64748b;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
}

export default NewsSection;