import { HabitDashboard } from '@/components/habits/habit-dashboard';
import Header from '@/components/layout/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 pb-24">
        <HabitDashboard />
      </main>
    </div>
  );
}
