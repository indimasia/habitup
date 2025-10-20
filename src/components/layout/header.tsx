'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf, Plus } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function Header() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">HabitZen</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild>
            <Link href="/add-habit">
              <Plus className="h-4 w-4 mr-2" />
              New Habit
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
