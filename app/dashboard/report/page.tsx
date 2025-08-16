"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Camera, MapPin, Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Define the form schema using zod
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  location: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  useCurrentLocation: z.boolean().default(false),
  priority: z.string().default("medium"),
  images: z.array(z.string()).optional(),
})

export default function ReportIssuePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [locationStatus, setLocationStatus] = useState<{
    accessed: boolean
    loading: boolean
    error?: string
  }>({ accessed: false, loading: false })

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      useCurrentLocation: false,
      priority: "medium",
      images: [],
    },
  })

  // Fetch address from coordinates using OpenStreetMap Nominatim API
  async function fetchAddressFromCoords(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await res.json()
      return data.display_name || `Lat: ${lat}, Lng: ${lng}`
    } catch (err) {
      console.error("Error fetching address:", err)
      return `Lat: ${lat}, Lng: ${lng}`
    }
  }

  // Get user location and set it in the form
  async function getUserLocationAndSet() {
    setLocationStatus({ accessed: false, loading: true, error: undefined })

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const address = await fetchAddressFromCoords(latitude, longitude)
            form.setValue("location", address)
            setLocationStatus({ accessed: true, loading: false })
            toast({
              title: "Location Captured",
              description: "Your current location has been captured.",
            })
          } catch (err) {
            setLocationStatus({
              accessed: false,
              loading: false,
              error: "Failed to fetch address",
            })
            toast({
              title: "Location Error",
              description: "We got your coordinates but couldn't fetch the address.",
              variant: "destructive",
            })
          }
        },
        (error) => {
          const errorMessage =
            error.code === error.PERMISSION_DENIED
              ? "Location permission denied"
              : "Unable to fetch your location"
          setLocationStatus({
            accessed: false,
            loading: false,
            error: errorMessage,
          })
          toast({
            title: "Location Error",
            description: errorMessage + ". Please enter it manually.",
            variant: "destructive",
          })
        }
      )
    } else {
      setLocationStatus({
        accessed: false,
        loading: false,
        error: "Geolocation not supported",
      })
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      })
    }
  }

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      console.log({
        ...values,
        images: uploadedImages,
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Issue Reported",
        description: "Your issue has been successfully reported and is pending moderation.",
      })

      form.reset()
      setUploadedImages([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle image upload
  const handleImageUpload = () => {
    const newImage = `/placeholder.svg?height=300&width=300&text=Image ${uploadedImages.length + 1}`
    setUploadedImages([...uploadedImages, newImage])

    toast({
      title: "Image Uploaded",
      description: "Your image has been uploaded successfully.",
    })
  }

  // Toggle use current location
  const handleUseCurrentLocation = (checked: boolean) => {
    form.setValue("useCurrentLocation", checked)
    if (checked) {
      getUserLocationAndSet()
    } else {
      form.setValue("location", "")
      setLocationStatus({ accessed: false, loading: false, error: undefined })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
        <p className="text-muted-foreground">Report an issue in your community to get it resolved.</p>
      </div>

      <Tabs defaultValue="my-sector" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-sector">My Sector</TabsTrigger>
          <TabsTrigger value="guest-report">Guest Report</TabsTrigger>
        </TabsList>
        <TabsContent value="my-sector">
          <Card>
            <CardHeader>
              <CardTitle>Report in Your Sector</CardTitle>
              <CardDescription>Report an issue in your own sector (Sector 2).</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Pothole on Main Street" {...field} />
                        </FormControl>
                        <FormDescription>A brief title describing the issue.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide details about the issue..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description of the issue to help authorities understand the problem.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="roads">Roads & Potholes</SelectItem>
                            <SelectItem value="water">Water Supply</SelectItem>
                            <SelectItem value="electricity">Electricity</SelectItem>
                            <SelectItem value="garbage">Garbage Collection</SelectItem>
                            <SelectItem value="streetlight">Street Lights</SelectItem>
                            <SelectItem value="drainage">Drainage</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the category that best describes the issue.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Location</FormLabel>
                        <FormDescription>Provide the location of the issue.</FormDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={form.watch("useCurrentLocation")}
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
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                placeholder="e.g., Sector 2, Main Street, Near Park"
                                {...field}
                                disabled={form.watch("useCurrentLocation")}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                disabled={form.watch("useCurrentLocation")}
                                onClick={() => getUserLocationAndSet()}
                              >
                                <MapPin className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch("useCurrentLocation") && (
                      <div className="flex items-center gap-2 text-sm">
                        {locationStatus.loading ? (
                          <>
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span>Fetching your location...</span>
                          </>
                        ) : locationStatus.accessed ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <MapPin className="h-4 w-4" />
                            Location captured successfully
                          </span>
                        ) : locationStatus.error ? (
                          <span className="text-destructive">{locationStatus.error}</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the priority level of the issue.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Images</FormLabel>
                      <FormDescription>
                        Upload images of the issue to help authorities understand the problem better.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Uploaded image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
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
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Report"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="guest-report">
          <Card>
            <CardHeader>
              <CardTitle>Guest Report</CardTitle>
              <CardDescription>
                Report an issue in a sector other than your own. This will require additional verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="rounded-full bg-muted p-6">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold">Guest Reporting</h3>
                <p className="text-muted-foreground">
                  As a guest reporter, your submission will undergo additional AI verification before being sent to
                  moderators.
                </p>
              </div>
              <Button className="mt-4">Continue as Guest</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
