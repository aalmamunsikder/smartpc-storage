interface ElectronAPI {
  // Common storage operations
  getStoreValue: (key: string) => Promise<any>;
  setStoreValue: (key: string, value: any) => Promise<boolean>;
  deleteStoreValue: (key: string) => Promise<boolean>;
  
  // Application information
  getAppVersion: () => Promise<string>;
  
  // Navigation and UI events
  onNavigate: (callback: (path: string) => void) => () => void;
  onShowAbout: (callback: () => void) => () => void;
  
  // Storage config operations
  getStorageConfig: () => Promise<{ used: number; total: number }>;
  updateStorageConfig: (config: { total: number }) => Promise<void>;
  saveStorageConfig: (config: { storageSize: number }) => Promise<{ success: boolean }>;
}

interface ElectronAPIExtended {
  getStorageConfig: () => Promise<{ storageSize: number } | null>;
  saveStorageConfig: (config: { storageSize: number }) => Promise<{ success: boolean }>;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
    electronAPI?: ElectronAPIExtended;
  }
} 