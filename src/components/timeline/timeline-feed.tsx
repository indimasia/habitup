'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePost } from "./create-post";
import { PostCard } from './post-card';
import { HabitCompletionCard } from './habit-completion-card';
import { timelineEvents } from '@/lib/mock-data';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export function TimelineFeed() {
  const [mainFilter, setMainFilter] = useState('all'); // 'all', 'posts', 'updates'
  const [showMineOnly, setShowMineOnly] = useState(false);

  const filteredEvents = timelineEvents.filter(event => {
    const typeMatch = 
        mainFilter === 'all' || 
        (mainFilter === 'posts' && event.type === 'post') ||
        (mainFilter === 'updates' && event.type === 'habitCompletion');
    
    const userMatch = !showMineOnly || (showMineOnly && event.user === 'You');

    return typeMatch && userMatch;
  });

  return (
    <div className="space-y-6">
      <CreatePost />
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setMainFilter}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <TabsList className="grid w-full grid-cols-3 max-w-sm">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
                <Switch 
                    id="show-mine-only" 
                    checked={showMineOnly}
                    onCheckedChange={setShowMineOnly}
                />
                <Label htmlFor="show-mine-only">Show only my activity</Label>
            </div>
        </div>
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
