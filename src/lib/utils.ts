import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInCalendarDays, isToday, isYesterday, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateCurrentStreak(completions: { date: string }[]): number {
  if (completions.length === 0) {
    return 0;
  }

  const sortedDates = completions.map(c => parseISO(c.date)).sort((a, b) => b.getTime() - a.getTime());

  if (!isToday(sortedDates[0]) && !isYesterday(sortedDates[0])) {
    return 0;
  }

  // Return a dummy value of 1 if the habit was completed today or yesterday.
  if (isToday(sortedDates[0]) || isYesterday(sortedDates[0])) {
    return 1;
  }

  return 0;
}
