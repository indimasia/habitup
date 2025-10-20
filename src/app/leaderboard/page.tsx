
import { LeaderboardTabs } from '@/components/leaderboard/leaderboard-tabs';
import Header from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 pb-24 max-w-3xl">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="text-center px-0">
            <CardTitle className="text-3xl font-bold font-headline">Leaderboard</CardTitle>
            <CardDescription>See who's leading the pack in habit formation.</CardDescription>
          </CardHeader>
          <LeaderboardTabs />
        </Card>
      </main>
    </div>
  );
}
