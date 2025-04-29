// Date formatter
export function formatDate(date, format = 'full') {
    if (!date) return '';
    
    // If date is a string, convert to Date object
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    // Format options
    if (format === 'full') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (format === 'short') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } else if (format === 'numeric') {
      return date.toLocaleDateString('en-US');
    } else if (format === 'time') {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (format === 'datetime') {
      return date.toLocaleString('en-US');
    }
    
    return date.toLocaleDateString('en-US');
  }
  
  // Currency formatter
  export function formatCurrency(value, format = 'standard') {
    if (value === null || value === undefined) return '';
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) return '';
    
    if (format === 'standard') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
      }).format(numValue);
    } else if (format === 'compact') {
      if (numValue >= 10000000) {
        return '₹' + (numValue / 10000000).toFixed(2) + ' Cr';
      } else if (numValue >= 100000) {
        return '₹' + (numValue / 100000).toFixed(2) + ' L';
      } else if (numValue >= 1000) {
        return '₹' + (numValue / 1000).toFixed(2) + ' K';
      } else {
        return '₹' + numValue.toFixed(2);
      }
    } else if (format === 'decimal') {
      return numValue.toFixed(2);
    }
    
    return numValue.toString();
  }
  
  // Number formatter
  export function formatNumber(value, format = 'standard') {
    if (value === null || value === undefined) return '';
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) return '';
    
    if (format === 'standard') {
      return new Intl.NumberFormat().format(numValue);
    } else if (format === 'compact') {
      if (numValue >= 10000000) {
        return (numValue / 10000000).toFixed(2) + ' Cr';
      } else if (numValue >= 100000) {
        return (numValue / 100000).toFixed(2) + ' L';
      } else if (numValue >= 1000) {
        return (numValue / 1000).toFixed(2) + ' K';
      } else {
        return numValue.toFixed(0);
      }
    } else if (format === 'decimal') {
      return numValue.toFixed(2);
    } else if (format === 'percent') {
      return numValue.toFixed(2) + '%';
    }
    
    return numValue.toString();
  }
  
  // Percentage change formatter with sign
  export function formatPercentChange(value) {
    if (value === null || value === undefined) return '';
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) return '';
    
    const sign = numValue >= 0 ? '+' : '';
    return sign + numValue.toFixed(2) + '%';
  }