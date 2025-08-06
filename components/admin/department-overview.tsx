import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function DepartmentOverview() {
  const departments = [
    {
      name: "Public Works",
      activeIssues: 45,
      resolvedThisMonth: 123,
      avgResolutionTime: "2.8 days",
      performance: 92,
      status: "excellent",
    },
    {
      name: "Transportation",
      activeIssues: 23,
      resolvedThisMonth: 67,
      avgResolutionTime: "4.2 days",
      performance: 78,
      status: "good",
    },
    {
      name: "Water & Utilities",
      activeIssues: 34,
      resolvedThisMonth: 89,
      avgResolutionTime: "3.5 days",
      performance: 85,
      status: "good",
    },
    {
      name: "Parks & Recreation",
      activeIssues: 12,
      resolvedThisMonth: 34,
      avgResolutionTime: "5.1 days",
      performance: 65,
      status: "needs-improvement",
    },
    {
      name: "Health & Safety",
      activeIssues: 8,
      resolvedThisMonth: 28,
      avgResolutionTime: "1.9 days",
      performance: 95,
      status: "excellent",
    },
    {
      name: "Environmental Services",
      activeIssues: 19,
      resolvedThisMonth: 45,
      avgResolutionTime: "3.8 days",
      performance: 82,
      status: "good",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "needs-improvement":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excellent"
      case "good":
        return "Good"
      case "needs-improvement":
        return "Needs Improvement"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {departments.map((dept) => (
        <Card key={dept.name}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{dept.name}</CardTitle>
              <Badge className={getStatusColor(dept.status)}>{getStatusLabel(dept.status)}</Badge>
            </div>
            <CardDescription>Department performance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Active Issues</p>
                <p className="text-2xl font-bold">{dept.activeIssues}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{dept.resolvedThisMonth}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Performance Score</span>
                <span>{dept.performance}%</span>
              </div>
              <Progress value={dept.performance} className="h-2" />
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">Avg Resolution Time</p>
              <p className="font-medium">{dept.avgResolutionTime}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
