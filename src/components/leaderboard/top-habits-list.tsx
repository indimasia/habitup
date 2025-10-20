
'use client';
import { Card, CardContent } from "@/components/ui/card"
import { topHabits } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopHabitsList() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                {topHabits.map((habit) => (
                    <div key={habit.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-3 w-12">
                            <span className={cn("font-bold text-lg", habit.rankColor)}>{habit.rank}</span>
                            <habit.rankIcon className={cn("h-6 w-6", habit.rankColor)} />
                        </div>

                        <div className="flex-1">
                            <p className="font-semibold font-headline truncate">{habit.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Avatar className="h-5 w-5">
                                    <AvatarImage src={habit.userAvatar} alt={habit.user} />
                                    <AvatarFallback>{habit.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{habit.user}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-amber-500 font-bold font-headline text-lg">
                            <Flame className="h-5 w-5"/>
                            <span>{habit.streak}</span>
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
    )
}

