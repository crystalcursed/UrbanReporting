"use client"

import { useState, useEffect } from "react"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, AlertTriangle, MapPin, User, Calendar, Search, Eye, Edit, MessageSquare, Wrench } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface IssueComment {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  submittedBy: string;
  submittedDate: string;
  location: string;
  contact: string;
  email: string;
  assignedTo: string | null;
  lastUpdated: string;
  comments: IssueComment[];
}

interface Worker {
  id: string;
  name: string;
  department: string;
  status: "available" | "busy" | "offline";
  currentTasks: number;
  completedTasks: number;
}

interface AdminIssuesListProps {
  filter: string
}

export function AdminIssuesList({ filter }: AdminIssuesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "ISS-001",
      title: "Broken Street Light on Main Street",
      description: "The street light near the intersection has been out for 3 days.",
      category: "Infrastructure",
      priority: "high",
      status: "pending",
      submittedBy: "John Doe",
      submittedDate: "2024-01-15",
      location: "Main St & Oak Ave",
      contact: "555-1234",
      email: "john.doe@example.com",
      assignedTo: null,
      lastUpdated: "2024-01-15",
      comments: [],
    },
    {
      id: "ISS-002",
      title: "Pothole on Elm Street",
      description: "Large pothole causing damage to vehicles.",
      category: "Roads",
      priority: "medium",
      status: "in-progress",
      submittedBy: "Jane Smith",
      submittedDate: "2024-01-14",
      location: "Elm Street, near School",
      contact: "555-5678",
      email: "jane.smith@example.com",
      assignedTo: "Public Works Team",
      lastUpdated: "2024-01-16",
      comments: [{ id: "C001", author: "Admin Sarah", message: "Assigned to Public Works.", timestamp: "2024-01-16", isAdmin: true }],
    },
    {
      id: "ISS-003",
      title: "Garbage Collection Missed",
      description: "Garbage not collected for the past week.",
      category: "Utilities",
      priority: "low",
      status: "resolved",
      submittedBy: "Mike Johnson",
      submittedDate: "2024-01-10",
      location: "Residential Block C",
      contact: "555-9012",
      email: "mike.j@example.com",
      assignedTo: "Environmental Services",
      lastUpdated: "2024-01-12",
      comments: [{ id: "C002", author: "Admin Mike", message: "Issue resolved.", timestamp: "2024-01-12", isAdmin: true }],
    },
    {
      id: "ISS-004",
      title: "Urgent Water Leak",
      description: "Major water pipe burst near city hall, causing flooding.",
      category: "Utilities",
      priority: "urgent",
      status: "pending",
      submittedBy: "City Resident",
      submittedDate: "2024-07-25",
      location: "Near City Hall",
      contact: "555-3333",
      email: "resident@example.com",
      assignedTo: null,
      lastUpdated: "2024-07-25",
      comments: [],
    },
  ])
  const [loading, setLoading] = useState(false) // No longer fetching from DB
  const [error, setError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isAssignWorkDialogOpen, setIsAssignWorkDialogOpen] = useState(false)
  const [dialogNewStatus, setDialogNewStatus] = useState("")
  const [dialogAssignedTo, setDialogAssignedTo] = useState("")
  const [quickUpdateStatus, setQuickUpdateStatus] = useState("")
  const [assignWorkerId, setAssignWorkerId] = useState("")
  const [assignInstructions, setAssignInstructions] = useState("")

  const { toast } = useToast()

  // Mock workers data
  const [workers, setWorkers] = useState<Worker[]>([
    { id: "W001", name: "John Smith", department: "Public Works", status: "available", currentTasks: 2, completedTasks: 45 },
    { id: "W002", name: "Maria Garcia", department: "Transportation", status: "busy", currentTasks: 4, completedTasks: 38 },
    { id: "W003", name: "David Johnson", department: "Utilities", status: "available", currentTasks: 1, completedTasks: 52 },
  ])

  useEffect(() => {
    // Simulate initial data load if needed, but for now, issues are hardcoded
    setLoading(false)
  }, [])

  const handleViewDialogOpen = (issue: Issue) => {
    setSelectedIssue(issue)
    setDialogNewStatus(issue.status)
    setDialogAssignedTo(issue.assignedTo || "")
    setIsViewDialogOpen(true)
  }

  const handleQuickUpdateOpen = (issue: Issue) => {
    setSelectedIssue(issue)
    setQuickUpdateStatus(issue.status)
    setIsUpdateDialogOpen(true)
  }

  const handleAssignWorkOpen = (issue: Issue) => {
    setSelectedIssue(issue)
    setAssignWorkerId(issue.assignedTo || "") // Pre-fill if already assigned
    setAssignInstructions("") // Clear instructions for new assignment
    setIsAssignWorkDialogOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "in-progress":
        return <AlertTriangle className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
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
      case "rejected":
        return "bg-red-100 text-red-800"
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

  const handleUpdateIssueStatus = (issueId: string, newStatus: string, assignedTo: string | null) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId
          ? {
              ...issue,
              status: newStatus,
              assignedTo: assignedTo,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : issue
      )
    )
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prevSelected => ({
        ...prevSelected!,
        status: newStatus,
        assignedTo: assignedTo,
        lastUpdated: new Date().toISOString().split('T')[0],
      }))
    }
    setIsViewDialogOpen(false)
    setIsUpdateDialogOpen(false)
    toast({
      title: "Success",
      description: `Issue ${issueId} status updated to ${newStatus}!`,
    })
  }

  const handleAddComment = (issueId: string, comment: string) => {
    if (!comment.trim()) {
      toast({
        title: "Warning",
        description: "Comment cannot be empty.",
        variant: "destructive",
      })
      return
    }

    const adminAuthor = "Admin - Current User"
    const newCommentObj: IssueComment = {
      id: String(Date.now()),
      author: adminAuthor,
      message: comment,
      timestamp: new Date().toLocaleString(),
      isAdmin: true,
    };

    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId
          ? {
              ...issue,
              comments: [...issue.comments, newCommentObj],
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : issue
      )
    )
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(prevSelected => ({
        ...prevSelected!,
        comments: [...prevSelected!.comments, newCommentObj],
        lastUpdated: new Date().toISOString().split('T')[0],
      }))
    }
    setNewComment("") // Clear the comment input
    toast({
      title: "Success",
      description: "Comment added successfully!",
    })
  }

  const handleAssignIssueToWorker = (issueId: string, workerId: string, instructions: string) => {
    const assignedWorker = workers.find(w => w.id === workerId)
    if (!assignedWorker) {
      toast({
        title: "Error",
        description: "Selected worker not found.",
        variant: "destructive",
      })
      return
    }

    // Update issue status and assignedTo
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId
          ? {
              ...issue,
              status: "in-progress", // Automatically set to in-progress when assigned
              assignedTo: assignedWorker.name,
              lastUpdated: new Date().toISOString().split('T')[0],
              comments: [...issue.comments, {
                id: String(Date.now()),
                author: "Admin - Current User",
                message: `Assigned to ${assignedWorker.name} with instructions: "${instructions}"`,
                timestamp: new Date().toLocaleString(),
                isAdmin: true,
              }]
            }
          : issue
      )
    )

    // Update worker's task count and status
    setWorkers(prevWorkers =>
      prevWorkers.map(worker =>
        worker.id === workerId
          ? {
              ...worker,
              currentTasks: worker.currentTasks + 1,
              status: worker.currentTasks + 1 >= 3 ? "busy" : worker.status,
            }
          : worker
      )
    )

    setIsAssignWorkDialogOpen(false)
    toast({
      title: "Issue Assigned!",
      description: `Issue ${issueId} assigned to ${assignedWorker.name}.`,
    })
  }


  const filteredIssues = issues.filter((issue) => {
    const matchesFilter =
      filter === "all" ||
      issue.status === filter ||
      (filter === "urgent" && issue.priority === "urgent") ||
      (filter === "pending" && issue.status === "pending") ||
      (filter === "resolved" && issue.status === "resolved")
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {/* Skeletons for loading state */}
        </div>
        <div className="flex items-center gap-4">
          {/* Skeletons for search/filter */}
        </div>
        <Card>
          <CardHeader>
            {/* Skeletons for card header */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-64" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Error</h1>
        <p className="text-red-500">Failed to load issues: {error}</p>
      </div>
    )
  }

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
            {filteredIssues.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-muted-foreground">
                  No issues found. Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
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
                      {issue.assignedTo && (
                        <div className="flex items-center gap-1">
                          <Wrench className="w-4 h-4" />
                          Assigned to: {issue.assignedTo}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Dialog open={isViewDialogOpen && selectedIssue?.id === issue.id} onOpenChange={setIsViewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleViewDialogOpen(issue)}>
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
                                  <Select value={dialogNewStatus} onValueChange={(value) => setDialogNewStatus(value)}>
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
                                  <Input
                                    placeholder="Department/Team"
                                    value={dialogAssignedTo}
                                    onChange={(e) => setDialogAssignedTo(e.target.value)}
                                  />
                                </div>
                              </div>
                              <Button onClick={() => selectedIssue && handleUpdateIssueStatus(selectedIssue.id, dialogNewStatus, dialogAssignedTo)}>
                                Save Changes
                              </Button>
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
                                  onClick={() => selectedIssue && handleAddComment(selectedIssue.id, newComment)}
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

                    <Dialog open={isUpdateDialogOpen && selectedIssue?.id === issue.id} onOpenChange={setIsUpdateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => handleQuickUpdateOpen(issue)}>
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
                            <Select value={quickUpdateStatus} onValueChange={(value) => setQuickUpdateStatus(value)}>
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
                          <Button onClick={() => selectedIssue && handleUpdateIssueStatus(selectedIssue.id, quickUpdateStatus, selectedIssue.assignedTo)}>
                            Update Status
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isAssignWorkDialogOpen && selectedIssue?.id === issue.id} onOpenChange={setIsAssignWorkDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary" onClick={() => handleAssignWorkOpen(issue)}>
                          <Wrench className="w-4 h-4 mr-1" />
                          Assign
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Work for Issue {selectedIssue?.id}</DialogTitle>
                          <DialogDescription>Assign this issue to a field worker.</DialogDescription>
                        </DialogHeader>
                        {selectedIssue && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="worker-select">Select Worker</Label>
                              <Select
                                value={assignWorkerId}
                                onValueChange={(value) => setAssignWorkerId(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a worker" />
                                </SelectTrigger>
                                <SelectContent>
                                  {workers.map((worker) => (
                                    <SelectItem key={worker.id} value={worker.id}>
                                      {worker.name} - {worker.department} ({worker.status})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="assign-instructions">Instructions for Worker</Label>
                              <Textarea
                                id="assign-instructions"
                                placeholder="Provide detailed instructions for the worker..."
                                rows={4}
                                value={assignInstructions}
                                onChange={(e) => setAssignInstructions(e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            onClick={() => selectedIssue && handleAssignIssueToWorker(selectedIssue.id, assignWorkerId, assignInstructions)}
                            disabled={!assignWorkerId || !assignInstructions.trim()}
                          >
                            Assign Issue
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
