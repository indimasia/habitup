'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useHabits } from '@/hooks/use-habits';
import { Habit } from '@/lib/types';
import { IconPicker } from './icon-picker';
import { HabitIcon } from '@/lib/icons';
import { Switch } from '../ui/switch';

const addHabitSchema = z.object({
    name: z.string().min(3, 'Habit name must be at least 3 characters long.'),
    description: z.string().max(200, 'Description is too long.').optional(),
    icon: z.string().min(1, 'Please select an icon.'),
    isPrivate: z.boolean().default(false),
  });

type AddHabitFormValues = z.infer<typeof addHabitSchema>;

interface AddHabitFormProps {
    habitToEdit?: Habit;
}

export function AddHabitForm({ habitToEdit }: AddHabitFormProps) {
  const router = useRouter();
  const { addHabit, updateHabit } = useHabits();
  const isEditMode = !!habitToEdit;
  
  const form = useForm<AddHabitFormValues>({
    resolver: zodResolver(addHabitSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: 'Repeat',
      isPrivate: false,
    },
  });

  useEffect(() => {
    if (habitToEdit) {
      form.reset({
        name: habitToEdit.name,
        description: habitToEdit.description,
        icon: habitToEdit.icon,
        isPrivate: habitToEdit.isPrivate,
      });
    }
  }, [habitToEdit, form]);

  function onSubmit(data: AddHabitFormValues) {
    const habitData = {
      name: data.name,
      description: data.description || '',
      icon: data.icon as HabitIcon,
      isPrivate: data.isPrivate,
      frequency: 'daily' as const,
    };

    if (isEditMode && habitToEdit) {
        updateHabit(habitToEdit.id, habitData);
    } else {
        addHabit(habitData);
    }
    
    router.push('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Drink water" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Why is this habit important to you?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <IconPicker value={field.value as HabitIcon} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Private Habit
                </FormLabel>
                <FormDescription>
                  Private habits will not appear on the public leaderboard.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting 
              ? (isEditMode ? 'Saving Changes...' : 'Creating Habit...') 
              : (isEditMode ? 'Save Changes' : 'Create Habit')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
