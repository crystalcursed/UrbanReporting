"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreHorizontal, ExternalLink } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for my reports
const myReports = [
  {
    id: "ISSUE-1234",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    status: "pending",
    priority: "high",
    location: "Sector 2, Main Street",
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
    location: "Sector 2, Residential Block C",
    createdAt: "2023-04-10T11:45:00Z",
    updatedAt: "2023-04-17T16:30:00Z",
  },
  {
    id: "ISSUE-1237",
    title: "Water Leakage",
    description: "Water pipe leakage causing water logging",
    status: "rejected",
    priority: "high",
    location: "Sector 2, Commercial Area",
    createdAt: "2023-04-16T09:10:00Z",
    updatedAt: "2023-04-16T09:10:00Z",
    rejectionReason: "This issue is already reported and being addressed (ISSUE-1230).",
  },
]

export default function MyReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter reports based on search query and status filter
  const filteredReports = myReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "in-progress":
        return "bg-blue-500 hover:bg-blue-600"
      case "resolved":
        return "bg-green-500 hover:bg-green-600"
      case "rejected":
        return "bg-red-500 hover:bg-red-600"
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
        <p className="text-muted-foreground">View and track all the issues you have reported.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reports..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Reported Issues</CardTitle>
            <CardDescription>
              {statusFilter === "all"
                ? "All issues you have reported"
                : `Issues with status: ${statusFilter.replace("-", " ")}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <div key={report.id} className="flex flex-col gap-2 rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">{report.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getPriorityColor(report.priority)} text-white`}>{report.priority}</Badge>
                        <Badge className={`${getStatusColor(report.status)} text-white`}>
                          {report.status.replace("-", " ")}
                        </Badge>
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
                              <Link href={`/dashboard/issues/${report.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Track Progress</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            {report.status !== "resolved" && report.status !== "rejected" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Cancel Report</DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="text-sm">{report.description}</p>
                    {report.rejectionReason && (
                      <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
                        <span className="font-semibold">Rejection Reason: </span>
                        {report.rejectionReason}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>ID: {report.id}</span>
                        <span>Reported: {new Date(report.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(report.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/issues/${report.id}`}>
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
                    No reports found. {searchQuery ? "Try adjusting your search." : "Report an issue to get started."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
