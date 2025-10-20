
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopUsersList } from "./top-users-list"
import { TopHabitsList } from "./top-habits-list"
import { Users, Flame } from "lucide-react"

export function LeaderboardTabs() {
  return (
    <Tabs defaultValue="top-users" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="top-users">
            <Users className="mr-2 h-4 w-4" />
            Top Users
        </TabsTrigger>
        <TabsTrigger value="top-habits">
            <Flame className="mr-2 h-4 w-4" />
            Top Habits
        </TabsTrigger>
      </TabsList>
      <TabsContent value="top-users" className="mt-4">
        <TopUsersList />
      </TabsContent>
      <TabsContent value="top-habits" className="mt-4">
        <TopHabitsList />
      </TabsContent>
    </Tabs>
  )
}
