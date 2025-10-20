import Header from '@/components/layout/header';

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center h-full text-center py-16">
          <h1 className="text-4xl font-bold font-headline">Coming Soon</h1>
          <p className="mt-4 text-lg text-muted-foreground">The Leaderboard is under construction. Get ready to compete!</p>
        </div>
      </main>
    </div>
  );
}
