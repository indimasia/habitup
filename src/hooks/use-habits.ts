'use client';

import { useEffect, useReducer, useCallback } from 'react';
import type { Habit } from '@/lib/types';
import { DEFAULT_HABITS } from '@/lib/data';
import { formatISO, subDays } from 'date-fns';
import { toast } from './use-toast';

const HABITS_STORAGE_KEY = 'habitzen-habits';

// --- Reducer Logic ---

type Action =
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: { id: string; data: Partial<Habit> } }
  | { type: 'DELETE_HABIT'; payload: { id: string } }
  | { type: 'TOGGLE_COMPLETION'; payload: { habitId: string; date: string } }
  | { type: 'SET_LOADED' };

interface State {
  habits: Habit[];
  isLoaded: boolean;
}

const initialState: State = {
  habits: [],
  isLoaded: false,
};

function habitsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADED':
      return { ...state, isLoaded: true };
    case 'SET_HABITS':
      return { ...state, habits: action.payload, isLoaded: true };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? { ...habit, ...action.payload.data, frequency: 'daily' } : habit
        ),
      };
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload.id),
      };
    case 'TOGGLE_COMPLETION': {
      const { habitId, date } = action.payload;
      return {
        ...state,
        habits: state.habits.map(habit => {
          if (habit.id === habitId) {
            const isCompleted = habit.completions.some(c => c.date === date);
            const newCompletions = isCompleted
              ? habit.completions.filter(c => c.date !== date)
              : [...habit.completions, { date }];
            return { ...habit, completions: newCompletions };
          }
          return habit;
        }),
      };
    }
    default:
      return state;
  }
}

// --- Helper Functions ---

function createInitialHabits(): Habit[] {
  const now = new Date();
  const date1 = formatISO(subDays(now, 1), { representation: 'date' });
  const date2 = formatISO(subDays(now, 2), { representation: 'date' });
  const date4 = formatISO(subDays(now, 4), { representation: 'date' });

  return DEFAULT_HABITS.map((habit, index) => ({
    ...habit,
    id: `habit-${now.getTime()}-${index}`,
    createdAt: now.toISOString(),
    completions: [{ date: date1 }, { date: date2 }, { date: date4 }],
    frequency: 'daily' as const,
  }));
}

// --- The Hook ---

export function useHabits() {
  const [state, dispatch] = useReducer(habitsReducer, initialState);
  const { habits, isLoaded } = state;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
      if (storedHabits) {
        dispatch({ type: 'SET_HABITS', payload: JSON.parse(storedHabits) });
      } else {
        const initialHabits = createInitialHabits();
        dispatch({ type: 'SET_HABITS', payload: initialHabits });
      }
    } catch (error) {
      console.error('Failed to load habits, using defaults.', error);
      dispatch({ type: 'SET_HABITS', payload: createInitialHabits() });
    }
  }, []);

  // Save to localStorage when habits change
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

  const addHabit = useCallback((newHabitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completions: [],
      frequency: 'daily',
    };
    dispatch({ type: 'ADD_HABIT', payload: newHabit });
    toast({
      title: 'Habit Created!',
      description: `You're on your way to building "${newHabit.name}".`,
    });
  }, []);

  const updateHabit = useCallback((habitId: string, updatedData: Partial<Omit<Habit, 'id'>>) => {
    dispatch({ type: 'UPDATE_HABIT', payload: { id: habitId, data: { ...updatedData, frequency: 'daily' } } });
    toast({
      title: 'Habit Updated',
      description: `Your habit "${updatedData.name}" has been saved.`,
    });
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    const habitToDelete = habits.find(h => h.id === habitId);
    if (habitToDelete) {
      dispatch({ type: 'DELETE_HABIT', payload: { id: habitId } });
      toast({
        title: 'Habit Deleted',
        description: `You have deleted the habit "${habitToDelete.name}".`,
        variant: 'destructive',
      });
    }
  }, [habits]);

  const toggleHabitCompletion = useCallback((habitId: string, date: string) => {
    dispatch({ type: 'TOGGLE_COMPLETION', payload: { habitId, date } });
  }, []);

  const getHabitById = useCallback((id: string) => {
    return habits.find(habit => habit.id === id);
  }, [habits]);

  return { habits, addHabit, updateHabit, deleteHabit, toggleHabitCompletion, getHabitById, isLoaded };
}
