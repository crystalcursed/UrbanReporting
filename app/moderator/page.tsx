"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle, Search, ThumbsDown, ThumbsUp } from "lucide-react"

// Mock data for pending issues
const pendingIssues = [
  {
    id: "ISSUE-1239",
    title: "Broken Sidewalk",
    description: "Sidewalk is broken and poses a tripping hazard for pedestrians",
    location: "Sector 2, Park Avenue",
    reportedBy: {
      name: "Priya Patel",
      avatar: "/placeholder-user.jpg",
      initials: "PP",
    },
    category: "infrastructure",
    priority: "medium",
    images: ["/placeholder.svg?height=300&width=400&text=Sidewalk Image"],
    aiVerified: true,
    createdAt: "2023-04-18T09:30:00Z",
  },
  {
    id: "ISSUE-1240",
    title: "Street Light Not Working",
    description: "Street light at the corner has been out for several days, creating a safety hazard at night",
    location: "Sector 2, Residential Block B",
    reportedBy: {
      name: "Amit Kumar",
      avatar: "/placeholder-user.jpg",
      initials: "AK",
    },
    category: "electricity",
    priority: "high",
    images: ["/placeholder.svg?height=300&width=400&text=Street Light Image"],
    aiVerified: true,
    createdAt: "2023-04-18T14:15:00Z",
  },
  {
    id: "ISSUE-1241",
    title: "Garbage Overflow",
    description: "Garbage bin is overflowing and hasn't been collected for days",
    location: "Sector 2, Market Area",
    reportedBy: {
      name: "Neha Singh",
      avatar: "/placeholder-user.jpg",
      initials: "NS",
    },
    category: "sanitation",
    priority: "medium",
    images: ["/placeholder.svg?height=300&width=400&text=Garbage Image"],
    aiVerified: false,
    createdAt: "2023-04-18T16:45:00Z",
  },
]

// Mock data for guest reports
const guestReports = [
  {
    id: "GUEST-1001",
    title: "Waterlogging on Highway",
    description: "Severe waterlogging on the highway after recent rains, causing traffic congestion",
    location: "Sector 5, Highway Junction",
    reportedBy: "Guest Reporter",
    category: "drainage",
    priority: "high",
    images: ["/placeholder.svg?height=300&width=400&text=Waterlogging Image"],
    aiVerified: true,
    createdAt: "2023-04-18T10:20:00Z",
  },
  {
    id: "GUEST-1002",
    title: "Damaged Traffic Signal",
    description: "Traffic signal not functioning properly, causing confusion and potential accidents",
    location: "Sector 4, Main Intersection",
    reportedBy: "Guest Reporter",
    category: "traffic",
    priority: "high",
    images: ["/placeholder.svg?height=300&width=400&text=Traffic Signal Image"],
    aiVerified: false,
    createdAt: "2023-04-18T11:30:00Z",
  },
]

// Mock data for flagged issues
const flaggedIssues = [
  {
    id: "ISSUE-1230",
    title: "Complex Drainage Issue",
    description: "Drainage system completely blocked, requires major infrastructure work",
    location: "Sector 2, Commercial Area",
    reportedBy: {
      name: "Vikram Mehta",
      avatar: "/placeholder-user.jpg",
      initials: "VM",
    },
    category: "drainage",
    priority: "high",
    flaggedBy: "Municipal Water Department",
    flagReason: "Requires specialized equipment and coordination with multiple departments",
    images: ["/placeholder.svg?height=300&width=400&text=Drainage Image"],
    createdAt: "2023-04-16T08:30:00Z",
    flaggedAt: "2023-04-17T14:20:00Z",
  },
]

