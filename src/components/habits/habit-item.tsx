'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Habit } from '@/lib/types';
import { cn, calculateCurrentStreak } from '@/lib/utils';
import { Flame, Lightbulb, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { habitIcons } from '@/lib/icons';
import { AITipGenerator } from './ai-tip-generator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useHabits } from '@/hooks/use-habits';
import { Button } from '../ui/button';

interface HabitItemProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

export function HabitItem({ habit, isCompleted, onToggle }: HabitItemProps) {
  const Icon = habitIcons[habit.icon as keyof typeof habitIcons] || Flame;
  const streak = calculateCurrentStreak(habit.completions);
  const { deleteHabit } = useHabits();

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-in-out flex items-start gap-3 p-3 rounded-lg',
        isCompleted ? 'bg-secondary/70' : 'bg-card/50 hover:bg-card'
      )}
    >
      <Checkbox
        id={`habit-${habit.id}-${new Date().getTime()}`}
        checked={isCompleted}
        onCheckedChange={onToggle}
        aria-label={`Mark ${habit.name} as complete`}
        className="h-6 w-6 rounded-full data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-2 mt-1"
      />
      <div className="flex-1 flex flex-col gap-2">
        <div>
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
            </div>

            <div className="flex items-center sm:gap-1">
                <AITipGenerator habit={habit}>
                <button className="p-2 rounded-full hover:bg-accent transition-colors" aria-label="Get a personalized tip">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                </button>
                </AITipGenerator>
                
                <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Habit options</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/edit-habit/${habit.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                        </Link>
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your habit "{habit.name}" and all its completion data.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => deleteHabit(habit.id)}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
      </div>
    </div>
  );
}
