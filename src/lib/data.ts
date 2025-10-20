import type { Habit } from './types';
import { formatISO } from 'date-fns';

export const DEFAULT_HABITS: Omit<Habit, 'id' | 'createdAt' | 'completions'>[] = [
  {
    name: 'Drink 8 glasses of water',
    description: 'Stay hydrated for better health and energy levels.',
    icon: 'GlassWater',
    frequency: 'daily',
  },
  {
    name: 'Read for 15 minutes',
    description: 'Expand your knowledge or get lost in a good story.',
    icon: 'BookOpen',
    frequency: 'daily',
  },
  {
    name: 'Morning workout',
    description: 'Start the day with some physical activity.',
    icon: 'Dumbbell',
    frequency: 'daily',
  },
  {
    name: 'Meditate for 5 minutes',
    description: 'Clear your mind and reduce stress.',
    icon: 'BrainCircuit',
    frequency: 'daily',
  },
  {
    name: 'Eat a healthy breakfast',
    description: 'Fuel your body for the day ahead.',
    icon: 'Apple',
    frequency: 'daily',
  },
];
