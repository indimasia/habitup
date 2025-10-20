'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Habit } from '@/lib/types';
import { DEFAULT_HABITS } from '@/lib/data';
import { formatISO, subDays } from 'date-fns';
import { toast } from './use-toast';

const HABITS_STORAGE_KEY = 'habitzen-habits';

function createInitialHabits(): Habit[] {
  // Avoid creating new Date objects repeatedly in a loop for performance.
  const now = new Date();
  const nowISO = now.toISOString();
  const date1 = formatISO(subDays(now, 1), { representation: 'date' });
  const date2 = formatISO(subDays(now, 2), { representation: 'date' });
  const date4 = formatISO(subDays(now, 4), { representation: 'date' });

  return DEFAULT_HABITS.map((habit, index) => ({
    ...habit,
    id: `habit-${now.getTime()}-${index}`,
    createdAt: nowISO,
    completions: [
      { date: date1 },
      { date: date2 },
      { date: date4 },
    ],
  }));
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let initialHabits: Habit[];
    try {
      const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
      if (storedHabits) {
        initialHabits = JSON.parse(storedHabits);
      } else {
        initialHabits = createInitialHabits();
        localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(initialHabits));
      }
    } catch (error) {
      console.error('Failed to load habits from localStorage', error);
      initialHabits = createInitialHabits();
    } finally {
      setHabits(initialHabits);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits to localStorage', error);
        toast({
            variant: 'destructive',
            title: 'Error Saving Data',
            description: 'Your changes could not be saved to your device.',
        });
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
    []
  );

  const updateHabit = useCallback(
    (habitId: string, updatedData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
      setHabits(prevHabits =>
        prevHabits.map(habit => 
          habit.id === habitId ? { ...habit, ...updatedData } : habit
        )
      );
      toast({
        title: 'Habit Updated',
        description: `Your habit "${updatedData.name}" has been saved.`,
      });
    },
    []
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
    [habits]
  );

  const toggleHabitCompletion = useCallback(
    (habitId: string, date: string) => {
      setHabits(prevHabits =>
        prevHabits.map(habit => {
          if (habit.id === habitId) {
            const isCompleted = habit.completions.some(c => c.date === date);
            const newCompletions = isCompleted
              ? habit.completions.filter(c => c.date !== date)
              : [...habit.completions, { date }];
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
