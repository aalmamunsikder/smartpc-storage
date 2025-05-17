'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Direct users to the proper page without causing redirect loops
    const redirectToProperPage = () => {
      try {
        // Check if we're in Electron or browser
        const isElectron = typeof window !== 'undefined' && window.electron !== undefined;
        
        // Simple flag to avoid redirect loops
        const alreadyChecked = sessionStorage.getItem('landing_redirect');
        
        if (!alreadyChecked) {
          sessionStorage.setItem('landing_redirect', 'true');
          
          // Check authentication status
          if (isElectron) {
            window.electron?.getStoreValue('isAuthenticated')
              .then(isAuth => {
                if (isAuth) {
                  router.push('/storage');
                } else {
                  router.push('/login');
                }
              })
              .catch(() => router.push('/login'));
          } else {
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            if (isAuthenticated) {
              router.push('/storage');
            } else {
              router.push('/login');
            }
          }
        }
      } catch (err) {
        console.error('Redirect error:', err);
        // Default to login on error
        router.push('/login');
      }
    };
    
    redirectToProperPage();
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold">Loading SmartPC...</h1>
        <p className="mt-2">Please wait...</p>
      </div>
    </div>
  );
} 