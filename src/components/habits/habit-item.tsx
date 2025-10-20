'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Habit } from '@/lib/types';
import { cn, calculateCurrentStreak } from '@/lib/utils';
import { Flame, Lightbulb } from 'lucide-react';
import { habitIcons } from '@/lib/icons';
import { AITipGenerator } from './ai-tip-generator';

interface HabitItemProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

export function HabitItem({ habit, isCompleted, onToggle }: HabitItemProps) {
  const Icon = habitIcons[habit.icon as keyof typeof habitIcons] || Flame;
  const streak = calculateCurrentStreak(habit.completions);

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-in-out flex items-center gap-4 p-3 rounded-lg',
        isCompleted ? 'bg-secondary/70' : 'bg-card/50 hover:bg-card'
      )}
    >
      <Checkbox
        id={`habit-${habit.id}-${new Date().getTime()}`}
        checked={isCompleted}
        onCheckedChange={onToggle}
        aria-label={`Mark ${habit.name} as complete`}
        className="h-6 w-6 rounded-full data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-2"
      />
      <div className="flex-1">
        <label
          htmlFor={`habit-${habit.id}-${new Date().getTime()}`}
          className={cn(
            'font-semibold font-headline text-base cursor-pointer transition-opacity',
            isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
          )}
        >
          {habit.name}
        </label>
        {habit.description && <p className="text-sm text-muted-foreground">{habit.description}</p>}
      </div>

      <div className="flex items-center gap-4 text-muted-foreground">
         <div className="flex items-center gap-1 text-sm font-medium">
            <Icon className="h-5 w-5 text-primary/80" />
          </div>
          {streak > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium" title={`${streak}-day streak`}>
                  <Flame className="h-5 w-5 text-amber-500"/>
                  <span className="font-headline">{streak}</span>
              </div>
          )}
      </div>
       
      <AITipGenerator habit={habit}>
          <button className="p-2 rounded-full hover:bg-accent transition-colors" aria-label="Get a personalized tip">
               <Lightbulb className="h-5 w-5 text-amber-500" />
          </button>
      </AITipGenerator>
    </div>
  );
}
