
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle } from 'lucide-react';

export function HabitCompletionCard({ completion }) {
  return (
    <Card className="bg-secondary/50">
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar>
          <AvatarImage src={completion.avatar} alt={`${completion.user}'s avatar`} />
          <AvatarFallback>{completion.user.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-sm">
          <p>
            <span className="font-semibold">{completion.user}</span> completed the habit "{completion.habitName}"
          </p>
          <p className="text-xs text-muted-foreground">{completion.timestamp}</p>
        </div>
        <CheckCircle className="h-6 w-6 text-primary" />
      </CardContent>
    </Card>
  );
}
