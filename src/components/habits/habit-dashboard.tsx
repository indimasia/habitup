'use client';
import { useState, useMemo } from 'react';
import { format, subDays, addDays, isSameDay, isToday } from 'date-fns';
import { useHabits } from '@/hooks/use-habits';
import { DAY_NAMES, type Habit } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { HabitItem } from './habit-item';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DayHabitList = ({ date, habits, onToggle }: { date: Date, habits: Habit[], onToggle: (habitId: string, date: string) => void }) => {
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
    <>
      <div className="text-center mb-4">
        <p className="text-muted-foreground mt-1 text-sm">
            {habitsForDay.length > 0
            ? `${completedCount} of ${habitsForDay.length} habits completed.`
            : "No habits scheduled for this day."}
        </p>
        {habitsForDay.length > 0 && (
            <Progress value={progress} className="h-2 mt-2" />
        )}
      </div>

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
    </>
  );
};


export function HabitDashboard() {
  const { habits, toggleHabitCompletion, isLoaded } = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleToggle = (habitId: string, date: string) => {
    toggleHabitCompletion(habitId, date);
  };

  const handlePrevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const isViewingToday = isToday(currentDate);

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

  const dateLabel = isToday(currentDate) ? 'Today' : format(currentDate, 'MMM d, yyyy');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={handlePrevDay} aria-label="Previous day">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <CardTitle className="text-xl font-bold font-headline text-center">
            {dateLabel}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleNextDay} disabled={isViewingToday} aria-label="Next day">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
          <DayHabitList
              date={currentDate}
              habits={habits}
              onToggle={handleToggle}
          />
      </CardContent>
    </Card>
  );
}
