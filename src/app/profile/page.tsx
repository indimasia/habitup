'use client';

import { useHabits } from '@/hooks/use-habits';
import Header from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Flame, CheckCircle, TrendingUp, History } from 'lucide-react';
import { useMemo } from 'react';
import { calculateLongestStreak } from '@/lib/utils';
import { HabitItem } from '@/components/habits/habit-item';
import { format } from 'date-fns';

function ProfileStats() {
  const { habits, isLoaded } = useHabits();

  const { longestStreak, totalCompletions } = useMemo(() => {
    if (!isLoaded) return { longestStreak: 0, totalCompletions: 0 };

    const longest = Math.max(0, ...habits.map(h => calculateLongestStreak(h.completions)));
    const total = habits.reduce((sum, h) => sum + h.completions.length, 0);

    return { longestStreak: longest, totalCompletions: total };
  }, [habits, isLoaded]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{longestStreak} days</div>
          <p className="text-xs text-muted-foreground">Your best consistency</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCompletions}</div>
          <p className="text-xs text-muted-foreground">Across all habits</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Habits Created</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{habits.length}</div>
          <p className="text-xs text-muted-foreground">Building a better you</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="/avatars/01.png" alt="User Avatar" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="YourUsername" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
            </CardContent>
            <CardContent>
                 <Button>Save Changes</Button>
            </CardContent>
        </Card>
    )
}

function HabitHistory() {
  const { habits, toggleHabitCompletion } = useHabits();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <History className="h-6 w-6" />
                <CardTitle>Your Habit History</CardTitle>
            </div>
            <CardDescription>An overview of all your habits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
             {habits.length > 0 ? (
                habits.map(habit => (
                    <HabitItem
                        key={habit.id}
                        habit={habit}
                        isCompleted={habit.completions.some(c => c.date === todayStr)}
                        onToggle={() => toggleHabitCompletion(habit.id, todayStr)}
                    />
                ))
            ) : (
                <p className="text-muted-foreground text-center py-4">You haven't created any habits yet.</p>
            )}
        </CardContent>
    </Card>
  )
}


export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
            <p className="text-muted-foreground">Your progress, your settings.</p>
        </div>

        <ProfileStats />

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <AccountSettings />
            </div>
            <div className="md:col-span-2">
                <HabitHistory />
            </div>
        </div>

      </main>
    </div>
  );
}
