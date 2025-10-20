'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Habit, DayOfWeek } from '@/lib/types';
import { DEFAULT_HABITS } from '@/lib/data';
import { formatISO, subDays } from 'date-fns';
import { useToast } from './use-toast';

const HABITS_STORAGE_KEY = 'habitzen-habits';

function createInitialHabits(): Habit[] {
  return DEFAULT_HABITS.map((habit, index) => ({
    ...habit,
    id: `habit-${Date.now()}-${index}`,
    createdAt: new Date().toISOString(),
    completions: [
      { date: formatISO(subDays(new Date(), 1), { representation: 'date' }) },
      { date: formatISO(subDays(new Date(), 2), { representation: 'date' }) },
      { date: formatISO(subDays(new Date(), 4), { representation: 'date' }) },
    ],
  }));
}

export function useHabits() {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      } else {
        const initialHabits = createInitialHabits();
        setHabits(initialHabits);
        localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(initialHabits));
      }
    } catch (error) {
      console.error('Failed to load habits from localStorage', error);
      // Fallback to default if localStorage fails
      setHabits(createInitialHabits());
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits to localStorage', error);
      }
    }
  }, [habits, isLoaded]);

  const addHabit = useCallback(
    (newHabitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
      const newHabit: Habit = {
        ...newHabitData,
        id: `habit-${Date.now()}`,
        createdAt: new Date().toISOString(),
        completions: [],
      };
      setHabits(prevHabits => [...prevHabits, newHabit]);
      toast({
        title: 'Habit Created!',
        description: `You're on your way to building "${newHabit.name}".`,
      });
    },
    [toast]
  );

  const updateHabit = useCallback(
    (habitId: string, updatedData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
      setHabits(prevHabits =>
        prevHabits.map(habit => {
          if (habit.id === habitId) {
            return {
              ...habit,
              ...updatedData,
            };
          }
          return habit;
        })
      );
      toast({
        title: 'Habit Updated',
        description: `Your habit "${updatedData.name}" has been saved.`,
      });
    },
    [toast]
  );

  const deleteHabit = useCallback(
    (habitId: string) => {
      const habitToDelete = habits.find(h => h.id === habitId);
      if (habitToDelete) {
        setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
        toast({
          title: 'Habit Deleted',
          description: `You have deleted the habit "${habitToDelete.name}".`,
          variant: 'destructive',
        });
      }
    },
    [habits, toast]
  );

  const toggleHabitCompletion = useCallback(
    (habitId: string, date: string) => {
      setHabits(prevHabits =>
        prevHabits.map(habit => {
          if (habit.id === habitId) {
            const completionIndex = habit.completions.findIndex(c => c.date === date);
            let newCompletions;

            if (completionIndex > -1) {
              // Remove completion
              newCompletions = habit.completions.filter((_, index) => index !== completionIndex);
            } else {
              // Add completion
              newCompletions = [...habit.completions, { date }];
            }
            return { ...habit, completions: newCompletions };
          }
          return habit;
        })
      );
    },
    []
  );

  const getHabitById = useCallback(
    (id: string) => {
      return habits.find(habit => habit.id === id);
    },
    [habits]
  );

  return { habits, addHabit, updateHabit, deleteHabit, toggleHabitCompletion, getHabitById, isLoaded };
}
