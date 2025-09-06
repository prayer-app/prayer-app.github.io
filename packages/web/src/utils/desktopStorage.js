// Desktop-specific storage utilities for Electron integration

// Check if running in Electron
export const isElectron = () => {
  return window.electronAPI !== undefined;
};

// Enhanced export data for desktop
export const exportDataDesktop = async () => {
  if (!isElectron()) {
    throw new Error('Not running in Electron environment');
  }

  try {
    // Get data from localStorage
    const data = {
      prayers: JSON.parse(localStorage.getItem('prayers') || '[]'),
      praises: JSON.parse(localStorage.getItem('praises') || '[]'),
      exportDate: new Date().toISOString()
    };

    // Show save dialog
    const result = await window.electronAPI.showExportDialog();
    
    if (result.canceled) {
      return { success: false, message: 'Export cancelled' };
    }

    // Write file
    const writeResult = await window.electronAPI.writeFile(
      result.filePath, 
      JSON.stringify(data, null, 2)
    );

    if (writeResult.success) {
      return { success: true, message: 'Data exported successfully' };
    } else {
      return { success: false, message: `Export failed: ${writeResult.error}` };
    }
  } catch (error) {
    return { success: false, message: `Export error: ${error.message}` };
  }
};

// Import data for desktop
export const importDataDesktop = async (data) => {
  if (!isElectron()) {
    throw new Error('Not running in Electron environment');
  }

  try {
    const parsedData = JSON.parse(data);
    
    // Validate data structure
    if (!parsedData.prayers || !parsedData.praises) {
      throw new Error('Invalid data format');
    }

    // Save to localStorage
    localStorage.setItem('prayers', JSON.stringify(parsedData.prayers));
    localStorage.setItem('praises', JSON.stringify(parsedData.praises));

    return { success: true, message: 'Data imported successfully' };
  } catch (error) {
    return { success: false, message: `Import error: ${error.message}` };
  }
};

// Setup desktop event listeners
export const setupDesktopListeners = (onExportData, onImportData) => {
  if (!isElectron()) {
    return;
  }

  // Listen for export data requests from menu
  window.electronAPI.onExportData(() => {
    if (onExportData) {
      onExportData();
    }
  });

  // Listen for import data from menu
  window.electronAPI.onImportData((event, data) => {
    if (onImportData) {
      onImportData(data);
    }
  });
};

// Cleanup listeners
export const cleanupDesktopListeners = () => {
  if (!isElectron()) {
    return;
  }

  window.electronAPI.removeAllListeners('export-data');
  window.electronAPI.removeAllListeners('import-data');
}; 