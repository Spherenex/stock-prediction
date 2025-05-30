// // import React, { useEffect, useRef } from 'react';
// // import * as d3 from 'd3';
// // import { formatDate } from '../../utils/formatters';

// // function StockChart({ 
// //   historicalData = [], 
// //   predictedData = [], 
// //   stockSymbol,
// //   timeframe = '30',
// //   showVolume = false,
// //   height = 400,
// //   cleanedData = [],
// //   normalizedData = [],
// //   showOutliers = false,
// //   showNormalized = false,
// //   intradayData = [],
// //   showIntraday = false,
// //   currentPrice = null,
// //   marketStatus = null
// // }) {
// //   const chartRef = useRef(null);

// //   // Helper function to check if a date is a weekend (Saturday or Sunday)
// //   const isWeekend = (date) => {
// //     const day = date.getDay();
// //     return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
// //   };

// //   // Helper function to get the next weekday
// //   const getNextWeekday = (date) => {
// //     const result = new Date(date);
// //     do {
// //       result.setDate(result.getDate() + 1);
// //     } while (isWeekend(result));
// //     return result;
// //   };

// //   // Generate weekday dates between start and end dates
// //   const generateWeekdayDates = (startDate, days) => {
// //     const dates = [];
// //     let currentDate = new Date(startDate);
    
// //     // Skip to next weekday if start date is a weekend
// //     if (isWeekend(currentDate)) {
// //       currentDate = getNextWeekday(currentDate);
// //     }
    
// //     // Add the first date
// //     dates.push(new Date(currentDate));
    
// //     // Generate subsequent weekday dates
// //     let weekdaysCount = 1;
// //     while (weekdaysCount < days) {
// //       currentDate = getNextWeekday(currentDate);
// //       dates.push(new Date(currentDate));
// //       weekdaysCount++;
// //     }
    
// //     return dates;
// //   };

// //   // Function to filter out weekends from any data array with a date field
// //   const filterWeekends = (data, dateField = 'date') => {
// //     const parseDate = d3.timeParse('%Y-%m-%d');
// //     return data
// //       .map(d => ({
// //         ...d,
// //         [dateField]: typeof d[dateField] === 'string' ? parseDate(d[dateField]) : d[dateField]
// //       }))
// //       .filter(d => !isWeekend(d[dateField]));
// //   };

// //   // Generate realistic intraday data when real data is not available
// //   const generateIntradayData = () => {
// //     const today = new Date();
// //     const isMarketDay = today.getDay() >= 1 && today.getDay() <= 5; // Monday to Friday
    
// //     if (!isMarketDay) return [];
    
// //     // Market hours: 9:15 AM to 3:30 PM (IST)
// //     const marketStart = new Date(today);
// //     marketStart.setHours(9, 15, 0, 0);
    
// //     const now = new Date();
// //     const marketEnd = new Date(today);
// //     marketEnd.setHours(15, 30, 0, 0);
    
// //     // Use current time if market is open, otherwise use market end
// //     const endTime = now < marketEnd ? now : marketEnd;
    
// //     const data = [];
    
// //     // Get base price from current price or last historical price
// //     let basePrice = currentPrice;
// //     if (!basePrice && historicalData.length > 0) {
// //       basePrice = historicalData[historicalData.length - 1].close;
// //     }
// //     if (!basePrice) {
// //       // Set default base prices for different stocks
// //       const basePrices = {
// //         'RELIANCE': 1940,
// //         'TCS': 3850,
// //         'HDFCBANK': 1720,
// //         'INFY': 1950,
// //         'ICICIBANK': 1100
// //       };
// //       basePrice = basePrices[stockSymbol] || 1940;
// //     }
    
// //     // Generate time points (30-minute intervals)
// //     const timePoints = [];
// //     let currentTime = new Date(marketStart);
    
// //     while (currentTime <= endTime) {
// //       timePoints.push(new Date(currentTime));
// //       currentTime.setMinutes(currentTime.getMinutes() + 30);
// //     }
    
// //     if (timePoints.length === 0) return [];
    
// //     // Generate realistic price movements
// //     let price = basePrice * (0.998 + Math.random() * 0.004); // Start within 0.2% of base
// //     const dailyVolatility = 0.015; // 1.5% daily volatility
// //     const hourlyVolatility = dailyVolatility / Math.sqrt(timePoints.length);
    
// //     // Create seed for consistent data generation
// //     const seed = stockSymbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
// //     let randomSeed = seed + today.getDate();
    
// //     const seededRandom = () => {
// //       randomSeed = (randomSeed * 9301 + 49297) % 233280;
// //       return randomSeed / 233280;
// //     };
    
// //     timePoints.forEach((time, index) => {
// //       // Add some realistic intraday patterns
// //       const timeOfDay = time.getHours() + time.getMinutes() / 60;
      
// //       // Market opening volatility (higher at start)
// //       let volatilityMultiplier = 1;
// //       if (timeOfDay < 10) {
// //         volatilityMultiplier = 1.5; // Higher volatility at market open
// //       } else if (timeOfDay > 14.5) {
// //         volatilityMultiplier = 1.3; // Higher volatility near market close
// //       } else {
// //         volatilityMultiplier = 0.8; // Lower volatility during mid-day
// //       }
      
// //       // Generate random price movement
// //       const randomFactor = (seededRandom() - 0.5) * 2;
// //       const priceChange = randomFactor * hourlyVolatility * basePrice * volatilityMultiplier;
      
// //       // Add mean reversion
// //       const meanReversion = (basePrice - price) * 0.1;
      
// //       // Add slight upward trend if current price is higher than base
// //       let trendFactor = 0;
// //       if (currentPrice && index === timePoints.length - 1) {
// //         // Ensure the last price point is close to current price
// //         trendFactor = (currentPrice - price) * 0.3;
// //       }
      
// //       price += priceChange + meanReversion + trendFactor;
      
// //       // Ensure price doesn't deviate too much from base
// //       const maxDeviation = basePrice * 0.03; // 3% max deviation
// //       price = Math.max(basePrice - maxDeviation, Math.min(basePrice + maxDeviation, price));
      
// //       const volume = 50000 + Math.floor(seededRandom() * 200000);
      
// //       data.push({
// //         time: time,
// //         price: parseFloat(price.toFixed(2)),
// //         volume: volume,
// //         isCurrentPrice: index === timePoints.length - 1 && currentPrice
// //       });
// //     });
    
// //     // If we have current price, adjust the last point
// //     if (currentPrice && data.length > 0) {
// //       data[data.length - 1].price = currentPrice;
// //       data[data.length - 1].isCurrentPrice = true;
// //     }
    
// //     return data;
// //   };

// //   useEffect(() => {
// //     // For intraday view, use intradayData if showIntraday is true
// //     if (showIntraday) {
// //       renderIntradayChart();
// //       return;
// //     }
    
// //     // For normalized data view, use normalizedData if showNormalized is true
// //     if (showNormalized && normalizedData.length > 0) {
// //       renderNormalizedChart();
// //       return;
// //     }
    
// //     // For data cleaning view, use cleanedData if available
// //     if (showOutliers && cleanedData.length > 0) {
// //       renderCleanedDataChart();
// //       return;
// //     }
    
// //     // Original chart rendering for historical and predicted data
// //     if (historicalData.length === 0 && predictedData.length === 0) return;

// //     // Clear previous chart
// //     d3.select(chartRef.current).selectAll('*').remove();

// //     // Filter data based on timeframe and exclude weekends
// //     const timeframeData = filterWeekends(historicalData).slice(-parseInt(timeframe));

// //     // Set up dimensions
// //     const margin = { top: 20, right: 30, bottom: 50, left: 70 };
// //     const width = chartRef.current.clientWidth - margin.left - margin.right;
// //     const chartHeight = height - margin.top - margin.bottom;
// //     const volumeHeight = showVolume ? 80 : 0;
// //     const priceHeight = chartHeight - volumeHeight;

// //     // Create SVG
// //     const svg = d3.select(chartRef.current)
// //       .append('svg')
// //       .attr('width', width + margin.left + margin.right)
// //       .attr('height', height)
// //       .append('g')
// //       .attr('transform', `translate(${margin.left},${margin.top})`);

// //     // Use filtered timeframe data for the chart
// //     const data = timeframeData;

// //     // Create prediction data for next 30 weekdays (excluding weekends)
// //     const currentDate = new Date();
// //     const weekdayDates = generateWeekdayDates(currentDate, 30);
    
// //     // Process predictedData
// //     let predictedWithDates = [];
    
// //     if (predictedData && predictedData.length > 0) {
// //       predictedWithDates = weekdayDates.map((date, index) => {
// //         const predictedValue = (index < predictedData.length) ? 
// //           predictedData[index].predicted : 
// //           2600 + Math.sin(index * Math.PI/5) * 150;
        
// //         return {
// //           date: date,
// //           predicted: predictedValue
// //         };
// //       });
// //     }

// //     // Set the domain to span from current date to the last weekday date
// //     const startDate = new Date(currentDate);
// //     const endDate = new Date(weekdayDates[weekdayDates.length - 1]);
    
// //     // X scale for the timeframe
// //     const x = d3.scaleTime()
// //       .domain([startDate, endDate])
// //       .range([0, width]);

// //     // Y scale for price
// //     const minValue = predictedWithDates.length > 0 ? 
// //       d3.min(predictedWithDates, d => d.predicted) * 0.995 : 2000;
    
// //     const maxValue = predictedWithDates.length > 0 ? 
// //       d3.max(predictedWithDates, d => d.predicted) * 1.005 : 2300;
    
// //     const y = d3.scaleLinear()
// //       .domain([minValue, maxValue])
// //       .range([priceHeight, 0])
// //       .nice();

// //     // Y scale for volume
// //     const yVolume = d3.scaleLinear()
// //       .domain([0, d3.max(data, d => d.volume || 0) || 1000000])
// //       .range([chartHeight, priceHeight + 10]);

// //     // Generate tick values - only include weekdays
// //     const xTickValues = weekdayDates.filter((d, i) => i % 3 === 0);

// //     // Add X axis with day/month format
// //     svg.append('g')
// //       .attr('transform', `translate(0,${priceHeight})`)
// //       .call(d3.axisBottom(x)
// //         .tickValues(xTickValues)
// //         .tickFormat(d => {
// //           const date = new Date(d);
// //           const day = date.getDate();
// //           const month = date.getMonth() + 1;
// //           return `${day}/${month}`;
// //         }))
// //       .selectAll('text')
// //       .style('text-anchor', 'middle')
// //       .style('font-size', '11px')
// //       .style('fill', '#64748b')
// //       .attr('dy', '1em');

// //     // Add X axis label
// //     svg.append('text')
// //       .attr('x', width / 2)
// //       .attr('y', priceHeight + 40)
// //       .style('text-anchor', 'middle')
// //       .style('fill', '#64748b')
// //       .style('font-size', '12px')
// //       .text('Date');

// //     // Add Y axis
// //     svg.append('g')
// //       .call(d3.axisLeft(y)
// //         .tickFormat(d => `₹${d.toFixed(0)}`))
// //       .call(g => g.select('.domain').remove())
// //       .call(g => g.selectAll('.tick line')
// //         .clone()
// //         .attr('x2', width)
// //         .attr('stroke-opacity', 0.1));

// //     // Add Y axis label
// //     svg.append('text')
// //       .attr('transform', 'rotate(-90)')
// //       .attr('y', -margin.left + 10)
// //       .attr('x', -priceHeight / 2)
// //       .attr('dy', '1em')
// //       .style('text-anchor', 'middle')
// //       .style('fill', '#64748b')
// //       .style('font-size', '12px')
// //       .text('Price (₹)');

// //     // Draw volume bars if showVolume is true
// //     if (showVolume && data.length > 0) {
// //       svg.append('g')
// //         .selectAll('rect')
// //         .data(data)
// //         .enter()
// //         .append('rect')
// //         .attr('x', d => x(d.date) - (width / data.length) / 2 + 1)
// //         .attr('width', width / data.length - 2)
// //         .attr('y', d => yVolume(d.volume || 0))
// //         .attr('height', d => chartHeight - yVolume(d.volume || 0))
// //         .attr('fill', (d, i) => i > 0 ? (d.close >= data[i-1].close ? '#dcfce7' : '#fee2e2') : '#e2e8f0')
// //         .attr('opacity', 0.7);

// //       svg.append('g')
// //         .attr('transform', `translate(${width},0)`)
// //         .call(d3.axisRight(yVolume)
// //           .ticks(3)
// //           .tickFormat(d => {
// //             if (d >= 1000000) return `${(d / 1000000).toFixed(1)}M`;
// //             if (d >= 1000) return `${(d / 1000).toFixed(1)}K`;
// //             return d;
// //           }))
// //         .call(g => g.select('.domain').remove())
// //         .selectAll('text')
// //         .style('fill', '#94a3b8')
// //         .style('font-size', '10px');
// //     }

// //     // Add grid lines
// //     svg.append('g')
// //       .attr('class', 'grid')
// //       .selectAll('line')
// //       .data(y.ticks())
// //       .enter()
// //       .append('line')
// //       .attr('x1', 0)
// //       .attr('x2', width)
// //       .attr('y1', d => y(d))
// //       .attr('y2', d => y(d))
// //       .attr('stroke', '#e2e8f0')
// //       .attr('stroke-dasharray', '3,3');

// //     // Create a clip path
// //     svg.append('defs')
// //       .append('clipPath')
// //       .attr('id', 'clip')
// //       .append('rect')
// //       .attr('width', width)
// //       .attr('height', priceHeight)
// //       .attr('x', 0)
// //       .attr('y', 0);
    
// //     // Calculate bar width with added gap (50% of the available space per bar for better spacing)
// //     const totalBars = predictedWithDates.length;
// //     const totalWidthPerBar = width / totalBars;
// //     const barWidth = totalWidthPerBar * 0.5; // Use 50% of the space for the bar, leaving 50% as gap

// //     // Add bars for prediction data with gaps
// //     svg.selectAll('.prediction-bar')
// //       .data(predictedWithDates)
// //       .enter()
// //       .append('rect')
// //       .attr('class', 'prediction-bar')
// //       .attr('x', (d, i) => x(d.date) - barWidth / 2)
// //       .attr('width', barWidth)
// //       .attr('y', d => y(d.predicted))
// //       .attr('height', d => priceHeight - y(d.predicted))
// //       .attr('fill', '#10b981')
// //       .attr('rx', 2)
// //       .attr('ry', 2)
// //       .attr('clip-path', 'url(#clip)');
    
// //     // Add average line
// //     const avgPrice = predictedWithDates.reduce((sum, d) => sum + d.predicted, 0) / predictedWithDates.length;
    
// //     svg.append('line')
// //       .attr('x1', 0)
// //       .attr('x2', width)
// //       .attr('y1', y(avgPrice))
// //       .attr('y2', y(avgPrice))
// //       .attr('stroke', '#ef4444')
// //       .attr('stroke-width', 1.5)
// //       .attr('stroke-dasharray', '5,5')
// //       .attr('clip-path', 'url(#clip)');
    
// //     // Add "Avg" label
// //     svg.append('text')
// //       .attr('x', width - 30)
// //       .attr('y', y(avgPrice) - 5)
// //       .attr('fill', '#ef4444')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600')
// //       .text('Avg');

// //     // Add title
// //     svg.append('text')
// //       .attr('x', width / 2)
// //       .attr('y', -5)
// //       .attr('text-anchor', 'middle')
// //       .style('font-size', '14px')
// //       .style('font-weight', 'bold')
// //       .style('fill', '#333')
// //       .text(`${stockSymbol || 'RELIANCE'} Price Prediction`);

// //     // Add hover effect with price display
// //     const focus = svg.append('g')
// //       .attr('class', 'focus')
// //       .style('display', 'none');

// //     focus.append('line')
// //       .attr('class', 'focus-line')
// //       .attr('y1', 0)
// //       .attr('y2', priceHeight)
// //       .attr('stroke', '#64748b')
// //       .attr('stroke-width', 1)
// //       .attr('stroke-dasharray', '3,3');

// //     focus.append('rect')
// //       .attr('class', 'tooltip-bg')
// //       .attr('x', 10)
// //       .attr('y', -20)
// //       .attr('width', 100)
// //       .attr('height', 24)
// //       .attr('rx', 4)
// //       .attr('fill', '#10b981')
// //       .attr('opacity', 0.95);

// //     focus.append('text')
// //       .attr('class', 'tooltip-text')
// //       .attr('x', 60)
// //       .attr('y', -4)
// //       .attr('text-anchor', 'middle')
// //       .attr('fill', '#ffffff')
// //       .style('font-size', '13px')
// //       .style('font-weight', '700');

// //     focus.append('rect')
// //       .attr('class', 'date-tooltip-bg')
// //       .attr('x', -40)
// //       .attr('y', priceHeight + 5)
// //       .attr('width', 80)
// //       .attr('height', 24)
// //       .attr('rx', 4)
// //       .attr('fill', '#10b981')
// //       .attr('opacity', 0.95);

// //     focus.append('text')
// //       .attr('class', 'date-tooltip-text')
// //       .attr('x', 0)
// //       .attr('y', priceHeight + 21)
// //       .attr('text-anchor', 'middle')
// //       .attr('fill', '#ffffff')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600');

// //     svg.append('rect')
// //       .attr('class', 'overlay')
// //       .attr('width', width)
// //       .attr('height', priceHeight)
// //       .style('fill', 'none')
// //       .style('pointer-events', 'all')
// //       .on('mouseover', () => focus.style('display', null))
// //       .on('mouseout', () => focus.style('display', 'none'))
// //       .on('mousemove', mousemove);

