
'use client';

import { Card, CardContent } from "@/components/ui/card"
import { leaderboardUsers } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopUsersList() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                {leaderboardUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-3 w-12">
                            <span className={cn("font-bold text-lg", user.rankColor)}>{user.rank}</span>
                            <user.rankIcon className={cn("h-6 w-6", user.rankColor)} />
                        </div>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold font-headline">{user.name}</p>
                        </div>

                        <div className="flex items-center gap-2 text-primary font-semibold">
                            <CheckCircle className="h-5 w-5"/>
                            <span>{user.completions}</span>
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
    )
}
