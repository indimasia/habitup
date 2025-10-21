import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInCalendarDays, isToday, isYesterday, parseISO, startOfToday, subDays, formatISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateCurrentStreak(completions: { date: string }[]): number {
  if (completions.length === 0) {
    return 0;
  }

  const sortedDates = completions.map(c => parseISO(c.date)).sort((a, b) => b.getTime() - a.getTime());

  const today = startOfToday();
  let mostRecentDate = sortedDates[0];

  // If the last completion was not today or yesterday, streak is 0
  if (!isToday(mostRecentDate) && !isYesterday(mostRecentDate)) {
    return 0;
  }

  let streak = 1;
  // If most recent was yesterday, start check from day before yesterday.
  let currentDate = isToday(mostRecentDate) ? mostRecentDate : today;


  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = sortedDates[i];
    const expectedPrevDate = new Date(currentDate);
    expectedPrevDate.setDate(currentDate.getDate() - streak);
    
    if (differenceInCalendarDays(currentDate, prevDate) === streak) {
      streak++;
    } else {
      break; 
    }
  }

  return streak;
}


export function calculateLongestStreak(completions: { date: string }[]): number {
    if (completions.length === 0) {
        return 0;
    }

    const sortedDates = completions.map(c => parseISO(c.date)).sort((a, b) => a.getTime() - b.getTime());

    if (sortedDates.length <= 1) {
        return sortedDates.length;
    }

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
        const diff = differenceInCalendarDays(sortedDates[i], sortedDates[i-1]);
        if (diff === 1) {
            currentStreak++;
        } else if (diff > 1) {
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1; // Reset streak
        }
        // if diff is 0, it's a completion on the same day, so we continue the streak
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return longestStreak;
}

export function getRecentStreak(completions: { date: string }[]): boolean[] {
  const today = startOfToday();
  const recentCompletions = new Set(completions.map(c => c.date));
  const streak: boolean[] = [];
  for (let i = 0; i < 5; i++) {
    const date = subDays(today, i);
    const dateStr = formatISO(date, { representation: 'date' });
    streak.push(recentCompletions.has(dateStr));
  }
  return streak.reverse(); // So it shows past to present (left to right)
}