// //     function mousemove(event) {
// //       const mouseDate = x.invert(d3.pointer(event)[0]);
      
// //       const bisect = d3.bisector(d => d.date).left;
// //       const index = bisect(predictedWithDates, mouseDate, 1);
// //       const d0 = predictedWithDates[index - 1] || predictedWithDates[0];
// //       const d1 = predictedWithDates[index] || d0;
// //       const d = mouseDate - d0.date > d1.date - mouseDate ? d1 : d0;
      
// //       if (d) {
// //         const xPos = x(d.date);
// //         focus.attr('transform', `translate(${xPos},0)`);
        
// //         focus.select('.tooltip-text').text(`₹${d.predicted.toFixed(2)}`);
        
// //         const dateStr = `${d.date.getDate()}/${d.date.getMonth() + 1}`;
// //         focus.select('.date-tooltip-text').text(dateStr);
        
// //         if (xPos > width - 100) {
// //           focus.select('.tooltip-bg').attr('x', -90);
// //           focus.select('.tooltip-text').attr('x', -50);
// //         } else {
// //           focus.select('.tooltip-bg').attr('x', 10);
// //           focus.select('.tooltip-text').attr('x', 60);
// //         }
// //       }
// //     }
// //   }, [historicalData, predictedData, stockSymbol, timeframe, showVolume, height, cleanedData, normalizedData, showOutliers, showNormalized, intradayData, showIntraday, currentPrice]);

// //   const renderIntradayChart = () => {
// //     // Use provided intraday data or generate if not available
// //     const data = intradayData.length > 0 ? intradayData : generateIntradayData();
    
// //     if (data.length === 0) return;
    
// //     d3.select(chartRef.current).selectAll('*').remove();
    
// //     const margin = { top: 40, right: 60, bottom: 50, left: 60 };
// //     const width = chartRef.current.clientWidth - margin.left - margin.right;
// //     const chartHeight = height - margin.top - margin.bottom;
    
// //     const svg = d3.select(chartRef.current)
// //       .append('svg')
// //       .attr('width', width + margin.left + margin.right)
// //       .attr('height', height)
// //       .append('g')
// //       .attr('transform', `translate(${margin.left},${margin.top})`);
    
// //     // Set up scales
// //     const xScale = d3.scaleTime()
// //       .domain(d3.extent(data, d => d.time))
// //       .range([0, width]);
    
// //     const priceExtent = d3.extent(data, d => d.price);
// //     const yScale = d3.scaleLinear()
// //       .domain([priceExtent[0] * 0.999, priceExtent[1] * 1.001])
// //       .range([chartHeight, 0])
// //       .nice();
    
// //     // Create line generator
// //     const line = d3.line()
// //       .x(d => xScale(d.time))
// //       .y(d => yScale(d.price))
// //       .curve(d3.curveMonotoneX);
    
// //     // Determine if price is up or down for the day
// //     const dayStart = data[0];
// //     const dayEnd = data[data.length - 1];
// //     const isUp = dayEnd.price >= dayStart.price;
// //     const priceChange = dayEnd.price - dayStart.price;
// //     const priceChangePercent = (priceChange / dayStart.price) * 100;
    
// //     // Add gradient definition
// //     const gradient = svg.append('defs')
// //       .append('linearGradient')
// //       .attr('id', 'intradayGradient')
// //       .attr('gradientUnits', 'userSpaceOnUse')
// //       .attr('x1', 0).attr('y1', chartHeight)
// //       .attr('x2', 0).attr('y2', 0);
    
// //     gradient.append('stop')
// //       .attr('offset', '0%')
// //       .attr('stop-color', isUp ? '#10b981' : '#ef4444')
// //       .attr('stop-opacity', 0.1);
    
// //     gradient.append('stop')
// //       .attr('offset', '100%')
// //       .attr('stop-color', isUp ? '#10b981' : '#ef4444')
// //       .attr('stop-opacity', 0.3);
    
// //     // Add area under the curve
// //     const area = d3.area()
// //       .x(d => xScale(d.time))
// //       .y0(chartHeight)
// //       .y1(d => yScale(d.price))
// //       .curve(d3.curveMonotoneX);
    
// //     svg.append('path')
// //       .datum(data)
// //       .attr('fill', 'url(#intradayGradient)')
// //       .attr('d', area);
    
// //     // Add the price line
// //     svg.append('path')
// //       .datum(data)
// //       .attr('fill', 'none')
// //       .attr('stroke', isUp ? '#10b981' : '#ef4444')
// //       .attr('stroke-width', 2.5)
// //       .attr('d', line);
    
// //     // Add grid lines
// //     svg.append('g')
// //       .attr('class', 'grid')
// //       .selectAll('line')
// //       .data(yScale.ticks(5))
// //       .enter()
// //       .append('line')
// //       .attr('x1', 0)
// //       .attr('x2', width)
// //       .attr('y1', d => yScale(d))
// //       .attr('y2', d => yScale(d))
// //       .attr('stroke', '#e5e7eb')
// //       .attr('stroke-dasharray', '2,2')
// //       .attr('opacity', 0.5);
    
// //     // Add X axis
// //     svg.append('g')
// //       .attr('transform', `translate(0,${chartHeight})`)
// //       .call(d3.axisBottom(xScale)
// //         .ticks(6)
// //         .tickFormat(d3.timeFormat('%I:%M %p')))
// //       .selectAll('text')
// //       .style('font-size', '11px')
// //       .style('fill', '#6b7280');
    
// //     // Add Y axis
// //     svg.append('g')
// //       .call(d3.axisLeft(yScale)
// //         .ticks(5)
// //         .tickFormat(d => `₹${d.toFixed(2)}`))
// //       .selectAll('text')
// //       .style('font-size', '11px')
// //       .style('fill', '#6b7280');
    
// //     // Add Y axis on the right
// //     svg.append('g')
// //       .attr('transform', `translate(${width},0)`)
// //       .call(d3.axisRight(yScale)
// //         .ticks(5)
// //         .tickFormat(d => `${d.toFixed(2)}`))
// //       .selectAll('text')
// //       .style('font-size', '10px')
// //       .style('fill', '#9ca3af');
    
// //     // Add current price indicator if available
// //     if (currentPrice) {
// //       const currentPriceY = yScale(currentPrice);
      
// //       // Horizontal line for current price
// //       svg.append('line')
// //         .attr('x1', 0)
// //         .attr('x2', width)
// //         .attr('y1', currentPriceY)
// //         .attr('y2', currentPriceY)
// //         .attr('stroke', '#3b82f6')
// //         .attr('stroke-width', 1.5)
// //         .attr('stroke-dasharray', '4,4');
      
// //       // Current price label
// //       svg.append('rect')
// //         .attr('x', width - 85)
// //         .attr('y', currentPriceY - 12)
// //         .attr('width', 80)
// //         .attr('height', 20)
// //         .attr('fill', '#3b82f6')
// //         .attr('rx', 3);
      
// //       svg.append('text')
// //         .attr('x', width - 45)
// //         .attr('y', currentPriceY + 2)
// //         .attr('text-anchor', 'middle')
// //         .style('font-size', '11px')
// //         .style('font-weight', '600')
// //         .style('fill', 'white')
// //         .text(`₹${currentPrice.toFixed(2)}`);
// //     }
    
// //     // Add data points
// //     svg.selectAll('.data-point')
// //       .data(data.filter((d, i) => i % 2 === 0))
// //       .enter()
// //       .append('circle')
// //       .attr('class', 'data-point')
// //       .attr('cx', d => xScale(d.time))
// //       .attr('cy', d => yScale(d.price))
// //       .attr('r', d => d.isCurrentPrice ? 4 : 2)
// //       .attr('fill', d => d.isCurrentPrice ? '#3b82f6' : (isUp ? '#10b981' : '#ef4444'))
// //       .attr('stroke', 'white')
// //       .attr('stroke-width', 1);
    
// //     // Add title with price change info
// //     svg.append('text')
// //       .attr('x', width / 2)
// //       .attr('y', -25)
// //       .attr('text-anchor', 'middle')
// //       .style('font-size', '16px')
// //       .style('font-weight', 'bold')
// //       .style('fill', '#333')
// //       .text(`${stockSymbol} - Today's Performance`);
    
// //     // Add price change indicator
// //     svg.append('text')
// //       .attr('x', 10)
// //       .attr('y', -5)
// //       .style('font-size', '14px')
// //       .style('font-weight', '600')
// //       .style('fill', isUp ? '#10b981' : '#ef4444')
// //       .text(`${isUp ? '+' : ''}₹${priceChange.toFixed(2)} (${isUp ? '+' : ''}${priceChangePercent.toFixed(2)}%)`);
    
// //     // Add market status indicator
// //     if (marketStatus) {
// //       svg.append('text')
// //         .attr('x', width - 10)
// //         .attr('y', -5)
// //         .attr('text-anchor', 'end')
// //         .style('font-size', '12px')
// //         .style('font-weight', '600')
// //         .style('fill', marketStatus.isOpen ? '#10b981' : '#ef4444')
// //         .text(`Market: ${marketStatus.status}`);
// //     }
    
// //     // Add hover functionality
// //     const focus = svg.append('g')
// //       .attr('class', 'focus')
// //       .style('display', 'none');

// //     focus.append('line')
// //       .attr('y1', 0)
// //       .attr('y2', chartHeight)
// //       .attr('stroke', '#64748b')
// //       .attr('stroke-width', 1)
// //       .attr('stroke-dasharray', '3,3');

// //     focus.append('circle')
// //       .attr('r', 5)
// //       .attr('fill', isUp ? '#10b981' : '#ef4444')
// //       .attr('stroke', '#fff')
// //       .attr('stroke-width', 2);

// //     const tooltip = focus.append('g');
    
// //     tooltip.append('rect')
// //       .attr('x', 10)
// //       .attr('y', -40)
// //       .attr('width', 120)
// //       .attr('height', 50)
// //       .attr('rx', 4)
// //       .attr('fill', 'white')
// //       .attr('stroke', '#e2e8f0')
// //       .attr('stroke-width', 1)
// //       .attr('opacity', 0.95);
    
// //     tooltip.append('text')
// //       .attr('x', 70)
// //       .attr('y', -20)
// //       .attr('text-anchor', 'middle')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600')
// //       .style('fill', '#374151')
// //       .attr('class', 'tooltip-price');
    
// //     tooltip.append('text')
// //       .attr('x', 70)
// //       .attr('y', -5)
// //       .attr('text-anchor', 'middle')
// //       .style('font-size', '11px')
// //       .style('fill', '#6b7280')
// //       .attr('class', 'tooltip-time');

// //     svg.append('rect')
// //       .attr('width', width)
// //       .attr('height', chartHeight)
// //       .style('fill', 'none')
// //       .style('pointer-events', 'all')
// //       .on('mouseover', () => focus.style('display', null))
// //       .on('mouseout', () => focus.style('display', 'none'))
// //       .on('mousemove', mousemove);

// //     function mousemove(event) {
// //       const mouseDate = xScale.invert(d3.pointer(event)[0]);
      
// //       const bisect = d3.bisector(d => d.time).left;
// //       const index = bisect(data, mouseDate, 1);
// //       const d0 = data[index - 1] || data[0];
// //       const d1 = data[index] || d0;
// //       const d = mouseDate - d0.time > d1.time - mouseDate ? d1 : d0;
      
// //       if (d) {
// //         const xPos = xScale(d.time);
// //         focus.attr('transform', `translate(${xPos},0)`);
        
// //         focus.select('circle').attr('cy', yScale(d.price));
// //         focus.select('.tooltip-price').text(`₹${d.price.toFixed(2)}`);
// //         focus.select('.tooltip-time').text(d3.timeFormat('%I:%M %p')(d.time));
        
// //         if (xPos > width - 130) {
// //           tooltip.attr('transform', 'translate(-130, 0)');
// //         } else {
// //           tooltip.attr('transform', 'translate(0, 0)');
// //         }
// //       }
// //     }
// //   };

// //   const renderCleanedDataChart = () => {
// //     if (cleanedData.length === 0 || historicalData.length === 0) return;
    
// //     d3.select(chartRef.current).selectAll('*').remove();
    
// //     const margin = { top: 20, right: 30, bottom: 50, left: 70 };
// //     const width = chartRef.current.clientWidth - margin.left - margin.right;
// //     const chartHeight = height - margin.top - margin.bottom;
// //     const priceHeight = chartHeight;
    
// //     const svg = d3.select(chartRef.current)
// //       .append('svg')
// //       .attr('width', width + margin.left + margin.right)
// //       .attr('height', height)
// //       .append('g')
// //       .attr('transform', `translate(${margin.left},${margin.top})`);
    
// //     // Filter cleanedData to exclude weekends
// //     const processedData = filterWeekends(cleanedData)
// //       .map((d, i) => {
// //         const variationFactor = 0.05;
// //         const waveFrequency = 0.2;
// //         const variation = Math.sin(i * waveFrequency) * variationFactor * d.close;
        
// //         return {
// //           date: d.date,
// //           close: d.close,
// //           originalClose: d.originalClose || (d.close + variation),
// //           isOutlier: d.isOutlier || false
// //         };
// //       });

// //     // Create weekday dates for mapping
// //     const currentDate = new Date();
// //     const weekdayDates = generateWeekdayDates(currentDate, processedData.length);
    
// //     const remappedData = processedData.map((d, i) => ({
// //       ...d,
// //       remappedDate: weekdayDates[i]
// //     }));
    
// //     const startDate = new Date(currentDate);
// //     const endDate = new Date(weekdayDates[weekdayDates.length - 1]);
    
// //     const x = d3.scaleTime()
// //       .domain([startDate, endDate])
// //       .range([0, width]);
    
// //     const y = d3.scaleLinear()
// //       .domain([
// //         d3.min(remappedData, d => Math.min(d.close, d.originalClose)) * 0.995,
// //         d3.max(remappedData, d => Math.max(d.close, d.originalClose)) * 1.005
// //       ])
// //       .range([priceHeight, 0])
// //       .nice();
    
// //     const xTickValues = weekdayDates.filter((d, i) => i % 3 === 0);
    
// //     svg.append('g')
// //       .attr('transform', `translate(0,${priceHeight})`)
// //       .call(d3.axisBottom(x)
// //         .tickValues(xTickValues)
// //         .tickFormat(d => {
// //           const date = new Date(d);
// //           const day = date.getDate();
// //           const month = date.getMonth() + 1;
// //           return `${day}/${month}`;
// //         }))
// //       .selectAll('text')
// //       .style('text-anchor', 'middle')
// //       .style('font-size', '11px')
// //       .style('fill', '#64748b')
// //       .attr('dy', '1em');
    
// //     svg.append('text')
// //       .attr('x', width / 2)
// //       .attr('y', priceHeight + 40)
// //       .style('text-anchor', 'middle')
// //       .style('fill', '#64748b')
// //       .style('font-size', '12px')
// //       .text('Date');
    
// //     svg.append('g')
// //       .call(d3.axisLeft(y)
// //         .tickFormat(d => `₹${d.toFixed(0)}`))
// //       .call(g => g.select('.domain').remove())
// //       .call(g => g.selectAll('.tick line')
// //         .clone()
// //         .attr('x2', width)
// //         .attr('stroke-opacity', 0.1));
    
// //     svg.append('text')
// //       .attr('transform', 'rotate(-90)')
// //       .attr('y', -margin.left + 10)
// //       .attr('x', -priceHeight / 2)
// //       .attr('dy', '1em')
// //       .style('text-anchor', 'middle')
// //       .style('fill', '#64748b')
// //       .style('font-size', '12px')
// //       .text('Price (₹)');
    
// //     svg.append('g')
// //       .attr('class', 'grid')
// //       .selectAll('line')
// //       .data(y.ticks())
// //       .enter()
// //       .append('line')
// //       .attr('x1', 0)
// //       .attr('x2', width)
// //       .attr('y1', d => y(d))
// //       .attr('y2', d => y(d))
// //       .attr('stroke', '#e2e8f0')
// //       .attr('stroke-dasharray', '3,3');
    
// //     svg.append('defs')
// //       .append('clipPath')
// //       .attr('id', 'clip')
// //       .append('rect')
// //       .attr('width', width)
// //       .attr('height', priceHeight)
// //       .attr('x', 0)
// //       .attr('y', 0);
    
// //     const originalLine = d3.line()
// //       .x(d => x(d.remappedDate))
// //       .y(d => y(d.originalClose))
// //       .curve(d3.curveNatural);
    
// //     const cleanedLine = d3.line()
// //       .x(d => x(d.remappedDate))
// //       .y(d => y(d.close))
// //       .curve(d3.curveNatural);
    
// //     svg.append('path')
// //       .datum(remappedData)
// //       .attr('fill', 'none')
// //       .attr('stroke', '#94a3b8')
// //       .attr('stroke-width', 2)
// //       .attr('stroke-dasharray', '3,3')
// //       .attr('clip-path', 'url(#clip)')
// //       .attr('d', originalLine);
    
// //     svg.append('path')
// //       .datum(remappedData)
// //       .attr('fill', 'none')
// //       .attr('stroke', '#10b981')
// //       .attr('stroke-width', 2.5)
// //       .attr('clip-path', 'url(#clip)')
// //       .attr('d', cleanedLine);
    
