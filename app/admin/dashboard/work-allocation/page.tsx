import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, Wrench, Clock, CheckCircle, Plus, Search, Phone, Mail } from "lucide-react"

export default function WorkAllocationPage() {
  const workers = [
    {
      id: "W001",
      name: "John Smith",
      department: "Public Works",
      phone: "+1-555-0123",
      email: "j.smith@city.gov",
      status: "available",
      currentTasks: 2,
      completedTasks: 45,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "W002",
      name: "Maria Garcia",
      department: "Transportation",
      phone: "+1-555-0456",
      email: "m.garcia@city.gov",
      status: "busy",
      currentTasks: 4,
      completedTasks: 38,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "W003",
      name: "David Johnson",
      department: "Utilities",
      phone: "+1-555-0789",
      email: "d.johnson@city.gov",
      status: "available",
      currentTasks: 1,
      completedTasks: 52,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-red-100 text-red-800"
      case "offline":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Work Allocation</h1>
        <p className="text-muted-foreground">Assign work to field workers and track progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Workers</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">+12 from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search workers by name, department, or ID..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="public-works">Public Works</SelectItem>
            <SelectItem value="transportation">Transportation</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Assign Work
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Work to Worker</DialogTitle>
              <DialogDescription>Create a new work assignment for field workers</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="worker-select">Select Worker</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a worker" />
                  </SelectTrigger>
                  <SelectContent>
                    {workers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.name} - {worker.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="issue-select">Select Issue</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an issue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ISS-001">ISS-001 - Broken Street Light</SelectItem>
                    <SelectItem value="ISS-002">ISS-002 - Pothole Repair</SelectItem>
                    <SelectItem value="ISS-003">ISS-003 - Water Leak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Set priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="instructions">Work Instructions</Label>
                <Textarea id="instructions" placeholder="Provide detailed instructions for the worker..." rows={4} />
              </div>
              <Button className="w-full">Assign Work</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workers List */}
      <Card>
        <CardHeader>
          <CardTitle>Field Workers</CardTitle>
          <CardDescription>Manage and assign work to field workers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workers.map((worker) => (
              <div key={worker.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={worker.avatar || "/placeholder.svg"} alt={worker.name} />
                    <AvatarFallback>
                      {worker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{worker.name}</h3>
                      <Badge className={getStatusColor(worker.status)}>
                        {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{worker.department}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {worker.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {worker.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{worker.currentTasks}</p>
                    <p className="text-xs text-muted-foreground">Current</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{worker.completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Tasks
                    </Button>
                    <Button size="sm" disabled={worker.status === "busy"}>
                      Assign Work
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
