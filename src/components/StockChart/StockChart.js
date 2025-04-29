


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
//   // New props for data processing
//   cleanedData = [],
//   normalizedData = [],
//   showOutliers = false,
//   showNormalized = false
// }) {
//   const chartRef = useRef(null);

//   useEffect(() => {
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
//     if (historicalData.length === 0) return;

//     // Clear previous chart
//     d3.select(chartRef.current).selectAll('*').remove();

//     // Filter data based on timeframe
//     const timeframeData = historicalData.slice(-parseInt(timeframe));

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

//     // Parse dates
//     const parseDate = d3.timeParse('%Y-%m-%d');
    
//     const data = timeframeData.map(d => ({
//       date: parseDate(d.date),
//       open: d.open,
//       high: d.high,
//       low: d.low,
//       close: d.close,
//       volume: d.volume
//     }));

//     // Add predicted data if available
//     const combinedData = [...data];
    
//     if (predictedData && predictedData.length > 0) {
//       const predictedWithDates = predictedData.map(d => ({
//         date: parseDate(d.date),
//         predicted: d.predicted
//       }));
      
//       // Combine with historical data for x-axis
//       predictedWithDates.forEach(item => {
//         combinedData.push(item);
//       });
//     }

//     // X scale
//     const x = d3.scaleTime()
//       .domain(d3.extent(combinedData, d => d.date))
//       .range([0, width]);

//     // Y scale for price
//     const y = d3.scaleLinear()
//       .domain([
//         d3.min(combinedData, d => d.low || d.predicted || d.close) * 0.995,
//         d3.max(combinedData, d => d.high || d.predicted || d.close) * 1.005
//       ])
//       .range([priceHeight, 0]);

//     // Y scale for volume
//     const yVolume = d3.scaleLinear()
//       .domain([0, d3.max(data, d => d.volume)])
//       .range([chartHeight, priceHeight + 10]);

//     // Add X axis with day and date format
//     svg.append('g')
//       .attr('transform', `translate(0,${priceHeight})`)
//       .call(d3.axisBottom(x)
//         .ticks(Math.min(10, timeframeData.length / 8))
//         .tickFormat(d => {
//           const date = new Date(d);
//           const day = date.getDate();
//           const month = date.getMonth() + 1;
//           return `${month}/${day}`;
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
//     if (showVolume) {
//       svg.append('g')
//         .selectAll('rect')
//         .data(data)
//         .enter()
//         .append('rect')
//         .attr('x', d => x(d.date) - (width / data.length) / 2 + 1)
//         .attr('width', width / data.length - 2)
//         .attr('y', d => yVolume(d.volume))
//         .attr('height', d => chartHeight - yVolume(d.volume))
//         .attr('fill', (d, i) => i > 0 ? (d.close >= data[i-1].close ? '#dcfce7' : '#fee2e2') : '#e2e8f0')
//         .attr('opacity', 0.7);

//       // Add Volume Y axis
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

//     // Area fill under the curve
//     const area = d3.area()
//       .x(d => x(d.date))
//       .y0(priceHeight)
//       .y1(d => y(d.close))
//       .curve(d3.curveMonotoneX);

//     // Add area with subtle fill
//     svg.append('path')
//       .datum(data)
//       .attr('fill', 'url(#blue-gradient)')
//       .attr('clip-path', 'url(#clip)')
//       .attr('d', area);

//     // Define gradient for area
//     const gradient = svg.append('defs')
//       .append('linearGradient')
//       .attr('id', 'blue-gradient')
//       .attr('x1', '0%')
//       .attr('y1', '0%')
//       .attr('x2', '0%')
//       .attr('y2', '100%');

//     gradient.append('stop')
//       .attr('offset', '0%')
//       .attr('stop-color', '#3b82f6')
//       .attr('stop-opacity', 0.2);

//     gradient.append('stop')
//       .attr('offset', '100%')
//       .attr('stop-color', '#3b82f6')
//       .attr('stop-opacity', 0.05);

//     // Line generator for historical data with smoother curve
//     const line = d3.line()
//       .x(d => x(d.date))
//       .y(d => y(d.close))
//       .curve(d3.curveMonotoneX);

//     // Create price path
//     svg.append('path')
//       .datum(data)
//       .attr('fill', 'none')
//       .attr('stroke', '#3b82f6')
//       .attr('stroke-width', 2.5)
//       .attr('clip-path', 'url(#clip)')
//       .attr('d', line);

//     // Add predicted line if available
//     if (predictedData && predictedData.length > 0) {
//       const lastActualDate = data[data.length - 1].date;
//       const lastActualPrice = data[data.length - 1].close;
      
//       const predictedWithDates = predictedData.map(d => ({
//         date: parseDate(d.date),
//         predicted: d.predicted
//       }));
      
//       // Start prediction line at the last actual data point
//       const predictionData = [
//         { date: lastActualDate, predicted: lastActualPrice },
//         ...predictedWithDates
//       ];
      
//       // Line generator for predicted data
//       const predLine = d3.line()
//         .x(d => x(d.date))
//         .y(d => y(d.predicted))
//         .curve(d3.curveMonotoneX);
      
//       // Area generator for predicted data
//       const predArea = d3.area()
//         .x(d => x(d.date))
//         .y0(priceHeight)
//         .y1(d => y(d.predicted))
//         .curve(d3.curveMonotoneX);
      
//       // Define gradient for prediction area
//       const predGradient = svg.append('defs')
//         .append('linearGradient')
//         .attr('id', 'pred-gradient')
//         .attr('x1', '0%')
//         .attr('y1', '0%')
//         .attr('x2', '0%')
//         .attr('y2', '100%');
      
