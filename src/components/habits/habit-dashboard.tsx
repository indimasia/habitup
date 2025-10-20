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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
                    {format(date, 'EEEE, MMMM do')}
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
      for (let i = 0; i < 5; i++) {
          days.push(subDays(today, i));
      }
      return days;
  }, [today]);

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

  const todayStr = format(today, 'yyyy-MM-dd');
  const dayOfWeek = DAY_NAMES[today.getDay()];

  const todaysHabits = habits.filter(habit => {
      if (habit.frequency === 'daily') {
        return true;
      }
      return habit.frequency.includes(dayOfWeek);
  });
  
  if (todaysHabits.length === 0 && isLoaded) {
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
    <div>
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
        {recentDays.map((day, index) => (
            <AccordionItem value={`item-${index}`} key={day.toISOString()} className="border-none">
                 <AccordionTrigger className="w-full bg-card p-4 rounded-lg shadow-sm hover:no-underline hover:shadow-md data-[state=open]:rounded-b-none">
                    <div className="flex justify-between items-center w-full">
                        <span className="font-headline text-lg">{isSameDay(day, today) ? 'Today' : format(day, 'EEEE, MMM d')}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-0 border-t-0">
                    <PastDayHabitList
                        date={day}
                        habits={habits}
                        onToggle={handleToggle}
                    />
                </AccordionContent>
            </AccordionItem>
        ))}
        </Accordion>
    </div>
  );
}
