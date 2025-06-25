"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Search, Star, PenToolIcon as Tool, UserCheck } from "lucide-react"
import { format } from "date-fns"

// Mock data for approved issues
const approvedIssues = [
  {
    id: "ISSUE-1234",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    status: "approved",
    priority: "high",
    location: "Sector 1, Main Street",
    category: "roads",
    createdAt: "2023-04-15T10:30:00Z",
    approvedAt: "2023-04-15T14:45:00Z",
  },
  {
    id: "ISSUE-1235",
    title: "Broken Street Light",
    description: "Street light not working for past 3 days",
    status: "approved",
    priority: "medium",
    location: "Sector 2, Park Avenue",
    category: "electricity",
    createdAt: "2023-04-14T08:20:00Z",
    approvedAt: "2023-04-16T09:15:00Z",
  },
  {
    id: "ISSUE-1237",
    title: "Water Leakage",
    description: "Water pipe leakage causing water logging",
    status: "approved",
    priority: "high",
    location: "Sector 3, Commercial Area",
    category: "water",
    createdAt: "2023-04-16T09:10:00Z",
    approvedAt: "2023-04-16T15:30:00Z",
  },
]

// Mock data for in-progress issues
const inProgressIssues = [
  {
    id: "ISSUE-1235",
    title: "Broken Street Light",
    description: "Street light not working for past 3 days",
    status: "in-progress",
    priority: "medium",
    location: "Sector 2, Park Avenue",
    category: "electricity",
    assignedTo: {
      name: "Rajesh Kumar",
      avatar: "/placeholder-user.jpg",
      initials: "RK",
      rating: 4.8,
    },
    estimatedCompletion: "2023-04-20",
    createdAt: "2023-04-14T08:20:00Z",
    assignedAt: "2023-04-16T10:30:00Z",
  },
  {
    id: "ISSUE-1238",
    title: "Fallen Tree",
    description: "Tree fallen after storm blocking the road",
    status: "in-progress",
    priority: "high",
    location: "Sector 2, Green Avenue",
    category: "environment",
    assignedTo: {
      name: "Suresh Patel",
      avatar: "/placeholder-user.jpg",
      initials: "SP",
      rating: 4.5,
    },
    estimatedCompletion: "2023-04-19",
    createdAt: "2023-04-17T07:30:00Z",
    assignedAt: "2023-04-17T11:45:00Z",
  },
]

// Mock data for technicians
const technicians = [
  {
    id: 1,
    name: "Rajesh Kumar",
    avatar: "/placeholder-user.jpg",
    initials: "RK",
    specialization: "Electrical",
    rating: 4.8,
    availability: "Available",
    location: "Sector 2",
    contactNumber: "+91 9876543210",
  },
  {
    id: 2,
    name: "Suresh Patel",
    avatar: "/placeholder-user.jpg",
    initials: "SP",
    specialization: "Plumbing",
    rating: 4.5,
    availability: "Available",
    location: "Sector 1",
    contactNumber: "+91 9876543211",
  },
  {
    id: 3,
    name: "Amit Singh",
    avatar: "/placeholder-user.jpg",
    initials: "AS",
    specialization: "Roads",
    rating: 4.7,
    availability: "Busy",
    location: "Sector 3",
    contactNumber: "+91 9876543212",
  },
  {
    id: 4,
    name: "Priya Sharma",
    avatar: "/placeholder-user.jpg",
    initials: "PS",
    specialization: "Electrical",
    rating: 4.6,
    availability: "Available",
    location: "Sector 2",
    contactNumber: "+91 9876543213",
  },
  {
    id: 5,
    name: "Vikram Mehta",
    avatar: "/placeholder-user.jpg",
    initials: "VM",
    specialization: "Sanitation",
    rating: 4.4,
    availability: "Available",
    location: "Sector 2",
    contactNumber: "+91 9876543214",
  },
]