//       predGradient.append('stop')
//         .attr('offset', '0%')
//         .attr('stop-color', '#10b981')
//         .attr('stop-opacity', 0.2);
      
//       predGradient.append('stop')
//         .attr('offset', '100%')
//         .attr('stop-color', '#10b981')
//         .attr('stop-opacity', 0.05);
      
//       // Add prediction area
//       svg.append('path')
//         .datum(predictionData)
//         .attr('fill', 'url(#pred-gradient)')
//         .attr('clip-path', 'url(#clip)')
//         .attr('d', predArea);
      
//       // Add prediction line (dashed style)
//       svg.append('path')
//         .datum(predictionData)
//         .attr('fill', 'none')
//         .attr('stroke', '#10b981')
//         .attr('stroke-width', 2.5)
//         .attr('stroke-dasharray', '5,5')
//         .attr('clip-path', 'url(#clip)')
//         .attr('d', predLine);
      
//       // Add vertical line at prediction start
//       svg.append('line')
//         .attr('x1', x(lastActualDate))
//         .attr('x2', x(lastActualDate))
//         .attr('y1', 0)
//         .attr('y2', priceHeight)
//         .attr('stroke', '#94a3b8')
//         .attr('stroke-width', 1)
//         .attr('stroke-dasharray', '4,4');
      
//       // Add "Today" label
//       svg.append('text')
//         .attr('x', x(lastActualDate))
//         .attr('y', -5)
//         .attr('text-anchor', 'middle')
//         .style('font-size', '10px')
//         .style('fill', '#64748b')
//         .text('Today');
//     }

//     // Add hover effect with price display
//     const focus = svg.append('g')
//       .attr('class', 'focus')
//       .style('display', 'none');

//     // Vertical line on hover
//     focus.append('line')
//       .attr('class', 'focus-line')
//       .attr('y1', 0)
//       .attr('y2', priceHeight)
//       .attr('stroke', '#64748b')
//       .attr('stroke-width', 1)
//       .attr('stroke-dasharray', '3,3');

//     // Circle on hover
//     focus.append('circle')
//       .attr('r', 5)
//       .attr('fill', '#3b82f6')
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 2);

//     // Background for price tooltip
//     focus.append('rect')
//       .attr('class', 'tooltip-bg')
//       .attr('x', 10)
//       .attr('y', -20)
//       .attr('width', 80)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#334155')
//       .attr('opacity', 0.9);

//     // Price text
//     focus.append('text')
//       .attr('class', 'tooltip-text')
//       .attr('x', 50)
//       .attr('y', -4)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#fff')
//       .style('font-size', '12px');

//     // Background for date tooltip
//     focus.append('rect')
//       .attr('class', 'date-tooltip-bg')
//       .attr('x', -40)
//       .attr('y', priceHeight + 5)
//       .attr('width', 80)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#334155')
//       .attr('opacity', 0.9);

//     // Date text
//     focus.append('text')
//       .attr('class', 'date-tooltip-text')
//       .attr('x', 0)
//       .attr('y', priceHeight + 21)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#fff')
//       .style('font-size', '12px');

//     // Add overlay for interactivity
//     svg.append('rect')
//       .attr('class', 'overlay')
//       .attr('width', width)
//       .attr('height', priceHeight)
//       .style('fill', 'none')
//       .style('pointer-events', 'all')
//       .on('mouseover', () => focus.style('display', null))
//       .on('mouseout', () => focus.style('display', 'none'))
//       .on('mousemove', mousemove);

//     // Handle mouse movement
//     function mousemove(event) {
//       const bisect = d3.bisector(d => d.date).left;
//       const x0 = x.invert(d3.pointer(event)[0]);
//       const i = bisect(data, x0, 1);
//       const d0 = data[i - 1];
//       const d1 = data[i] || d0;
//       const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      
//       // Position the focus
//       focus.attr('transform', `translate(${x(d.date)},0)`);
      
//       // Update tooltip values
//       focus.select('.tooltip-text').text(`₹${d.close.toFixed(2)}`);
      
//       // Format date as day/month
//       const dateStr = `${d.date.getDate()}/${d.date.getMonth() + 1}`;
//       focus.select('.date-tooltip-text').text(dateStr);
      
//       // Adjust tooltip positioning if needed
//       if (x(d.date) > width - 100) {
//         focus.select('.tooltip-bg').attr('x', -90);
//         focus.select('.tooltip-text').attr('x', -50);
//       } else {
//         focus.select('.tooltip-bg').attr('x', 10);
//         focus.select('.tooltip-text').attr('x', 50);
//       }
//     }
//   }, [historicalData, predictedData, stockSymbol, timeframe, showVolume, height]);

//   // New function to render cleaned data chart with outliers
//   const renderCleanedDataChart = () => {
//     if (cleanedData.length === 0 || historicalData.length === 0) return;
    
//     // Clear previous chart
//     d3.select(chartRef.current).selectAll('*').remove();
    
//     // Set up dimensions
//     const margin = { top: 20, right: 30, bottom: 50, left: 70 };
//     const width = chartRef.current.clientWidth - margin.left - margin.right;
//     const chartHeight = height - margin.top - margin.bottom;
//     const priceHeight = chartHeight;
    
//     // Create SVG
//     const svg = d3.select(chartRef.current)
//       .append('svg')
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height)
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);
    
//     // Parse dates
//     const parseDate = d3.timeParse('%Y-%m-%d');
    
//     // Prepare data
//     const originalData = historicalData.map(d => ({
//       date: parseDate(d.date),
//       close: d.close
//     }));
    
