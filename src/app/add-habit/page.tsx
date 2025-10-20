import { AddHabitForm } from '@/components/habits/add-habit-form';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddHabitPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Create a New Habit</CardTitle>
            </CardHeader>
            <CardContent>
              <AddHabitForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
