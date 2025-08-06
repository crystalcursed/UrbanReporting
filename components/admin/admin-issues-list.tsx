"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  User,
  Calendar,
  Search,
  Eye,
  Edit,
  MessageSquare,
} from "lucide-react"

interface AdminIssuesListProps {
  filter: string
}

export function AdminIssuesList({ filter }: AdminIssuesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIssue, setSelectedIssue] = useState<any>(null)
  const [newComment, setNewComment] = useState("")

  const mockIssues = [
    {
      id: "ISS-001",
      title: "Broken Street Light on Main Street",
      description: "The street light near the intersection has been out for 3 days, creating safety concerns.",
      status: "pending",
      priority: "high",
      location: "Main St & Oak Ave",
      submittedBy: "John Doe",
      submittedDate: "2024-01-15",
      category: "Infrastructure",
      contact: "+1-555-0123",
      email: "john.doe@email.com",
      assignedTo: "",
      comments: [
        {
          id: "1",
          author: "John Doe",
          message: "This is becoming a serious safety issue, especially at night.",
          timestamp: "2024-01-15 10:30 AM",
          isAdmin: false,
        },
      ],
    },
    {
      id: "ISS-002",
      title: "Pothole on Elm Street",
      description: "Large pothole causing damage to vehicles near the school entrance.",
      status: "in-progress",
      priority: "medium",
      location: "Elm Street, near Elementary School",
      submittedBy: "Sarah Johnson",
      submittedDate: "2024-01-14",
      category: "Roads",
      contact: "+1-555-0456",
      email: "sarah.j@email.com",
      assignedTo: "Road Maintenance Team",
      comments: [
        {
          id: "2",
          author: "Sarah Johnson",
          message: "Several cars have been damaged already.",
          timestamp: "2024-01-14 2:15 PM",
          isAdmin: false,
        },
        {
          id: "3",
          author: "Admin - Mike Wilson",
          message: "Issue has been assigned to our road maintenance team. Work scheduled for next week.",
          timestamp: "2024-01-16 9:00 AM",
          isAdmin: true,
        },
      ],
    },
    {
      id: "ISS-003",
      title: "Noise Complaint - Construction Site",
      description: "Construction work starting before 7 AM violating city noise ordinances.",
      status: "resolved",
      priority: "low",
      location: "Pine Street Construction Site",
      submittedBy: "Michael Brown",
      submittedDate: "2024-01-10",
      category: "Noise",
      contact: "+1-555-0789",
      email: "m.brown@email.com",
      assignedTo: "Code Enforcement",
      comments: [
        {
          id: "4",
          author: "Michael Brown",
          message: "Work starts at 6 AM every day, waking up the entire neighborhood.",
          timestamp: "2024-01-10 8:00 AM",
          isAdmin: false,
        },
        {
          id: "5",
          author: "Admin - Lisa Chen",
          message: "Contacted construction company. They have agreed to start work at 8 AM going forward.",
          timestamp: "2024-01-12 11:30 AM",
          isAdmin: true,
        },
      ],
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "in-progress":
        return <AlertTriangle className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateIssueStatus = (issueId: string, newStatus: string) => {
    // In a real app, this would update the issue status via API
    console.log(`Updating issue ${issueId} to status: ${newStatus}`)
  }

  const addComment = (issueId: string, comment: string) => {
    // In a real app, this would add a comment via API
    console.log(`Adding comment to issue ${issueId}: ${comment}`)
    setNewComment("")
  }

  const filteredIssues = mockIssues.filter((issue) => {
    const matchesFilter =
      filter === "all" || issue.status === filter || (filter === "urgent" && issue.priority === "urgent")
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search issues, citizens, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issues Management</CardTitle>
          <CardDescription>
            {filter === "all" ? "All reported issues" : `Issues filtered by: ${filter}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                    <Badge className={getStatusColor(issue.status)}>
                      {getStatusIcon(issue.status)}
                      <span className="ml-1 capitalize">{issue.status.replace("-", " ")}</span>
                    </Badge>
                    <Badge className={getPriorityColor(issue.priority)}>
                      <span className="capitalize">{issue.priority}</span>
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">{issue.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {issue.submittedBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {issue.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {issue.submittedDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedIssue(issue)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Issue Details - {selectedIssue?.id}
                        </DialogTitle>
                        <DialogDescription>Manage and update issue status</DialogDescription>
                      </DialogHeader>

                      {selectedIssue && (
                        <div className="space-y-6">
                          {/* Issue Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3">Issue Information</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <strong>Title:</strong> {selectedIssue.title}
                                </div>
                                <div>
                                  <strong>Category:</strong> {selectedIssue.category}
                                </div>
                                <div>
                                  <strong>Priority:</strong>
                                  <Badge className={`ml-2 ${getPriorityColor(selectedIssue.priority)}`}>
                                    {selectedIssue.priority}
                                  </Badge>
                                </div>
                                <div>
                                  <strong>Status:</strong>
                                  <Badge className={`ml-2 ${getStatusColor(selectedIssue.status)}`}>
                                    {selectedIssue.status.replace("-", " ")}
                                  </Badge>
                                </div>
                                <div>
                                  <strong>Location:</strong> {selectedIssue.location}
                                </div>
                                <div>
                                  <strong>Submitted:</strong> {selectedIssue.submittedDate}
                                </div>
                                {selectedIssue.assignedTo && (
                                  <div>
                                    <strong>Assigned To:</strong> {selectedIssue.assignedTo}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-3">Citizen Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <strong>Name:</strong> {selectedIssue.submittedBy}
                                </div>
                                <div>
                                  <strong>Phone:</strong> {selectedIssue.contact}
                                </div>
                                <div>
                                  <strong>Email:</strong> {selectedIssue.email}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedIssue.description}</p>
                          </div>

                          {/* Status Update */}
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-3">Update Status</h4>
                            <div className="flex gap-4 mb-4">
                              <div className="flex-1">
                                <Label htmlFor="status-update">New Status</Label>
                                <Select onValueChange={(value) => updateIssueStatus(selectedIssue.id, value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select new status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1">
                                <Label htmlFor="assign-to">Assign To</Label>
                                <Input placeholder="Department/Team" />
                              </div>
                            </div>
                          </div>

                          {/* Comments */}
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-3">Comments & Updates</h4>
                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                              {selectedIssue.comments.map((comment: any) => (
                                <div
                                  key={comment.id}
                                  className={`p-3 rounded-lg ${comment.isAdmin ? "bg-blue-50 border-l-4 border-blue-400" : "bg-gray-50"}`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">
                                      {comment.isAdmin ? (
                                        <Badge variant="secondary" className="mr-2">
                                          Admin
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="mr-2">
                                          Citizen
                                        </Badge>
                                      )}
                                      {comment.author}
                                    </span>
                                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.message}</p>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="new-comment">Add Comment</Label>
                              <Textarea
                                id="new-comment"
                                placeholder="Add a comment or update..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                              />
                              <Button
                                onClick={() => selectedIssue && addComment(selectedIssue.id, newComment)}
                                disabled={!newComment.trim()}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Add Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Quick Status Update</DialogTitle>
                        <DialogDescription>Update the status of issue {issue.id}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Current Status</Label>
                          <Badge className={`ml-2 ${getStatusColor(issue.status)}`}>
                            {issue.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <div>
                          <Label htmlFor="quick-status">New Status</Label>
                          <Select onValueChange={(value) => updateIssueStatus(issue.id, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-center text-muted-foreground">
                No issues found. Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