//     const processedData = cleanedData.map(d => ({
//       date: parseDate(d.date),
//       close: d.close,
//       originalClose: d.originalClose || d.close,
//       isOutlier: d.isOutlier || false
//     }));
    
//     // X scale
//     const x = d3.scaleTime()
//       .domain(d3.extent(processedData, d => d.date))
//       .range([0, width]);
    
//     // Y scale
//     const y = d3.scaleLinear()
//       .domain([
//         d3.min(processedData, d => Math.min(d.close, d.originalClose)) * 0.995,
//         d3.max(processedData, d => Math.max(d.close, d.originalClose)) * 1.005
//       ])
//       .range([priceHeight, 0]);
    
//     // Add X axis
//     svg.append('g')
//       .attr('transform', `translate(0,${priceHeight})`)
//       .call(d3.axisBottom(x)
//         .ticks(Math.min(10, processedData.length / 8))
//         .tickFormat(d => {
//           const date = new Date(d);
//           const day = date.getDate();
//           const month = date.getMonth() + 1;
//           return `${month}/${day}`;
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
    
//     // Line generator for original data
//     const originalLine = d3.line()
//       .x(d => x(d.date))
//       .y(d => y(d.originalClose || d.close))
//       .curve(d3.curveMonotoneX);
    
//     // Line generator for cleaned data
//     const cleanedLine = d3.line()
//       .x(d => x(d.date))
//       .y(d => y(d.close))
//       .curve(d3.curveMonotoneX);
    
//     // Create original price path (lighter color)
//     svg.append('path')
//       .datum(processedData)
//       .attr('fill', 'none')
//       .attr('stroke', '#94a3b8')
//       .attr('stroke-width', 2)
//       .attr('stroke-dasharray', '3,3')
//       .attr('clip-path', 'url(#clip)')
//       .attr('d', originalLine);
    
//     // Create cleaned price path
//     svg.append('path')
//       .datum(processedData)
//       .attr('fill', 'none')
//       .attr('stroke', '#10b981')
//       .attr('stroke-width', 2.5)
//       .attr('clip-path', 'url(#clip)')
//       .attr('d', cleanedLine);
    
//     // Add outlier points
//     svg.selectAll('.outlier-point')
//       .data(processedData.filter(d => d.isOutlier))
//       .enter()
//       .append('circle')
//       .attr('class', 'outlier-point')
//       .attr('cx', d => x(d.date))
//       .attr('cy', d => y(d.originalClose || d.close))
//       .attr('r', 5)
//       .attr('fill', '#ef4444')
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 1.5);
    
//     // Add tooltip functionality similar to the original chart
//     const focus = svg.append('g')
//       .attr('class', 'focus')
//       .style('display', 'none');
    
//     // Vertical line on hover
//     focus.append('line')
//       .attr('class', 'focus-line')
//       .attr('y1', 0)
//       .attr('y2', priceHeight)
//       .attr('stroke', '#64748b')
//       .attr('stroke-width', 1)
//       .attr('stroke-dasharray', '3,3');
    
//     // Circle on hover for original data
//     focus.append('circle')
//       .attr('class', 'focus-circle-original')
//       .attr('r', 5)
//       .attr('fill', '#94a3b8')
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 2);
    
//     // Circle on hover for cleaned data
//     focus.append('circle')
//       .attr('class', 'focus-circle-cleaned')
//       .attr('r', 5)
//       .attr('fill', '#10b981')
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 2);
    
//     // Background for original price tooltip
//     focus.append('rect')
//       .attr('class', 'tooltip-bg-original')
//       .attr('x', 10)
//       .attr('y', -20)
//       .attr('width', 100)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#334155')
//       .attr('opacity', 0.9);
    
//     // Original price text
//     focus.append('text')
//       .attr('class', 'tooltip-text-original')
//       .attr('x', 60)
//       .attr('y', -4)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#ffffff')
//       .style('font-size', '12px')
//       .style('font-weight', '600');
    
//     // Background for cleaned price tooltip
//     focus.append('rect')
//       .attr('class', 'tooltip-bg-cleaned')
//       .attr('x', 10)
//       .attr('y', 10)
//       .attr('width', 100)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#334155')
//       .attr('opacity', 0.9);
    
//     // Cleaned price text
//     focus.append('text')
//       .attr('class', 'tooltip-text-cleaned')
//       .attr('x', 60)
//       .attr('y', 26)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#ffffff')
//       .style('font-size', '12px')
//       .style('font-weight', '600');
    
//     // Background for date tooltip
//     focus.append('rect')
//       .attr('class', 'date-tooltip-bg')
//       .attr('x', -40)
//       .attr('y', priceHeight + 5)
//       .attr('width', 80)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#334155')
//       .attr('opacity', 0.9);
    
//     // Date text
//     focus.append('text')
//       .attr('class', 'date-tooltip-text')
//       .attr('x', 0)
//       .attr('y', priceHeight + 21)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#fff')
//       .style('font-size', '12px');
    
//     // Add overlay for interactivity
//     svg.append('rect')
//       .attr('class', 'overlay')
//       .attr('width', width)
//       .attr('height', priceHeight)
//       .style('fill', 'none')
//       .style('pointer-events', 'all')
//       .on('mouseover', () => focus.style('display', null))
//       .on('mouseout', () => focus.style('display', 'none'))
//       .on('mousemove', mousemove);
    
