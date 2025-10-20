
'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={post.avatar} alt={`${post.user}'s avatar`} />
          <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{post.user}</p>
          <p className="text-sm text-muted-foreground">{post.timestamp}</p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-2 px-4 border-t">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className={cn(isLiked && 'text-red-500 hover:text-red-600', "flex items-center gap-2")}
        >
          <Heart className={cn(isLiked && "fill-current", "h-5 w-5")} />
          <span>{post.likes + (isLiked ? 1 : 0)}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span>{post.comments.length}</span>
        </Button>
      </CardFooter>
      {showComments && (
        <div className="p-4 border-t bg-muted/50">
          <div className="space-y-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatar} alt={`${comment.user}'s avatar`} />
                  <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-background p-2 rounded-lg">
                  <p className="font-semibold text-sm">{comment.user}</p>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-3 pt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=You" alt="Your avatar" />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <div className="w-full">
                    <Textarea placeholder="Write a comment..." className="w-full min-h-[40px] bg-background" />
                    <div className="flex justify-end mt-2">
                        <Button size="sm">Comment</Button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
