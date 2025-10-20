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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useHabits } from '@/hooks/use-habits';
import { DAY_NAMES, DayOfWeek, Habit } from '@/lib/types';
import { IconPicker } from './icon-picker';
import { HabitIcon } from '@/lib/icons';

const addHabitSchema = z
  .object({
    name: z.string().min(3, 'Habit name must be at least 3 characters long.'),
    description: z.string().max(200, 'Description is too long.').optional(),
    icon: z.string().min(1, 'Please select an icon.'),
    frequencyType: z.enum(['daily', 'specific']),
    specificDays: z
      .array(z.string())
      .optional(),
  })
  .refine(
    data => {
      if (data.frequencyType === 'specific') {
        return data.specificDays && data.specificDays.length > 0;
      }
      return true;
    },
    {
      message: 'Please select at least one day.',
      path: ['specificDays'],
    }
  );

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
      frequencyType: 'daily',
      specificDays: [],
    },
  });

  useEffect(() => {
    if (habitToEdit) {
      form.reset({
        name: habitToEdit.name,
        description: habitToEdit.description,
        icon: habitToEdit.icon,
        frequencyType: habitToEdit.frequency === 'daily' ? 'daily' : 'specific',
        specificDays: Array.isArray(habitToEdit.frequency) ? habitToEdit.frequency : [],
      });
    }
  }, [habitToEdit, form]);

  const frequencyType = form.watch('frequencyType');

  function onSubmit(data: AddHabitFormValues) {
    const habitData = {
      name: data.name,
      description: data.description || '',
      icon: data.icon as HabitIcon,
      frequency: data.frequencyType === 'daily' ? 'daily' : (data.specificDays as DayOfWeek[]),
    };

    if (isEditMode) {
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
          name="frequencyType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Frequency</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="daily" />
                    </FormControl>
                    <FormLabel className="font-normal">Daily</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="specific" />
                    </FormControl>
                    <FormLabel className="font-normal">Specific days of the week</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {frequencyType === 'specific' && (
          <FormField
            control={form.control}
            name="specificDays"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Select Days</FormLabel>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {DAY_NAMES.map(day => (
                  <FormField
                    key={day}
                    control={form.control}
                    name="specificDays"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={day}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day)}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([...(field.value || []), day])
                                  : field.onChange(
                                      field.value?.filter(
                                        value => value !== day
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {day}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting 
            ? (isEditMode ? 'Saving Changes...' : 'Creating Habit...') 
            : (isEditMode ? 'Save Changes' : 'Create Habit')
          }
        </Button>
      </form>
    </Form>
  );
}
