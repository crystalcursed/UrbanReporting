"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Camera, Info } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

// Mock data for guest reports
const guestReports = [
  {
    id: "GUEST-1001",
    title: "Waterlogging on Highway",
    description: "Severe waterlogging on the highway after recent rains, causing traffic congestion",
    location: "Sector 5, Highway Junction",
    status: "pending",
    category: "drainage",
    priority: "high",
    createdAt: "2023-04-18T10:20:00Z",
    sector: "Sector 5",
  },
  {
    id: "GUEST-1002",
    title: "Damaged Traffic Signal",
    description: "Traffic signal not functioning properly, causing confusion and potential accidents",
    location: "Sector 4, Main Intersection",
    status: "approved",
    category: "traffic",
    priority: "high",
    createdAt: "2023-04-18T11:30:00Z",
    sector: "Sector 4",
  },
  {
    id: "GUEST-1003",
    title: "Fallen Tree Blocking Road",
    description: "Large tree has fallen and is blocking the entire road after last night's storm",
    location: "Sector 3, College Road",
    status: "rejected",
    category: "environment",
    priority: "medium",
    createdAt: "2023-04-17T09:15:00Z",
    sector: "Sector 3",
    rejectionReason: "Duplicate report. Already being addressed by authorities.",
  },
]

export default function GuestReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("my-guest-reports")

  // Form state for new guest report
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [sector, setSector] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("medium")
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter reports based on search query and status
  const filteredReports = guestReports.filter((report) => {
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
      case "approved":
        return "bg-green-500 hover:bg-green-600"
      case "rejected":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const handleSubmitGuestReport = () => {
    if (!title || !description || !location || !sector || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Guest Report Submitted",
        description: "Your report has been submitted and is pending AI verification and moderation.",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setLocation("")
      setSector("")
      setCategory("")
      setPriority("medium")
      setUseCurrentLocation(false)
      setIsSubmitting(false)

      // Switch to reports tab
      setActiveTab("my-guest-reports")
    }, 1500)
  }

  const handleUseCurrentLocation = (checked: boolean) => {
    setUseCurrentLocation(checked)

    if (checked) {
      // In a real app, this would get the user's current location
      setLocation("Current Location: Sector 4, Main Street")

      toast({
        title: "Location Captured",
        description: "Your current location has been captured.",
      })
    } else {
      setLocation("")
    }
  }

  const handleImageUpload = () => {
    // In a real app, this would open a file picker and upload the image
    toast({
      title: "Image Upload",
      description: "Image upload functionality would be implemented here.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Guest Reports</h1>
        <p className="text-muted-foreground">
          Report issues in sectors other than your own or view your guest reports.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-guest-reports">My Guest Reports</TabsTrigger>
          <TabsTrigger value="create-guest-report">Create Guest Report</TabsTrigger>
        </TabsList>

        <TabsContent value="my-guest-reports" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search guest reports..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Guest Reports</CardTitle>
              <CardDescription>Issues you've reported in sectors other than your own</CardDescription>
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
                        <Badge className={`${getStatusColor(report.status)} text-white`}>{report.status}</Badge>
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
                          <span>Sector: {report.sector}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-center text-muted-foreground">
                      No guest reports found.{" "}
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your filters."
                        : "Create a guest report to get started."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <div>
                <CardTitle>About Guest Reports</CardTitle>
                <CardDescription>Understanding the guest reporting process</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Guest reports allow you to report issues in sectors other than your own. These reports undergo
                  additional verification through our AI system and are reviewed by moderators of the respective sector.
                </p>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">Guest Report Process</h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">1. Submission:</span>
                      <span className="text-muted-foreground">
                        You submit a report for an issue in a sector other than your own.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">2. AI Verification:</span>
                      <span className="text-muted-foreground">
                        Our AI system verifies the report for accuracy and checks for duplicates.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">3. Moderation:</span>
                      <span className="text-muted-foreground">
                        Sector moderators review the report before forwarding it to authorities.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">4. Resolution:</span>
                      <span className="text-muted-foreground">
                        If approved, the report is assigned to the appropriate department for resolution.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create-guest-report">
          <Card>
            <CardHeader>
              <CardTitle>Create Guest Report</CardTitle>
              <CardDescription>Report an issue in a sector other than your own</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Issue Title
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Pothole on Main Street"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">A brief title describing the issue.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Provide details about the issue..."
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Detailed description of the issue to help authorities understand the problem.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="sector" className="text-sm font-medium">
                  Sector
                </label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger id="sector">
                    <SelectValue placeholder="Select sector where issue is located" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sector-1">Sector 1</SelectItem>
                    <SelectItem value="sector-3">Sector 3</SelectItem>
                    <SelectItem value="sector-4">Sector 4</SelectItem>
                    <SelectItem value="sector-5">Sector 5</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Select the sector where the issue is located.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roads">Roads & Potholes</SelectItem>
                    <SelectItem value="water">Water Supply</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="garbage">Garbage Collection</SelectItem>
                    <SelectItem value="streetlight">Street Lights</SelectItem>
                    <SelectItem value="drainage">Drainage</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Select the category that best describes the issue.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={useCurrentLocation}
                      onCheckedChange={handleUseCurrentLocation}
                      id="use-current-location"
                    />
                    <label
                      htmlFor="use-current-location"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Use current location
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="e.g., Sector 4, Main Street, Near Park"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={useCurrentLocation}
                  />
                  <Button type="button" variant="outline" size="icon" disabled={useCurrentLocation}>
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Provide the specific location of the issue.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Select the priority level of the issue.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Images</label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex aspect-square h-full flex-col items-center justify-center gap-1 rounded-md border border-dashed"
                    onClick={handleImageUpload}
                  >
                    <Camera className="h-8 w-8" />
                    <span className="text-xs">Add Image</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload images of the issue to help authorities understand the problem better.
                </p>
              </div>

              <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-950">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">Guest Report Notice</h4>
                    <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                      As this is a guest report for a sector other than your own, it will undergo additional AI
                      verification before being sent to moderators. This process may take longer than regular reports.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("my-guest-reports")}>
                Cancel
              </Button>
              <Button onClick={handleSubmitGuestReport} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Guest Report"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