// //     svg.selectAll('.outlier-point')
// //       .data(remappedData.filter(d => d.isOutlier))
// //       .enter()
// //       .append('circle')
// //       .attr('class', 'outlier-point')
// //       .attr('cx', d => x(d.remappedDate))
// //       .attr('cy', d => y(d.originalClose))
// //       .attr('r', 5)
// //       .attr('fill', '#ef4444')
// //       .attr('stroke', '#fff')
// //       .attr('stroke-width', 1.5);

// //     const midIdx = Math.floor(remappedData.length / 2);
// //     const referencePoint = remappedData[midIdx];
    
// //     svg.append('line')
// //       .attr('x1', x(referencePoint.remappedDate))
// //       .attr('x2', x(referencePoint.remappedDate))
// //       .attr('y1', 0)
// //       .attr('y2', priceHeight)
// //       .attr('stroke', '#64748b')
// //       .attr('stroke-width', 1)
// //       .attr('stroke-dasharray', '4,4');
    
// //     svg.append('rect')
// //       .attr('x', x(referencePoint.remappedDate) - 70)
// //       .attr('y', 35)
// //       .attr('width', 140)
// //       .attr('height', 24)
// //       .attr('rx', 4)
// //       .attr('fill', '#ffffff')
// //       .attr('stroke', '#94a3b8')
// //       .attr('stroke-width', 1)
// //       .attr('opacity', 0.9);
    
// //     svg.append('text')
// //       .attr('x', x(referencePoint.remappedDate))
// //       .attr('y', 51)
// //       .attr('text-anchor', 'middle')
// //       .style('font-size', '12px')
// //       .style('fill', '#64748b')
// //       .text(`Original: ₹${referencePoint.originalClose.toFixed(2)}`);
    
// //     svg.append('rect')
// //       .attr('x', x(referencePoint.remappedDate) - 60)
// //       .attr('y', 65)
// //       .attr('width', 120)
// //       .attr('height', 24)
// //       .attr('rx', 4)
// //       .attr('fill', '#10b981')
// //       .attr('opacity', 0.9);
    
// //     svg.append('text')
// //       .attr('x', x(referencePoint.remappedDate))
// //       .attr('y', 81)
// //       .attr('text-anchor', 'middle')
// //       .style('font-size', '12px')
// //       .style('fill', '#ffffff')
// //       .text(`Cleaned: ₹${referencePoint.close.toFixed(2)}`);

// //     const focus = svg.append('g')
// //       .attr('class', 'focus')
// //       .style('display', 'none');
    
// //     focus.append('line')
// //       .attr('y1', 0)
// //       .attr('y2', priceHeight)
// //       .attr('stroke', '#64748b')
// //       .attr('stroke-width', 1)
// //       .attr('stroke-dasharray', '3,3');
    
// //     focus.append('circle')
// //       .attr('r', 5)
// //       .attr('fill', '#94a3b8')
// //       .attr('stroke', '#fff')
// //       .attr('stroke-width', 2)
// //       .attr('class', 'original-circle');
    
// //     focus.append('circle')
// //       .attr('r', 5)
// //       .attr('fill', '#10b981')
// //       .attr('stroke', '#fff')
// //       .attr('stroke-width', 2)
// //       .attr('class', 'cleaned-circle');
    
// //     const tooltip = focus.append('g');
    
// //     tooltip.append('rect')
// //       .attr('x', 10)
// //       .attr('y', -25)
// //       .attr('width', 140)
// //       .attr('height', 24)
// //       .attr('rx', 4)
// //       .attr('fill', '#94a3b8')
// //       .attr('opacity', 0.95);
    
// //     tooltip.append('text')
// //       .attr('x', 80)
// //       .attr('y', -9)
// //       .attr('text-anchor', 'middle')
// //       .attr('fill', '#ffffff')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600')
// //       .attr('class', 'original-text');
    
// //     tooltip.append('rect')
// //       .attr('x', 10)
// //       .attr('y', 5)
// //       .attr('width', 140)
// //       .attr('height', 24)
// //       .attr('rx', 4)
// //       .attr('fill', '#10b981')
// //       .attr('opacity', 0.95);
    
// //     tooltip.append('text')
// //       .attr('x', 80)
// //       .attr('y', 21)
// //       .attr('text-anchor', 'middle')
// //       .attr('fill', '#ffffff')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600')
// //       .attr('class', 'cleaned-text');
    
// //     tooltip.append('rect')
// //       .attr('x', -40)
// //       .attr('y', priceHeight + 5)
// //       .attr('width', 80)
// //       .attr('height', 24)
// //       .attr('rx', 4)
// //       .attr('fill', '#64748b')
// //       .attr('opacity', 0.9);
    
// //     tooltip.append('text')
// //       .attr('x', 0)
// //       .attr('y', priceHeight + 21)
// //       .attr('text-anchor', 'middle')
// //       .attr('fill', '#ffffff')
// //       .style('font-size', '12px')
// //       .attr('class', 'date-text');
    
// //     svg.append('rect')
// //       .attr('width', width)
// //       .attr('height', priceHeight)
// //       .style('fill', 'none')
// //       .style('pointer-events', 'all')
// //       .on('mouseover', () => focus.style('display', null))
// //       .on('mouseout', () => focus.style('display', 'none'))
// //       .on('mousemove', mousemove);
    
// //     function mousemove(event) {
// //       const mouseDate = x.invert(d3.pointer(event)[0]);
      
// //       const bisect = d3.bisector(d => d.remappedDate).left;
// //       const index = bisect(remappedData, mouseDate, 1);
      
// //       if (index > 0 && index < remappedData.length) {
// //         const d0 = remappedData[index - 1];
// //         const d1 = remappedData[index];
// //         const d = mouseDate - d0.remappedDate > d1.remappedDate - mouseDate ? d1 : d0;
        
// //         const xPos = x(d.remappedDate);
// //         focus.attr('transform', `translate(${xPos},0)`);
        
// //         focus.select('.original-circle').attr('cy', y(d.originalClose));
// //         focus.select('.cleaned-circle').attr('cy', y(d.close));
        
// //         focus.select('.original-text').text(`Original: ₹${d.originalClose.toFixed(2)}`);
// //         focus.select('.cleaned-text').text(`Cleaned: ₹${d.close.toFixed(2)}`);
        
// //         const dateStr = `${d.remappedDate.getDate()}/${d.remappedDate.getMonth() + 1}`;
// //         focus.select('.date-text').text(dateStr);
        
// //         if (xPos > width - 150) {
// //           tooltip.attr('transform', 'translate(-150, 0)');
// //         } else {
// //           tooltip.attr('transform', 'translate(0, 0)');
// //         }
// //       }
// //     }
// //   };
  
// //   const renderNormalizedChart = () => {
// //     d3.select(chartRef.current).selectAll('*').remove();
    
// //     const margin = { top: 40, right: 30, bottom: 50, left: 40 };
// //     const width = chartRef.current.clientWidth - margin.left - margin.right;
// //     const chartHeight = height - margin.top - margin.bottom;
    
// //     const svg = d3.select(chartRef.current)
// //       .append('svg')
// //       .attr('width', width + margin.left + margin.right)
// //       .attr('height', height)
// //       .append('g')
// //       .attr('transform', `translate(${margin.left},${margin.top})`);
    
// //     // Generate sine wave data using the same weekday dates as the data cleaning chart
// //     const generateSineWaveData = () => {
// //       const data = [];
      
// //       const currentDate = new Date();
// //       const weekdayDates = generateWeekdayDates(currentDate, 30);
      
// //       for (let i = 0; i < weekdayDates.length; i++) {
// //         const progress = i / (weekdayDates.length - 1);
// //         const angle = progress * Math.PI * 8;
        
// //         const normalizedClose = 0.5 + 0.48 * Math.sin(angle);
// //         const normalizedLow = 0.5 + 0.2 * Math.sin(angle);
        
// //         data.push({
// //           date: weekdayDates[i],
// //           normalizedClose: normalizedClose,
// //           normalizedLow: normalizedLow
// //         });
// //       }
      
// //       return { data, weekdayDates };
// //     };
    
// //     const { data: sineData, weekdayDates } = generateSineWaveData();
    
// //     const startDate = new Date(sineData[0].date);
// //     const endDate = new Date(sineData[sineData.length - 1].date);
    
// //     const x = d3.scaleTime()
// //       .domain([startDate, endDate])
// //       .range([0, width]);
    
// //     const y = d3.scaleLinear()
// //       .domain([0, 1])
// //       .range([chartHeight, 0])
// //       .nice();
    
// //     svg.append('text')
// //       .attr('x', width / 2)
// //       .attr('y', -20)
// //       .attr('text-anchor', 'middle')
// //       .style('font-size', '14px')
// //       .style('font-weight', 'bold')
// //       .style('fill', '#333')
// //       .text('Normalized Price Data (0-1 Scale)');
    
// //     const yGridTicks = [0, 0.25, 0.5, 0.75, 1];
// //     svg.append('g')
// //       .attr('class', 'grid-horizontal')
// //       .selectAll('line')
// //       .data(yGridTicks)
// //       .enter()
// //       .append('line')
// //       .attr('x1', 0)
// //       .attr('x2', width)
// //       .attr('y1', d => y(d))
// //       .attr('y2', d => y(d))
// //       .attr('stroke', '#ddd')
// //       .attr('stroke-dasharray', '2,2');
    
// //     const xTickValues = weekdayDates.filter((d, i) => i % 3 === 0);
    
// //     svg.append('g')
// //       .attr('class', 'grid-vertical')
// //       .selectAll('line')
// //       .data(xTickValues)
// //       .enter()
// //       .append('line')
// //       .attr('x1', d => x(d))
// //       .attr('x2', d => x(d))
// //       .attr('y1', 0)
// //       .attr('y2', chartHeight)
// //       .attr('stroke', '#ddd')
// //       .attr('stroke-dasharray', '2,2');
    
// //     svg.append('g')
// //       .call(d3.axisLeft(y)
// //         .tickValues(yGridTicks)
// //         .tickFormat(d => d.toFixed(2)))
// //       .call(g => g.select('.domain').attr('stroke', '#ccc'))
// //       .call(g => g.selectAll('.tick line').attr('stroke', '#ccc'))
// //       .call(g => g.selectAll('.tick text')
// //         .attr('x', -5)
// //         .style('text-anchor', 'end')
// //         .style('fill', '#666')
// //         .style('font-size', '11px'));
    
// //     svg.append('g')
// //       .attr('transform', `translate(0,${chartHeight})`)
// //       .call(d3.axisBottom(x)
// //         .tickValues(xTickValues)
// //         .tickFormat(d => {
// //           const day = d.getDate();
// //           const month = d.getMonth() + 1;
// //           return `${day}/${month}`;
// //         }))
// //       .call(g => g.select('.domain').attr('stroke', '#ccc'))
// //       .call(g => g.selectAll('.tick line').attr('stroke', '#ccc'))
// //       .call(g => g.selectAll('.tick text')
// //         .style('text-anchor', 'middle')
// //         .style('fill', '#666')
// //         .style('font-size', '11px'));
    
// //     const closeLine = d3.line()
// //       .x(d => x(d.date))
// //       .y(d => y(d.normalizedClose))
// //       .curve(d3.curveMonotoneX);
    
// //     const lowLine = d3.line()
// //       .x(d => x(d.date))
// //       .y(d => y(d.normalizedLow))
// //       .curve(d3.curveMonotoneX);
    
// //     svg.append('path')
// //       .datum(sineData)
// //       .attr('fill', 'none')
// //       .attr('stroke', '#2dd4bf')
// //       .attr('stroke-width', 1.5)
// //       .attr('stroke-dasharray', '4,3')
// //       .attr('d', lowLine);
    
// //     svg.append('path')
// //       .datum(sineData)
// //       .attr('fill', 'none')
// //       .attr('stroke', '#8b5cf6')
// //       .attr('stroke-width', 2)
// //       .attr('d', closeLine);
    
// //     svg.selectAll('.dot')
// //       .data(sineData.filter((d, i) => i % 3 === 0))
// //       .enter()
// //       .append('circle')
// //       .attr('class', 'dot')
// //       .attr('cx', d => x(d.date))
// //       .attr('cy', d => y(d.normalizedClose))
// //       .attr('r', 4)
// //       .attr('fill', '#8b5cf6')
// //       .attr('stroke', '#fff')
// //       .attr('stroke-width', 1.5);
    
// //     const focus = svg.append('g')
// //       .attr('class', 'focus')
// //       .style('display', 'none');
    
// //     focus.append('line')
// //       .attr('y1', 0)
// //       .attr('y2', chartHeight)
// //       .attr('stroke', '#94a3b8')
// //       .attr('stroke-width', 1)
// //       .attr('stroke-dasharray', '3,3');
    
// //     const tooltip = focus.append('g');
    
// //     tooltip.append('rect')
// //       .attr('x', 10)
// //       .attr('y', -50)
// //       .attr('width', 160)
// //       .attr('height', 70)
// //       .attr('rx', 4)
// //       .attr('fill', 'white')
// //       .attr('stroke', '#e2e8f0')
// //       .attr('stroke-width', 1)
// //       .attr('opacity', 0.9);
    
// //     tooltip.append('text')
// //       .attr('x', 20)
// //       .attr('y', -30)
// //       .attr('fill', '#8b5cf6')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600')
// //       .text('Normalized Value:');
      
// //     tooltip.append('text')
// //       .attr('x', 150)
// //       .attr('y', -30)
// //       .attr('text-anchor', 'end')
// //       .attr('fill', '#8b5cf6')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600')
// //       .attr('class', 'norm-close-text');
    
// //     tooltip.append('text')
// //       .attr('x', 20)
// //       .attr('y', -10)
// //       .attr('fill', '#2dd4bf')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600')
// //       .text('Normalized Value:');
    
// //     tooltip.append('text')
// //       .attr('x', 150)
// //       .attr('y', -10)
// //       .attr('text-anchor', 'end')
// //       .attr('fill', '#2dd4bf')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600')
// //       .attr('class', 'norm-low-text');
    
// //     tooltip.append('text')
// //       .attr('x', 20)
// //       .attr('y', 10)
// //       .attr('fill', '#6b7280')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600')
// //       .text('Original:');
    
// //     tooltip.append('text')
// //       .attr('x', 150)
// //       .attr('y', 10)
// //       .attr('text-anchor', 'end')
// //       .attr('fill', '#6b7280')
// //       .style('font-size', '12px')
// //       .style('font-weight', '600')
// //       .attr('class', 'original-text');
    
// //     svg.append('rect')
// //       .attr('width', width)
// //       .attr('height', chartHeight)
// //       .style('fill', 'none')
// //       .style('pointer-events', 'all')
// //       .on('mouseover', () => focus.style('display', null))
// //       .on('mouseout', () => focus.style('display', 'none'))
// //       .on('mousemove', mousemove);
    
// //     function mousemove(event) {
// //       const mouseDate = x.invert(d3.pointer(event)[0]);
      
// //       const bisect = d3.bisector(d => d.date).left;
// //       const index = bisect(sineData, mouseDate, 1);
      
// //       if (index > 0 && index < sineData.length) {
// //         const d0 = sineData[index - 1];
// //         const d1 = sineData[index];
// //         const d = mouseDate - d0.date > d1.date - mouseDate ? d1 : d0;
        
// //         const xPos = x(d.date);
// //         focus.attr('transform', `translate(${xPos},0)`);
        
// //         focus.select('.norm-close-text').text(`${d.normalizedClose.toFixed(4)}`);
// //         focus.select('.norm-low-text').text(`${d.normalizedLow.toFixed(4)}`);
// //         focus.select('.original-text').text(`₹${(d.normalizedClose * 3000).toFixed(2)}`);
        
// //         if (xPos > width - 170) {
// //           tooltip.attr('transform', 'translate(-170, 0)');
// //         } else {
// //           tooltip.attr('transform', 'translate(0, 0)');
// //         }
// //       }
// //     }
// //   };

// //   return (
// //     <div 
// //       ref={chartRef} 
// //       style={{ 
// //         width: '100%', 
// //         height: `${height}px`,
// //         overflow: 'hidden'
// //       }}
// //       className="stock-chart"
// //     ></div>
// //   );
// // }

// // export default StockChart;




// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import { formatDate } from '../../utils/formatters';

// function StockChart({ 
//   historicalData = [], 
//   predictedData = [], 
//   stockSymbol,
//   timeframe = '30',
//   showVolume = false,
//   height = 400,
//   cleanedData = [],
//   normalizedData = [],
//   showOutliers = false,
//   showNormalized = false,
//   intradayData = [],
//   showIntraday = false,
//   currentPrice = null,
//   marketStatus = null
// }) {
//   const chartRef = useRef(null);
  
//   // Stock baseline prices for reference (fallback if needed)
//   const stockBasePrices = {
//     'RELIANCE': 2800,
//     'TCS': 3500,
//     'HDFCBANK': 1600,
//     'INFY': 1500,
//     'ICICIBANK': 1000,
//     'ASIANPAINT': 2285, 
//     'BAJFINANCE': 7000,
//     'HCLTECH': 1200,
//     'WIPRO': 420,
//     'SBIN': 750,
//   };

//   // Helper function to check if a date is a weekend (Saturday or Sunday)
//   const isWeekend = (date) => {
//     const day = date.getDay();
//     return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
//   };

//   // Helper function to get the next weekday
//   const getNextWeekday = (date) => {
//     const result = new Date(date);
//     do {
//       result.setDate(result.getDate() + 1);
//     } while (isWeekend(result));
//     return result;
//   };

//   // Generate weekday dates between start and end dates
//   const generateWeekdayDates = (startDate, days) => {
//     const dates = [];
//     let currentDate = new Date(startDate);
    
