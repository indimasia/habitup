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

  let streak = 1;
  if (!isToday(sortedDates[0]) && isYesterday(sortedDates[0])) {
    streak = 1;
  } else if (!isToday(sortedDates[0])) {
    return 0;
  }


  for (let i = 1; i < sortedDates.length; i++) {
    const diff = differenceInCalendarDays(sortedDates[i-1], sortedDates[i]);
    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
    // if diff is 0, it means same day completion, ignore.
  }

  return streak;
}
