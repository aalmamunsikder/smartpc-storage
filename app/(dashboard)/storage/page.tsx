'use client';

import React, { useEffect, useState } from 'react';
import CloudStorage from '@/components/dashboard/CloudStorage';
import CloudStorageCategories from '@/components/dashboard/CloudStorageCategories';
import { useRouter } from 'next/navigation';

export default function StoragePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Simple flag to avoid redirect loops
    const alreadyChecked = sessionStorage.getItem('auth_checked');
    
    // Only check authentication once per session
    if (!alreadyChecked) {
      sessionStorage.setItem('auth_checked', 'true');
      
      // Check if running in Electron
      if (typeof window !== 'undefined' && window.electron) {
        setIsElectron(true);
      }
      
      // Check authentication
      const checkAuth = async () => {
        let authStatus = false;
        
        try {
          if (typeof window !== 'undefined') {
            if (window.electron) {
              authStatus = await window.electron.getStoreValue('isAuthenticated') === true;
            } else {
              authStatus = localStorage.getItem('isAuthenticated') === 'true';
            }
            
            if (!authStatus) {
              router.push('/login');
              return;
            }
          }
        } catch (err) {
          console.error('Error checking auth:', err);
        }
        
        setIsLoading(false);
      };
      
      checkAuth();
    } else {
      setIsLoading(false);
    }
    
    // Clean up loading state
    return () => {
      setIsLoading(false);
    };
  }, [router]);
  
  // Simple loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading storage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Smart Storage</h1>
      
      {/* Categories section */}
      <div className="mb-6">
        <CloudStorageCategories />
      </div>
      
      {/* Main storage component */}
      <CloudStorage />
    </div>
  );
} 