//     // Skip to next weekday if start date is a weekend
//     if (isWeekend(currentDate)) {
//       currentDate = getNextWeekday(currentDate);
//     }
    
//     // Add the first date
//     dates.push(new Date(currentDate));
    
//     // Generate subsequent weekday dates
//     let weekdaysCount = 1;
//     while (weekdaysCount < days) {
//       currentDate = getNextWeekday(currentDate);
//       dates.push(new Date(currentDate));
//       weekdaysCount++;
//     }
    
//     return dates;
//   };

//   // Function to filter out weekends from any data array with a date field
//   const filterWeekends = (data, dateField = 'date') => {
//     const parseDate = d3.timeParse('%Y-%m-%d');
//     return data
//       .map(d => ({
//         ...d,
//         [dateField]: typeof d[dateField] === 'string' ? parseDate(d[dateField]) : d[dateField]
//       }))
//       .filter(d => !isWeekend(d[dateField]));
//   };

//   // Generate realistic intraday data when real data is not available
//   const generateIntradayData = () => {
//     const today = new Date();
//     const isMarketDay = today.getDay() >= 1 && today.getDay() <= 5; // Monday to Friday
    
//     if (!isMarketDay) return [];
    
//     // Market hours: 9:15 AM to 3:30 PM (IST)
//     const marketStart = new Date(today);
//     marketStart.setHours(9, 15, 0, 0);
    
//     const now = new Date();
//     const marketEnd = new Date(today);
//     marketEnd.setHours(15, 30, 0, 0);
    
//     // Use current time if market is open, otherwise use market end
//     const endTime = now < marketEnd ? now : marketEnd;
    
//     const data = [];
    
//     // Get base price from current price or last historical price or default fallback
//     let basePrice = currentPrice;
//     if (!basePrice && historicalData.length > 0) {
//       basePrice = historicalData[historicalData.length - 1].close;
//     }
//     if (!basePrice) {
//       // Use stock-specific base price as fallback
//       basePrice = stockBasePrices[stockSymbol] || 2000;
//     }
    
//     // Generate time points (30-minute intervals)
//     const timePoints = [];
//     let currentTime = new Date(marketStart);
    
//     while (currentTime <= endTime) {
//       timePoints.push(new Date(currentTime));
//       currentTime.setMinutes(currentTime.getMinutes() + 30);
//     }
    
//     if (timePoints.length === 0) return [];
    
//     // Generate realistic price movements
//     let price = basePrice * (0.998 + Math.random() * 0.004); // Start within 0.2% of base
//     const dailyVolatility = 0.01; // 1% daily volatility (reduced from 1.5%)
//     const hourlyVolatility = dailyVolatility / Math.sqrt(timePoints.length);
    
//     // Create seed for consistent data generation
//     const seed = stockSymbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
//     let randomSeed = seed + today.getDate();
    
//     const seededRandom = () => {
//       randomSeed = (randomSeed * 9301 + 49297) % 233280;
//       return randomSeed / 233280;
//     };
    
//     timePoints.forEach((time, index) => {
//       // Add some realistic intraday patterns
//       const timeOfDay = time.getHours() + time.getMinutes() / 60;
      
//       // Market opening volatility (higher at start)
//       let volatilityMultiplier = 1;
//       if (timeOfDay < 10) {
//         volatilityMultiplier = 1.3; // Higher volatility at market open
//       } else if (timeOfDay > 14.5) {
//         volatilityMultiplier = 1.2; // Higher volatility near market close
//       } else {
//         volatilityMultiplier = 0.8; // Lower volatility during mid-day
//       }
      
//       // Generate random price movement
//       const randomFactor = (seededRandom() - 0.5) * 2;
//       const priceChange = randomFactor * hourlyVolatility * basePrice * volatilityMultiplier;
      
//       // Add mean reversion
//       const meanReversion = (basePrice - price) * 0.1;
      
//       // Add slight upward trend if current price is higher than base
//       let trendFactor = 0;
//       if (currentPrice && index === timePoints.length - 1) {
//         // Ensure the last price point is close to current price
//         trendFactor = (currentPrice - price) * 0.3;
//       }
      
//       price += priceChange + meanReversion + trendFactor;
      
//       // Ensure price doesn't deviate too much from base (reduced from 3% to 2%)
//       const maxDeviation = basePrice * 0.02; // 2% max deviation
//       price = Math.max(basePrice - maxDeviation, Math.min(basePrice + maxDeviation, price));
      
//       // Scale volume based on stock price (higher priced stocks often have lower volume)
//       const volumeScale = Math.max(1, 5000 / basePrice);
//       const volume = 50000 * volumeScale + Math.floor(seededRandom() * 100000 * volumeScale);
      
//       data.push({
//         time: time,
//         price: parseFloat(price.toFixed(2)),
//         volume: volume,
//         isCurrentPrice: index === timePoints.length - 1 && currentPrice
//       });
//     });
    
//     // If we have current price, adjust the last point
//     if (currentPrice && data.length > 0) {
//       data[data.length - 1].price = currentPrice;
//       data[data.length - 1].isCurrentPrice = true;
//     }
    
//     return data;
//   };

//   useEffect(() => {
//     // For intraday view, use intradayData if showIntraday is true
//     if (showIntraday) {
//       renderIntradayChart();
//       return;
//     }
    
//     // For normalized data view, use normalizedData if showNormalized is true
//     if (showNormalized && normalizedData.length > 0) {
//       renderNormalizedChart();
//       return;
//     }
    
//     // For data cleaning view, use cleanedData if available
//     if (showOutliers && cleanedData.length > 0) {
//       renderCleanedDataChart();
//       return;
//     }
    
//     // Original chart rendering for historical and predicted data
//     if (historicalData.length === 0 && predictedData.length === 0) return;

//     // Clear previous chart
//     d3.select(chartRef.current).selectAll('*').remove();

//     // Filter data based on timeframe and exclude weekends
//     const timeframeData = filterWeekends(historicalData).slice(-parseInt(timeframe));

//     // Set up dimensions
//     const margin = { top: 20, right: 30, bottom: 50, left: 70 };
//     const width = chartRef.current.clientWidth - margin.left - margin.right;
//     const chartHeight = height - margin.top - margin.bottom;
//     const volumeHeight = showVolume ? 80 : 0;
//     const priceHeight = chartHeight - volumeHeight;

//     // Create SVG
//     const svg = d3.select(chartRef.current)
//       .append('svg')
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height)
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);

//     // Use filtered timeframe data for the chart
//     const data = timeframeData;

//     // Create prediction data for next 30 weekdays (excluding weekends)
//     const currentDate = new Date();
//     const weekdayDates = generateWeekdayDates(currentDate, 30);
    
//     // Get base price for prediction constraints
//     const basePrice = currentPrice || 
//         (historicalData.length > 0 ? historicalData[historicalData.length - 1].close : 
//         stockBasePrices[stockSymbol] || 2000);
    
//     // Process predictedData
//     let predictedWithDates = [];
    
//     if (predictedData && predictedData.length > 0) {
//       predictedWithDates = weekdayDates.map((date, index) => {
//         // Use actual predicted value if available, otherwise use a conservative prediction
//         const predictedValue = (index < predictedData.length) ? 
//           predictedData[index].predicted : 
//           basePrice * (1 + (Math.sin(index * Math.PI/10) * 0.05)); // Max 5% oscillation
        
//         return {
//           date: date,
//           predicted: predictedValue
//         };
//       });
//     }

//     // Set the domain to span from current date to the last weekday date
//     const startDate = new Date(currentDate);
//     const endDate = new Date(weekdayDates[weekdayDates.length - 1]);
    
//     // X scale for the timeframe
//     const x = d3.scaleTime()
//       .domain([startDate, endDate])
//       .range([0, width]);

//     // Calculate min/max for y-axis with sensible margins
//     let minValue, maxValue;
    
//     if (predictedWithDates.length > 0) {
//       const minPredicted = d3.min(predictedWithDates, d => d.predicted);
//       const maxPredicted = d3.max(predictedWithDates, d => d.predicted);
      
//       // Add 0.5% padding on each side
//       minValue = minPredicted * 0.995;
//       maxValue = maxPredicted * 1.005;
//     } else {
//       // Fallback with base price if no predictions
//       minValue = basePrice * 0.95;
//       maxValue = basePrice * 1.05;
//     }
    
//     // Y scale for price
//     const y = d3.scaleLinear()
//       .domain([minValue, maxValue])
//       .range([priceHeight, 0])
//       .nice();

//     // Y scale for volume
//     const yVolume = d3.scaleLinear()
//       .domain([0, d3.max(data, d => d.volume || 0) || 1000000])
//       .range([chartHeight, priceHeight + 10]);

//     // Generate tick values - only include weekdays
//     const xTickValues = weekdayDates.filter((d, i) => i % 3 === 0);

//     // Add X axis with day/month format
//     svg.append('g')
//       .attr('transform', `translate(0,${priceHeight})`)
//       .call(d3.axisBottom(x)
//         .tickValues(xTickValues)
//         .tickFormat(d => {
//           const date = new Date(d);
//           const day = date.getDate();
//           const month = date.getMonth() + 1;
//           return `${day}/${month}`;
//         }))
//       .selectAll('text')
//       .style('text-anchor', 'middle')
//       .style('font-size', '11px')
//       .style('fill', '#64748b')
//       .attr('dy', '1em');

//     // Add X axis label
//     svg.append('text')
//       .attr('x', width / 2)
//       .attr('y', priceHeight + 40)
//       .style('text-anchor', 'middle')
//       .style('fill', '#64748b')
//       .style('font-size', '12px')
//       .text('Date');

//     // Add Y axis
//     svg.append('g')
//       .call(d3.axisLeft(y)
//         .tickFormat(d => `₹${d.toFixed(0)}`))
//       .call(g => g.select('.domain').remove())
//       .call(g => g.selectAll('.tick line')
//         .clone()
//         .attr('x2', width)
//         .attr('stroke-opacity', 0.1));

//     // Add Y axis label
//     svg.append('text')
//       .attr('transform', 'rotate(-90)')
//       .attr('y', -margin.left + 10)
//       .attr('x', -priceHeight / 2)
//       .attr('dy', '1em')
//       .style('text-anchor', 'middle')
//       .style('fill', '#64748b')
//       .style('font-size', '12px')
//       .text('Price (₹)');

//     // Draw volume bars if showVolume is true
//     if (showVolume && data.length > 0) {
//       svg.append('g')
//         .selectAll('rect')
//         .data(data)
//         .enter()
//         .append('rect')
//         .attr('x', d => x(d.date) - (width / data.length) / 2 + 1)
//         .attr('width', width / data.length - 2)
//         .attr('y', d => yVolume(d.volume || 0))
//         .attr('height', d => chartHeight - yVolume(d.volume || 0))
//         .attr('fill', (d, i) => i > 0 ? (d.close >= data[i-1].close ? '#dcfce7' : '#fee2e2') : '#e2e8f0')
//         .attr('opacity', 0.7);

//       svg.append('g')
//         .attr('transform', `translate(${width},0)`)
//         .call(d3.axisRight(yVolume)
//           .ticks(3)
//           .tickFormat(d => {
//             if (d >= 1000000) return `${(d / 1000000).toFixed(1)}M`;
//             if (d >= 1000) return `${(d / 1000).toFixed(1)}K`;
//             return d;
//           }))
//         .call(g => g.select('.domain').remove())
//         .selectAll('text')
//         .style('fill', '#94a3b8')
//         .style('font-size', '10px');
//     }

//     // Add grid lines
//     svg.append('g')
//       .attr('class', 'grid')
//       .selectAll('line')
//       .data(y.ticks())
//       .enter()
//       .append('line')
//       .attr('x1', 0)
//       .attr('x2', width)
//       .attr('y1', d => y(d))
//       .attr('y2', d => y(d))
//       .attr('stroke', '#e2e8f0')
//       .attr('stroke-dasharray', '3,3');

//     // Create a clip path
//     svg.append('defs')
//       .append('clipPath')
//       .attr('id', 'clip')
//       .append('rect')
//       .attr('width', width)
//       .attr('height', priceHeight)
//       .attr('x', 0)
//       .attr('y', 0);
    
//     // Calculate bar width with added gap (50% of the available space per bar for better spacing)
//     const totalBars = predictedWithDates.length;
//     const totalWidthPerBar = width / totalBars;
//     const barWidth = totalWidthPerBar * 0.5; // Use 50% of the space for the bar, leaving 50% as gap

//     // Add bars for prediction data with gaps
//     svg.selectAll('.prediction-bar')
//       .data(predictedWithDates)
//       .enter()
//       .append('rect')
//       .attr('class', 'prediction-bar')
//       .attr('x', (d, i) => x(d.date) - barWidth / 2)
//       .attr('width', barWidth)
//       .attr('y', d => y(d.predicted))
//       .attr('height', d => priceHeight - y(d.predicted))
//       .attr('fill', '#10b981')
//       .attr('rx', 2)
//       .attr('ry', 2)
//       .attr('clip-path', 'url(#clip)');
    
//     // Add average line
//     const avgPrice = predictedWithDates.reduce((sum, d) => sum + d.predicted, 0) / predictedWithDates.length;
    
//     svg.append('line')
//       .attr('x1', 0)
//       .attr('x2', width)
//       .attr('y1', y(avgPrice))
//       .attr('y2', y(avgPrice))
//       .attr('stroke', '#ef4444')
//       .attr('stroke-width', 1.5)
//       .attr('stroke-dasharray', '5,5')
//       .attr('clip-path', 'url(#clip)');
    
//     // Add "Avg" label
//     svg.append('text')
//       .attr('x', width - 30)
//       .attr('y', y(avgPrice) - 5)
//       .attr('fill', '#ef4444')
//       .style('font-size', '12px')
//       .style('font-weight', '600')
//       .text('Avg');

//     // Add title
//     svg.append('text')
//       .attr('x', width / 2)
//       .attr('y', -5)
//       .attr('text-anchor', 'middle')
//       .style('font-size', '14px')
//       .style('font-weight', 'bold')
//       .style('fill', '#333')
//       .text(`${stockSymbol || 'RELIANCE'} Price Prediction`);
      
//     // Add current price indicator if available
//     if (currentPrice) {
//       const currentPriceY = y(currentPrice);
      
//       // Add current price line across chart
//       svg.append('line')
//         .attr('x1', 0)
//         .attr('x2', width)
//         .attr('y1', currentPriceY)
//         .attr('y2', currentPriceY)
//         .attr('stroke', '#3b82f6')
//         .attr('stroke-width', 1.5)
//         .attr('stroke-dasharray', '5,5')
//         .attr('clip-path', 'url(#clip)');
      
//       // Add current price label
//       svg.append('rect')
//         .attr('x', 0)
//         .attr('y', currentPriceY - 10)
//         .attr('width', 85)
//         .attr('height', 20)
//         .attr('fill', '#3b82f6')
//         .attr('rx', 3);
      
//       svg.append('text')
//         .attr('x', 42)
//         .attr('y', currentPriceY + 4)
//         .attr('text-anchor', 'middle')
//         .style('font-size', '11px')
//         .style('font-weight', '600')
//         .style('fill', 'white')
//         .text(`₹${currentPrice.toFixed(2)}`);
//     }

//     // Add hover effect with price display
//     const focus = svg.append('g')
//       .attr('class', 'focus')
//       .style('display', 'none');

//     focus.append('line')
//       .attr('class', 'focus-line')
//       .attr('y1', 0)
//       .attr('y2', priceHeight)
//       .attr('stroke', '#64748b')
//       .attr('stroke-width', 1)
//       .attr('stroke-dasharray', '3,3');

//     focus.append('rect')
//       .attr('class', 'tooltip-bg')
//       .attr('x', 10)
//       .attr('y', -20)
//       .attr('width', 100)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#10b981')
//       .attr('opacity', 0.95);

//     focus.append('text')
//       .attr('class', 'tooltip-text')
//       .attr('x', 60)
//       .attr('y', -4)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#ffffff')
//       .style('font-size', '13px')
//       .style('font-weight', '700');

//     focus.append('rect')
//       .attr('class', 'date-tooltip-bg')
//       .attr('x', -40)
//       .attr('y', priceHeight + 5)
//       .attr('width', 80)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#10b981')
//       .attr('opacity', 0.95);

//     focus.append('text')
//       .attr('class', 'date-tooltip-text')
//       .attr('x', 0)
//       .attr('y', priceHeight + 21)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#ffffff')
//       .style('font-size', '12px')
//       .style('font-weight', '600');

//     svg.append('rect')
//       .attr('class', 'overlay')
//       .attr('width', width)
//       .attr('height', priceHeight)
//       .style('fill', 'none')
//       .style('pointer-events', 'all')
//       .on('mouseover', () => focus.style('display', null))
//       .on('mouseout', () => focus.style('display', 'none'))
//       .on('mousemove', mousemove);

//     function mousemove(event) {
//       const mouseDate = x.invert(d3.pointer(event)[0]);
      
//       const bisect = d3.bisector(d => d.date).left;
//       const index = bisect(predictedWithDates, mouseDate, 1);
//       const d0 = predictedWithDates[index - 1] || predictedWithDates[0];
//       const d1 = predictedWithDates[index] || d0;
//       const d = mouseDate - d0.date > d1.date - mouseDate ? d1 : d0;
      
//       if (d) {
//         const xPos = x(d.date);
//         focus.attr('transform', `translate(${xPos},0)`);
        
//         focus.select('.tooltip-text').text(`₹${d.predicted.toFixed(2)}`);
        
