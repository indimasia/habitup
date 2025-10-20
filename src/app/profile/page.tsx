'use client';

import { useHabits } from '@/hooks/use-habits';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Flame, CheckCircle, TrendingUp, History, LogOut } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { calculateLongestStreak } from '@/lib/utils';
import { HabitItemReadOnly } from '@/components/habits/habit-item-read-only';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/context/auth-context';

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
    const { user, logout } = useAuth();
    const [username, setUsername] = useState(user?.name || 'Anonymous');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (user?.name) {
            setUsername(user.name);
            setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`);
        }
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={avatarUrl} alt="User Avatar" />
                        <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="space-y-2" suppressHydrationWarning>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="space-y-2" suppressHydrationWarning>
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                </div>
                 <div className="space-y-2" suppressHydrationWarning>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
            </CardContent>
            <CardContent className="flex flex-col gap-4">
                 <Button>Save Changes</Button>
                 <Button variant="outline" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                 </Button>
            </CardContent>
        </Card>
    )
}

function HabitHistory() {
  const { habits } = useHabits();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const selectedDateStr = date ? format(date, 'yyyy-MM-dd') : '';

  return (
    <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <History className="h-6 w-6" />
                <CardTitle>Your Habit History</CardTitle>
            </div>
            <CardDescription>Select a date to view your habit completions.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-3">
             {habits.length > 0 ? (
                habits.map(habit => (
                    <HabitItemReadOnly
                        key={`${habit.id}-${selectedDateStr}`}
                        habit={habit}
                        isCompleted={habit.completions.some(c => c.date === selectedDateStr)}
                    />
                ))
            ) : (
                <p className="text-muted-foreground text-center py-4">You haven't created any habits yet.</p>
            )}
          </div>
        </CardContent>
    </Card>
  )
}


export default function ProfilePage() {
  return (
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Your Profile</h1>
            <p className="text-muted-foreground">Your progress, your settings.</p>
        </div>

        <ProfileStats />

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <AccountSettings />
            </div>
            <div className="lg:col-span-2">
                <HabitHistory />
            </div>
        </div>

      </main>
  );
}
