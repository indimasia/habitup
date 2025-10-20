'use server';

/**
 * @fileOverview A Genkit flow for generating personalized habit tips.
 *
 * - generatePersonalizedHabitTips - A function that generates personalized habit tips for a given habit.
 * - GeneratePersonalizedHabitTipsInput - The input type for the generatePersonalizedHabitTips function.
 * - GeneratePersonalizedHabitTipsOutput - The return type for the generatePersonalizedHabitTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedHabitTipsInputSchema = z.object({
  habitName: z.string().describe('The name of the habit.'),
  habitDescription: z.string().describe('A description of the habit.'),
  userContext: z
    .string()
    .describe(
      'Information about the user, including their goals, challenges, and past experiences with habit formation.'
    ),
});

export type GeneratePersonalizedHabitTipsInput = z.infer<
  typeof GeneratePersonalizedHabitTipsInputSchema
>;

const GeneratePersonalizedHabitTipsOutputSchema = z.object({
  tip: z.string().describe('A personalized tip to help the user maintain their habit.'),
});

export type GeneratePersonalizedHabitTipsOutput = z.infer<
  typeof GeneratePersonalizedHabitTipsOutputSchema
>;

export async function generatePersonalizedHabitTips(
  input: GeneratePersonalizedHabitTipsInput
): Promise<GeneratePersonalizedHabitTipsOutput> {
  return generatePersonalizedHabitTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedHabitTipsPrompt',
  input: {schema: GeneratePersonalizedHabitTipsInputSchema},
  output: {schema: GeneratePersonalizedHabitTipsOutputSchema},
  prompt: `You are an AI habit coach that is an expert in encouraging users to continue their habits.

  Generate a personalized tip for the user to help them maintain their habit, based on the following information:

  Habit name: {{{habitName}}}
  Habit description: {{{habitDescription}}}
  User context: {{{userContext}}}

  The tip should be encouraging, specific, and actionable.
  `,
});

const generatePersonalizedHabitTipsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedHabitTipsFlow',
    inputSchema: GeneratePersonalizedHabitTipsInputSchema,
    outputSchema: GeneratePersonalizedHabitTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