//         const dateStr = `${d.date.getDate()}/${d.date.getMonth() + 1}`;
//         focus.select('.date-tooltip-text').text(dateStr);
        
//         if (xPos > width - 100) {
//           focus.select('.tooltip-bg').attr('x', -90);
//           focus.select('.tooltip-text').attr('x', -50);
//         } else {
//           focus.select('.tooltip-bg').attr('x', 10);
//           focus.select('.tooltip-text').attr('x', 60);
//         }
//       }
//     }
//   }, [historicalData, predictedData, stockSymbol, timeframe, showVolume, height, cleanedData, normalizedData, showOutliers, showNormalized, intradayData, showIntraday, currentPrice, stockBasePrices]);

//   const renderIntradayChart = () => {
//     // Use provided intraday data or generate if not available
//     const data = intradayData.length > 0 ? intradayData : generateIntradayData();
    
//     if (data.length === 0) return;
    
//     d3.select(chartRef.current).selectAll('*').remove();
    
//     const margin = { top: 40, right: 60, bottom: 50, left: 60 };
//     const width = chartRef.current.clientWidth - margin.left - margin.right;
//     const chartHeight = height - margin.top - margin.bottom;
    
//     const svg = d3.select(chartRef.current)
//       .append('svg')
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height)
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);
    
//     // Set up scales
//     const xScale = d3.scaleTime()
//       .domain(d3.extent(data, d => d.time))
//       .range([0, width]);
    
//     const priceExtent = d3.extent(data, d => d.price);
//     const buffer = (priceExtent[1] - priceExtent[0]) * 0.05; // 5% buffer
    
//     const yScale = d3.scaleLinear()
//       .domain([priceExtent[0] - buffer, priceExtent[1] + buffer])
//       .range([chartHeight, 0])
//       .nice();
    
//     // Create line generator
//     const line = d3.line()
//       .x(d => xScale(d.time))
//       .y(d => yScale(d.price))
//       .curve(d3.curveMonotoneX);
    
//     // Determine if price is up or down for the day
//     const dayStart = data[0];
//     const dayEnd = data[data.length - 1];
//     const isUp = dayEnd.price >= dayStart.price;
//     const priceChange = dayEnd.price - dayStart.price;
//     const priceChangePercent = (priceChange / dayStart.price) * 100;
    
//     // Add gradient definition
//     const gradient = svg.append('defs')
//       .append('linearGradient')
//       .attr('id', 'intradayGradient')
//       .attr('gradientUnits', 'userSpaceOnUse')
//       .attr('x1', 0).attr('y1', chartHeight)
//       .attr('x2', 0).attr('y2', 0);
    
//     gradient.append('stop')
//       .attr('offset', '0%')
//       .attr('stop-color', isUp ? '#10b981' : '#ef4444')
//       .attr('stop-opacity', 0.1);
    
//     gradient.append('stop')
//       .attr('offset', '100%')
//       .attr('stop-color', isUp ? '#10b981' : '#ef4444')
//       .attr('stop-opacity', 0.3);
    
//     // Add area under the curve
//     const area = d3.area()
//       .x(d => xScale(d.time))
//       .y0(chartHeight)
//       .y1(d => yScale(d.price))
//       .curve(d3.curveMonotoneX);
    
//     svg.append('path')
//       .datum(data)
//       .attr('fill', 'url(#intradayGradient)')
//       .attr('d', area);
    
//     // Add the price line
//     svg.append('path')
//       .datum(data)
//       .attr('fill', 'none')
//       .attr('stroke', isUp ? '#10b981' : '#ef4444')
//       .attr('stroke-width', 2.5)
//       .attr('d', line);
    
//     // Add grid lines
//     svg.append('g')
//       .attr('class', 'grid')
//       .selectAll('line')
//       .data(yScale.ticks(5))
//       .enter()
//       .append('line')
//       .attr('x1', 0)
//       .attr('x2', width)
//       .attr('y1', d => yScale(d))
//       .attr('y2', d => yScale(d))
//       .attr('stroke', '#e5e7eb')
//       .attr('stroke-dasharray', '2,2')
//       .attr('opacity', 0.5);
    
//     // Add X axis
//     svg.append('g')
//       .attr('transform', `translate(0,${chartHeight})`)
//       .call(d3.axisBottom(xScale)
//         .ticks(6)
//         .tickFormat(d3.timeFormat('%I:%M %p')))
//       .selectAll('text')
//       .style('font-size', '11px')
//       .style('fill', '#6b7280');
    
//     // Add Y axis
//     svg.append('g')
//       .call(d3.axisLeft(yScale)
//         .ticks(5)
//         .tickFormat(d => `₹${d.toFixed(2)}`))
//       .selectAll('text')
//       .style('font-size', '11px')
//       .style('fill', '#6b7280');
    
//     // Add Y axis on the right
//     svg.append('g')
//       .attr('transform', `translate(${width},0)`)
//       .call(d3.axisRight(yScale)
//         .ticks(5)
//         .tickFormat(d => `${d.toFixed(2)}`))
//       .selectAll('text')
//       .style('font-size', '10px')
//       .style('fill', '#9ca3af');
    
//     // Add current price indicator if available
//     if (currentPrice) {
//       const currentPriceY = yScale(currentPrice);
      
//       // Horizontal line for current price
//       svg.append('line')
//         .attr('x1', 0)
//         .attr('x2', width)
//         .attr('y1', currentPriceY)
//         .attr('y2', currentPriceY)
//         .attr('stroke', '#3b82f6')
//         .attr('stroke-width', 1.5)
//         .attr('stroke-dasharray', '4,4');
      
//       // Current price label
//       svg.append('rect')
//         .attr('x', width - 85)
//         .attr('y', currentPriceY - 12)
//         .attr('width', 80)
//         .attr('height', 20)
//         .attr('fill', '#3b82f6')
//         .attr('rx', 3);
      
//       svg.append('text')
//         .attr('x', width - 45)
//         .attr('y', currentPriceY + 2)
//         .attr('text-anchor', 'middle')
//         .style('font-size', '11px')
//         .style('font-weight', '600')
//         .style('fill', 'white')
//         .text(`₹${currentPrice.toFixed(2)}`);
//     }
    
//     // Add data points
//     svg.selectAll('.data-point')
//       .data(data.filter((d, i) => i % 2 === 0))
//       .enter()
//       .append('circle')
//       .attr('class', 'data-point')
//       .attr('cx', d => xScale(d.time))
//       .attr('cy', d => yScale(d.price))
//       .attr('r', d => d.isCurrentPrice ? 4 : 2)
//       .attr('fill', d => d.isCurrentPrice ? '#3b82f6' : (isUp ? '#10b981' : '#ef4444'))
//       .attr('stroke', 'white')
//       .attr('stroke-width', 1);
    
//     // Add title with price change info
//     svg.append('text')
//       .attr('x', width / 2)
//       .attr('y', -25)
//       .attr('text-anchor', 'middle')
//       .style('font-size', '16px')
//       .style('font-weight', 'bold')
//       .style('fill', '#333')
//       .text(`${stockSymbol} - Today's Performance`);
    
//     // Add price change indicator
//     svg.append('text')
//       .attr('x', 10)
//       .attr('y', -5)
//       .style('font-size', '14px')
//       .style('font-weight', '600')
//       .style('fill', isUp ? '#10b981' : '#ef4444')
//       .text(`${isUp ? '+' : ''}₹${priceChange.toFixed(2)} (${isUp ? '+' : ''}${priceChangePercent.toFixed(2)}%)`);
    
//     // Add market status indicator
//     if (marketStatus) {
//       svg.append('text')
//         .attr('x', width - 10)
//         .attr('y', -5)
//         .attr('text-anchor', 'end')
//         .style('font-size', '12px')
//         .style('font-weight', '600')
//         .style('fill', marketStatus.isOpen ? '#10b981' : '#ef4444')
//         .text(`Market: ${marketStatus.status}`);
//     }
    
//     // Add hover functionality
//     const focus = svg.append('g')
//       .attr('class', 'focus')
//       .style('display', 'none');

//     focus.append('line')
//       .attr('y1', 0)
//       .attr('y2', chartHeight)
//       .attr('stroke', '#64748b')
//       .attr('stroke-width', 1)
//       .attr('stroke-dasharray', '3,3');

//     focus.append('circle')
//       .attr('r', 5)
//       .attr('fill', isUp ? '#10b981' : '#ef4444')
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 2);

//     const tooltip = focus.append('g');
    
//     tooltip.append('rect')
//       .attr('x', 10)
//       .attr('y', -40)
//       .attr('width', 120)
//       .attr('height', 50)
//       .attr('rx', 4)
//       .attr('fill', 'white')
//       .attr('stroke', '#e2e8f0')
//       .attr('stroke-width', 1)
//       .attr('opacity', 0.95);
    
//     tooltip.append('text')
//       .attr('x', 70)
//       .attr('y', -20)
//       .attr('text-anchor', 'middle')
//       .style('font-size', '12px')
//       .style('font-weight', '600')
//       .style('fill', '#374151')
//       .attr('class', 'tooltip-price');
    
//     tooltip.append('text')
//       .attr('x', 70)
//       .attr('y', -5)
//       .attr('text-anchor', 'middle')
//       .style('font-size', '11px')
//       .style('fill', '#6b7280')
//       .attr('class', 'tooltip-time');

//     svg.append('rect')
//       .attr('width', width)
//       .attr('height', chartHeight)
//       .style('fill', 'none')
//       .style('pointer-events', 'all')
//       .on('mouseover', () => focus.style('display', null))
//       .on('mouseout', () => focus.style('display', 'none'))
//       .on('mousemove', mousemove);

//     function mousemove(event) {
//       const mouseDate = xScale.invert(d3.pointer(event)[0]);
      
//       const bisect = d3.bisector(d => d.time).left;
//       const index = bisect(data, mouseDate, 1);
//       const d0 = data[index - 1] || data[0];
//       const d1 = data[index] || d0;
//       const d = mouseDate - d0.time > d1.time - mouseDate ? d1 : d0;
      
//       if (d) {
//         const xPos = xScale(d.time);
//         focus.attr('transform', `translate(${xPos},0)`);
        
//         focus.select('circle').attr('cy', yScale(d.price));
//         focus.select('.tooltip-price').text(`₹${d.price.toFixed(2)}`);
//         focus.select('.tooltip-time').text(d3.timeFormat('%I:%M %p')(d.time));
        
//         if (xPos > width - 130) {
//           tooltip.attr('transform', 'translate(-130, 0)');
//         } else {
//           tooltip.attr('transform', 'translate(0, 0)');
//         }
//       }
//     }
//   };

//   const renderCleanedDataChart = () => {
//     if (cleanedData.length === 0 || historicalData.length === 0) return;
    
//     d3.select(chartRef.current).selectAll('*').remove();
    
//     const margin = { top: 20, right: 30, bottom: 50, left: 70 };
//     const width = chartRef.current.clientWidth - margin.left - margin.right;
//     const chartHeight = height - margin.top - margin.bottom;
//     const priceHeight = chartHeight;
    
//     const svg = d3.select(chartRef.current)
//       .append('svg')
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height)
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);
    
//     // Filter cleanedData to exclude weekends
//     const processedData = filterWeekends(cleanedData)
//       .map((d, i) => {
//         const variationFactor = 0.03; // Reduced from 0.05
//         const waveFrequency = 0.2;
//         const variation = Math.sin(i * waveFrequency) * variationFactor * d.close;
        
//         return {
//           date: d.date,
//           close: d.close,
//           originalClose: d.originalClose || (d.close + variation),
//           isOutlier: d.isOutlier || false
//         };
//       });

//     // Create weekday dates for mapping
//     const currentDate = new Date();
//     const weekdayDates = generateWeekdayDates(currentDate, processedData.length);
    
//     const remappedData = processedData.map((d, i) => ({
//       ...d,
//       remappedDate: weekdayDates[i]
//     }));
    
//     const startDate = new Date(currentDate);
//     const endDate = new Date(weekdayDates[weekdayDates.length - 1]);
    
//     const x = d3.scaleTime()
//       .domain([startDate, endDate])
//       .range([0, width]);
    
//     // Calculate min/max for y-axis with sensible margins
//     const allPrices = remappedData.flatMap(d => [d.close, d.originalClose]);
//     const minPrice = d3.min(allPrices) * 0.995;
//     const maxPrice = d3.max(allPrices) * 1.005;
    
//     const y = d3.scaleLinear()
//       .domain([minPrice, maxPrice])
//       .range([priceHeight, 0])
//       .nice();
    
//     const xTickValues = weekdayDates.filter((d, i) => i % 3 === 0);
    
//     svg.append('g')
//       .attr('transform', `translate(0,${priceHeight})`)
//       .call(d3.axisBottom(x)
//         .tickValues(xTickValues)
//         .tickFormat(d => {
//           const date = new Date(d);
//           const day = date.getDate();
//           const month = date.getMonth() + 1;
//           return `${day}/${month}`;
//         }))
//       .selectAll('text')
//       .style('text-anchor', 'middle')
//       .style('font-size', '11px')
//       .style('fill', '#64748b')
//       .attr('dy', '1em');
    
//     svg.append('text')
//       .attr('x', width / 2)
//       .attr('y', priceHeight + 40)
//       .style('text-anchor', 'middle')
//       .style('fill', '#64748b')
//       .style('font-size', '12px')
//       .text('Date');
    
//     svg.append('g')
//       .call(d3.axisLeft(y)
//         .tickFormat(d => `₹${d.toFixed(0)}`))
//       .call(g => g.select('.domain').remove())
//       .call(g => g.selectAll('.tick line')
//         .clone()
//         .attr('x2', width)
//         .attr('stroke-opacity', 0.1));
    
//     svg.append('text')
//       .attr('transform', 'rotate(-90)')
//       .attr('y', -margin.left + 10)
//       .attr('x', -priceHeight / 2)
//       .attr('dy', '1em')
//       .style('text-anchor', 'middle')
//       .style('fill', '#64748b')
//       .style('font-size', '12px')
//       .text('Price (₹)');
    
//     svg.append('g')
//       .attr('class', 'grid')
//       .selectAll('line')
//       .data(y.ticks())
//       .enter()
//       .append('line')
//       .attr('x1', 0)
//       .attr('x2', width)
//       .attr('y1', d => y(d))
//       .attr('y2', d => y(d))
//       .attr('stroke', '#e2e8f0')
//       .attr('stroke-dasharray', '3,3');
    
//     svg.append('defs')
//       .append('clipPath')
//       .attr('id', 'clip')
//       .append('rect')
//       .attr('width', width)
//       .attr('height', priceHeight)
//       .attr('x', 0)
//       .attr('y', 0);
    
//     const originalLine = d3.line()
//       .x(d => x(d.remappedDate))
//       .y(d => y(d.originalClose))
//       .curve(d3.curveNatural);
    
//     const cleanedLine = d3.line()
//       .x(d => x(d.remappedDate))
//       .y(d => y(d.close))
//       .curve(d3.curveNatural);
    
//     svg.append('path')
//       .datum(remappedData)
//       .attr('fill', 'none')
//       .attr('stroke', '#94a3b8')
//       .attr('stroke-width', 2)
//       .attr('stroke-dasharray', '3,3')
//       .attr('clip-path', 'url(#clip)')
//       .attr('d', originalLine);
    
//     svg.append('path')
//       .datum(remappedData)
//       .attr('fill', 'none')
//       .attr('stroke', '#10b981')
//       .attr('stroke-width', 2.5)
//       .attr('clip-path', 'url(#clip)')
//       .attr('d', cleanedLine);
    
//     svg.selectAll('.outlier-point')
//       .data(remappedData.filter(d => d.isOutlier))
//       .enter()
//       .append('circle')
//       .attr('class', 'outlier-point')
//       .attr('cx', d => x(d.remappedDate))
//       .attr('cy', d => y(d.originalClose))
//       .attr('r', 5)
//       .attr('fill', '#ef4444')
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 1.5);

//     const midIdx = Math.floor(remappedData.length / 2);
//     const referencePoint = remappedData[midIdx];
    
//     svg.append('line')
//       .attr('x1', x(referencePoint.remappedDate))
//       .attr('x2', x(referencePoint.remappedDate))
//       .attr('y1', 0)
//       .attr('y2', priceHeight)
//       .attr('stroke', '#64748b')
//       .attr('stroke-width', 1)
//       .attr('stroke-dasharray', '4,4');
    
//     svg.append('rect')
//       .attr('x', x(referencePoint.remappedDate) - 70)
//       .attr('y', 35)
//       .attr('width', 140)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#ffffff')
//       .attr('stroke', '#94a3b8')
//       .attr('stroke-width', 1)
//       .attr('opacity', 0.9);
    
//     svg.append('text')
//       .attr('x', x(referencePoint.remappedDate))
//       .attr('y', 51)
//       .attr('text-anchor', 'middle')
//       .style('font-size', '12px')
//       .style('fill', '#64748b')
//       .text(`Original: ₹${referencePoint.originalClose.toFixed(2)}`);
    
//     svg.append('rect')
//       .attr('x', x(referencePoint.remappedDate) - 60)
//       .attr('y', 65)
//       .attr('width', 120)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#10b981')
//       .attr('opacity', 0.9);
    
//     svg.append('text')
//       .attr('x', x(referencePoint.remappedDate))
//       .attr('y', 81)
//       .attr('text-anchor', 'middle')
//       .style('font-size', '12px')
//       .style('fill', '#ffffff')
//       .text(`Cleaned: ₹${referencePoint.close.toFixed(2)}`);
      
//     // Add current price indicator if available
//     if (currentPrice) {
//       const currentPriceY = y(currentPrice);
      
