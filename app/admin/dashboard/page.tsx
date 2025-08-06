import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminIssueStats } from "@/components/admin/admin-issue-stats"
import { AdminIssuesList } from "@/components/admin/admin-issues-list"
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity"
import { DepartmentOverview } from "@/components/admin/department-overview"

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage citizen issues and monitor department performance.</p>
      </div>

      <AdminIssueStats />

      <Tabs defaultValue="all-issues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-issues">All Issues</TabsTrigger>
          <TabsTrigger value="pending-review">Pending Review</TabsTrigger>
          <TabsTrigger value="urgent-issues">Urgent Issues</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="all-issues" className="space-y-4">
          <AdminIssuesList filter="all" />
        </TabsContent>

        <TabsContent value="pending-review" className="space-y-4">
          <AdminIssuesList filter="pending" />
        </TabsContent>

        <TabsContent value="urgent-issues" className="space-y-4">
          <AdminIssuesList filter="urgent" />
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <DepartmentOverview />
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Administrative Activity</CardTitle>
            <CardDescription>Latest actions taken by government officials</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminRecentActivity />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Notifications</CardTitle>
            <CardDescription>Important alerts and system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">High Priority Issues Alert</p>
                  <p className="text-xs text-muted-foreground">3 urgent issues require immediate attention</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Department Performance Review</p>
                  <p className="text-xs text-muted-foreground">Monthly performance reports are ready</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">System Update Complete</p>
                  <p className="text-xs text-muted-foreground">All systems are running normally</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
