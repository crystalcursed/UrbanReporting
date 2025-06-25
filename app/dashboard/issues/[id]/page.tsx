"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, Clock, MapPin, MessageCircle, Share2, ThumbsUp } from "lucide-react"

// Mock issue data
const mockIssue = {
  id: "ISSUE-1234",
  title: "Pothole on Main Street",
  description:
    "Large pothole causing traffic issues and potential damage to vehicles. It's approximately 2 feet wide and 6 inches deep. The pothole has been there for over a week and is getting worse with each passing day. Several vehicles have already been damaged.",
  status: "in-progress",
  priority: "high",
  location: "Sector 1, Main Street, Near City Park",
  category: "roads",
  reportedBy: {
    name: "Rahul Sharma",
    avatar: "/placeholder-user.jpg",
    initials: "RS",
  },
  assignedTo: {
    name: "Municipal Road Department",
    contact: "roads@municipality.gov",
  },
  technician: {
    name: "Rajesh Kumar",
    contact: "rajesh@municipality.gov",
  },
  createdAt: "2023-04-15T10:30:00Z",
  updatedAt: "2023-04-17T14:45:00Z",
  estimatedResolutionDate: "2023-04-20",
  images: [
    "/placeholder.svg?height=400&width=600&text=Pothole Image 1",
    "/placeholder.svg?height=400&width=600&text=Pothole Image 2",
  ],
  comments: [
    {
      id: 1,
      user: {
        name: "Rahul Sharma",
        avatar: "/placeholder-user.jpg",
        initials: "RS",
      },
      text: "I noticed this pothole while driving to work. It's quite dangerous and needs immediate attention.",
      timestamp: "2023-04-15T10:35:00Z",
    },
    {
      id: 2,
      user: {
        name: "Moderator",
        avatar: "/placeholder-user.jpg",
        initials: "MOD",
      },
      text: "Thank you for reporting this issue. It has been verified and assigned to the Municipal Road Department.",
      timestamp: "2023-04-15T14:20:00Z",
    },
    {
      id: 3,
      user: {
        name: "Municipal Road Department",
        avatar: "/placeholder-user.jpg",
        initials: "MRD",
      },
      text: "We have scheduled repairs for this pothole. A team will be dispatched within 48 hours.",
      timestamp: "2023-04-16T09:15:00Z",
    },
    {
      id: 4,
      user: {
        name: "Rajesh Kumar",
        avatar: "/placeholder-user.jpg",
        initials: "RK",
      },
      text: "I've inspected the site. The repair will require additional materials. We've scheduled the work for tomorrow morning.",
      timestamp: "2023-04-17T14:45:00Z",
    },
  ],
  timeline: [
    {
      id: 1,
      title: "Issue Reported",
      description: "Issue reported by Rahul Sharma",
      timestamp: "2023-04-15T10:30:00Z",
      icon: MessageCircle,
      iconColor: "text-blue-500",
    },
    {
      id: 2,
      title: "Issue Verified",
      description: "Issue verified by Sector 1 Moderator",
      timestamp: "2023-04-15T14:00:00Z",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    {
      id: 3,
      title: "Assigned to Department",
      description: "Assigned to Municipal Road Department",
      timestamp: "2023-04-15T14:20:00Z",
      icon: Clock,
      iconColor: "text-orange-500",
    },
    {
      id: 4,
      title: "Technician Assigned",
      description: "Rajesh Kumar assigned to fix the issue",
      timestamp: "2023-04-16T09:15:00Z",
      icon: Clock,
      iconColor: "text-orange-500",
    },
    {
      id: 5,
      title: "Site Inspection",
      description: "Site inspected by Rajesh Kumar",
      timestamp: "2023-04-17T10:30:00Z",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    {
      id: 6,
      title: "In Progress",
      description: "Repair work scheduled for tomorrow",
      timestamp: "2023-04-17T14:45:00Z",
      icon: Clock,
      iconColor: "text-orange-500",
    },
  ],
}

export default function IssueDetailPage() {
  const params = useParams()
  const issueId = params.id
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // In a real app, you would fetch the issue data based on the ID
  const issue = mockIssue

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

  const handleSubmitComment = () => {
    if (!commentText.trim()) return

    setIsSubmitting(true)

    // In a real app, this would be an API call to submit the comment
    setTimeout(() => {
      setIsSubmitting(false)
      setCommentText("")
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully.",
      })
    }, 1000)
  }

  const handleShareIssue = () => {
    // In a real app, this would copy the issue URL to clipboard
    navigator.clipboard.writeText(`https://urbanconnect.com/issues/${issue.id}`)
    toast({
      title: "Link Copied",
      description: "Issue link copied to clipboard.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/dashboard/issues">
            <Button variant="ghost" size="sm">
              Issues
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <Button variant="ghost" size="sm" disabled>
            {issue.id}
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{issue.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={`${getStatusColor(issue.status)} text-white`}>{issue.status.replace("-", " ")}</Badge>
          <Badge className={`${getPriorityColor(issue.priority)} text-white`}>{issue.priority}</Badge>
          <span className="text-sm text-muted-foreground">
            Reported on {new Date(issue.createdAt).toLocaleDateString()}
          </span>
          <span className="text-sm text-muted-foreground">ID: {issue.id}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="mt-1 text-muted-foreground">{issue.description}</p>
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <div className="mt-1 flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{issue.location}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Images</h3>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {issue.images.map((image, index) => (
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={handleShareIssue}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Support (23)
              </Button>
            </CardFooter>
          </Card>

          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>Discussion about this issue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {issue.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{comment.user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <div className="flex w-full flex-col gap-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button
                      className="ml-auto"
                      disabled={!commentText.trim() || isSubmitting}
                      onClick={handleSubmitComment}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                  <CardDescription>History of this issue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-muted">
                    {issue.timeline.map((event) => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full bg-background">
                          <event.icon className={`h-4 w-4 ${event.iconColor}`} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{event.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-sm font-medium">Category</span>
                <p className="text-sm text-muted-foreground capitalize">{issue.category.replace("-", " ")}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <span className="text-sm font-medium">Reported By</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={issue.reportedBy.avatar || "/placeholder.svg"} alt={issue.reportedBy.name} />
                    <AvatarFallback>{issue.reportedBy.initials}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-muted-foreground">{issue.reportedBy.name}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <span className="text-sm font-medium">Assigned Department</span>
                <p className="text-sm text-muted-foreground">{issue.assignedTo.name}</p>
                <p className="text-xs text-muted-foreground">{issue.assignedTo.contact}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <span className="text-sm font-medium">Assigned Technician</span>
                <p className="text-sm text-muted-foreground">{issue.technician.name}</p>
                <p className="text-xs text-muted-foreground">{issue.technician.contact}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <span className="text-sm font-medium">Estimated Resolution</span>
                <p className="text-sm text-muted-foreground">
                  {new Date(issue.estimatedResolutionDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Similar Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-3">
                <div className="flex justify-between">
                  <h3 className="font-medium">Pothole near City Mall</h3>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">resolved</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Sector 1, City Mall Road</p>
              </div>
              <div className="rounded-md border p-3">
                <div className="flex justify-between">
                  <h3 className="font-medium">Road damage after rain</h3>
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white">in progress</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Sector 2, Hospital Road</p>
              </div>
              <div className="rounded-md border p-3">
                <div className="flex justify-between">
                  <h3 className="font-medium">Damaged road surface</h3>
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">pending</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Sector 3, School Lane</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
