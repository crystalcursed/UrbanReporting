"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

// Mock data for pending issues
const pendingIssues = [
  {
    id: "ISSUE-1234",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    status: "pending",
    priority: "high",
    location: "Sector 2, Main Street",
    category: "roads",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-04-15T14:45:00Z",
    stage: "moderation",
    stageProgress: 50,
    estimatedTime: "24 hours",
  },
  {
    id: "ISSUE-1239",
    title: "Broken Sidewalk",
    description: "Sidewalk is broken and poses a tripping hazard for pedestrians",
    status: "pending",
    priority: "medium",
    location: "Sector 2, Park Avenue",
    category: "infrastructure",
    createdAt: "2023-04-18T09:30:00Z",
    updatedAt: "2023-04-18T09:30:00Z",
    stage: "verification",
    stageProgress: 75,
    estimatedTime: "12 hours",
  },
  {
    id: "ISSUE-1240",
    title: "Street Light Not Working",
    description: "Street light at the corner has been out for several days, creating a safety hazard at night",
    status: "pending",
    priority: "high",
    location: "Sector 2, Residential Block B",
    category: "electricity",
    createdAt: "2023-04-18T14:15:00Z",
    updatedAt: "2023-04-18T14:15:00Z",
    stage: "ai-analysis",
    stageProgress: 25,
    estimatedTime: "36 hours",
  },
  {
    id: "ISSUE-1241",
    title: "Garbage Overflow",
    description: "Garbage bin is overflowing and hasn't been collected for days",
    status: "pending",
    priority: "medium",
    location: "Sector 2, Market Area",
    category: "sanitation",
    createdAt: "2023-04-18T16:45:00Z",
    updatedAt: "2023-04-18T16:45:00Z",
    stage: "initial",
    stageProgress: 10,
    estimatedTime: "48 hours",
  },
]

export default function PendingIssuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Filter issues based on search query, priority, and category
  const filteredIssues = pendingIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter

    return matchesSearch && matchesPriority && matchesCategory
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-orange-500 hover:bg-orange-600"
      case "low":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "initial":
        return "Initial Review"
      case "ai-analysis":
        return "AI Analysis"
      case "verification":
        return "Verification"
      case "moderation":
        return "Moderation"
      default:
        return stage
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Pending Issues</h1>
        <p className="text-muted-foreground">Track issues that are currently pending approval or assignment.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pending issues..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="roads">Roads & Potholes</SelectItem>
              <SelectItem value="water">Water Supply</SelectItem>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="sanitation">Sanitation</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="environment">Environment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Issues</CardTitle>
            <CardDescription>Issues awaiting approval, verification, or assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue) => (
                  <div key={issue.id} className="flex flex-col gap-2 rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{issue.title}</h3>
                        <p className="text-sm text-muted-foreground">{issue.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getPriorityColor(issue.priority)} text-white`}>{issue.priority}</Badge>
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">pending</Badge>
                      </div>
                    </div>
                    <p className="text-sm">{issue.description}</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Current Stage: {getStageLabel(issue.stage)}</span>
                        <span className="text-muted-foreground">{issue.stageProgress}%</span>
                      </div>
                      <Progress value={issue.stageProgress} className="h-2" />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Estimated time remaining: {issue.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>ID: {issue.id}</span>
                        <span>Reported: {new Date(issue.createdAt).toLocaleDateString()}</span>
                        <span>Category: {issue.category}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/issues/${issue.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-center text-muted-foreground">
                    No pending issues found.{" "}
                    {searchQuery || priorityFilter !== "all" || categoryFilter !== "all"
                      ? "Try adjusting your filters."
                      : "All issues have been addressed!"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div>
              <CardTitle>What to Expect</CardTitle>
              <CardDescription>Understanding the pending issue process</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">Pending Issue Stages</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-medium">1. Initial Review:</span>
                    <span className="text-muted-foreground">
                      Your issue has been submitted and is awaiting initial processing.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">2. AI Analysis:</span>
                    <span className="text-muted-foreground">
                      Our AI system is analyzing the issue for duplicates and categorization.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">3. Verification:</span>
                    <span className="text-muted-foreground">
                      The issue is being verified for accuracy and completeness.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">4. Moderation:</span>
                    <span className="text-muted-foreground">
                      A community moderator is reviewing the issue before forwarding it to authorities.
                    </span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Once an issue completes all pending stages, it will be assigned to the appropriate department for
                resolution. You will receive notifications as your issue progresses through these stages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