//     // Handle mouse movement
//     function mousemove(event) {
//       const bisect = d3.bisector(d => d.date).left;
//       const x0 = x.invert(d3.pointer(event)[0]);
//       const i = bisect(processedData, x0, 1);
//       const d0 = processedData[i - 1];
//       const d1 = processedData[i] || d0;
//       const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      
//       // Position the focus
//       focus.attr('transform', `translate(${x(d.date)},0)`);
      
//       // Update circle positions
//       focus.select('.focus-circle-original')
//         .attr('cy', y(d.originalClose || d.close));
      
//       focus.select('.focus-circle-cleaned')
//         .attr('cy', y(d.close));
      
//       // Update tooltip values
//       focus.select('.tooltip-text-original')
//         .text(`Original: ₹${(d.originalClose || d.close).toFixed(2)}`);
      
//       focus.select('.tooltip-text-cleaned')
//         .text(`Cleaned: ₹${d.close.toFixed(2)}`);
      
//       // Format date as day/month
//       const dateStr = `${d.date.getDate()}/${d.date.getMonth() + 1}`;
//       focus.select('.date-tooltip-text').text(dateStr);
      
//       // Adjust tooltip positioning if needed
//       if (x(d.date) > width - 120) {
//         focus.select('.tooltip-bg-original').attr('x', -110);
//         focus.select('.tooltip-text-original').attr('x', -60);
//         focus.select('.tooltip-bg-cleaned').attr('x', -110);
//         focus.select('.tooltip-text-cleaned').attr('x', -60);
//       } else {
//         focus.select('.tooltip-bg-original').attr('x', 10);
//         focus.select('.tooltip-text-original').attr('x', 60);
//         focus.select('.tooltip-bg-cleaned').attr('x', 10);
//         focus.select('.tooltip-text-cleaned').attr('x', 60);
//       }
//     }
//   };
  
//   // New function to render normalized data chart
//   const renderNormalizedChart = () => {
//     if (normalizedData.length === 0) return;
    
//     // Clear previous chart
//     d3.select(chartRef.current).selectAll('*').remove();
    
//     // Set up dimensions
//     const margin = { top: 20, right: 30, bottom: 50, left: 70 };
//     const width = chartRef.current.clientWidth - margin.left - margin.right;
//     const chartHeight = height - margin.top - margin.bottom;
//     const priceHeight = chartHeight;
    
//     // Create SVG
//     const svg = d3.select(chartRef.current)
//       .append('svg')
//       .attr('width', width + margin.left + margin.right)
//       .attr('height', height)
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);
    
//     // Parse dates
//     const parseDate = d3.timeParse('%Y-%m-%d');
    
//     // Prepare data
//     const data = normalizedData.map(d => ({
//       date: parseDate(d.date),
//       normalizedClose: d.normalizedClose,
//       normalizedHigh: d.normalizedHigh,
//       normalizedLow: d.normalizedLow,
//       originalClose: d.originalClose || d.close
//     }));
    
//     // X scale
//     const x = d3.scaleTime()
//       .domain(d3.extent(data, d => d.date))
//       .range([0, width]);
    
//     // Y scale for normalized values (0-1)
//     const y = d3.scaleLinear()
//       .domain([0, 1])
//       .range([priceHeight, 0]);
    
//     // Add X axis
//     svg.append('g')
//       .attr('transform', `translate(0,${priceHeight})`)
//       .call(d3.axisBottom(x)
//         .ticks(Math.min(10, data.length / 8))
//         .tickFormat(d => {
//           const date = new Date(d);
//           const day = date.getDate();
//           const month = date.getMonth() + 1;
//           return `${month}/${day}`;
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
//         .tickFormat(d => d.toFixed(2)))
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
//       .text('Normalized Value (0-1)');
    
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
    
//     // Define gradient for area
//     const gradient = svg.append('defs')
//       .append('linearGradient')
//       .attr('id', 'purple-gradient')
//       .attr('x1', '0%')
//       .attr('y1', '0%')
//       .attr('x2', '0%')
//       .attr('y2', '100%');
    
//     gradient.append('stop')
//       .attr('offset', '0%')
//       .attr('stop-color', '#8b5cf6')
//       .attr('stop-opacity', 0.2);
    
//     gradient.append('stop')
//       .attr('offset', '100%')
//       .attr('stop-color', '#8b5cf6')
//       .attr('stop-opacity', 0.05);
    
//     // Area generator for normalized data
//     const area = d3.area()
//       .x(d => x(d.date))
//       .y0(priceHeight)
//       .y1(d => y(d.normalizedClose))
//       .curve(d3.curveMonotoneX);
    
//     // Add area with subtle fill
//     svg.append('path')
//       .datum(data)
//       .attr('fill', 'url(#purple-gradient)')
//       .attr('clip-path', 'url(#clip)')
//       .attr('d', area);
    
//     // Line generator for normalized data
//     const line = d3.line()
//       .x(d => x(d.date))
//       .y(d => y(d.normalizedClose))
//       .curve(d3.curveMonotoneX);
    
//     // Create normalized price path
//     svg.append('path')
//       .datum(data)
//       .attr('fill', 'none')
//       .attr('stroke', '#8b5cf6')
//       .attr('stroke-width', 2.5)
//       .attr('clip-path', 'url(#clip)')
//       .attr('d', line);
    
//     // Add high-low range area (similar to candlestick's shadow)
//     svg.selectAll('.range-line')
//       .data(data)
//       .enter()
//       .append('line')
//       .attr('class', 'range-line')
//       .attr('x1', d => x(d.date))
//       .attr('x2', d => x(d.date))
//       .attr('y1', d => y(d.normalizedHigh))
//       .attr('y2', d => y(d.normalizedLow))
//       .attr('stroke', '#8b5cf6')
//       .attr('stroke-width', 1)
//       .attr('opacity', 0.5);
    
