
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/updates', label: 'Updates', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container mx-auto grid h-16 max-w-lg grid-cols-4 items-center">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center justify-center space-y-1 text-center"
          >
            <Icon
              className={cn(
                'h-6 w-6 transition-colors',
                pathname === href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            />
            <span
              className={cn(
                'text-xs font-medium transition-colors',
                pathname === href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
