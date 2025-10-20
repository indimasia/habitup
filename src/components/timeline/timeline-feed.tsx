
'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePost } from "./create-post";
import { PostCard } from './post-card';
import { HabitCompletionCard } from './habit-completion-card';
import { timelineEvents } from '@/lib/mock-data';

export function TimelineFeed() {
  const [filter, setFilter] = useState('all');

  const filteredEvents = timelineEvents.filter(event => {
    if (filter === 'community') return event.user !== 'You';
    if (filter === 'me') return event.user === 'You';
    return true; // 'all'
  });

  return (
    <div className="space-y-6">
      <CreatePost />
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="me">Me</TabsTrigger>
        </TabsList>
        <div className="mt-6 space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              event.type === 'post' 
                ? <PostCard key={event.id} post={event as any} /> 
                : <HabitCompletionCard key={event.id} completion={event as any} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No events to show for this filter.</p>
          )}
        </div>
      </Tabs>
    </div>
  );
}
