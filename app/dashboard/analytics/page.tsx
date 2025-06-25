"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for issue statistics
const issuesByCategory = [
  { name: "Roads", value: 35 },
  { name: "Water", value: 25 },
  { name: "Electricity", value: 18 },
  { name: "Sanitation", value: 15 },
  { name: "Infrastructure", value: 12 },
  { name: "Environment", value: 8 },
  { name: "Others", value: 5 },
]

const issuesByStatus = [
  { name: "Pending", value: 42 },
  { name: "In Progress", value: 35 },
  { name: "Resolved", value: 50 },
  { name: "Rejected", value: 8 },
]

const issuesByMonth = [
  { name: "Jan", pending: 15, inProgress: 10, resolved: 8 },
  { name: "Feb", pending: 20, inProgress: 15, resolved: 12 },
  { name: "Mar", pending: 25, inProgress: 20, resolved: 18 },
  { name: "Apr", pending: 30, inProgress: 25, resolved: 22 },
  { name: "May", pending: 35, inProgress: 30, resolved: 28 },
  { name: "Jun", pending: 25, inProgress: 20, resolved: 30 },
  { name: "Jul", pending: 20, inProgress: 15, resolved: 25 },
  { name: "Aug", pending: 15, inProgress: 10, resolved: 20 },
  { name: "Sep", pending: 25, inProgress: 20, resolved: 15 },
  { name: "Oct", pending: 30, inProgress: 25, resolved: 20 },
  { name: "Nov", pending: 35, inProgress: 30, resolved: 25 },
  { name: "Dec", pending: 40, inProgress: 35, resolved: 30 },
]

const resolutionTimeByCategory = [
  { name: "Roads", time: 5.2 },
  { name: "Water", time: 3.8 },
  { name: "Electricity", time: 2.5 },
  { name: "Sanitation", time: 4.1 },
  { name: "Infrastructure", time: 7.3 },
  { name: "Environment", time: 6.2 },
  { name: "Others", time: 3.5 },
]

const communityParticipation = [
  { name: "Jan", participation: 25 },
  { name: "Feb", participation: 30 },
  { name: "Mar", participation: 35 },
  { name: "Apr", participation: 40 },
  { name: "May", participation: 45 },
  { name: "Jun", participation: 50 },
  { name: "Jul", participation: 55 },
  { name: "Aug", participation: 60 },
  { name: "Sep", participation: 65 },
  { name: "Oct", participation: 70 },
  { name: "Nov", participation: 75 },
  { name: "Dec", participation: 80 },
]

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B"]
const STATUS_COLORS = {
  pending: "#FFBB28",
  inProgress: "#0088FE",
  resolved: "#00C49F",
  rejected: "#FF8042",
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")
  const [sector, setSector] = useState("all")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Insights and statistics about urban issues in your community.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            <SelectItem value="sector-1">Sector 1</SelectItem>
            <SelectItem value="sector-2">Sector 2</SelectItem>
            <SelectItem value="sector-3">Sector 3</SelectItem>
            <SelectItem value="sector-4">Sector 4</SelectItem>
            <SelectItem value="sector-5">Sector 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+5 from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 days</div>
            <p className="text-xs text-muted-foreground">-0.5 days from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">+8% from last period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Issues Overview</TabsTrigger>
          <TabsTrigger value="resolution">Resolution Metrics</TabsTrigger>
          <TabsTrigger value="community">Community Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Issues by Category</CardTitle>
                <CardDescription>Distribution of issues across different categories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issuesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {issuesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} issues`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Issues by Status</CardTitle>
                <CardDescription>Current status of all reported issues</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issuesByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill={STATUS_COLORS.pending} />
                      <Cell fill={STATUS_COLORS.inProgress} />
                      <Cell fill={STATUS_COLORS.resolved} />
                      <Cell fill={STATUS_COLORS.rejected} />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} issues`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Issues Trend</CardTitle>
              <CardDescription>Monthly trend of issues by status</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={issuesByMonth}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pending" name="Pending" fill={STATUS_COLORS.pending} />
                  <Bar dataKey="inProgress" name="In Progress" fill={STATUS_COLORS.inProgress} />
                  <Bar dataKey="resolved" name="Resolved" fill={STATUS_COLORS.resolved} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Average Resolution Time by Category</CardTitle>
              <CardDescription>Average days taken to resolve issues by category</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={resolutionTimeByCategory}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value) => [`${value} days`, "Avg. Resolution Time"]} />
                  <Legend />
                  <Bar dataKey="time" name="Avg. Resolution Time (days)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resolution Efficiency</CardTitle>
                <CardDescription>Percentage of issues resolved within target time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Within Target", value: 68 },
                        { name: "Delayed", value: 32 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#00C49F" />
                      <Cell fill="#FF8042" />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Rating</CardTitle>
                <CardDescription>User satisfaction with issue resolution</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "5 Stars", value: 45 },
                        { name: "4 Stars", value: 30 },
                        { name: "3 Stars", value: 15 },
                        { name: "2 Stars", value: 7 },
                        { name: "1 Star", value: 3 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#00C49F" />
                      <Cell fill="#82CA9D" />
                      <Cell fill="#FFBB28" />
                      <Cell fill="#FF8042" />
                      <Cell fill="#FF6B6B" />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Participation Trend</CardTitle>
              <CardDescription>
                Monthly trend of community participation in issue reporting and resolution
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={communityParticipation}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Participation %", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value) => [`${value}%`, "Participation Rate"]} />
                  <Legend />
                  <Bar dataKey="participation" name="Community Participation (%)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Distribution of user engagement activities</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Issue Reporting", value: 40 },
                        { name: "Verification", value: 25 },
                        { name: "Feedback", value: 20 },
                        { name: "Discussion", value: 15 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                      <Cell fill="#FFBB28" />
                      <Cell fill="#FF8042" />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Users by Sector</CardTitle>
                <CardDescription>Distribution of active users across sectors</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Sector 1", value: 20 },
                        { name: "Sector 2", value: 30 },
                        { name: "Sector 3", value: 15 },
                        { name: "Sector 4", value: 25 },
                        { name: "Sector 5", value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2, 3, 4].map((index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
