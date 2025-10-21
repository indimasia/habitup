'use client';

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRecentStreak } from '@/lib/utils';
import { Habit } from '@/lib/types';

interface RecentStreakProps {
  habit: Habit;
  className?: string;
}

export function RecentStreak({ habit, className }: RecentStreakProps) {
  const streakData = getRecentStreak(habit.completions);

  return (
    <div className={cn('flex items-center gap-1', className)} title="Last 5 days">
      {streakData.map((completed, index) => (
        <Flame
          key={index}
          className={cn(
            'h-5 w-5',
            completed ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  );
}
