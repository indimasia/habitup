'use client';
import { useState, useEffect, useMemo } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { useHabits } from '@/hooks/use-habits';
import { DAY_NAMES, type Habit } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { HabitItem } from './habit-item';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

const PastDayHabitList = ({ date, habits, onToggle }: { date: Date, habits: Habit[], onToggle: (habitId: string, date: string) => void }) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayOfWeek = DAY_NAMES[date.getDay()];

  const habitsForDay = useMemo(() => {
    return habits.filter(habit => {
      if (habit.frequency === 'daily') {
        return true;
      }
      return habit.frequency.includes(dayOfWeek);
    });
  }, [habits, dayOfWeek]);

  const completedCount = useMemo(() => {
    return habitsForDay.filter(habit =>
      habit.completions.some(c => c.date === dateStr)
    ).length;
  }, [habitsForDay, dateStr]);
  
  const progress = habitsForDay.length > 0 ? (completedCount / habitsForDay.length) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-xl font-bold font-headline text-foreground">
                    {isSameDay(date, new Date()) ? 'Today' : format(date, 'EEEE, MMMM do')}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                    {habitsForDay.length > 0
                    ? `${completedCount} of ${habitsForDay.length} habits completed.`
                    : "No habits scheduled for this day."}
                </p>
            </div>
        </div>
        
        {habitsForDay.length > 0 && (
            <Progress value={progress} className="h-2 mb-4" />
        )}

        <div className="space-y-3">
          {habitsForDay.map(habit => (
            <HabitItem
              key={`${habit.id}-${dateStr}`}
              habit={habit}
              isCompleted={habit.completions.some(c => c.date === dateStr)}
              onToggle={() => onToggle(habit.id, dateStr)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


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

  const handleToggle = (habitId: string, date: string) => {
    toggleHabitCompletion(habitId, date);
  };
  
  const recentDays = useMemo(() => {
      const days = [];
      for (let i = 0; i < 7; i++) {
          days.push(subDays(today, i));
      }
      return days;
  }, [today]);

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const allHabitsScheduled = habits.length > 0;

  if (!allHabitsScheduled && isLoaded) {
      return (
        <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold font-headline">No Habits Created Yet</h2>
            <p className="text-muted-foreground mt-2 mb-4">Ready to build some great habits?</p>
            <Button asChild>
              <Link href="/add-habit">Create Your First Habit</Link>
            </Button>
        </div>
      )
  }

  return (
    <div className="space-y-4">
        {recentDays.map((day) => (
            <PastDayHabitList
                key={day.toISOString()}
                date={day}
                habits={habits}
                onToggle={handleToggle}
            />
        ))}
    </div>
  );
}
