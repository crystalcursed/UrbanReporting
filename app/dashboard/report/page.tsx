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
import { Camera, MapPin, Upload, X, RotateCcw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRef } from "react"

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
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages([...uploadedImages, e.target.result as string])
          toast({
            title: "Image Uploaded",
            description: "Your image has been uploaded successfully.",
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Open camera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      
      setStream(mediaStream)
      setIsCameraOpen(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions or use file upload.",
        variant: "destructive",
      })
    }
  }

  // Close camera
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraOpen(false)
  }

  // Switch camera (front/back)
  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newFacingMode)
    
    if (stream) {
      closeCamera()
      setTimeout(() => {
        openCamera()
      }, 100)
    }
  }

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setUploadedImages([...uploadedImages, imageDataUrl])
        
        closeCamera()
        
        toast({
          title: "Photo Captured",
          description: "Your photo has been captured successfully.",
        })
      }
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
    toast({
      title: "Image Removed",
      description: "Image has been removed from your report.",
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
                        Take photos or upload images of the issue to help authorities understand the problem better.
                      </FormDescription>
                    </div>
                    
                    {/* Camera Modal */}
                    {isCameraOpen && (
                      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-4 w-full max-w-md">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Take a Photo</h3>
                            <Button variant="ghost" size="icon" onClick={closeCamera}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="relative">
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full rounded-lg"
                              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                            />
                            <canvas ref={canvasRef} className="hidden" />
                          </div>
                          
                          <div className="flex justify-center gap-4 mt-4">
                            <Button variant="outline" onClick={switchCamera}>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Switch Camera
                            </Button>
                            <Button onClick={capturePhoto} className="bg-blue-600 hover:bg-blue-700">
                              <Camera className="h-4 w-4 mr-2" />
                              Capture
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {/* Camera and Upload Buttons */}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={openCamera}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                      
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                      />
                      
                      {/* Image Grid */}
                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative aspect-square overflow-hidden rounded-md border group">
                              <img
                                src={image}
                                alt={`Uploaded image ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add more images button */}
                      {uploadedImages.length > 0 && uploadedImages.length < 5 && (
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex aspect-square h-full flex-col items-center justify-center gap-1 rounded-md border border-dashed"
                            onClick={openCamera}
                          >
                            <Camera className="h-6 w-6" />
                            <span className="text-xs">Take Photo</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex aspect-square h-full flex-col items-center justify-center gap-1 rounded-md border border-dashed"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-6 w-6" />
                            <span className="text-xs">Upload Image</span>
                          </Button>
                        </div>
                      )}
                      
                      {/* Initial add image buttons when no images */}
                      {uploadedImages.length === 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex aspect-square h-full flex-col items-center justify-center gap-2 rounded-md border border-dashed min-h-[120px]"
                            onClick={openCamera}
                          >
                            <Camera className="h-8 w-8" />
                            <span className="text-sm font-medium">Take Photo</span>
                            <span className="text-xs text-muted-foreground">Use device camera</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex aspect-square h-full flex-col items-center justify-center gap-2 rounded-md border border-dashed min-h-[120px]"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-8 w-8" />
                            <span className="text-sm font-medium">Upload Image</span>
                            <span className="text-xs text-muted-foreground">From gallery</span>
                          </Button>
                        </div>
                      )}
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
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                          <img
                            src={image}
                            alt={`Uploaded image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
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
