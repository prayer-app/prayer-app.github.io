const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Export data functionality
  exportData: () => ipcRenderer.send('export-data'),
  onExportData: (callback) => ipcRenderer.on('export-data', callback),
  
  // Import data functionality
  onImportData: (callback) => ipcRenderer.on('import-data', callback),
  
  // File dialog and write operations
  showExportDialog: () => ipcRenderer.invoke('export-data-dialog'),
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}); 