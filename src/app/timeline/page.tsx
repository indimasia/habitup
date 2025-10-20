import Header from '@/components/layout/header';
import { TimelineFeed } from '@/components/timeline/timeline-feed';

export default function TimelinePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-headline">Timeline</h1>
            <p className="text-muted-foreground">See what's happening in the community.</p>
        </div>
        <TimelineFeed />
      </main>
    </div>
  );
}