export default function AuthorityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIssue, setSelectedIssue] = useState<any>(null)
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null)
  const [estimatedDate, setEstimatedDate] = useState<Date | undefined>(undefined)
  const [technicianFilter, setTechnicianFilter] = useState("all")
  const [isAssigning, setIsAssigning] = useState(false)

  const filteredApprovedIssues = approvedIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredInProgressIssues = inProgressIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredTechnicians = technicians.filter((technician) => {
    const matchesSearch =
      technician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      technician.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      technician.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      technicianFilter === "all" ||
      (technicianFilter === "available" && technician.availability === "Available") ||
      (technicianFilter === "busy" && technician.availability === "Busy")

    return matchesSearch && matchesFilter
  })

  const handleAssignTechnician = () => {
    if (!selectedIssue || !selectedTechnician || !estimatedDate) {
      toast({
        title: "Error",
        description: "Please select a technician and estimated completion date.",
        variant: "destructive",
      })
      return
    }

    setIsAssigning(true)

    // In a real app, this would be an API call to assign the technician
    setTimeout(() => {
      toast({
        title: "Technician Assigned",
        description: `${selectedTechnician.name} has been assigned to issue ${selectedIssue.id}.`,
      })
      setIsAssigning(false)
      setSelectedTechnician(null)
      setEstimatedDate(undefined)
      // In a real app, this would update the issue status in the database
    }, 1500)
  }

  const handleFlagIssue = (issue: any) => {
    toast({
      title: "Issue Flagged",
      description: `Issue ${issue.id} has been flagged for review by moderators.`,
    })
    // In a real app, this would update the issue status in the database
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
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Authority Dashboard</h1>
          <p className="text-muted-foreground">Manage and assign technicians to resolve reported issues.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search issues or technicians..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500 text-white">Municipal Authority</Badge>
            <span className="text-sm text-muted-foreground">Sector 2 Department</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="approved" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="approved">
                  Approved Issues
                  <Badge className="ml-2 bg-yellow-500 text-white">{filteredApprovedIssues.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="in-progress">
                  In Progress
                  <Badge className="ml-2 bg-blue-500 text-white">{filteredInProgressIssues.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="approved">
                <Card>
                  <CardHeader>
                    <CardTitle>Approved Issues</CardTitle>
                    <CardDescription>
                      Issues approved by moderators that need to be assigned to technicians
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredApprovedIssues.length > 0 ? (
                        filteredApprovedIssues.map((issue) => (
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
                                <Badge className={`${getPriorityColor(issue.priority)} text-white`}>
                                  {issue.priority}
                                </Badge>
                                <Badge className="bg-green-500 text-white">Approved</Badge>
                              </div>
                            </div>
                            <p className="text-sm line-clamp-2">{issue.description}</p>
                            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                              <span>ID: {issue.id}</span>
                              <span>Approved: {new Date(issue.approvedAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedIssue(issue)
                                    }}
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Assign Technician
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Assign Technician</DialogTitle>
                                    <DialogDescription>Assign a technician to resolve this issue.</DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Issue Details</h4>
                                      <p className="text-sm">{selectedIssue?.title}</p>
                                      <p className="text-sm text-muted-foreground">{selectedIssue?.location}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Select Technician</h4>
                                      <Select
                                        onValueChange={(value) => {
                                          const tech = technicians.find((t) => t.id.toString() === value)
                                          setSelectedTechnician(tech)
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a technician" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {technicians
                                            .filter((tech) => tech.availability === "Available")
                                            .map((tech) => (
                                              <SelectItem key={tech.id} value={tech.id.toString()}>
                                                {tech.name} - {tech.specialization}
                                              </SelectItem>
                                            ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Estimated Completion Date</h4>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {estimatedDate ? format(estimatedDate, "PPP") : "Select a date"}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            selected={estimatedDate}
                                            onSelect={setEstimatedDate}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedTechnician(null)
                                        setEstimatedDate(undefined)
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button onClick={handleAssignTechnician} disabled={isAssigning}>
                                      {isAssigning ? "Assigning..." : "Assign"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleFlagIssue(issue)
                                }}
                              >
                                Flag Issue
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                          <p className="text-center text-muted-foreground">No approved issues found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="in-progress">
                <Card>
                  <CardHeader>
                    <CardTitle>In Progress Issues</CardTitle>
                    <CardDescription>Issues currently being resolved by technicians</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredInProgressIssues.length > 0 ? (
                        filteredInProgressIssues.map((issue) => (
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
                                <Badge className={`${getPriorityColor(issue.priority)} text-white`}>
                                  {issue.priority}
                                </Badge>
                                <Badge className="bg-blue-500 text-white">In Progress</Badge>
                              </div>
                            </div>
                            <p className="text-sm line-clamp-2">{issue.description}</p>
                            <div className="flex items-center gap-4 pt-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={issue.assignedTo.avatar || "/placeholder.svg"}
                                    alt={issue.assignedTo.name}
                                  />
                                  <AvatarFallback>{issue.assignedTo.initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium">{issue.assignedTo.name}</span>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    <span className="text-xs text-muted-foreground ml-1">
                                      {issue.assignedTo.rating}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  Due: {new Date(issue.estimatedCompletion).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <Button size="sm" className="flex-1">
                                Track Progress
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                Contact Technician
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                          <p className="text-center text-muted-foreground">No in-progress issues found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technicians</CardTitle>
                <CardDescription>Available technicians in your area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Technicians</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  {filteredTechnicians.length > 0 ? (
                    filteredTechnicians.map((technician) => (
                      <div key={technician.id} className="flex items-start gap-4 rounded-lg border p-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={technician.avatar || "/placeholder.svg"} alt={technician.name} />
                          <AvatarFallback>{technician.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{technician.name}</h3>
                            <Badge
                              className={
                                technician.availability === "Available"
                                  ? "bg-green-500 text-white"
                                  : "bg-orange-500 text-white"
                              }
                            >
                              {technician.availability}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tool className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{technician.specialization}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs text-muted-foreground">{technician.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{technician.location}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                      <p className="text-center text-muted-foreground">No technicians found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Technicians
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Stats</CardTitle>
                <CardDescription>Performance metrics for your department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Issues Assigned</span>
                  <span className="font-semibold">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Issues Resolved</span>
                  <span className="font-semibold text-green-600">35</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Resolution Time</span>
                  <span className="font-semibold">3.2 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Citizen Satisfaction</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
