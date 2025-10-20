'use client';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { useHabits } from '@/hooks/use-habits';
import { DAY_NAMES, type Habit } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { HabitItem } from './habit-item';
import Link from 'next/link';
import { Button } from '../ui/button';

export function HabitDashboard() {
  const { habits, toggleHabitCompletion, isLoaded } = useHabits();
  const [today, setToday] = useState(new Date());

  // Update date every minute to catch day changes
  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = useMemo(() => format(today, 'yyyy-MM-dd'), [today]);
  const dayOfWeek = useMemo(() => DAY_NAMES[today.getDay()], [today]);

  const todaysHabits = useMemo(() => {
    return habits.filter(habit => {
      if (habit.frequency === 'daily') {
        return true;
      }
      return habit.frequency.includes(dayOfWeek);
    });
  }, [habits, dayOfWeek]);

  const completedCount = useMemo(() => {
    return todaysHabits.filter(habit =>
      habit.completions.some(c => c.date === todayStr)
    ).length;
  }, [todaysHabits, todayStr]);

  const progress = todaysHabits.length > 0 ? (completedCount / todaysHabits.length) * 100 : 0;

  const handleToggle = (habitId: string) => {
    toggleHabitCompletion(habitId, todayStr);
  };

  if (!isLoaded) {
    return (
      <div>
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-4" />
        <div className="space-y-4 mt-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline text-foreground">
        {format(today, 'EEEE, MMMM do')}
      </h1>
      <p className="text-muted-foreground mt-1">
        {todaysHabits.length > 0
          ? `${completedCount} of ${todaysHabits.length} habits completed today.`
          : "Ready to build some great habits?"}
      </p>

      {todaysHabits.length > 0 && (
        <div className="mt-6">
          <Progress value={progress} className="h-3" />
        </div>
      )}

      <div className="space-y-4 mt-8">
        {todaysHabits.length > 0 ? (
          todaysHabits.map(habit => (
            <HabitItem
              key={habit.id}
              habit={habit}
              isCompleted={habit.completions.some(c => c.date === todayStr)}
              onToggle={() => handleToggle(habit.id)}
            />
          ))
        ) : (
          <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold font-headline">No Habits for Today</h2>
            <p className="text-muted-foreground mt-2 mb-4">Looks like you're all set, or maybe you want to add a new habit?</p>
            <Button asChild>
              <Link href="/add-habit">Create Your First Habit</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
