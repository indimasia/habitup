import {
  BookOpen,
  BrainCircuit,
  Dumbbell,
  GlassWater,
  Heart,
  Leaf,
  PenSquare,
  Repeat,
  Sparkles,
  Sunrise,
  Bed,
  Apple,
  Zap,
  Award,
  BarChart,
  Target,
} from 'lucide-react';

export const habitIcons = {
  BookOpen: BookOpen,
  BrainCircuit: BrainCircuit,
  Dumbbell: Dumbbell,
  GlassWater: GlassWater,
  Heart: Heart,
  Leaf: Leaf,
  PenSquare: PenSquare,
  Repeat: Repeat,
  Sparkles: Sparkles,
  Sunrise: Sunrise,
  Bed: Bed,
  Apple: Apple,
  Zap: Zap,
  Award: Award,
  BarChart: BarChart,
  Target: Target,
};

export type HabitIcon = keyof typeof habitIcons;

export const habitIconNames = Object.keys(habitIcons) as HabitIcon[];