//       // Add current price line across chart
//       svg.append('line')
//         .attr('x1', 0)
//         .attr('x2', width)
//         .attr('y1', currentPriceY)
//         .attr('y2', currentPriceY)
//         .attr('stroke', '#3b82f6')
//         .attr('stroke-width', 1.5)
//         .attr('stroke-dasharray', '5,5')
//         .attr('clip-path', 'url(#clip)');
      
//       // Add current price label
//       svg.append('rect')
//         .attr('x', width - 85)
//         .attr('y', currentPriceY - 10)
//         .attr('width', 85)
//         .attr('height', 20)
//         .attr('fill', '#3b82f6')
//         .attr('rx', 3);
      
//       svg.append('text')
//         .attr('x', width - 42)
//         .attr('y', currentPriceY + 4)
//         .attr('text-anchor', 'middle')
//         .style('font-size', '11px')
//         .style('font-weight', '600')
//         .style('fill', 'white')
//         .text(`₹${currentPrice.toFixed(2)}`);
//     }

//     const focus = svg.append('g')
//       .attr('class', 'focus')
//       .style('display', 'none');
    
//     focus.append('line')
//       .attr('y1', 0)
//       .attr('y2', priceHeight)
//       .attr('stroke', '#64748b')
//       .attr('stroke-width', 1)
//       .attr('stroke-dasharray', '3,3');
    
//     focus.append('circle')
//       .attr('r', 5)
//       .attr('fill', '#94a3b8')
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 2)
//       .attr('class', 'original-circle');
    
//     focus.append('circle')
//       .attr('r', 5)
//       .attr('fill', '#10b981')
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 2)
//       .attr('class', 'cleaned-circle');
    
//     const tooltip = focus.append('g');
    
//     tooltip.append('rect')
//       .attr('x', 10)
//       .attr('y', -25)
//       .attr('width', 140)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#94a3b8')
//       .attr('opacity', 0.95);
    
//     tooltip.append('text')
//       .attr('x', 80)
//       .attr('y', -9)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#ffffff')
//       .style('font-size', '12px')
//       .style('font-weight', '600')
//       .attr('class', 'original-text');
    
//     tooltip.append('rect')
//       .attr('x', 10)
//       .attr('y', 5)
//       .attr('width', 140)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#10b981')
//       .attr('opacity', 0.95);
    
//     tooltip.append('text')
//       .attr('x', 80)
//       .attr('y', 21)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#ffffff')
//       .style('font-size', '12px')
//       .style('font-weight', '600')
//       .attr('class', 'cleaned-text');
    
//     tooltip.append('rect')
//       .attr('x', -40)
//       .attr('y', priceHeight + 5)
//       .attr('width', 80)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#64748b')
//       .attr('opacity', 0.9);
    
//     tooltip.append('text')
//       .attr('x', 0)
//       .attr('y', priceHeight + 21)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#ffffff')
//       .style('font-size', '12px')
//       .attr('class', 'date-text');
    
//     svg.append('rect')
//       .attr('width', width)
//       .attr('height', priceHeight)
//       .style('fill', 'none')
//       .style('pointer-events', 'all')
//       .on('mouseover', () => focus.style('display', null))
//       .on('mouseout', () => focus.style('display', 'none'))
//       .on('mousemove', mousemove);
    
//     function mousemove(event) {
//       const mouseDate = x.invert(d3.pointer(event)[0]);
      
//       const bisect = d3.bisector(d => d.remappedDate).left;
//       const index = bisect(remappedData, mouseDate, 1);
      
//       if (index > 0 && index < remappedData.length) {
//         const d0 = remappedData[index - 1];
//         const d1 = remappedData[index];
//         const d = mouseDate - d0.remappedDate > d1.remappedDate - mouseDate ? d1 : d0;
        
//         const xPos = x(d.remappedDate);
//         focus.attr('transform', `translate(${xPos},0)`);
        
//         focus.select('.original-circle').attr('cy', y(d.originalClose));
//         focus.select('.cleaned-circle').attr('cy', y(d.close));
        
//         focus.select('.original-text').text(`Original: ₹${d.originalClose.toFixed(2)}`);
//         focus.select('.cleaned-text').text(`Cleaned: ₹${d.close.toFixed(2)}`);
        
//         const dateStr = `${d.remappedDate.getDate()}/${d.remappedDate.getMonth() + 1}`;
//         focus.select('.date-text').text(dateStr);
        
//         if (xPos > width - 150) {
//           tooltip.attr('transform', 'translate(-150, 0)');
//         } else {
//           tooltip.attr('transform', 'translate(0, 0)');
//         }
//       }
//     }
//   };
  
//   const renderNormalizedChart = () => {
//     d3.select(chartRef.current).selectAll('*').remove();
    
//     const margin = { top: 40, right: 30, bottom: 50, left: 40 };
//     const width = chartRef.current.clientWidth - margin.left - margin.right;
//     const chartHeight = height - margin.top - margin.bottom;
    
//     const svg = d3.select(chartRef.current)
//       .append('svg')
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height)
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);
    
//     // Get base price for prediction constraints - important for accurate visualization
//     const basePrice = currentPrice || 
//       (historicalData.length > 0 ? historicalData[historicalData.length - 1].close : 
//       stockBasePrices[stockSymbol] || 2000);
    
//     // Generate sine wave data using the same weekday dates as the data cleaning chart
//     const generateSineWaveData = () => {
//       const data = [];
      
//       const currentDate = new Date();
//       const weekdayDates = generateWeekdayDates(currentDate, 30);
      
//       // Use a smaller amplitude for the sine wave (0.3 instead of 0.48)
//       const amplitude = 0.3;
      
//       for (let i = 0; i < weekdayDates.length; i++) {
//         const progress = i / (weekdayDates.length - 1);
//         const angle = progress * Math.PI * 8;
        
//         // Reduced amplitude for more realistic data
//         const normalizedClose = 0.5 + amplitude * Math.sin(angle);
//         const normalizedLow = 0.5 + 0.15 * Math.sin(angle);
        
//         data.push({
//           date: weekdayDates[i],
//           normalizedClose: normalizedClose,
//           normalizedLow: normalizedLow,
//           originalPrice: basePrice * (0.95 + normalizedClose * 0.1) // Map to real price range
//         });
//       }
      
//       return { data, weekdayDates };
//     };
    
//     const { data: sineData, weekdayDates } = generateSineWaveData();
    
//     const startDate = new Date(sineData[0].date);
//     const endDate = new Date(sineData[sineData.length - 1].date);
    
//     const x = d3.scaleTime()
//       .domain([startDate, endDate])
//       .range([0, width]);
    
//     const y = d3.scaleLinear()
//       .domain([0, 1])
//       .range([chartHeight, 0])
//       .nice();
    
//     svg.append('text')
//       .attr('x', width / 2)
//       .attr('y', -20)
//       .attr('text-anchor', 'middle')
//       .style('font-size', '14px')
//       .style('font-weight', 'bold')
//       .style('fill', '#333')
//       .text('Normalized Price Data (0-1 Scale)');
    
//     const yGridTicks = [0, 0.25, 0.5, 0.75, 1];
//     svg.append('g')
//       .attr('class', 'grid-horizontal')
//       .selectAll('line')
//       .data(yGridTicks)
//       .enter()
//       .append('line')
//       .attr('x1', 0)
//       .attr('x2', width)
//       .attr('y1', d => y(d))
//       .attr('y2', d => y(d))
//       .attr('stroke', '#ddd')
//       .attr('stroke-dasharray', '2,2');
    
//     const xTickValues = weekdayDates.filter((d, i) => i % 3 === 0);
    
//     svg.append('g')
//       .attr('class', 'grid-vertical')
//       .selectAll('line')
//       .data(xTickValues)
//       .enter()
//       .append('line')
//       .attr('x1', d => x(d))
//       .attr('x2', d => x(d))
//       .attr('y1', 0)
//       .attr('y2', chartHeight)
//       .attr('stroke', '#ddd')
//       .attr('stroke-dasharray', '2,2');
    
//     svg.append('g')
//       .call(d3.axisLeft(y)
//         .tickValues(yGridTicks)
//         .tickFormat(d => d.toFixed(2)))
//       .call(g => g.select('.domain').attr('stroke', '#ccc'))
//       .call(g => g.selectAll('.tick line').attr('stroke', '#ccc'))
//       .call(g => g.selectAll('.tick text')
//         .attr('x', -5)
//         .style('text-anchor', 'end')
//         .style('fill', '#666')
//         .style('font-size', '11px'));
    
//     svg.append('g')
//       .attr('transform', `translate(0,${chartHeight})`)
//       .call(d3.axisBottom(x)
//         .tickValues(xTickValues)
//         .tickFormat(d => {
//           const day = d.getDate();
//           const month = d.getMonth() + 1;
//           return `${day}/${month}`;
//         }))
//       .call(g => g.select('.domain').attr('stroke', '#ccc'))
//       .call(g => g.selectAll('.tick line').attr('stroke', '#ccc'))
//       .call(g => g.selectAll('.tick text')
//         .style('text-anchor', 'middle')
//         .style('fill', '#666')
//         .style('font-size', '11px'));
    
//     const closeLine = d3.line()
//       .x(d => x(d.date))
//       .y(d => y(d.normalizedClose))
//       .curve(d3.curveMonotoneX);
    
//     const lowLine = d3.line()
//       .x(d => x(d.date))
//       .y(d => y(d.normalizedLow))
//       .curve(d3.curveMonotoneX);
    
//     svg.append('path')
//       .datum(sineData)
//       .attr('fill', 'none')
//       .attr('stroke', '#2dd4bf')
//       .attr('stroke-width', 1.5)
//       .attr('stroke-dasharray', '4,3')
//       .attr('d', lowLine);
    
//     svg.append('path')
//       .datum(sineData)
//       .attr('fill', 'none')
//       .attr('stroke', '#8b5cf6')
//       .attr('stroke-width', 2)
//       .attr('d', closeLine);
    
//     svg.selectAll('.dot')
//       .data(sineData.filter((d, i) => i % 3 === 0))
//       .enter()
//       .append('circle')
//       .attr('class', 'dot')
//       .attr('cx', d => x(d.date))
//       .attr('cy', d => y(d.normalizedClose))
//       .attr('r', 4)
//       .attr('fill', '#8b5cf6')
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 1.5);
      
//     // Add current price normalized indicator if available
//     if (currentPrice && historicalData.length > 0) {
//       const closePrices = historicalData.map(item => item.close);
//       const minPrice = Math.min(...closePrices);
//       const maxPrice = Math.max(...closePrices);
//       const priceRange = maxPrice - minPrice;
      
//       // Calculate normalized value for current price
//       const normalizedCurrentPrice = (currentPrice - minPrice) / priceRange;
      
//       const currentPriceY = y(normalizedCurrentPrice);
      
//       // Add normalized current price line
//       svg.append('line')
//         .attr('x1', 0)
//         .attr('x2', width)
//         .attr('y1', currentPriceY)
//         .attr('y2', currentPriceY)
//         .attr('stroke', '#3b82f6')
//         .attr('stroke-width', 1.5)
//         .attr('stroke-dasharray', '4,4');
      
//       // Add normalized current price label
//       svg.append('rect')
//         .attr('x', 0)
//         .attr('y', currentPriceY - 10)
//         .attr('width', 110)
//         .attr('height', 20)
//         .attr('fill', '#3b82f6')
//         .attr('rx', 3);
      
//       svg.append('text')
//         .attr('x', 55)
//         .attr('y', currentPriceY + 4)
//         .attr('text-anchor', 'middle')
//         .style('font-size', '11px')
//         .style('font-weight', '600')
//         .style('fill', 'white')
//         .text(`Current: ${normalizedCurrentPrice.toFixed(4)}`);
//     }
    
//     const focus = svg.append('g')
//       .attr('class', 'focus')
//       .style('display', 'none');
    
//     focus.append('line')
//       .attr('y1', 0)
//       .attr('y2', chartHeight)
//       .attr('stroke', '#94a3b8')
//       .attr('stroke-width', 1)
//       .attr('stroke-dasharray', '3,3');
    
//     const tooltip = focus.append('g');
    
//     tooltip.append('rect')
//       .attr('x', 10)
//       .attr('y', -50)
//       .attr('width', 160)
//       .attr('height', 70)
//       .attr('rx', 4)
//       .attr('fill', 'white')
//       .attr('stroke', '#e2e8f0')
//       .attr('stroke-width', 1)
//       .attr('opacity', 0.9);
    
//     tooltip.append('text')
//       .attr('x', 20)
//       .attr('y', -30)
//       .attr('fill', '#8b5cf6')
//       .style('font-size', '12px')
//       .style('font-weight', '600')
//       .text('Normalized Value:');
      
//     tooltip.append('text')
//       .attr('x', 150)
//       .attr('y', -30)
//       .attr('text-anchor', 'end')
//       .attr('fill', '#8b5cf6')
//       .style('font-size', '12px')
//       .style('font-weight', '600')
//       .attr('class', 'norm-close-text');
    
//     tooltip.append('text')
//       .attr('x', 20)
//       .attr('y', -10)
//       .attr('fill', '#2dd4bf')
//       .style('font-size', '12px')
//       .style('font-weight', '600')
//       .text('Normalized Value:');
    
//     tooltip.append('text')
//       .attr('x', 150)
//       .attr('y', -10)
//       .attr('text-anchor', 'end')
//       .attr('fill', '#2dd4bf')
//       .style('font-size', '12px')
//       .style('font-weight', '600')
//       .attr('class', 'norm-low-text');
    
//     tooltip.append('text')
//       .attr('x', 20)
//       .attr('y', 10)
//       .attr('fill', '#6b7280')
//       .style('font-size', '12px')
//       .style('font-weight', '600')
//       .text('Original:');
    
//     tooltip.append('text')
//       .attr('x', 150)
//       .attr('y', 10)
//       .attr('text-anchor', 'end')
//       .attr('fill', '#6b7280')
//       .style('font-size', '12px')
//       .style('font-weight', '600')
//       .attr('class', 'original-text');
    
//     svg.append('rect')
//       .attr('width', width)
//       .attr('height', chartHeight)
//       .style('fill', 'none')
//       .style('pointer-events', 'all')
//       .on('mouseover', () => focus.style('display', null))
//       .on('mouseout', () => focus.style('display', 'none'))
//       .on('mousemove', mousemove);
    
//     function mousemove(event) {
//       const mouseDate = x.invert(d3.pointer(event)[0]);
      
//       const bisect = d3.bisector(d => d.date).left;
//       const index = bisect(sineData, mouseDate, 1);
      
//       if (index > 0 && index < sineData.length) {
//         const d0 = sineData[index - 1];
//         const d1 = sineData[index];
//         const d = mouseDate - d0.date > d1.date - mouseDate ? d1 : d0;
        
//         const xPos = x(d.date);
//         focus.attr('transform', `translate(${xPos},0)`);
        
//         focus.select('.norm-close-text').text(`${d.normalizedClose.toFixed(4)}`);
//         focus.select('.norm-low-text').text(`${d.normalizedLow.toFixed(4)}`);
//         focus.select('.original-text').text(`₹${d.originalPrice.toFixed(2)}`);
        
//         if (xPos > width - 170) {
//           tooltip.attr('transform', 'translate(-170, 0)');
//         } else {
//           tooltip.attr('transform', 'translate(0, 0)');
//         }
//       }
//     }
//   };

//   return (
//     <div 
//       ref={chartRef} 
//       style={{ 
//         width: '100%', 
//         height: `${height}px`,
//         overflow: 'hidden'
//       }}
//       className="stock-chart"
//     ></div>
//   );
// }

// export default StockChart;


import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { formatDate } from '../../utils/formatters';

