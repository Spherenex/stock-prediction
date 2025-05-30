import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { formatDate } from '../../utils/formatters';

function AIEnhancedChart({ 
  historicalData = [], 
  predictedData = [],
  aiPredictionData = null, 
  stockSymbol = 'RELIANCE',
  timeframe = '30',
  currentPrice = null,
  height = 400
}) {
  const chartRef = useRef(null);

  // Get stock-specific data
  const getStockDefaults = (symbol) => {
    // Default stock data for major companies
    const stockDefaults = {
      'RELIANCE': { basePrice: 1419.50, changePercent: 0.47, changeAmount: 6.60 },
      'TCS': { basePrice: 3850.25, changePercent: 0.62, changeAmount: 23.75 },
      'HDFCBANK': { basePrice: 1720.80, changePercent: -0.31, changeAmount: -5.40 },
      'INFY': { basePrice: 1950.15, changePercent: 0.85, changeAmount: 16.35 },
      'ICICIBANK': { basePrice: 1102.35, changePercent: 0.24, changeAmount: 2.60 },
      'HINDUNILVR': { basePrice: 2480.75, changePercent: -0.18, changeAmount: -4.50 },
      'KOTAKBANK': { basePrice: 1875.40, changePercent: 0.39, changeAmount: 7.25 },
      'BHARTIARTL': { basePrice: 1230.65, changePercent: 1.12, changeAmount: 13.65 },
      'ITC': { basePrice: 445.30, changePercent: 0.58, changeAmount: 2.55 },
      'SBIN': { basePrice: 780.90, changePercent: 0.74, changeAmount: 5.70 },
      'BAJFINANCE': { basePrice: 6850.25, changePercent: -0.42, changeAmount: -28.90 },
      'AXISBANK': { basePrice: 1291.70, changePercent: 0.47, changeAmount: 6.60 },
      'ASIANPAINT': { basePrice: 3120.85, changePercent: -0.27, changeAmount: -8.50 }
    };
    
    return stockDefaults[symbol] || { basePrice: 2000.00, changePercent: 0.00, changeAmount: 0.00 };
  };

  // Helper function to check if a date is a weekend (Saturday or Sunday)
  const isWeekend = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return false; // If date is null, undefined, or invalid, treat as not weekend
    }
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  // Helper function to get the next weekday
  const getNextWeekday = (date) => {
    if (!date || !(date instanceof Date)) {
      return new Date(); // Return current date as fallback
    }
    const result = new Date(date);
    do {
      result.setDate(result.getDate() + 1);
    } while (isWeekend(result));
    return result;
  };

  // Generate weekday dates for a specified number of days
  const generateWeekdayDates = (startDate, days) => {
    const dates = [];
    let currentDate = new Date(startDate);

    if (isWeekend(currentDate)) {
      currentDate = getNextWeekday(currentDate);
    }

    dates.push(new Date(currentDate));

    let weekdaysCount = 1;
    while (weekdaysCount < days) {
      currentDate = getNextWeekday(currentDate);
      dates.push(new Date(currentDate));
      weekdaysCount++;
    }

    return dates;
  };

  // Filter weekend dates out of data
  const filterWeekends = (data, dateField = 'date') => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const parseDate = d3.timeParse('%Y-%m-%d');
    
    return data
      .map(d => {
        let parsedDate;
        
        if (typeof d[dateField] === 'string') {
          parsedDate = parseDate(d[dateField]);
          // If parseDate fails, try parsing with Date constructor
          if (!parsedDate) {
            parsedDate = new Date(d[dateField]);
          }
        } else if (d[dateField] instanceof Date) {
          parsedDate = d[dateField];
        } else {
          // Skip invalid dates
          return null;
        }
        
        // Validate the parsed date
        if (!parsedDate || isNaN(parsedDate.getTime())) {
          return null;
        }
        
        return {
          ...d,
          [dateField]: parsedDate
        };
      })
      .filter(d => d !== null && !isWeekend(d[dateField]));
  };

  // Generate historical data if none provided
  const generateHistoricalData = (symbol, days = 90) => {
    const stockData = getStockDefaults(symbol);
    const basePrice = stockData.basePrice;
    const today = new Date();
    const data = [];
    
    // Use stock volatility based on its price (higher priced stocks often have higher volatility)
    const volatility = 0.01 + (basePrice / 10000); // 1-2% daily volatility
    
    // Realistic annual growth rate
    const annualGrowthRate = 0.12; // 12% annual growth
    const dailyGrowthRate = Math.pow(1 + annualGrowthRate, 1/365) - 1;
    
    // Starting price (work backwards from current price)
    let price = basePrice / Math.pow(1 + dailyGrowthRate, days);
    
    for (let i = days; i > 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Random price movement with drift
      const randomFactor = (Math.random() - 0.5) * 2;
      const noise = randomFactor * volatility * price;
      const drift = price * dailyGrowthRate;
      
      price += drift + noise;
      
      // Daily price range
      const high = price * (1 + Math.random() * 0.01);
      const low = price * (1 - Math.random() * 0.01);
      const open = low + Math.random() * (high - low);
      
      data.push({
        date: new Date(date),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(price.toFixed(2)),
        volume: 100000 + Math.floor(Math.random() * 900000)
      });
    }
    
    // Ensure the last price is close to the current price
    if (data.length > 0) {
      const lastIndex = data.length - 1;
      const lastPrice = data[lastIndex].close;
      const adjustment = (basePrice / lastPrice) - 1;
      
      // Adjust the last few days to trend toward the current price
      const daysToAdjust = Math.min(7, data.length);
      for (let i = 0; i < daysToAdjust; i++) {
        const idx = data.length - daysToAdjust + i;
        const factor = i / daysToAdjust;
        const currentAdjustment = adjustment * factor;
        
        data[idx].close = parseFloat((data[idx].close * (1 + currentAdjustment)).toFixed(2));
        data[idx].high = Math.max(data[idx].high, data[idx].close * 1.005);
        data[idx].low = Math.min(data[idx].low, data[idx].close * 0.995);
      }
      
      // Make sure the very last price is exactly the base price
      data[lastIndex].close = basePrice;
      data[lastIndex].high = Math.max(data[lastIndex].high, basePrice);
      data[lastIndex].low = Math.min(data[lastIndex].low, basePrice);
    }
    
    return data;
  };

  // Generate predictions if none provided
  const generatePredictions = (symbol, days = 30) => {
    const stockData = getStockDefaults(symbol);
    const basePrice = stockData.basePrice;
    const changePercent = stockData.changePercent;
    const today = new Date();
    
    // Generate more bullish predictions if recent change is positive
    const growthFactor = changePercent > 0 ? 1.5 : changePercent < 0 ? 0.5 : 1.0;
    
    // Base growth rate (annualized)
    const annualGrowthRate = 0.15 * growthFactor; // 15% annual growth adjusted by recent change
    const dailyGrowthRate = Math.pow(1 + annualGrowthRate, 1/365) - 1;
    
    // Generate predictions
    const predictions = [];
    let price = basePrice;
    
    const weekdayDates = generateWeekdayDates(today, days);
    
    for (let i = 0; i < days; i++) {
      // Add some random noise (volatility)
      const volatility = 0.01 + (basePrice / 10000); // Higher priced stocks have higher volatility
      const noise = (Math.random() - 0.5) * 2 * volatility * price;
      
      // Calculate growth plus noise for this day
      const growth = price * dailyGrowthRate;
      price += growth + noise;
      
      if (i < weekdayDates.length) {
        predictions.push({
          date: new Date(weekdayDates[i]),
          predicted: parseFloat(price.toFixed(2)),
          aiGenerated: true
        });
      }
    }
    
    return predictions;
  };

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Get stock-specific data
    const stockData = getStockDefaults(stockSymbol);
    const stockPrice = currentPrice || stockData.basePrice;
    
    // Use provided data or generate if not available
    const displayHistoricalData = historicalData.length > 0 ? 
      historicalData : 
      generateHistoricalData(stockSymbol, 90);
    
    const displayPredictedData = predictedData.length > 0 ?
      predictedData :
      generatePredictions(stockSymbol, 30);
    
    // Set up dimensions
    const margin = { top: 30, right: 60, bottom: 50, left: 65 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Filter data based on timeframe
    const filteredHistoricalData = filterWeekends(displayHistoricalData).slice(-parseInt(timeframe));

    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate prediction data for next 30 weekdays
    const today = new Date();
    const weekdayDates = generateWeekdayDates(today, 30);

    // Create combined dataset for visualization
    let combinedData = [];

    // Add historical data
    if (filteredHistoricalData.length > 0) {
      const histData = filteredHistoricalData.map(d => ({
        date: new Date(d.date),
        value: d.close,
        isHistorical: true
      }));
      combinedData = [...combinedData, ...histData];
    }

    // Add predicted data
    if (displayPredictedData.length > 0) {
      const parsePredictedDate = d3.timeParse('%Y-%m-%d');
      const predictedPoints = displayPredictedData.map((d, i) => {
        let date;
        if (typeof d.date === 'string') {
          date = parsePredictedDate(d.date) || new Date(d.date);
        } else if (d.date instanceof Date) {
          date = d.date;
        } else {
          date = weekdayDates[i] || new Date();
        }
        
        return {
          date: new Date(date),
          value: d.predicted,
          isHistorical: false,
          isAI: d.aiGenerated || false
        };
      });
      
      combinedData = [...combinedData, ...predictedPoints];
    } else if (aiPredictionData && aiPredictionData.predictions && aiPredictionData.predictions.length > 0) {
      // If no standard predictions but AI predictions available
      const aiPredictedPoints = aiPredictionData.predictions.map((value, i) => ({
        date: new Date(weekdayDates[i] || new Date()),
        value: value,
        isHistorical: false,
        isAI: true
      }));
      
      combinedData = [...combinedData, ...aiPredictedPoints];
    }

    // Filter out any invalid data points
    combinedData = combinedData.filter(d => 
      d.date && d.date instanceof Date && !isNaN(d.date.getTime()) && 
      typeof d.value === 'number' && !isNaN(d.value)
    );

    if (combinedData.length === 0) {
      // If no valid data, show an error message
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', chartHeight / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', '#64748b')
        .text('No valid data to display');
      return;
    }

    // Set the domain to cover both historical and predicted data
    const dates = combinedData.map(d => d.date);
    const values = combinedData.map(d => d.value);
    
    const xDomain = d3.extent(dates);
    const yDomain = [
      d3.min(values) * 0.995,
      d3.max(values) * 1.005
    ];
    
    // Create scales
    const x = d3.scaleTime()
      .domain(xDomain)
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain(yDomain)
      .nice()
      .range([chartHeight, 0]);
    
    // Add X axis with formatting
    svg.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x)
        .ticks(7)
        .tickFormat(d => {
          const date = new Date(d);
          return `${date.getDate()}/${date.getMonth() + 1}`;
        }))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#64748b');
    
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y)
        .tickFormat(d => `₹${d.toFixed(0)}`))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#64748b');
    
    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(y.ticks())
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => y(d))
      .attr('y2', d => y(d))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '3,3');
    
    // Create a clip path
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', chartHeight)
      .attr('x', 0)
      .attr('y', 0);
    
    // Function to separate historical and predicted data
    const historicalPoints = combinedData.filter(d => d.isHistorical);
    const predictedPoints = combinedData.filter(d => !d.isHistorical);
    
    // Add area gradient for historical data
    const areaGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    
    areaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.3);
    
    areaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0);
    
    // Add area for historical data
    if (historicalPoints.length > 0) {
      const areaHistorical = d3.area()
        .x(d => x(d.date))
        .y0(chartHeight)
        .y1(d => y(d.value))
        .curve(d3.curveMonotoneX);
      
      svg.append('path')
        .datum(historicalPoints)
        .attr('fill', 'url(#areaGradient)')
        .attr('d', areaHistorical)
        .attr('clip-path', 'url(#clip)');
    }
    
    // Add line for historical data
    if (historicalPoints.length > 0) {
      const lineHistorical = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);
      
      svg.append('path')
        .datum(historicalPoints)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('d', lineHistorical)
        .attr('clip-path', 'url(#clip)');
    }
    
    // Add area gradient for predicted data
    const predictedGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'predictedGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    
    predictedGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0.2);
    
    predictedGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0);
    
    // Add area for predicted data if available
    if (predictedPoints.length > 0) {
      const areaPredicted = d3.area()
        .x(d => x(d.date))
        .y0(chartHeight)
        .y1(d => y(d.value))
        .curve(d3.curveMonotoneX);
      
      svg.append('path')
        .datum(predictedPoints)
        .attr('fill', 'url(#predictedGradient)')
        .attr('d', areaPredicted)
        .attr('clip-path', 'url(#clip)');
    }
    
    // Add line for predicted data
    if (predictedPoints.length > 0) {
      const linePredicted = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);
      
      svg.append('path')
        .datum(predictedPoints)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '0,0')
        .attr('d', linePredicted)
        .attr('clip-path', 'url(#clip)');
    }
    
    // Add prediction confidence interval if AI predictions available
    if (aiPredictionData && predictedPoints.length > 0 && aiPredictionData.confidenceScore) {
      const confidenceScore = aiPredictionData.confidenceScore || 0.8;
      const volatilityFactor = 0.05 * (1 - confidenceScore); // Lower confidence = higher volatility
      
      // Generate upper and lower confidence bands
      const upperBand = predictedPoints.map(d => ({
        date: d.date,
        value: d.value * (1 + volatilityFactor)
      }));
      
      const lowerBand = predictedPoints.map(d => ({
        date: d.date,
        value: d.value * (1 - volatilityFactor)
      }));
      
      // Create confidence area (between upper and lower bands)
      const confidenceArea = d3.area()
        .x(d => x(d.date))
        .y0((d, i) => y(lowerBand[i].value))
        .y1((d, i) => y(upperBand[i].value))
        .curve(d3.curveMonotoneX);
      
      svg.append('path')
        .datum(predictedPoints)
        .attr('fill', '#10b981')
        .attr('fill-opacity', 0.15)
        .attr('d', confidenceArea)
        .attr('clip-path', 'url(#clip)');
    }
    
    // Add points for historical data
    if (historicalPoints.length > 0) {
      svg.selectAll('.historical-point')
        .data(historicalPoints.filter((d, i) => i % 7 === 0)) // Display every 7th point to avoid clutter
        .enter()
        .append('circle')
        .attr('class', 'historical-point')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.value))
        .attr('r', 3)
        .attr('fill', '#3b82f6')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5)
        .attr('clip-path', 'url(#clip)');
    }
    
    // Add points for predicted data
    if (predictedPoints.length > 0) {
      svg.selectAll('.predicted-point')
        .data(predictedPoints.filter((d, i) => i % 5 === 0)) // Display every 5th point
        .enter()
        .append('circle')
        .attr('class', 'predicted-point')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.value))
        .attr('r', 3.5)
        .attr('fill', '#10b981')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5)
        .attr('clip-path', 'url(#clip)');
    }
    
    // Add current price indicator line if available
    if (stockPrice) {
      // Vertical line at today's date
      svg.append('line')
        .attr('x1', x(today))
        .attr('x2', x(today))
        .attr('y1', 0)
        .attr('y2', chartHeight)
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,5')
        .attr('clip-path', 'url(#clip)');
      
      // Current price horizontal line
      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(stockPrice))
        .attr('y2', y(stockPrice))
        .attr('stroke', '#f43f5e')
        .attr('stroke-width', 1.5)
        .attr('clip-path', 'url(#clip)');
      
      // Current price label
      svg.append('rect')
        .attr('x', width - 85)
        .attr('y', y(stockPrice) - 12)
        .attr('width', 85)
        .attr('height', 24)
        .attr('fill', '#f43f5e')
        .attr('rx', 4);
      
      svg.append('text')
        .attr('x', width - 42)
        .attr('y', y(stockPrice) + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .text(`₹${stockPrice.toFixed(2)}`);
    }
    
    // Add support and resistance levels if AI predictions available
    if (aiPredictionData && aiPredictionData.supportLevels && aiPredictionData.supportLevels.length > 0) {
      // Take only the first support level for clarity
      const supportLevel = aiPredictionData.supportLevels[0];
      
      svg.append('line')
        .attr('x1', x(today))
        .attr('x2', width)
        .attr('y1', y(supportLevel))
        .attr('y2', y(supportLevel))
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,3')
        .attr('clip-path', 'url(#clip)');
      
      svg.append('text')
        .attr('x', width + 5)
        .attr('y', y(supportLevel) + 4)
        .attr('text-anchor', 'start')
        .attr('fill', '#3b82f6')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .text(`S: ₹${supportLevel.toFixed(2)}`);
    }
    
    if (aiPredictionData && aiPredictionData.resistanceLevels && aiPredictionData.resistanceLevels.length > 0) {
      // Take only the first resistance level for clarity
      const resistanceLevel = aiPredictionData.resistanceLevels[aiPredictionData.resistanceLevels.length - 1];
      
      svg.append('line')
        .attr('x1', x(today))
        .attr('x2', width)
        .attr('y1', y(resistanceLevel))
        .attr('y2', y(resistanceLevel))
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,3')
        .attr('clip-path', 'url(#clip)');
      
      svg.append('text')
        .attr('x', width + 5)
        .attr('y', y(resistanceLevel) + 4)
        .attr('text-anchor', 'start')
        .attr('fill', '#ef4444')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .text(`R: ₹${resistanceLevel.toFixed(2)}`);
    }
    
    // Add chart title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#334155')
      .text(`${stockSymbol} - Historical Data & Price Prediction`);
    
    // Add AI label if using AI predictions
    if (aiPredictionData && aiPredictionData.aiGenerated) {
      svg.append('text')
        .attr('x', width - 5)
        .attr('y', 20)
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#8b5cf6')
        .text('AI Enhanced');
    }
    
    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -chartHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#64748b')
      .text('Price (₹)');
    
    // Add today label
    svg.append('text')
      .attr('x', x(today))
      .attr('y', chartHeight + 35)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('fill', '#64748b')
      .text('Today');
    
    // Add hover effect with tooltip
    const tooltip = svg.append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');
    
    tooltip.append('rect')
      .attr('width', 120)
      .attr('height', 50)
      .attr('rx', 5)
      .attr('fill', 'white')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1)
      .attr('opacity', 0.9);
    
    const tooltipText1 = tooltip.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .style('font-size', '12px')
      .style('fill', '#334155');
    
    const tooltipText2 = tooltip.append('text')
      .attr('x', 10)
      .attr('y', 40)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#334155');
    
    const tooltipLine = svg.append('line')
      .attr('class', 'hover-line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .style('display', 'none');
    
    svg.append('rect')
      .attr('width', width)
      .attr('height', chartHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => {
        tooltip.style('display', null);
        tooltipLine.style('display', null);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
        tooltipLine.style('display', 'none');
      })
      .on('mousemove', function(event) {
        const mouseX = d3.pointer(event)[0];
        const x0 = x.invert(mouseX);
        
        // Find closest data point
        const bisect = d3.bisector(d => d.date).left;
        const allPoints = [...historicalPoints, ...predictedPoints].sort((a, b) => a.date - b.date);
        
        if (allPoints.length === 0) return;
        
        const i = bisect(allPoints, x0, 1);
        const d0 = allPoints[i - 1];
        const d1 = allPoints[i] || d0;
        const d = !d0 ? d1 : !d1 ? d0 : (x0 - d0.date > d1.date - x0 ? d1 : d0);
        
        if (!d) return;
        
        const xPos = x(d.date);
        tooltipLine.attr('transform', `translate(${xPos}, 0)`);
        
        const tooltipX = xPos > width - 140 ? xPos - 130 : xPos + 10;
        tooltip.attr('transform', `translate(${tooltipX}, 10)`);
        
        const dateFormatted = d.date.toLocaleDateString('en-IN', { 
          day: 'numeric',
          month: 'short', 
          year: 'numeric'
        });
        
        tooltipText1.text(dateFormatted);
        tooltipText2.text(`₹${d.value.toFixed(2)}`);
        tooltipText2.attr('fill', d.isHistorical ? '#3b82f6' : '#10b981');
      });
    
  }, [historicalData, predictedData, aiPredictionData, stockSymbol, timeframe, currentPrice, height]);

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: `${height}px`,
        background: '#ffffff',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
    />
  );
}

export default AIEnhancedChart;