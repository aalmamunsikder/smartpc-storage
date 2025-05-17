import React from 'react';

interface DebugPanelProps {
  activePath: string;
  isElectron: boolean;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ activePath, isElectron }) => {
  return (
    <div className="fixed bottom-4 right-4 p-3 bg-black/80 text-white rounded-lg text-xs z-50 max-w-xs">
      <h4 className="font-bold mb-1">Debug Info</h4>
      <div className="space-y-1">
        <div>Active Path: <span className="text-yellow-400">{activePath}</span></div>
        <div>URL Hash: <span className="text-yellow-400">{window.location.hash || 'none'}</span></div>
        <div>Electron Mode: <span className="text-yellow-400">{isElectron ? 'Yes' : 'No'}</span></div>
      </div>
    </div>
  );
};

export default DebugPanel; 