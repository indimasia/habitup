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
    // Only redirect after initial loading is complete
    if (!isLoading) {
      if (!isAuthenticated && pathname !== '/login') {
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading only during initial auth check, not during login attempts
  if (isLoading && pathname !== '/login') {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">Loading...</div>
        </div>
    );
  }
  
  // Always render the login page, let it handle its own auth state
  if (pathname === '/login') {
    return (
      <div className="relative flex flex-col min-h-screen">
        {children}
      </div>
    );
  }
  
  // For protected pages, don't render if not authenticated
  if (!isAuthenticated) {
    return null;
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
