'use client';
import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Habit } from '@/lib/types';
import { getAITip } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AITipGeneratorProps {
  habit: Habit;
  children: ReactNode;
}

export function AITipGenerator({ habit, children }: AITipGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [userContext, setUserContext] = useState('');
  const [tip, setTip] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateTip = async () => {
    setIsLoading(true);
    setTip('');
    const result = await getAITip({
      habitName: habit.name,
      habitDescription: habit.description,
      userContext: userContext || 'I want to stay motivated.',
    });
    setIsLoading(false);

    if (result.success) {
      setTip(result.tip);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Get a Personal Tip for "{habit.name}"
          </DialogTitle>
          <DialogDescription>
            Our AI coach can give you a personalized tip. Tell us a bit about your goals or challenges.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="user-context">My goals/challenges (optional)</Label>
            <Textarea
              id="user-context"
              placeholder="e.g., I'm finding it hard to stay consistent on weekends."
              value={userContext}
              onChange={e => setUserContext(e.target.value)}
            />
          </div>
          {tip && (
             <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle className="font-headline">Your AI Coach Says:</AlertTitle>
                <AlertDescription className="prose prose-sm">
                    {tip}
                </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleGenerateTip} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Tip'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
