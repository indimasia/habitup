'use server';

import {
  generatePersonalizedHabitTips,
  type GeneratePersonalizedHabitTipsInput,
} from '@/ai/flows/generate-personalized-habit-tips';

export async function getAITip(input: GeneratePersonalizedHabitTipsInput) {
  try {
    const result = await generatePersonalizedHabitTips(input);
    if (!result || !result.tip) {
        return { success: false, error: 'Failed to generate a valid tip.' };
    }
    return { success: true, tip: result.tip };
  } catch (error) {
    console.error('AI tip generation failed:', error);
    return { success: false, error: 'An unexpected error occurred while generating your tip.' };
  }
}
