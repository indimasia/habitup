'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from './header';
import BottomNav from './bottom-nav';

export function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
    if (!isLoading && isAuthenticated && pathname === '/login') {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    // You can return a global loading spinner here
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">Loading...</div>
        </div>
    );
  }
  
  if (!isAuthenticated && pathname !== '/login') {
    return null; // Don't render anything while redirecting
  }

  if (isAuthenticated && pathname === '/login') {
    return null; // Don't render login page if authenticated
  }

  const isLoginPage = pathname === '/login';

  return (
    <div className="relative flex flex-col min-h-screen">
      {!isLoginPage && <Header />}
      <div className="flex-grow pb-16">
        {children}
      </div>
      {!isLoginPage && <BottomNav />}
    </div>
  );
}
