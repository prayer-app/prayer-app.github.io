// Storage keys
export const STORAGE_KEYS = {
  PRAYERS: 'prayers',
  PRAISES: 'praises'
};

// Initialize storage
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PRAYERS)) {
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRAISES)) {
    localStorage.setItem(STORAGE_KEYS.PRAISES, JSON.stringify([]));
  }
}

// Prayer storage functions
export function getPrayers() {
  try {
    const prayers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAYERS));
    if (!Array.isArray(prayers)) {
      console.warn('Prayers data was not an array, resetting to empty array');
      localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify([]));
      return [];
    }
    return prayers;
  } catch (error) {
    console.error('Error parsing prayers from localStorage:', error);
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify([]));
    return [];
  }
}

export function savePrayers(prayers) {
  localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayers));
}

// Praise storage functions
export function getPraises() {
  try {
    const praises = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRAISES));
    if (!Array.isArray(praises)) {
      console.warn('Praises data was not an array, resetting to empty array');
      localStorage.setItem(STORAGE_KEYS.PRAISES, JSON.stringify([]));
      return [];
    }
    return praises;
  } catch (error) {
    console.error('Error parsing praises from localStorage:', error);
    localStorage.setItem(STORAGE_KEYS.PRAISES, JSON.stringify([]));
    return [];
  }
}

export function savePraises(praises) {
  localStorage.setItem(STORAGE_KEYS.PRAISES, JSON.stringify(praises));
}

// Reset database
export function resetDatabase() {
  localStorage.removeItem(STORAGE_KEYS.PRAYERS);
  localStorage.removeItem(STORAGE_KEYS.PRAISES);
  initializeStorage();
}

// Export data
export function exportData() {
  const data = {
    prayers: getPrayers(),
    praises: getPraises()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prayer-praise-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} 