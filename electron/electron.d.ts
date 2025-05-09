interface ElectronAPI {
  getStoreValue: (key: string) => Promise<any>;
  setStoreValue: (key: string, value: any) => Promise<boolean>;
  deleteStoreValue: (key: string) => Promise<boolean>;
  getAppVersion: () => Promise<string>;
  onNavigate: (callback: (path: string) => void) => () => void;
  onShowAbout: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
} 