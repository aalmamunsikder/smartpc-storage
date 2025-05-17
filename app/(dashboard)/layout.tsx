'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useToast } from '@/hooks/use-toast';

// No need to redefine Window.electron here
// The type is defined in electron/electron.d.ts

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isElectron, setIsElectron] = useState(false);
  
  useEffect(() => {
    // Check if running in Electron
    if (typeof window !== 'undefined' && window.electron) {
      setIsElectron(true);
      
      // Set up navigation listener from the main process
      const removeNavigateListener = window.electron.onNavigate((path: string) => {
        router.push(path);
      });
      
      // Set up about dialog listener
      const removeAboutListener = window.electron.onShowAbout(() => {
        // Use immediately invoked async function to handle the Promise
        (async () => {
          const version = await window.electron?.getAppVersion() || "1.0.0";
          toast({
            title: "About SmartPC",
            description: "Version: " + version
          });
        })();
      });
      
      return () => {
        removeNavigateListener();
        removeAboutListener();
      };
    }
  }, [router, toast]);
  
  // Simplified authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let isAuthenticated = false;
        
        // In development, we can bypass the auth check to avoid redirect loops
        if (process.env.NODE_ENV === 'development') {
          isAuthenticated = true;
        } else if (typeof window !== 'undefined') {
          if (window.electron) {
            isAuthenticated = await window.electron.getStoreValue('isAuthenticated') === true;
          } else {
            isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
          }
          
          if (!isAuthenticated && pathname !== '/login') {
            router.push('/login');
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router, pathname]);

  // Handle navigation from sidebar
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      if (isElectron && window.electron) {
        await window.electron.setStoreValue('isAuthenticated', false);
      } else {
        localStorage.removeItem('isAuthenticated');
      }
      
      // Also clear session storage check
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth_checked');
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
      
      router.push('/login');
    } catch (err) {
      console.error('Error during logout:', err);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold">Loading SmartPC...</h1>
          <p className="mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main layout container */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - fixed */}
        <DashboardSidebar activePath={pathname} onNavigate={handleNavigate} />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - fixed */}
          <DashboardHeader onLogout={handleLogout} />
          
          {/* Scrollable content - children will be injected by Next.js */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 