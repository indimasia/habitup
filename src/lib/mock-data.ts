
import { User, Medal, Trophy, Star } from 'lucide-react';

export const leaderboardUsers = [
  {
    id: 'user-1',
    name: 'Alex',
    avatar: '/avatars/01.png',
    completions: 184,
    rank: 1,
    rankIcon: Medal,
    rankColor: 'text-amber-400',
  },
  {
    id: 'user-2',
    name: 'Sarah',
    avatar: '/avatars/02.png',
    completions: 172,
    rank: 2,
    rankIcon: Trophy,
    rankColor: 'text-slate-400',
  },
  {
    id: 'user-3',
    name: 'Mike',
    avatar: '/avatars/03.png',
    completions: 165,
    rank: 3,
    rankIcon: Award,
    rankColor: 'text-amber-600',
  },
  {
    id: 'user-4',
    name: 'Jen',
    avatar: '/avatars/04.png',
    completions: 158,
    rank: 4,
    rankIcon: Star,
    rankColor: 'text-muted-foreground',
  },
    {
    id: 'user-5',
    name: 'David',
    avatar: '/avatars/05.png',
    completions: 140,
    rank: 5,
    rankIcon: User,
    rankColor: 'text-muted-foreground',
  },
];


export const topHabits = [
    {
        id: 'habit-101',
        name: 'Daily Morning Run',
        streak: 128,
        user: 'Emily',
        userAvatar: '/avatars/06.png',
        rank: 1,
        rankIcon: Medal,
        rankColor: 'text-amber-400',
    },
    {
        id: 'habit-102',
        name: 'Read 20 pages',
        streak: 115,
        user: 'Chris',
        userAvatar: '/avatars/07.png',
        rank: 2,
        rankIcon: Trophy,
        rankColor: 'text-slate-400',
    },
    {
        id: 'habit-103',
        name: 'Code for 1 hour',
        streak: 98,
        user: 'Liam',
        userAvatar: '/avatars/08.png',
        rank: 3,
        rankIcon: Award,
        rankColor: 'text-amber-600',
    },
    {
        id: 'habit-104',
        name: 'No Sugar',
        streak: 95,
        user: 'Olivia',
        userAvatar: '/avatars/09.png',
        rank: 4,
        rankIcon: Star,
        rankColor: 'text-muted-foreground',
    },
    {
        id: 'habit-105',
        name: 'Meditate',
        streak: 80,
        user: 'Noah',
        userAvatar: '/avatars/10.png',
        rank: 5,
        rankIcon: User,
        rankColor: 'text-muted-foreground',
    }
]

