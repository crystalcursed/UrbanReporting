"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AnalyticsPage() {
  // Mock data for charts
  const issueTrendsData = [
    { month: "Jan", reported: 120, resolved: 90 },
    { month: "Feb", reported: 150, resolved: 110 },
    { month: "Mar", reported: 130, resolved: 100 },
    { month: "Apr", reported: 180, resolved: 140 },
    { month: "May", reported: 160, resolved: 130 },
    { month: "Jun", reported: 200, resolved: 170 },
  ]

  const issueCategoryData = [
    { name: "Infrastructure", value: 300 },
    { name: "Roads", value: 200 },
    { name: "Utilities", value: 150 },
    { name: "Environment", value: 100 },
    { name: "Public Safety", value: 80 },
    { name: "Other", value: 50 },
  ]

  const departmentPerformanceData = [
    { department: "Public Works", resolved: 120, pending: 30 },
    { department: "Transportation", resolved: 90, pending: 20 },
    { department: "Utilities", resolved: 70, pending: 15 },
    { department: "Parks & Rec", resolved: 50, pending: 10 },
    { department: "Health & Safety", resolved: 40, pending: 5 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive analytics and reporting for community issues.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 hrs</div>
                <p className="text-xs text-muted-foreground">-0.3 hrs from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Citizen Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2/5</div>
                <p className="text-xs text-muted-foreground">+0.1 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12.4K</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Reporting & Resolution Trends</CardTitle>
              <CardDescription>Monthly trends of reported and resolved issues.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  reported: {
                    label: "Reported Issues",
                    color: "hsl(var(--chart-1))",
                  },
                  resolved: {
                    label: "Resolved Issues",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={issueTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="reported" stroke="var(--color-reported)" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="resolved" stroke="var(--color-resolved)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
              <CardDescription>Distribution of issues across different categories.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer
                config={{
                  value: {
                    label: "Issues",
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {issueCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Overview</CardTitle>
              <CardDescription>Issues resolved and pending by department.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  resolved: {
                    label: "Resolved",
                    color: "hsl(var(--chart-1))",
                  },
                  pending: {
                    label: "Pending",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="resolved" fill="var(--color-resolved)" name="Resolved Issues" />
                    <Bar dataKey="pending" fill="var(--color-pending)" name="Pending Issues" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Download and view detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Report generation and download options will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
