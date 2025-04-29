

import React, { useState } from 'react';
import { formatDate } from '../../utils/formatters';

function NewsSection({ news }) {
  const [filter, setFilter] = useState('all');
  
  if (!news || news.length === 0) {
    return (
      <div className="news-section news-section--empty">
        <h2 className="news-section__title">Recent News</h2>
        <div className="news-section__empty">
          No recent news available
        </div>
      </div>
    );
  }
  
  const getSentimentClass = (sentiment) => {
    if (sentiment > 0.2) return 'positive';
    if (sentiment < -0.2) return 'negative';
    return 'neutral';
  };
  
  const getSentimentText = (sentiment) => {
    if (sentiment > 0.2) return 'Positive';
    if (sentiment < -0.2) return 'Negative';
    return 'Neutral';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.2) return '↑';
    if (sentiment < -0.2) return '↓';
    return '→';
  };
  
  const filteredNews = filter === 'all' 
    ? news 
    : filter === 'positive' 
    ? news.filter(item => item.sentiment > 0.2)
    : filter === 'negative'
    ? news.filter(item => item.sentiment < -0.2)
    : news.filter(item => item.sentiment >= -0.2 && item.sentiment <= 0.2);
  
  // Calculate sentiment distribution
  const positiveCount = news.filter(item => item.sentiment > 0.2).length;
  const negativeCount = news.filter(item => item.sentiment < -0.2).length;
  const neutralCount = news.filter(item => item.sentiment >= -0.2 && item.sentiment <= 0.2).length;
  
  const positivePercentage = (positiveCount / news.length) * 100;
  const negativePercentage = (negativeCount / news.length) * 100;
  const neutralPercentage = (neutralCount / news.length) * 100;
  
  return (
    <div className="news-section">
      <div className="news-section__header">
        <h2 className="news-section__title">Recent News</h2>
        
        <div className="news-section__filters">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${filter === 'positive' ? 'active' : ''}`}
            onClick={() => setFilter('positive')}
          >
            Positive
          </button>
          <button 
            className={`filter-button ${filter === 'neutral' ? 'active' : ''}`}
            onClick={() => setFilter('neutral')}
          >
            Neutral
          </button>
          <button 
            className={`filter-button ${filter === 'negative' ? 'active' : ''}`}
            onClick={() => setFilter('negative')}
          >
            Negative
          </button>
        </div>
      </div>
      
      <div className="news-section__distribution">
        <div className="distribution-label">Sentiment Distribution:</div>
        <div className="distribution-bar">
          <div 
            className="distribution-segment positive" 
            style={{ width: `${positivePercentage}%` }}
            title={`Positive: ${positiveCount} articles (${Math.round(positivePercentage)}%)`}
          ></div>
          <div 
            className="distribution-segment neutral" 
            style={{ width: `${neutralPercentage}%` }}
            title={`Neutral: ${neutralCount} articles (${Math.round(neutralPercentage)}%)`}
          ></div>
          <div 
            className="distribution-segment negative" 
            style={{ width: `${negativePercentage}%` }}
            title={`Negative: ${negativeCount} articles (${Math.round(negativePercentage)}%)`}
          ></div>
        </div>
        <div className="distribution-legend">
          <div className="legend-item">
            <span className="legend-color positive"></span>
            <span className="legend-text">Positive ({positiveCount})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color neutral"></span>
            <span className="legend-text">Neutral ({neutralCount})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color negative"></span>
            <span className="legend-text">Negative ({negativeCount})</span>
          </div>
        </div>
      </div>
      
      <div className="news-list">
        {filteredNews.map(item => (
          <div key={item.id} className={`news-item news-item--${getSentimentClass(item.sentiment)}`}>
            <div className="news-item__sentiment">
              <span className={`sentiment-indicator sentiment-indicator--${getSentimentClass(item.sentiment)}`}>
                {getSentimentIcon(item.sentiment)} {getSentimentText(item.sentiment)}
              </span>
            </div>
            <h3 className="news-item__headline">{item.headline}</h3>
            <p className="news-item__summary">{item.summary}</p>
            <div className="news-item__meta">
              <span className="news-item__source">
                {item.source} • {formatDate(new Date(item.date))}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredNews.length === 0 && (
        <div className="news-section__empty">
          No {filter} news available
        </div>
      )}
    </div>
  );
}

export default NewsSection;