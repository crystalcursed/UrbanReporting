import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IssuesList } from "@/components/dashboard/issues-list"
import { IssueStats } from "@/components/dashboard/issue-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { LeaderboardSection } from "@/components/dashboard/leaderboard-section"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your community's issues.</p>
      </div>
      <IssueStats />
      <Tabs defaultValue="my-sector" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-sector">My Sector</TabsTrigger>
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          <TabsTrigger value="all-sectors">All Sectors</TabsTrigger>
        </TabsList>
        <TabsContent value="my-sector" className="space-y-4">
          <IssuesList sector="my-sector" />
        </TabsContent>
        <TabsContent value="my-reports" className="space-y-4">
          <IssuesList sector="my-reports" />
        </TabsContent>
        <TabsContent value="all-sectors" className="space-y-4">
          <IssuesList sector="all-sectors" />
        </TabsContent>
      </Tabs>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your community</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Community Leaderboard</CardTitle>
            <CardDescription>Top contributors in your sector</CardDescription>
          </CardHeader>
          <CardContent>
            <LeaderboardSection />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
