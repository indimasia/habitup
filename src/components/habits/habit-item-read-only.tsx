'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Habit } from '@/lib/types';
import { cn, calculateCurrentStreak } from '@/lib/utils';
import { Flame, Lock } from 'lucide-react';
import { habitIcons } from '@/lib/icons';

interface HabitItemReadOnlyProps {
  habit: Habit;
  isCompleted: boolean;
}

export function HabitItemReadOnly({ habit, isCompleted }: HabitItemReadOnlyProps) {
  const Icon = habitIcons[habit.icon as keyof typeof habitIcons] || Flame;
  const streak = calculateCurrentStreak(habit.completions);
  const uniqueId = `habit-${habit.id}-${new Date().getTime()}`;

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-in-out flex items-start gap-3 p-3 rounded-lg',
        isCompleted ? 'bg-secondary/70' : 'bg-card/50'
      )}
    >
      <Checkbox
        id={uniqueId}
        checked={isCompleted}
        disabled
        aria-label={`Status for ${habit.name}`}
        className="h-6 w-6 rounded-full data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-2 mt-1"
      />
      <div className="flex-1 flex flex-col gap-2">
        <div className="grid sm:grid-cols-[1fr_auto] sm:items-start gap-2">
          <div className='flex-1'>
            <label
              htmlFor={uniqueId}
              className={cn(
                'font-semibold font-headline text-base cursor-default',
                isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
              )}
            >
              {habit.name}
            </label>
            {habit.description && <p className="text-sm text-muted-foreground">{habit.description}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between text-muted-foreground mt-1">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm font-medium">
                    <Icon className="h-5 w-5 text-primary/80" />
                </div>
                {streak > 0 && (
                    <div className="flex items-center gap-1 text-sm font-medium" title={`${streak}-day streak`}>
                    <Flame className="h-5 w-5 text-amber-500" />
                    <span className="font-headline">{streak}</span>
                    </div>
                )}
                 {habit.isPrivate && (
                    <div className="flex items-center gap-1 text-sm font-medium" title="Private habit">
                        <Lock className="h-4 w-4 text-muted-foreground/80" />
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
