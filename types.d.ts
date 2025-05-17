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
  
  // File operations
  loadImageFile: (filePath: string) => Promise<{
    success: boolean;
    dataUrl?: string;
    fileName?: string;
    error?: string;
  }>;
  loadImageThumbnail: (filePath: string, options?: {
    width?: number;
    height?: number;
  }) => Promise<{
    success: boolean;
    dataUrl?: string;
    fileName?: string;
    isOptimized?: boolean;
    error?: string;
  }>;
  selectFile: (options?: {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
    properties?: string[];
    message?: string;
  }) => Promise<{
    success: boolean;
    filePath?: string;
    canceled?: boolean;
    error?: string;
  }>;
  
  // Utility
  isElectron: boolean;
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

export {}; 