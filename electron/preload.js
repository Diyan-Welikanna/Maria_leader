const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveRecord: (record) => ipcRenderer.invoke('save-record', record),
  loadRecords: () => ipcRenderer.invoke('load-records'),
  saveAllRecords: (records) => ipcRenderer.invoke('save-all-records', records),
  saveCSV: (csvContent, filename) => ipcRenderer.invoke('save-csv', csvContent, filename),
  getDataPath: () => ipcRenderer.invoke('get-data-path')
});
