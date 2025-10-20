
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
    if (filter === 'posts') return event.type === 'post';
    if (filter === 'activity') return event.type === 'habitCompletion';
    return true;
  });

  return (
    <div className="space-y-6">
      <CreatePost />
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="activity">Habit Activity</TabsTrigger>
        </TabsList>
        <div className="mt-6 space-y-6">
          {filteredEvents.map(event => (
            event.type === 'post' 
              ? <PostCard key={event.id} post={event as any} /> 
              : <HabitCompletionCard key={event.id} completion={event as any} />
          ))}
        </div>
      </Tabs>
    </div>
  );
}