export default function ModeratorPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIssue, setSelectedIssue] = useState<any>(null)

  const filteredPendingIssues = pendingIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredGuestReports = guestReports.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredFlaggedIssues = flaggedIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleApprove = (issue: any) => {
    toast({
      title: "Issue Approved",
      description: `Issue ${issue.id} has been approved and forwarded to the relevant department.`,
    })
    // In a real app, this would update the issue status in the database
  }

  const handleReject = (issue: any) => {
    toast({
      title: "Issue Rejected",
      description: `Issue ${issue.id} has been rejected.`,
      variant: "destructive",
    })
    // In a real app, this would update the issue status in the database
  }

  const handleReassign = (issue: any) => {
    toast({
      title: "Issue Reassigned",
      description: `Issue ${issue.id} has been reassigned to the appropriate department.`,
    })
    // In a real app, this would update the issue department in the database
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Moderator Dashboard</h1>
          <p className="text-muted-foreground">Review and approve issues reported in your sector.</p>
        </div>

        <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500 text-white">Online</Badge>
            <span className="text-sm text-muted-foreground">Sector 2 Moderator</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Moderator Stats</CardTitle>
                <CardDescription>Your moderation activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Issues Reviewed</span>
                  <span className="font-semibold">124</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Approved</span>
                  <span className="font-semibold text-green-600">98</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rejected</span>
                  <span className="font-semibold text-red-600">26</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Response Time</span>
                  <span className="font-semibold">2.3 hours</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Verification Status</CardTitle>
                <CardDescription>AI-assisted moderation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Verified Issues</span>
                  <span className="font-semibold">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Accuracy Rate</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Moderator Overrides</span>
                  <span className="font-semibold text-orange-600">8%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  Pending Issues
                  <Badge className="ml-2 bg-yellow-500 text-white">{filteredPendingIssues.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="guest">
                  Guest Reports
                  <Badge className="ml-2 bg-blue-500 text-white">{filteredGuestReports.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="flagged">
                  Flagged Issues
                  <Badge className="ml-2 bg-red-500 text-white">{filteredFlaggedIssues.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Issues</CardTitle>
                    <CardDescription>Review and approve issues reported in your sector</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredPendingIssues.length > 0 ? (
                        filteredPendingIssues.map((issue) => (
                          <div
                            key={issue.id}
                            className="flex flex-col gap-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedIssue(issue)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{issue.title}</h3>
                                <p className="text-sm text-muted-foreground">{issue.location}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-yellow-500 text-white">Pending</Badge>
                                {issue.aiVerified && <Badge className="bg-green-500 text-white">AI Verified</Badge>}
                              </div>
                            </div>
                            <p className="text-sm line-clamp-2">{issue.description}</p>
                            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                              <span>ID: {issue.id}</span>
                              <span>Reported: {new Date(issue.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleApprove(issue)
                                }}
                              >
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReject(issue)
                                }}
                              >
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                          <p className="text-center text-muted-foreground">No pending issues found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="guest">
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Reports</CardTitle>
                    <CardDescription>Review reports from guests visiting your sector</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredGuestReports.length > 0 ? (
                        filteredGuestReports.map((issue) => (
                          <div
                            key={issue.id}
                            className="flex flex-col gap-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedIssue(issue)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{issue.title}</h3>
                                <p className="text-sm text-muted-foreground">{issue.location}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-500 text-white">Guest Report</Badge>
                                {issue.aiVerified && <Badge className="bg-green-500 text-white">AI Verified</Badge>}
                              </div>
                            </div>
                            <p className="text-sm line-clamp-2">{issue.description}</p>
                            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                              <span>ID: {issue.id}</span>
                              <span>Reported: {new Date(issue.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleApprove(issue)
                                }}
                              >
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReject(issue)
                                }}
                              >
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                          <p className="text-center text-muted-foreground">No guest reports found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flagged">
                <Card>
                  <CardHeader>
                    <CardTitle>Flagged Issues</CardTitle>
                    <CardDescription>Issues flagged by departments that need your attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredFlaggedIssues.length > 0 ? (
                        filteredFlaggedIssues.map((issue) => (
                          <div
                            key={issue.id}
                            className="flex flex-col gap-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedIssue(issue)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{issue.title}</h3>
                                <p className="text-sm text-muted-foreground">{issue.location}</p>
                              </div>
                              <Badge className="bg-red-500 text-white">Flagged</Badge>
                            </div>
                            <p className="text-sm line-clamp-2">{issue.description}</p>
                            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                              <span>Flagged by: {issue.flaggedBy}</span>
                              <span>On: {new Date(issue.flaggedAt).toLocaleString()}</span>
                            </div>
                            <div className="mt-2 rounded-md bg-muted p-2 text-sm">
                              <span className="font-semibold">Reason: </span>
                              {issue.flagReason}
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReassign(issue)
                                }}
                              >
                                Reassign Department
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                          <p className="text-center text-muted-foreground">No flagged issues found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {selectedIssue && (
              <Card>
                <CardHeader>
                  <CardTitle>Issue Details</CardTitle>
                  <CardDescription>Detailed view of the selected issue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{selectedIssue.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedIssue.location}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Description</h4>
                    <p className="text-sm">{selectedIssue.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Reported By</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedIssue.reportedBy && typeof selectedIssue.reportedBy !== "string" ? (
                        <>
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={selectedIssue.reportedBy.avatar || "/placeholder.svg"}
                              alt={selectedIssue.reportedBy.name}
                            />
                            <AvatarFallback>{selectedIssue.reportedBy.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{selectedIssue.reportedBy.name}</span>
                        </>
                      ) : (
                        <span className="text-sm">{selectedIssue.reportedBy}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Category</h4>
                    <p className="text-sm capitalize">{selectedIssue.category.replace("-", " ")}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Priority</h4>
                    <p className="text-sm capitalize">{selectedIssue.priority}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Images</h4>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {selectedIssue.images.map((image: string, index: number) => (
                        <div key={index} className="relative aspect-video overflow-hidden rounded-md border">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Issue image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">AI Verification</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedIssue.aiVerified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Verified by AI</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Requires manual verification</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedIssue(null)}>
                    Close
                  </Button>
                  <div className="flex gap-2">
                    {"flaggedBy" in selectedIssue ? (
                      <Button onClick={() => handleReassign(selectedIssue)}>Reassign Department</Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={() => handleReject(selectedIssue)}>
                          <ThumbsDown className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button onClick={() => handleApprove(selectedIssue)}>
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
