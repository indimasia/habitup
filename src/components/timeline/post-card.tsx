'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageSquare, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/auth-context';

export function PostCard({ post }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isDeleted, setIsDeleted] = useState(false);

  const currentUserName = user?.user_metadata?.name || user?.email || 'You';
  const isCurrentUserPost = post.user === 'You' || post.user === currentUserName;

  const handleSave = () => {
    // In a real app, you'd call an API to update the post
    post.content = editedContent;
    setIsEditing(false);
  };

  const handleDelete = () => {
    // In a real app, you'd call an API to delete the post
    setIsDeleted(true);
  }

  if (isDeleted) {
    return null;
  }

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
        {isCurrentUserPost && (
            <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Post options</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setIsEditing(true); setEditedContent(post.content); }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your post.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-2">
        {isEditing ? (
            <div className='space-y-2'>
                <Textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="min-h-[100px]" />
                <div className='flex justify-end gap-2'>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </div>
        ) : (
            <p className="whitespace-pre-wrap">{post.content}</p>
        )}
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
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUserName}`} alt="Your avatar" />
                  <AvatarFallback>{currentUserName.charAt(0) || 'Y'}</AvatarFallback>
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
