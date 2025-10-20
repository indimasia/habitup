
'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function CreatePost() {
  const [postContent, setPostContent] = useState('');

  const handlePost = () => {
    if (postContent.trim()) {
      console.log('New Post:', postContent);
      // Here you would typically call a function to add the post to the timeline
      setPostContent('');
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=You" alt="Your avatar" />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="w-full space-y-2">
            <Textarea
              placeholder="Share your progress or ask a question..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full border-none focus-visible:ring-0 resize-none"
            />
            <div className="flex justify-end">
              <Button onClick={handlePost} disabled={!postContent.trim()}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
