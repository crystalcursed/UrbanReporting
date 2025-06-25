"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search } from "lucide-react"

// Mock data for issues
const mockIssues = [
  {
    id: "ISSUE-1234",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    status: "pending",
    priority: "high",
    location: "Sector 1, Main Street",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-04-15T14:45:00Z",
  },
  {
    id: "ISSUE-1235",
    title: "Broken Street Light",
    description: "Street light not working for past 3 days",
    status: "in-progress",
    priority: "medium",
    location: "Sector 2, Park Avenue",
    createdAt: "2023-04-14T08:20:00Z",
    updatedAt: "2023-04-16T09:15:00Z",
  },
  {
    id: "ISSUE-1236",
    title: "Garbage Collection Missed",
    description: "Garbage not collected for the past week",
    status: "resolved",
    priority: "medium",
    location: "Sector 1, Residential Block C",
    createdAt: "2023-04-10T11:45:00Z",
    updatedAt: "2023-04-17T16:30:00Z",
  },
  {
    id: "ISSUE-1237",
    title: "Water Leakage",
    description: "Water pipe leakage causing water logging",
    status: "pending",
    priority: "high",
    location: "Sector 3, Commercial Area",
    createdAt: "2023-04-16T09:10:00Z",
    updatedAt: "2023-04-16T09:10:00Z",
  },
  {
    id: "ISSUE-1238",
    title: "Fallen Tree",
    description: "Tree fallen after storm blocking the road",
    status: "in-progress",
    priority: "high",
    location: "Sector 2, Green Avenue",
    createdAt: "2023-04-17T07:30:00Z",
    updatedAt: "2023-04-17T10:45:00Z",
  },
]

type IssuesListProps = {
  sector: string
}

export function IssuesList({ sector }: IssuesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter issues based on search query and filters
  const filteredIssues = mockIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "in-progress":
        return "bg-blue-500 hover:bg-blue-600"
      case "resolved":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues</CardTitle>
        <CardDescription>
          {sector === "my-sector"
            ? "Issues reported in your sector"
            : sector === "my-reports"
              ? "Issues you have reported"
              : "Issues from all sectors"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search issues..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
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
          </div>
          <div className="space-y-4">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <div key={issue.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-start">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{issue.title}</h3>
                        <p className="text-sm text-muted-foreground">{issue.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(issue.status)} text-white`}>
                          {issue.status.replace("-", " ")}
                        </Badge>
                        <Badge className={`${getPriorityColor(issue.priority)} text-white`}>{issue.priority}</Badge>
                      </div>
                    </div>
                    <p className="text-sm">{issue.description}</p>
                    <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                      <span>ID: {issue.id}</span>
                      <span>Reported: {new Date(issue.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(issue.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center sm:ml-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/issues/${issue.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Track Progress</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-muted-foreground">No issues found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredIssues.length} of {mockIssues.length} issues
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
