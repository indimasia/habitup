export type Habit = {
  id: string;
  name: string;
  description: string;
  icon: string;
  frequency: 'daily'; // All habits are daily now
  completions: { date: string }[]; // YYYY-MM-DD
  createdAt: string; // ISO string
  isPrivate: boolean;
};

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export type DayOfWeek = (typeof DAY_NAMES)[number];
