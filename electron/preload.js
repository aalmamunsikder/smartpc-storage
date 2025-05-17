const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Store operations
  getStoreValue: (key) => ipcRenderer.invoke('get-store-value', key),
  setStoreValue: (key, value) => ipcRenderer.invoke('set-store-value', key, value),
  deleteStoreValue: (key) => ipcRenderer.invoke('delete-store-value', key),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Navigation handled from main process
  onNavigate: (callback) => {
    const listener = (_, path) => callback(path);
    ipcRenderer.on('navigate', listener);
    return () => {
      ipcRenderer.removeListener('navigate', listener);
    };
  },
  
  // About dialog
  onShowAbout: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('show-about', listener);
    return () => {
      ipcRenderer.removeListener('show-about', listener);
    };
  },
  
  // File operations
  loadImageFile: (filePath) => ipcRenderer.invoke('load-image-file', filePath),
  loadImageThumbnail: (filePath, options) => ipcRenderer.invoke('load-image-thumbnail', filePath, options),
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  
  // Utility for checking if running in Electron
  isElectron: true
}); 