//     // Add tooltip functionality
//     const focus = svg.append('g')
//       .attr('class', 'focus')
//       .style('display', 'none');
    
//     // Vertical line on hover
//     focus.append('line')
//       .attr('class', 'focus-line')
//       .attr('y1', 0)
//       .attr('y2', priceHeight)
//       .attr('stroke', '#64748b')
//       .attr('stroke-width', 1)
//       .attr('stroke-dasharray', '3,3');
    
//     // Circle on hover
//     focus.append('circle')
//       .attr('r', 5)
//       .attr('fill', '#8b5cf6')
//       .attr('stroke', '#fff')
//       .attr('stroke-width', 2);
    
//     // Background for normalized value tooltip
//     focus.append('rect')
//       .attr('class', 'tooltip-bg')
//       .attr('x', 10)
//       .attr('y', -20)
//       .attr('width', 130)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#334155')
//       .attr('opacity', 0.9);
    
//     // Normalized value text
//     focus.append('text')
//       .attr('class', 'tooltip-text')
//       .attr('x', 75)
//       .attr('y', -4)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#fff')
//       .style('font-size', '12px');
    
//     // Background for original price tooltip
//     focus.append('rect')
//       .attr('class', 'tooltip-bg-price')
//       .attr('x', 10)
//       .attr('y', 10)
//       .attr('width', 130)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#334155')
//       .attr('opacity', 0.9);
    
//     // Original price text
//     focus.append('text')
//       .attr('class', 'tooltip-text-price')
//       .attr('x', 75)
//       .attr('y', 26)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#fff')
//       .style('font-size', '12px');
    
//     // Background for date tooltip
//     focus.append('rect')
//       .attr('class', 'date-tooltip-bg')
//       .attr('x', -40)
//       .attr('y', priceHeight + 5)
//       .attr('width', 80)
//       .attr('height', 24)
//       .attr('rx', 4)
//       .attr('fill', '#334155')
//       .attr('opacity', 0.9);
    
//     // Date text
//     focus.append('text')
//       .attr('class', 'date-tooltip-text')
//       .attr('x', 0)
//       .attr('y', priceHeight + 21)
//       .attr('text-anchor', 'middle')
//       .attr('fill', '#fff')
//       .style('font-size', '12px');
    
//     // Add overlay for interactivity
//     svg.append('rect')
//       .attr('class', 'overlay')
//       .attr('width', width)
//       .attr('height', priceHeight)
//       .style('fill', 'none')
//       .style('pointer-events', 'all')
//       .on('mouseover', () => focus.style('display', null))
//       .on('mouseout', () => focus.style('display', 'none'))
//       .on('mousemove', mousemove);
    
//     // Handle mouse movement
//     function mousemove(event) {
//       const bisect = d3.bisector(d => d.date).left;
//       const x0 = x.invert(d3.pointer(event)[0]);
//       const i = bisect(data, x0, 1);
//       const d0 = data[i - 1];
//       const d1 = data[i] || d0;
//       const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      
//       // Position the focus
//       focus.attr('transform', `translate(${x(d.date)},0)`);
      
//       // Position the circle
//       focus.select('circle').attr('cy', y(d.normalizedClose));
      
//       // Update tooltip values
//       focus.select('.tooltip-text')
//         .text(`Normalized: ${d.normalizedClose.toFixed(4)}`);
      
//       focus.select('.tooltip-text-price')
//         .text(`Original: ₹${d.originalClose.toFixed(2)}`);
      
//       // Format date as day/month
//       const dateStr = `${d.date.getDate()}/${d.date.getMonth() + 1}`;
//       focus.select('.date-tooltip-text').text(dateStr);
      
