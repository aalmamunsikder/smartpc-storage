'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to storage page by default
    router.push('/storage');
  }, [router]);
  
  return null;
} 