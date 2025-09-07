// Web-specific storage functions
// These replace the shared package storage dependencies for the web PWA

import { formatDateForStorage } from './webUtils.js';

// Initialize storage (web-specific)
export function initializeStorage() {
  // Web storage is automatically available
  return Promise.resolve();
}

// Get prayers from localStorage
export function getPrayers() {
  try {
    const prayers = localStorage.getItem('prayers');
    return prayers ? JSON.parse(prayers) : [];
  } catch (error) {
    console.error('Error getting prayers:', error);
    return [];
  }
}

// Save prayers to localStorage
export function savePrayers(prayers) {
  try {
    localStorage.setItem('prayers', JSON.stringify(prayers));
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving prayers:', error);
    return Promise.reject(error);
  }
}

// Get praises from localStorage
export function getPraises() {
  try {
    const praises = localStorage.getItem('praises');
    return praises ? JSON.parse(praises) : [];
  } catch (error) {
    console.error('Error getting praises:', error);
    return [];
  }
}

// Save praises to localStorage
export function savePraises(praises) {
  try {
    localStorage.setItem('praises', JSON.stringify(praises));
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving praises:', error);
    return Promise.reject(error);
  }
}

// Reset database (clear localStorage)
export function resetDatabase() {
  try {
    localStorage.removeItem('prayers');
    localStorage.removeItem('praises');
    return Promise.resolve();
  } catch (error) {
    console.error('Error resetting database:', error);
    return Promise.reject(error);
  }
}

// Export data as JSON
export function exportData() {
  try {
    const data = {
      prayers: getPrayers(),
      praises: getPraises(),
      exportDate: formatDateForStorage(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `prayer-praise-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting data:', error);
    return Promise.reject(error);
  }
}
