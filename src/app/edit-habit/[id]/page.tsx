'use client';

import { useParams, useRouter } from 'next/navigation';
import { AddHabitForm } from '@/components/habits/add-habit-form';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/hooks/use-habits';
import { useEffect, useState } from 'react';
import { Habit } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditHabitPage() {
  const router = useRouter();
  const params = useParams();
  const { getHabitById, isLoaded } = useHabits();
  const [habit, setHabit] = useState<Habit | undefined>(undefined);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (isLoaded) {
      const habitToEdit = getHabitById(id);
      if (habitToEdit) {
        setHabit(habitToEdit);
      } else {
        // Handle case where habit is not found
        router.push('/');
      }
    }
  }, [id, isLoaded, getHabitById, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Edit Habit</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoaded && habit ? (
                 <AddHabitForm habitToEdit={habit} />
              ) : (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-10 w-1/3" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
