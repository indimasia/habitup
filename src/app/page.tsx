import { HabitDashboard } from '@/components/habits/habit-dashboard';

export default function Home() {
  return (
    <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 pb-24">
      <HabitDashboard />
    </main>
  );
}