//       // Adjust tooltip positioning if needed
//       if (x(d.date) > width - 150) {
//         focus.select('.tooltip-bg').attr('x', -140);
//         focus.select('.tooltip-text').attr('x', -75);
//         focus.select('.tooltip-bg-price').attr('x', -140);
//         focus.select('.tooltip-text-price').attr('x', -75);
//       } else {
//         focus.select('.tooltip-bg').attr('x', 10);
//         focus.select('.tooltip-text').attr('x', 75);
//         focus.select('.tooltip-bg-price').attr('x', 10);
//         focus.select('.tooltip-text-price').attr('x', 75);
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
  // New props for data processing
  cleanedData = [],
  normalizedData = [],
  showOutliers = false,
  showNormalized = false
}) {
  const chartRef = useRef(null);

  useEffect(() => {
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
    if (historicalData.length === 0) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Filter data based on timeframe
    const timeframeData = historicalData.slice(-parseInt(timeframe));

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

    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    
    const data = timeframeData.map(d => ({
      date: parseDate(d.date),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume
    }));

    // Add predicted data if available
    const combinedData = [...data];
    
    if (predictedData && predictedData.length > 0) {
      const predictedWithDates = predictedData.map(d => ({
        date: parseDate(d.date),
        predicted: d.predicted
      }));
      
      // Combine with historical data for x-axis
      predictedWithDates.forEach(item => {
        combinedData.push(item);
      });
    }

    // X scale
    const x = d3.scaleTime()
      .domain(d3.extent(combinedData, d => d.date))
      .range([0, width]);

    // Y scale for price
    const y = d3.scaleLinear()
      .domain([
        d3.min(combinedData, d => d.low || d.predicted || d.close) * 0.995,
        d3.max(combinedData, d => d.high || d.predicted || d.close) * 1.005
      ])
      .range([priceHeight, 0]);

    // Y scale for volume
    const yVolume = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.volume)])
      .range([chartHeight, priceHeight + 10]);

    // Add X axis with day and date format
    svg.append('g')
      .attr('transform', `translate(0,${priceHeight})`)
      .call(d3.axisBottom(x)
        .ticks(Math.min(10, timeframeData.length / 8))
        .tickFormat(d => {
          const date = new Date(d);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          return `${month}/${day}`;
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
    if (showVolume) {
      svg.append('g')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => x(d.date) - (width / data.length) / 2 + 1)
        .attr('width', width / data.length - 2)
        .attr('y', d => yVolume(d.volume))
        .attr('height', d => chartHeight - yVolume(d.volume))
        .attr('fill', (d, i) => i > 0 ? (d.close >= data[i-1].close ? '#dcfce7' : '#fee2e2') : '#e2e8f0')
        .attr('opacity', 0.7);

      // Add Volume Y axis
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

    // Area fill under the curve
    const area = d3.area()
      .x(d => x(d.date))
      .y0(priceHeight)
      .y1(d => y(d.close))
      .curve(d3.curveMonotoneX);

    // Add area with subtle fill
    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#blue-gradient)')
      .attr('clip-path', 'url(#clip)')
      .attr('d', area);

    // Define gradient for area
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'blue-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.2);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3b82f6')
      .attr('stop-opacity', 0.05);

    // Line generator for historical data with smoother curve
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.close))
      .curve(d3.curveMonotoneX);

    // Create price path
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2.5)
      .attr('clip-path', 'url(#clip)')
      .attr('d', line);

    // Add predicted line if available
    if (predictedData && predictedData.length > 0) {
      const lastActualDate = data[data.length - 1].date;
      const lastActualPrice = data[data.length - 1].close;
      
      const predictedWithDates = predictedData.map(d => ({
        date: parseDate(d.date),
        predicted: d.predicted
      }));
      
      // Start prediction line at the last actual data point
      const predictionData = [
        { date: lastActualDate, predicted: lastActualPrice },
        ...predictedWithDates
      ];
      
      // Line generator for predicted data
      const predLine = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.predicted))
        .curve(d3.curveMonotoneX);
      
      // Area generator for predicted data
      const predArea = d3.area()
        .x(d => x(d.date))
        .y0(priceHeight)
        .y1(d => y(d.predicted))
        .curve(d3.curveMonotoneX);
      
      // Define gradient for prediction area
      const predGradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'pred-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
      
      predGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#10b981')
        .attr('stop-opacity', 0.2);
      
      predGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#10b981')
        .attr('stop-opacity', 0.05);
      
      // Add prediction area
      svg.append('path')
        .datum(predictionData)
        .attr('fill', 'url(#pred-gradient)')
        .attr('clip-path', 'url(#clip)')
        .attr('d', predArea);
      
      // Add prediction line (dashed style)
      svg.append('path')
        .datum(predictionData)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '5,5')
        .attr('clip-path', 'url(#clip)')
        .attr('d', predLine);
      
      // Add vertical line at prediction start
      svg.append('line')
        .attr('x1', x(lastActualDate))
        .attr('x2', x(lastActualDate))
        .attr('y1', 0)
        .attr('y2', priceHeight)
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');
      
      // Add "Today" label
      svg.append('text')
        .attr('x', x(lastActualDate))
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('fill', '#64748b')
        .text('Today');
    }

    // Add hover effect with price display
    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    // Vertical line on hover
    focus.append('line')
      .attr('class', 'focus-line')
      .attr('y1', 0)
      .attr('y2', priceHeight)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Circle on hover
    focus.append('circle')
      .attr('r', 5)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Background for price tooltip
    focus.append('rect')
      .attr('class', 'tooltip-bg')
      .attr('x', 10)
      .attr('y', -20)
      .attr('width', 80)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#60a5fa')  // Light blue
      .attr('opacity', 0.95);

    // Price text
    focus.append('text')
      .attr('class', 'tooltip-text')
      .attr('x', 50)
      .attr('y', -4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '13px')
      .style('font-weight', '700');

    // Background for date tooltip
    focus.append('rect')
      .attr('class', 'date-tooltip-bg')
      .attr('x', -40)
      .attr('y', priceHeight + 5)
      .attr('width', 80)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#60a5fa')  // Light blue
      .attr('opacity', 0.95);

    // Date text
    focus.append('text')
      .attr('class', 'date-tooltip-text')
      .attr('x', 0)
      .attr('y', priceHeight + 21)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', '600');

    // Add overlay for interactivity
    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', priceHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', mousemove);

    // Handle mouse movement
    function mousemove(event) {
      const bisect = d3.bisector(d => d.date).left;
      const x0 = x.invert(d3.pointer(event)[0]);
      const i = bisect(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i] || d0;
      const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      
      // Position the focus
      focus.attr('transform', `translate(${x(d.date)},0)`);
      
      // Update tooltip values
      focus.select('.tooltip-text').text(`₹${d.close.toFixed(2)}`);
      
      // Format date as day/month
      const dateStr = `${d.date.getDate()}/${d.date.getMonth() + 1}`;
      focus.select('.date-tooltip-text').text(dateStr);
      
      // Adjust tooltip positioning if needed
      if (x(d.date) > width - 100) {
        focus.select('.tooltip-bg').attr('x', -90);
        focus.select('.tooltip-text').attr('x', -50);
      } else {
        focus.select('.tooltip-bg').attr('x', 10);
        focus.select('.tooltip-text').attr('x', 50);
      }
    }
  }, [historicalData, predictedData, stockSymbol, timeframe, showVolume, height]);

  // New function to render cleaned data chart with outliers
  const renderCleanedDataChart = () => {
    if (cleanedData.length === 0 || historicalData.length === 0) return;
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const priceHeight = chartHeight;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    
    // Prepare data
    const originalData = historicalData.map(d => ({
      date: parseDate(d.date),
      close: d.close
    }));
    
    const processedData = cleanedData.map(d => ({
      date: parseDate(d.date),
      close: d.close,
      originalClose: d.originalClose || d.close,
      isOutlier: d.isOutlier || false
    }));
    
    // X scale
    const x = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date))
      .range([0, width]);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([
        d3.min(processedData, d => Math.min(d.close, d.originalClose)) * 0.995,
        d3.max(processedData, d => Math.max(d.close, d.originalClose)) * 1.005
      ])
      .range([priceHeight, 0]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${priceHeight})`)
      .call(d3.axisBottom(x)
        .ticks(Math.min(10, processedData.length / 8))
        .tickFormat(d => {
          const date = new Date(d);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          return `${month}/${day}`;
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
    
    // Line generator for original data
    const originalLine = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.originalClose || d.close))
      .curve(d3.curveMonotoneX);
    
    // Line generator for cleaned data
    const cleanedLine = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.close))
      .curve(d3.curveMonotoneX);
    
    // Create original price path (lighter color)
    svg.append('path')
      .datum(processedData)
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3')
      .attr('clip-path', 'url(#clip)')
      .attr('d', originalLine);
    
    // Create cleaned price path
    svg.append('path')
      .datum(processedData)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2.5)
      .attr('clip-path', 'url(#clip)')
      .attr('d', cleanedLine);
    
    // Add outlier points
    svg.selectAll('.outlier-point')
      .data(processedData.filter(d => d.isOutlier))
      .enter()
      .append('circle')
      .attr('class', 'outlier-point')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.originalClose || d.close))
      .attr('r', 5)
      .attr('fill', '#ef4444')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
    
    // Add tooltip functionality similar to the original chart
    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');
    
    // Vertical line on hover
    focus.append('line')
      .attr('class', 'focus-line')
      .attr('y1', 0)
      .attr('y2', priceHeight)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');
    
    // Circle on hover for original data
    focus.append('circle')
      .attr('class', 'focus-circle-original')
      .attr('r', 5)
      .attr('fill', '#94a3b8')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // Circle on hover for cleaned data
    focus.append('circle')
      .attr('class', 'focus-circle-cleaned')
      .attr('r', 5)
      .attr('fill', '#10b981')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // // Background for original price tooltip
    // focus.append('rect')
    //   .attr('class', 'tooltip-bg-original')
    //   .attr('x', 10)
    //   .attr('y', -20)
    //   .attr('width', 100)
    //   .attr('height', 24)
    //   .attr('rx', 4)
    //   .attr('fill', '#60a5fa')  // Light blue
    //   .attr('opacity', 0.95);
    
    // Original price text
    focus.append('text')
      .attr('class', 'tooltip-text-original')
      .attr('x', 60)
      .attr('y', -4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '13px')
      .style('font-weight', '700');
    
    // // Background for cleaned price tooltip
    // focus.append('rect')
    //   .attr('class', 'tooltip-bg-cleaned')
    //   .attr('x', 10)
    //   .attr('y', 10)
    //   .attr('width', 100)
    //   .attr('height', 24)
    //   .attr('rx', 4)
    //   .attr('fill', '#60a5fa')  // Light blue
    //   .attr('opacity', 0.95);
    
    // Cleaned price text
    focus.append('text')
      .attr('class', 'tooltip-text-cleaned')
      .attr('x', 60)
      .attr('y', 26)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', '600');
    
    // Background for date tooltip
    focus.append('rect')
      .attr('class', 'date-tooltip-bg')
      .attr('x', -40)
      .attr('y', priceHeight + 5)
      .attr('width', 80)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#fff')
      .attr('opacity', 0.9);
    
    // Date text
    focus.append('text')
      .attr('class', 'date-tooltip-text')
      .attr('x', 0)
      .attr('y', priceHeight + 21)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', '600');
    
    // Add overlay for interactivity
    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', priceHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', mousemove);
    
    // Handle mouse movement
    function mousemove(event) {
      const bisect = d3.bisector(d => d.date).left;
      const x0 = x.invert(d3.pointer(event)[0]);
      const i = bisect(processedData, x0, 1);
      const d0 = processedData[i - 1];
      const d1 = processedData[i] || d0;
      const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      
      // Position the focus
      focus.attr('transform', `translate(${x(d.date)},0)`);
      
      // Update circle positions
      focus.select('.focus-circle-original')
        .attr('cy', y(d.originalClose || d.close));
      
      focus.select('.focus-circle-cleaned')
        .attr('cy', y(d.close));
      
      // Update tooltip values
      focus.select('.tooltip-text-original')
        .text(`Original: ₹${(d.originalClose || d.close).toFixed(2)}`);
      
      focus.select('.tooltip-text-cleaned')
        .text(`Cleaned: ₹${d.close.toFixed(2)}`);
      
      // Format date as day/month
      const dateStr = `${d.date.getDate()}/${d.date.getMonth() + 1}`;
      focus.select('.date-tooltip-text').text(dateStr);
      
      // Adjust tooltip positioning if needed
      if (x(d.date) > width - 120) {
        focus.select('.tooltip-bg-original').attr('x', -110);
        focus.select('.tooltip-text-original').attr('x', -60);
        focus.select('.tooltip-bg-cleaned').attr('x', -110);
        focus.select('.tooltip-text-cleaned').attr('x', -60);
      } else {
        focus.select('.tooltip-bg-original').attr('x', 10);
        focus.select('.tooltip-text-original').attr('x', 60);
        focus.select('.tooltip-bg-cleaned').attr('x', 10);
        focus.select('.tooltip-text-cleaned').attr('x', 60);
      }
    }
  };
  
  // New function to render normalized data chart
  const renderNormalizedChart = () => {
    if (normalizedData.length === 0) return;
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const priceHeight = chartHeight;
    
    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    
    // Prepare data
    const data = normalizedData.map(d => ({
      date: parseDate(d.date),
      normalizedClose: d.normalizedClose,
      normalizedHigh: d.normalizedHigh,
      normalizedLow: d.normalizedLow,
      originalClose: d.originalClose || d.close
    }));
    
    // X scale
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);
    
    // Y scale for normalized values (0-1)
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([priceHeight, 0]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${priceHeight})`)
      .call(d3.axisBottom(x)
        .ticks(Math.min(10, data.length / 8))
        .tickFormat(d => {
          const date = new Date(d);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          return `${month}/${day}`;
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
        .tickFormat(d => d.toFixed(2)))
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
      .text('Normalized Value (0-1)');
    
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
    
    // Define gradient for area
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'purple-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', 0.2);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', 0.05);
    
    // Area generator for normalized data
    const area = d3.area()
      .x(d => x(d.date))
      .y0(priceHeight)
      .y1(d => y(d.normalizedClose))
      .curve(d3.curveMonotoneX);
    
    // Add area with subtle fill
    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#purple-gradient)')
      .attr('clip-path', 'url(#clip)')
      .attr('d', area);
    
    // Line generator for normalized data
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.normalizedClose))
      .curve(d3.curveMonotoneX);
    
    // Create normalized price path
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 2.5)
      .attr('clip-path', 'url(#clip)')
      .attr('d', line);
    
    // Add high-low range area (similar to candlestick's shadow)
    svg.selectAll('.range-line')
      .data(data)
      .enter()
      .append('line')
      .attr('class', 'range-line')
      .attr('x1', d => x(d.date))
      .attr('x2', d => x(d.date))
      .attr('y1', d => y(d.normalizedHigh))
      .attr('y2', d => y(d.normalizedLow))
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 1)
      .attr('opacity', 0.5);
    
    // Add tooltip functionality
    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');
    
    // Vertical line on hover
    focus.append('line')
      .attr('class', 'focus-line')
      .attr('y1', 0)
      .attr('y2', priceHeight)
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');
    
    // Circle on hover
    focus.append('circle')
      .attr('r', 5)
      .attr('fill', '#8b5cf6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // Background for normalized value tooltip
    focus.append('rect')
      .attr('class', 'tooltip-bg')
      .attr('x', 10)
      .attr('y', -20)
      .attr('width', 130)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#fff')
      .attr('opacity', 0.9);
    
    // Normalized value text
    focus.append('text')
      .attr('class', 'tooltip-text')
      .attr('x', 75)
      .attr('y', -4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', '600');
    
    // Background for original price tooltip
    focus.append('rect')
      .attr('class', 'tooltip-bg-price')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', 130)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#ffff')
      .attr('opacity', 0.9);
    
    // Original price text
    focus.append('text')
      .attr('class', 'tooltip-text-price')
      .attr('x', 75)
      .attr('y', 26)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', '600');
    
    // Background for date tooltip
    focus.append('rect')
      .attr('class', 'date-tooltip-bg')
      .attr('x', -40)
      .attr('y', priceHeight + 5)
      .attr('width', 80)
      .attr('height', 24)
      .attr('rx', 4)
      .attr('fill', '#e2a9f5')
      .attr('opacity', 0.9);
    
    // Date text
    focus.append('text')
      .attr('class', 'date-tooltip-text')
      .attr('x', 0)
      .attr('y', priceHeight + 21)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '12px');
    
    // Add overlay for interactivity
    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', priceHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', mousemove);
    
    // Handle mouse movement
    function mousemove(event) {
      const bisect = d3.bisector(d => d.date).left;
      const x0 = x.invert(d3.pointer(event)[0]);
      const i = bisect(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i] || d0;
      const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      
      // Position the focus
      focus.attr('transform', `translate(${x(d.date)},0)`);
      
      // Position the circle
      focus.select('circle').attr('cy', y(d.normalizedClose));
      
      // Update tooltip values
      focus.select('.tooltip-text')
        .text(`Normalized: ${d.normalizedClose.toFixed(4)}`);
      
      focus.select('.tooltip-text-price')
        .text(`Original: ₹${d.originalClose.toFixed(2)}`);
      
      // Format date as day/month
      const dateStr = `${d.date.getDate()}/${d.date.getMonth() + 1}`;
      focus.select('.date-tooltip-text').text(dateStr);
      
      // Adjust tooltip positioning if needed
      if (x(d.date) > width - 150) {
        focus.select('.tooltip-bg').attr('x', -140);
        focus.select('.tooltip-text').attr('x', -75);
        focus.select('.tooltip-bg-price').attr('x', -140);
        focus.select('.tooltip-text-price').attr('x', -75);
      } else {
        focus.select('.tooltip-bg').attr('x', 10);
        focus.select('.tooltip-text').attr('x', 75);
        focus.select('.tooltip-bg-price').attr('x', 10);
        focus.select('.tooltip-text-price').attr('x', 75);
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