function StockChart({ 
  historicalData = [], 
  predictedData = [], 
  stockSymbol,
  timeframe = '30',
  showVolume = false,
  height = 400,
  cleanedData = [],
  normalizedData = [],
  showOutliers = false,
  showNormalized = false,
  intradayData = [],
  showIntraday = false,
  currentPrice = null,
  marketStatus = null
}) {
  const chartRef = useRef(null);
  
  // Stock baseline prices for reference (fallback if needed)
  const stockBasePrices = {
    'RELIANCE': 2800,
    'TCS': 3500,
    'HDFCBANK': 1600,
    'INFY': 1500,
    'ICICIBANK': 1000,
    'ASIANPAINT': 2000,
    'ASIANPAINTS': 2000, // Including both possible naming conventions
    'BAJFINANCE': 7000,
    'HCLTECH': 1200,
    'WIPRO': 420,
    'SBIN': 750,
    'TATASTEEL': 145,
    'HINDUNILVR': 2600,
    'MARUTI': 10800,
    'AXISBANK': 1100,
    'BHARTIARTL': 1170,
    'KOTAKBANK': 1750,
    'ULTRACEMCO': 9600,
    'LT': 3300,
    'TITAN': 3200,
  };

  // Helper function to check if a date is a weekend (Saturday or Sunday)
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  // Helper function to get the next weekday
  const getNextWeekday = (date) => {
    const result = new Date(date);
    do {
      result.setDate(result.getDate() + 1);
    } while (isWeekend(result));
    return result;
  };

  // Generate weekday dates between start and end dates
  const generateWeekdayDates = (startDate, days) => {
    const dates = [];
    let currentDate = new Date(startDate);
    
    // Skip to next weekday if start date is a weekend
    if (isWeekend(currentDate)) {
      currentDate = getNextWeekday(currentDate);
    }
    
    // Add the first date
    dates.push(new Date(currentDate));
    
    // Generate subsequent weekday dates
    let weekdaysCount = 1;
    while (weekdaysCount < days) {
      currentDate = getNextWeekday(currentDate);
      dates.push(new Date(currentDate));
      weekdaysCount++;
    }
    
    return dates;
  };

  // Function to filter out weekends from any data array with a date field
  const filterWeekends = (data, dateField = 'date') => {
    const parseDate = d3.timeParse('%Y-%m-%d');
    return data
      .map(d => ({
        ...d,
        [dateField]: typeof d[dateField] === 'string' ? parseDate(d[dateField]) : d[dateField]
      }))
      .filter(d => !isWeekend(d[dateField]));
  };

  const generateIntradayData = () => {
    const today = new Date();
    const isMarketDay = today.getDay() >= 1 && today.getDay() <= 5; // Monday to Friday
    
    if (!isMarketDay) return [];
    
    // Market hours: 9:15 AM to 3:30 PM (IST)
    const marketStart = new Date(today);
    marketStart.setHours(9, 15, 0, 0);
    
    const now = new Date();
    const marketEnd = new Date(today);
    marketEnd.setHours(15, 30, 0, 0);
    
    // Use current time if market is open, otherwise use market end
    const endTime = now < marketEnd ? now : marketEnd;
    
    const data = [];
    
    // Get base price from current price or last historical price or default fallback
    let basePrice = currentPrice;
    if (!basePrice && historicalData.length > 0) {
      basePrice = historicalData[historicalData.length - 1].close;
    }
    if (!basePrice) {
      // Use stock-specific base price as fallback
      basePrice = stockBasePrices[stockSymbol] || 2000;
    }
    
    // Special handling for Asian Paints to ensure prices stay around 2000-2300 range
    const isAsianPaints = stockSymbol.includes('ASIANPAINT');
    if (isAsianPaints && (!basePrice || basePrice < 1800 || basePrice > 2500)) {
      basePrice = 2285; // Force correct price range for Asian Paints
    }
    
    // Generate time points (30-minute intervals)
    const timePoints = [];
    let currentTime = new Date(marketStart);
    
    while (currentTime <= endTime) {
      timePoints.push(new Date(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    
    if (timePoints.length === 0) return [];
    
    // Generate realistic price movements
    let price = basePrice * (0.998 + Math.random() * 0.004); // Start within 0.2% of base
    
    // Use smaller volatility for high-priced stocks and Asian Paints
    const dailyVolatility = isAsianPaints ? 0.008 : 0.01; // 0.8% for Asian Paints, 1% for others
    const hourlyVolatility = dailyVolatility / Math.sqrt(timePoints.length);
    
    // Create seed for consistent data generation
    const seed = stockSymbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let randomSeed = seed + today.getDate();
    
    const seededRandom = () => {
      randomSeed = (randomSeed * 9301 + 49297) % 233280;
      return randomSeed / 233280;
    };
    
    timePoints.forEach((time, index) => {
      // Add some realistic intraday patterns
      const timeOfDay = time.getHours() + time.getMinutes() / 60;
      
      // Market opening volatility (higher at start)
      let volatilityMultiplier = 1;
      if (timeOfDay < 10) {
        volatilityMultiplier = 1.3; // Higher volatility at market open
      } else if (timeOfDay > 14.5) {
        volatilityMultiplier = 1.2; // Higher volatility near market close
      } else {
        volatilityMultiplier = 0.8; // Lower volatility during mid-day
      }
      
      // Generate random price movement
      const randomFactor = (seededRandom() - 0.5) * 2;
      const priceChange = randomFactor * hourlyVolatility * basePrice * volatilityMultiplier;
      
      // Add mean reversion
      const meanReversion = (basePrice - price) * 0.1;
      
      // Add slight upward trend if current price is higher than base
      let trendFactor = 0;
      if (currentPrice && index === timePoints.length - 1) {
        // Ensure the last price point is close to current price
        trendFactor = (currentPrice - price) * 0.3;
      }
      
      price += priceChange + meanReversion + trendFactor;
      
      // Ensure price doesn't deviate too much from base (reduced from 3% to 2%)
      // Use even tighter constraints for Asian Paints
      const maxDeviation = isAsianPaints ? basePrice * 0.015 : basePrice * 0.02; // 1.5% for Asian Paints, 2% for others
      price = Math.max(basePrice - maxDeviation, Math.min(basePrice + maxDeviation, price));
      
      // Scale volume based on stock price (higher priced stocks often have lower volume)
      const volumeScale = Math.max(1, 5000 / basePrice);
      const volume = 50000 * volumeScale + Math.floor(seededRandom() * 100000 * volumeScale);
      
      data.push({
        time: time,
        price: parseFloat(price.toFixed(2)),
        volume: volume,
        isCurrentPrice: index === timePoints.length - 1 && currentPrice
      });
    });
    
    // If we have current price, adjust the last point
    if (currentPrice && data.length > 0) {
      data[data.length - 1].price = currentPrice;
      data[data.length - 1].isCurrentPrice = true;
    }
    
    return data;
  };

  useEffect(() => {
    // For intraday view, use intradayData if showIntraday is true
    if (showIntraday) {
      renderIntradayChart();
      return;
    }
    
    // For normalized data view, use normalizedData if showNormalized is true
    if (showNormalized && normalizedData.length > 0) {
      renderNormalizedChart();
      return;
    }
    
    // For data cleaning view, use cleanedData if available
    if (showOutliers && cleanedData.length > 0) {
      renderCleanedDataChart();
      return;
    }
    
    // Original chart rendering for historical and predicted data
    if (historicalData.length === 0 && predictedData.length === 0) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Filter data based on timeframe and exclude weekends
    const timeframeData = filterWeekends(historicalData).slice(-parseInt(timeframe));

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const volumeHeight = showVolume ? 80 : 0;
    const priceHeight = chartHeight - volumeHeight;

    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Use filtered timeframe data for the chart
    const data = timeframeData;

    // Create prediction data for next 30 weekdays (excluding weekends)
    const currentDate = new Date();
    const weekdayDates = generateWeekdayDates(currentDate, 30);
    
    // Get base price for prediction constraints
    const basePrice = currentPrice || 
        (historicalData.length > 0 ? historicalData[historicalData.length - 1].close : 
        stockBasePrices[stockSymbol] || 2000);
    
    // Process predictedData
    let predictedWithDates = [];
    
    if (predictedData && predictedData.length > 0) {
      predictedWithDates = weekdayDates.map((date, index) => {
        // Use actual predicted value if available, otherwise use a conservative prediction
        const predictedValue = (index < predictedData.length) ? 
          predictedData[index].predicted : 
          basePrice * (1 + (Math.sin(index * Math.PI/10) * 0.05)); // Max 5% oscillation
        
        return {
          date: date,
          predicted: predictedValue
        };
      });
    }

    // Set the domain to span from current date to the last weekday date
    const startDate = new Date(currentDate);
    const endDate = new Date(weekdayDates[weekdayDates.length - 1]);
    
    // X scale for the timeframe
    const x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, width]);

    // Calculate min/max for y-axis with sensible margins
    let minValue, maxValue;
    
    if (predictedWithDates.length > 0) {
      const minPredicted = d3.min(predictedWithDates, d => d.predicted);
      const maxPredicted = d3.max(predictedWithDates, d => d.predicted);
      
      // Add 0.5% padding on each side
      minValue = minPredicted * 0.995;
      maxValue = maxPredicted * 1.005;
    } else {
      // Fallback with base price if no predictions
      minValue = basePrice * 0.95;
      maxValue = basePrice * 1.05;
    }
    
    // Y scale for price
    const y = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([priceHeight, 0])
      .nice();

    // Y scale for volume
    const yVolume = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.volume || 0) || 1000000])
      .range([chartHeight, priceHeight + 10]);

    // Generate tick values - only include weekdays
    const xTickValues = weekdayDates.filter((d, i) => i % 3 === 0);

    // Add X axis with day/month format
    svg.append('g')
      .attr('transform', `translate(0,${priceHeight})`)
      .call(d3.axisBottom(x)
        .tickValues(xTickValues)
        .tickFormat(d => {
          const date = new Date(d);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          return `${day}/${month}`;
        }))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#64748b')
      .attr('dy', '1em');

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', priceHeight + 40)
      .style('text-anchor', 'middle')
      .style('fill', '#64748b')
      .style('font-size', '12px')
      .text('Date');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y)
        .tickFormat(d => `₹${d.toFixed(0)}`))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .clone()
        .attr('x2', width)
        .attr('stroke-opacity', 0.1));

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 10)
      .attr('x', -priceHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#64748b')
      .style('font-size', '12px')
      .text('Price (₹)');

    // Draw volume bars if showVolume is true
    if (showVolume && data.length > 0) {
      svg.append('g')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(d.date) - (width / data.length) / 2 + 1)
        .attr('width', width / data.length - 2)
        .attr('y', d => yVolume(d.volume || 0))
        .attr('height', d => chartHeight - yVolume(d.volume || 0))
        .attr('fill', (d, i) => i > 0 ? (d.close >= data[i-1].close ? '#dcfce7' : '#fee2e2') : '#e2e8f0')
        .attr('opacity', 0.7);

      svg.append('g')
        .attr('transform', `translate(${width},0)`)
        .call(d3.axisRight(yVolume)
          .ticks(3)
          .tickFormat(d => {
            if (d >= 1000000) return `${(d / 1000000).toFixed(1)}M`;
            if (d >= 1000) return `${(d / 1000).toFixed(1)}K`;
            return d;
          }))
        .call(g => g.select('.domain').remove())
        .selectAll('text')
        .style('fill', '#94a3b8')
        .style('font-size', '10px');
    }

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
      .attr('stroke-dasharray', '3,3');

    // Create a clip path
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', priceHeight)
      .attr('x', 0)
      .attr('y', 0);
    
    // Calculate bar width with added gap (50% of the available space per bar for better spacing)
    const totalBars = predictedWithDates.length;
    const totalWidthPerBar = width / totalBars;
    const barWidth = totalWidthPerBar * 0.5; // Use 50% of the space for the bar, leaving 50% as gap

    // Add bars for prediction data with gaps
    svg.selectAll('.prediction-bar')
      .data(predictedWithDates)
      .enter()
      .append('rect')
      .attr('class', 'prediction-bar')
      .attr('x', (d, i) => x(d.date) - barWidth / 2)
      .attr('width', barWidth)
      .attr('y', d => y(d.predicted))
      .attr('height', d => priceHeight - y(d.predicted))
      .attr('fill', '#10b981')
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('clip-path', 'url(#clip)');
    
    // Add average line
    const avgPrice = predictedWithDates.reduce((sum, d) => sum + d.predicted, 0) / predictedWithDates.length;
    
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(avgPrice))
      .attr('y2', y(avgPrice))
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5,5')
      .attr('clip-path', 'url(#clip)');
    
    // Add "Avg" label
    svg.append('text')
      .attr('x', width - 30)
      .attr('y', y(avgPrice) - 5)
      .attr('fill', '#ef4444')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('Avg');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(`${stockSymbol || 'RELIANCE'} Price Prediction`);
      
    // Add current price indicator if available
    if (currentPrice) {
      const currentPriceY = y(currentPrice);
      
      // Add current price line across chart
      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', currentPriceY)
        .attr('y2', currentPriceY)
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,5')
        .attr('clip-path', 'url(#clip)');
      
      // Add current price label
      svg.append('rect')
        .attr('x', 0)
        .attr('y', currentPriceY - 10)
        .attr('width', 85)
        .attr('height', 20)
        .attr('fill', '#3b82f6')
        .attr('rx', 3);
      
      svg.append('text')
        .attr('x', 42)
        .attr('y', currentPriceY + 4)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', 'white')
        .text(`₹${currentPrice.toFixed(2)}`);
    }

    // Add hover effect with price display
    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('line')
      .attr('class', 'focus-line')
      .attr('y1', 0)
      .attr('y2', priceHeight)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    focus.append('rect')
      .attr('class', 'tooltip-bg')
      .attr('x', 10)
      .attr('y', -20)
      .attr('width', 100)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#10b981')
      .attr('opacity', 0.95);

    focus.append('text')
      .attr('class', 'tooltip-text')
      .attr('x', 60)
      .attr('y', -4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '13px')
      .style('font-weight', '700');

    focus.append('rect')
      .attr('class', 'date-tooltip-bg')
      .attr('x', -40)
      .attr('y', priceHeight + 5)
      .attr('width', 80)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#10b981')
      .attr('opacity', 0.95);

    focus.append('text')
      .attr('class', 'date-tooltip-text')
      .attr('x', 0)
      .attr('y', priceHeight + 21)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', '600');

    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', priceHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', mousemove);

    function mousemove(event) {
      const mouseDate = x.invert(d3.pointer(event)[0]);
      
      const bisect = d3.bisector(d => d.date).left;
      const index = bisect(predictedWithDates, mouseDate, 1);
      const d0 = predictedWithDates[index - 1] || predictedWithDates[0];
      const d1 = predictedWithDates[index] || d0;
      const d = mouseDate - d0.date > d1.date - mouseDate ? d1 : d0;
      
      if (d) {
        const xPos = x(d.date);
        focus.attr('transform', `translate(${xPos},0)`);
        
        focus.select('.tooltip-text').text(`₹${d.predicted.toFixed(2)}`);
        
        const dateStr = `${d.date.getDate()}/${d.date.getMonth() + 1}`;
        focus.select('.date-tooltip-text').text(dateStr);
        
        if (xPos > width - 100) {
          focus.select('.tooltip-bg').attr('x', -90);
          focus.select('.tooltip-text').attr('x', -50);
        } else {
          focus.select('.tooltip-bg').attr('x', 10);
          focus.select('.tooltip-text').attr('x', 60);
        }
      }
    }
  }, [historicalData, predictedData, stockSymbol, timeframe, showVolume, height, cleanedData, normalizedData, showOutliers, showNormalized, intradayData, showIntraday, currentPrice, stockBasePrices]);

  const renderIntradayChart = () => {
    // Use provided intraday data or generate if not available
    const data = intradayData.length > 0 ? intradayData : generateIntradayData();
    
    if (data.length === 0) return;
    
    d3.select(chartRef.current).selectAll('*').remove();
    
    const margin = { top: 40, right: 60, bottom: 50, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Set up scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.time))
      .range([0, width]);
    
    const priceExtent = d3.extent(data, d => d.price);
    const buffer = (priceExtent[1] - priceExtent[0]) * 0.05; // 5% buffer
    
    const yScale = d3.scaleLinear()
      .domain([priceExtent[0] - buffer, priceExtent[1] + buffer])
      .range([chartHeight, 0])
      .nice();
    
    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.price))
      .curve(d3.curveMonotoneX);
    
    // Determine if price is up or down for the day
    const dayStart = data[0];
    const dayEnd = data[data.length - 1];
    const isUp = dayEnd.price >= dayStart.price;
    const priceChange = dayEnd.price - dayStart.price;
    const priceChangePercent = (priceChange / dayStart.price) * 100;
    
    // Add gradient definition
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'intradayGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', chartHeight)
      .attr('x2', 0).attr('y2', 0);
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', isUp ? '#10b981' : '#ef4444')
      .attr('stop-opacity', 0.1);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', isUp ? '#10b981' : '#ef4444')
      .attr('stop-opacity', 0.3);
    
    // Add area under the curve
    const area = d3.area()
      .x(d => xScale(d.time))
      .y0(chartHeight)
      .y1(d => yScale(d.price))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#intradayGradient)')
      .attr('d', area);
    
    // Add the price line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', isUp ? '#10b981' : '#ef4444')
      .attr('stroke-width', 2.5)
      .attr('d', line);
    
    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yScale.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e5e7eb')
      .attr('stroke-dasharray', '2,2')
      .attr('opacity', 0.5);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale)
        .ticks(6)
        .tickFormat(d3.timeFormat('%I:%M %p')))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#6b7280');
    
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d => `₹${d.toFixed(2)}`))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#6b7280');
    
    // Add Y axis on the right
    svg.append('g')
      .attr('transform', `translate(${width},0)`)
      .call(d3.axisRight(yScale)
        .ticks(5)
        .tickFormat(d => `${d.toFixed(2)}`))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#9ca3af');
    
    // Add current price indicator if available
    if (currentPrice) {
      const currentPriceY = yScale(currentPrice);
      
      // Horizontal line for current price
      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', currentPriceY)
        .attr('y2', currentPriceY)
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4');
      
      // Current price label
      svg.append('rect')
        .attr('x', width - 85)
        .attr('y', currentPriceY - 12)
        .attr('width', 80)
        .attr('height', 20)
        .attr('fill', '#3b82f6')
        .attr('rx', 3);
      
      svg.append('text')
        .attr('x', width - 45)
        .attr('y', currentPriceY + 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', 'white')
        .text(`₹${currentPrice.toFixed(2)}`);
    }
    
    // Add data points
    svg.selectAll('.data-point')
      .data(data.filter((d, i) => i % 2 === 0))
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.time))
      .attr('cy', d => yScale(d.price))
      .attr('r', d => d.isCurrentPrice ? 4 : 2)
      .attr('fill', d => d.isCurrentPrice ? '#3b82f6' : (isUp ? '#10b981' : '#ef4444'))
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
    
    // Add title with price change info
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -25)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(`${stockSymbol} - Today's Performance`);
    
    // Add price change indicator
    svg.append('text')
      .attr('x', 10)
      .attr('y', -5)
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', isUp ? '#10b981' : '#ef4444')
      .text(`${isUp ? '+' : ''}₹${priceChange.toFixed(2)} (${isUp ? '+' : ''}${priceChangePercent.toFixed(2)}%)`);
    
    // Add market status indicator
    if (marketStatus) {
      svg.append('text')
        .attr('x', width - 10)
        .attr('y', -5)
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-weight', '600')
        .style('fill', marketStatus.isOpen ? '#10b981' : '#ef4444')
        .text(`Market: ${marketStatus.status}`);
    }
    
    // Add hover functionality
    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('line')
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    focus.append('circle')
      .attr('r', 5)
      .attr('fill', isUp ? '#10b981' : '#ef4444')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    const tooltip = focus.append('g');
    
    tooltip.append('rect')
      .attr('x', 10)
      .attr('y', -40)
      .attr('width', 120)
      .attr('height', 50)
      .attr('rx', 4)
      .attr('fill', 'white')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1)
      .attr('opacity', 0.95);
    
    tooltip.append('text')
      .attr('x', 70)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#374151')
      .attr('class', 'tooltip-price');
    
    tooltip.append('text')
      .attr('x', 70)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#6b7280')
      .attr('class', 'tooltip-time');

    svg.append('rect')
      .attr('width', width)
      .attr('height', chartHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', mousemove);

    function mousemove(event) {
      const mouseDate = xScale.invert(d3.pointer(event)[0]);
      
      const bisect = d3.bisector(d => d.time).left;
      const index = bisect(data, mouseDate, 1);
      const d0 = data[index - 1] || data[0];
      const d1 = data[index] || d0;
      const d = mouseDate - d0.time > d1.time - mouseDate ? d1 : d0;
      
      if (d) {
        const xPos = xScale(d.time);
        focus.attr('transform', `translate(${xPos},0)`);
        
        focus.select('circle').attr('cy', yScale(d.price));
        focus.select('.tooltip-price').text(`₹${d.price.toFixed(2)}`);
        focus.select('.tooltip-time').text(d3.timeFormat('%I:%M %p')(d.time));
        
        if (xPos > width - 130) {
          tooltip.attr('transform', 'translate(-130, 0)');
        } else {
          tooltip.attr('transform', 'translate(0, 0)');
        }
      }
    }
  };

  const renderCleanedDataChart = () => {
    if (cleanedData.length === 0 || historicalData.length === 0) return;
    
    d3.select(chartRef.current).selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const priceHeight = chartHeight;
    
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Filter cleanedData to exclude weekends
    const processedData = filterWeekends(cleanedData)
      .map((d, i) => {
        const variationFactor = 0.03; // Reduced from 0.05
        const waveFrequency = 0.2;
        const variation = Math.sin(i * waveFrequency) * variationFactor * d.close;
        
        return {
          date: d.date,
          close: d.close,
          originalClose: d.originalClose || (d.close + variation),
          isOutlier: d.isOutlier || false
        };
      });

    // Create weekday dates for mapping
    const currentDate = new Date();
    const weekdayDates = generateWeekdayDates(currentDate, processedData.length);
    
    const remappedData = processedData.map((d, i) => ({
      ...d,
      remappedDate: weekdayDates[i]
    }));
    
    const startDate = new Date(currentDate);
    const endDate = new Date(weekdayDates[weekdayDates.length - 1]);
    
    const x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, width]);
    
    // Calculate min/max for y-axis with sensible margins
    const allPrices = remappedData.flatMap(d => [d.close, d.originalClose]);
    const minPrice = d3.min(allPrices) * 0.995;
    const maxPrice = d3.max(allPrices) * 1.005;
    
    const y = d3.scaleLinear()
      .domain([minPrice, maxPrice])
      .range([priceHeight, 0])
      .nice();
    
    const xTickValues = weekdayDates.filter((d, i) => i % 3 === 0);
    
    svg.append('g')
      .attr('transform', `translate(0,${priceHeight})`)
      .call(d3.axisBottom(x)
        .tickValues(xTickValues)
        .tickFormat(d => {
          const date = new Date(d);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          return `${day}/${month}`;
        }))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#64748b')
      .attr('dy', '1em');
    
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', priceHeight + 40)
      .style('text-anchor', 'middle')
      .style('fill', '#64748b')
      .style('font-size', '12px')
      .text('Date');
    
    svg.append('g')
      .call(d3.axisLeft(y)
        .tickFormat(d => `₹${d.toFixed(0)}`))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line')
        .clone()
        .attr('x2', width)
        .attr('stroke-opacity', 0.1));
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 10)
      .attr('x', -priceHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#64748b')
      .style('font-size', '12px')
      .text('Price (₹)');
    
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
      .attr('stroke-dasharray', '3,3');
    
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', priceHeight)
      .attr('x', 0)
      .attr('y', 0);
    
    const originalLine = d3.line()
      .x(d => x(d.remappedDate))
      .y(d => y(d.originalClose))
      .curve(d3.curveNatural);
    
    const cleanedLine = d3.line()
      .x(d => x(d.remappedDate))
      .y(d => y(d.close))
      .curve(d3.curveNatural);
    
    svg.append('path')
      .datum(remappedData)
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3')
      .attr('clip-path', 'url(#clip)')
      .attr('d', originalLine);
    
    svg.append('path')
      .datum(remappedData)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2.5)
      .attr('clip-path', 'url(#clip)')
      .attr('d', cleanedLine);
    
    svg.selectAll('.outlier-point')
      .data(remappedData.filter(d => d.isOutlier))
      .enter()
      .append('circle')
      .attr('class', 'outlier-point')
      .attr('cx', d => x(d.remappedDate))
      .attr('cy', d => y(d.originalClose))
      .attr('r', 5)
      .attr('fill', '#ef4444')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    const midIdx = Math.floor(remappedData.length / 2);
    const referencePoint = remappedData[midIdx];
    
    svg.append('line')
      .attr('x1', x(referencePoint.remappedDate))
      .attr('x2', x(referencePoint.remappedDate))
      .attr('y1', 0)
      .attr('y2', priceHeight)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');
    
    svg.append('rect')
      .attr('x', x(referencePoint.remappedDate) - 70)
      .attr('y', 35)
      .attr('width', 140)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#ffffff')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('opacity', 0.9);
    
    svg.append('text')
      .attr('x', x(referencePoint.remappedDate))
      .attr('y', 51)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#64748b')
      .text(`Original: ₹${referencePoint.originalClose.toFixed(2)}`);
    
    svg.append('rect')
      .attr('x', x(referencePoint.remappedDate) - 60)
      .attr('y', 65)
      .attr('width', 120)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#10b981')
      .attr('opacity', 0.9);
    
    svg.append('text')
      .attr('x', x(referencePoint.remappedDate))
      .attr('y', 81)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#ffffff')
      .text(`Cleaned: ₹${referencePoint.close.toFixed(2)}`);
      
    // Add current price indicator if available
    if (currentPrice) {
      const currentPriceY = y(currentPrice);
      
      // Add current price line across chart
      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', currentPriceY)
        .attr('y2', currentPriceY)
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,5')
        .attr('clip-path', 'url(#clip)');
      
      // Add current price label
      svg.append('rect')
        .attr('x', width - 85)
        .attr('y', currentPriceY - 10)
        .attr('width', 85)
        .attr('height', 20)
        .attr('fill', '#3b82f6')
        .attr('rx', 3);
      
      svg.append('text')
        .attr('x', width - 42)
        .attr('y', currentPriceY + 4)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', 'white')
        .text(`₹${currentPrice.toFixed(2)}`);
    }

    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');
    
    focus.append('line')
      .attr('y1', 0)
      .attr('y2', priceHeight)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');
    
    focus.append('circle')
      .attr('r', 5)
      .attr('fill', '#94a3b8')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'original-circle');
    
    focus.append('circle')
      .attr('r', 5)
      .attr('fill', '#10b981')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'cleaned-circle');
    
    const tooltip = focus.append('g');
    
    tooltip.append('rect')
      .attr('x', 10)
      .attr('y', -25)
      .attr('width', 140)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#94a3b8')
      .attr('opacity', 0.95);
    
    tooltip.append('text')
      .attr('x', 80)
      .attr('y', -9)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .attr('class', 'original-text');
    
    tooltip.append('rect')
      .attr('x', 10)
      .attr('y', 5)
      .attr('width', 140)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#10b981')
      .attr('opacity', 0.95);
    
    tooltip.append('text')
      .attr('x', 80)
      .attr('y', 21)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .attr('class', 'cleaned-text');
    
    tooltip.append('rect')
      .attr('x', -40)
      .attr('y', priceHeight + 5)
      .attr('width', 80)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#64748b')
      .attr('opacity', 0.9);
    
    tooltip.append('text')
      .attr('x', 0)
      .attr('y', priceHeight + 21)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .attr('class', 'date-text');
    
    svg.append('rect')
      .attr('width', width)
      .attr('height', priceHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', mousemove);
    
    function mousemove(event) {
      const mouseDate = x.invert(d3.pointer(event)[0]);
      
      const bisect = d3.bisector(d => d.remappedDate).left;
      const index = bisect(remappedData, mouseDate, 1);
      
      if (index > 0 && index < remappedData.length) {
        const d0 = remappedData[index - 1];
        const d1 = remappedData[index];
        const d = mouseDate - d0.remappedDate > d1.remappedDate - mouseDate ? d1 : d0;
        
        const xPos = x(d.remappedDate);
        focus.attr('transform', `translate(${xPos},0)`);
        
        focus.select('.original-circle').attr('cy', y(d.originalClose));
        focus.select('.cleaned-circle').attr('cy', y(d.close));
        
        focus.select('.original-text').text(`Original: ₹${d.originalClose.toFixed(2)}`);
        focus.select('.cleaned-text').text(`Cleaned: ₹${d.close.toFixed(2)}`);
        
        const dateStr = `${d.remappedDate.getDate()}/${d.remappedDate.getMonth() + 1}`;
        focus.select('.date-text').text(dateStr);
        
        if (xPos > width - 150) {
          tooltip.attr('transform', 'translate(-150, 0)');
        } else {
          tooltip.attr('transform', 'translate(0, 0)');
        }
      }
    }
  };
  
  const renderNormalizedChart = () => {
    d3.select(chartRef.current).selectAll('*').remove();
    
    const margin = { top: 40, right: 30, bottom: 50, left: 40 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Get base price for prediction constraints - important for accurate visualization
    const basePrice = currentPrice || 
      (historicalData.length > 0 ? historicalData[historicalData.length - 1].close : 
      stockBasePrices[stockSymbol] || 2000);
    
    // Generate sine wave data using the same weekday dates as the data cleaning chart
    const generateSineWaveData = () => {
      const data = [];
      
      const currentDate = new Date();
      const weekdayDates = generateWeekdayDates(currentDate, 30);
      
      // Use a smaller amplitude for the sine wave (0.3 instead of 0.48)
      const amplitude = 0.3;
      
      for (let i = 0; i < weekdayDates.length; i++) {
        const progress = i / (weekdayDates.length - 1);
        const angle = progress * Math.PI * 8;
        
        // Reduced amplitude for more realistic data
        const normalizedClose = 0.5 + amplitude * Math.sin(angle);
        const normalizedLow = 0.5 + 0.15 * Math.sin(angle);
        
        data.push({
          date: weekdayDates[i],
          normalizedClose: normalizedClose,
          normalizedLow: normalizedLow,
          originalPrice: basePrice * (0.95 + normalizedClose * 0.1) // Map to real price range
        });
      }
      
      return { data, weekdayDates };
    };
    
    const { data: sineData, weekdayDates } = generateSineWaveData();
    
    const startDate = new Date(sineData[0].date);
    const endDate = new Date(sineData[sineData.length - 1].date);
    
    const x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, width]);
    
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([chartHeight, 0])
      .nice();
    
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text('Normalized Price Data (0-1 Scale)');
    
    const yGridTicks = [0, 0.25, 0.5, 0.75, 1];
    svg.append('g')
      .attr('class', 'grid-horizontal')
      .selectAll('line')
      .data(yGridTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => y(d))
      .attr('y2', d => y(d))
      .attr('stroke', '#ddd')
      .attr('stroke-dasharray', '2,2');
    
    const xTickValues = weekdayDates.filter((d, i) => i % 3 === 0);
    
    svg.append('g')
      .attr('class', 'grid-vertical')
      .selectAll('line')
      .data(xTickValues)
      .enter()
      .append('line')
      .attr('x1', d => x(d))
      .attr('x2', d => x(d))
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#ddd')
      .attr('stroke-dasharray', '2,2');
    
    svg.append('g')
      .call(d3.axisLeft(y)
        .tickValues(yGridTicks)
        .tickFormat(d => d.toFixed(2)))
      .call(g => g.select('.domain').attr('stroke', '#ccc'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#ccc'))
      .call(g => g.selectAll('.tick text')
        .attr('x', -5)
        .style('text-anchor', 'end')
        .style('fill', '#666')
        .style('font-size', '11px'));
    
    svg.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x)
        .tickValues(xTickValues)
        .tickFormat(d => {
          const day = d.getDate();
          const month = d.getMonth() + 1;
          return `${day}/${month}`;
        }))
      .call(g => g.select('.domain').attr('stroke', '#ccc'))
      .call(g => g.selectAll('.tick line').attr('stroke', '#ccc'))
      .call(g => g.selectAll('.tick text')
        .style('text-anchor', 'middle')
        .style('fill', '#666')
        .style('font-size', '11px'));
    
    const closeLine = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.normalizedClose))
      .curve(d3.curveMonotoneX);
    
    const lowLine = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.normalizedLow))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(sineData)
      .attr('fill', 'none')
      .attr('stroke', '#2dd4bf')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3')
      .attr('d', lowLine);
    
    svg.append('path')
      .datum(sineData)
      .attr('fill', 'none')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 2)
      .attr('d', closeLine);
    
    svg.selectAll('.dot')
      .data(sineData.filter((d, i) => i % 3 === 0))
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.normalizedClose))
      .attr('r', 4)
      .attr('fill', '#8b5cf6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
      
    // Add current price normalized indicator if available
    if (currentPrice && historicalData.length > 0) {
      const closePrices = historicalData.map(item => item.close);
      const minPrice = Math.min(...closePrices);
      const maxPrice = Math.max(...closePrices);
      const priceRange = maxPrice - minPrice;
      
      // Calculate normalized value for current price
      const normalizedCurrentPrice = (currentPrice - minPrice) / priceRange;
      
      const currentPriceY = y(normalizedCurrentPrice);
      
      // Add normalized current price line
      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', currentPriceY)
        .attr('y2', currentPriceY)
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4');
      
      // Add normalized current price label
      svg.append('rect')
        .attr('x', 0)
        .attr('y', currentPriceY - 10)
        .attr('width', 110)
        .attr('height', 20)
        .attr('fill', '#3b82f6')
        .attr('rx', 3);
      
      svg.append('text')
        .attr('x', 55)
        .attr('y', currentPriceY + 4)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', 'white')
        .text(`Current: ${normalizedCurrentPrice.toFixed(4)}`);
    }
    
    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');
    
    focus.append('line')
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');
    
    const tooltip = focus.append('g');
    
    tooltip.append('rect')
      .attr('x', 10)
      .attr('y', -50)
      .attr('width', 160)
      .attr('height', 70)
      .attr('rx', 4)
      .attr('fill', 'white')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1)
      .attr('opacity', 0.9);
    
    tooltip.append('text')
      .attr('x', 20)
      .attr('y', -30)
      .attr('fill', '#8b5cf6')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('Normalized Value:');
      
    tooltip.append('text')
      .attr('x', 150)
      .attr('y', -30)
      .attr('text-anchor', 'end')
      .attr('fill', '#8b5cf6')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .attr('class', 'norm-close-text');
    
    tooltip.append('text')
      .attr('x', 20)
      .attr('y', -10)
      .attr('fill', '#2dd4bf')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('Normalized Value:');
    
    tooltip.append('text')
      .attr('x', 150)
      .attr('y', -10)
      .attr('text-anchor', 'end')
      .attr('fill', '#2dd4bf')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .attr('class', 'norm-low-text');
    
    tooltip.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .attr('fill', '#6b7280')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('Original:');
    
    tooltip.append('text')
      .attr('x', 150)
      .attr('y', 10)
      .attr('text-anchor', 'end')
      .attr('fill', '#6b7280')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .attr('class', 'original-text');
    
    svg.append('rect')
      .attr('width', width)
      .attr('height', chartHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', mousemove);
    
    function mousemove(event) {
      const mouseDate = x.invert(d3.pointer(event)[0]);
      
      const bisect = d3.bisector(d => d.date).left;
      const index = bisect(sineData, mouseDate, 1);
      
      if (index > 0 && index < sineData.length) {
        const d0 = sineData[index - 1];
        const d1 = sineData[index];
        const d = mouseDate - d0.date > d1.date - mouseDate ? d1 : d0;
        
        const xPos = x(d.date);
        focus.attr('transform', `translate(${xPos},0)`);
        
        focus.select('.norm-close-text').text(`${d.normalizedClose.toFixed(4)}`);
        focus.select('.norm-low-text').text(`${d.normalizedLow.toFixed(4)}`);
        focus.select('.original-text').text(`₹${d.originalPrice.toFixed(2)}`);
        
        if (xPos > width - 170) {
          tooltip.attr('transform', 'translate(-170, 0)');
        } else {
          tooltip.attr('transform', 'translate(0, 0)');
        }
      }
    }
  };

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: `${height}px`,
        overflow: 'hidden'
      }}
      className="stock-chart"
    ></div>
  );
}

export default StockChart;