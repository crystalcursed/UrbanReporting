"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare, ThumbsUp, Award, Users, Calendar, MapPin } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Mock data for community members
const communityMembers = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "/placeholder-user.jpg",
    initials: "RS",
    role: "Moderator",
    points: 1250,
    issues: 15,
    badge: "Gold",
    joinedAt: "2023-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar: "/placeholder-user.jpg",
    initials: "PP",
    role: "Citizen",
    points: 980,
    issues: 12,
    badge: "Silver",
    joinedAt: "2023-02-10T08:20:00Z",
  },
  {
    id: 3,
    name: "Amit Kumar",
    avatar: "/placeholder-user.jpg",
    initials: "AK",
    role: "Citizen",
    points: 820,
    issues: 10,
    badge: "Silver",
    joinedAt: "2023-01-20T11:45:00Z",
  },
  {
    id: 4,
    name: "Neha Singh",
    avatar: "/placeholder-user.jpg",
    initials: "NS",
    role: "Citizen",
    points: 750,
    issues: 8,
    badge: "Bronze",
    joinedAt: "2023-03-05T09:10:00Z",
  },
  {
    id: 5,
    name: "Vikram Mehta",
    avatar: "/placeholder-user.jpg",
    initials: "VM",
    role: "Assistant Moderator",
    points: 620,
    issues: 7,
    badge: "Bronze",
    joinedAt: "2023-02-25T14:30:00Z",
  },
]

// Mock data for community discussions
const communityDiscussions = [
  {
    id: 1,
    title: "Ideas for improving park maintenance",
    author: {
      name: "Rahul Sharma",
      avatar: "/placeholder-user.jpg",
      initials: "RS",
    },
    content:
      "I've noticed that our sector's park could use better maintenance. What if we organize a community clean-up day once a month? We could coordinate with the municipal gardeners to ensure proper tools and disposal of waste.",
    createdAt: "2023-04-15T10:30:00Z",
    likes: 24,
    comments: 8,
    tags: ["parks", "community-initiative", "maintenance"],
  },
  {
    id: 2,
    title: "Street light replacement schedule",
    author: {
      name: "Priya Patel",
      avatar: "/placeholder-user.jpg",
      initials: "PP",
    },
    content:
      "Does anyone know the schedule for street light replacements in our sector? Several lights on my street have been out for weeks now, and I'm wondering if there's a planned maintenance coming up.",
    createdAt: "2023-04-16T08:20:00Z",
    likes: 15,
    comments: 12,
    tags: ["street-lights", "maintenance", "schedule"],
  },
  {
    id: 3,
    title: "Water supply issues in Block C",
    author: {
      name: "Amit Kumar",
      avatar: "/placeholder-user.jpg",
      initials: "AK",
    },
    content:
      "Has anyone else in Block C been experiencing low water pressure in the mornings? It seems to have started about a week ago. I've reported it through the app, but I'm curious if others are facing the same issue.",
    createdAt: "2023-04-17T11:45:00Z",
    likes: 32,
    comments: 18,
    tags: ["water-supply", "block-c", "infrastructure"],
  },
]

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Community Clean-up Drive",
    description: "Join us for a community clean-up drive to beautify our sector's parks and public spaces.",
    date: "2023-05-15T09:00:00Z",
    location: "Central Park, Sector 2",
    organizer: {
      name: "Rahul Sharma",
      avatar: "/placeholder-user.jpg",
      initials: "RS",
    },
    participants: 28,
    maxParticipants: 50,
  },
  {
    id: 2,
    title: "Tree Plantation Drive",
    description: "Help increase the green cover in our sector by participating in this tree plantation initiative.",
    date: "2023-05-22T08:30:00Z",
    location: "Green Belt, Sector 2",
    organizer: {
      name: "Vikram Mehta",
      avatar: "/placeholder-user.jpg",
      initials: "VM",
    },
    participants: 35,
    maxParticipants: 40,
  },
  {
    id: 3,
    title: "Waste Management Workshop",
    description: "Learn about effective waste segregation and recycling practices for a cleaner community.",
    date: "2023-05-28T10:00:00Z",
    location: "Community Hall, Sector 2",
    organizer: {
      name: "Neha Singh",
      avatar: "/placeholder-user.jpg",
      initials: "NS",
    },
    participants: 15,
    maxParticipants: 30,
  },
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [discussionTitle, setDiscussionTitle] = useState("")
  const [discussionContent, setDiscussionContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter members based on search query
  const filteredMembers = communityMembers.filter((member) => {
    return (
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Filter discussions based on search query
  const filteredDiscussions = communityDiscussions.filter((discussion) => {
    return (
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  // Filter events based on search query
  const filteredEvents = upcomingEvents.filter((event) => {
    return (
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Gold":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "Silver":
        return "bg-gray-400 hover:bg-gray-500"
      case "Bronze":
        return "bg-amber-700 hover:bg-amber-800"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const handleSubmitDiscussion = () => {
    if (!discussionTitle || !discussionContent) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your discussion.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Discussion Posted",
        description: "Your discussion has been posted successfully.",
      })

      // Reset form
      setDiscussionTitle("")
      setDiscussionContent("")
      setIsSubmitting(false)
    }, 1500)
  }

  const handleJoinEvent = (eventId: number) => {
    toast({
      title: "Event Joined",
      description: "You have successfully joined the event.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Community</h1>
        <p className="text-muted-foreground">
          Connect with members of your sector and participate in community activities.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search community members, discussions, or events..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="discussions">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Members</CardTitle>
              <CardDescription>Members of your sector (Sector 2)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{member.name}</span>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{member.issues} issues reported</span>
                          <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{member.points} pts</span>
                        </div>
                        <Badge className={`${getBadgeColor(member.badge)} text-white`}>{member.badge}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-center text-muted-foreground">No members found. Try adjusting your search.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Leaderboard</CardTitle>
              <CardDescription>Top contributors in your sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityMembers
                  .sort((a, b) => b.points - a.points)
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={member.id} className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-semibold">
                        {index + 1}
                      </div>
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.issues} issues reported</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-medium">{member.points} pts</p>
                        <Badge className={`${getBadgeColor(member.badge)} text-white`}>{member.badge}</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Start a Discussion</CardTitle>
              <CardDescription>Share your thoughts or questions with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="discussion-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="discussion-title"
                  placeholder="What would you like to discuss?"
                  value={discussionTitle}
                  onChange={(e) => setDiscussionTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="discussion-content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="discussion-content"
                  placeholder="Share your thoughts, questions, or ideas..."
                  className="min-h-[120px]"
                  value={discussionContent}
                  onChange={(e) => setDiscussionContent(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitDiscussion} disabled={isSubmitting} className="ml-auto">
                {isSubmitting ? "Posting..." : "Post Discussion"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Discussions</CardTitle>
              <CardDescription>Recent discussions in your sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredDiscussions.length > 0 ? (
                  filteredDiscussions.map((discussion) => (
                    <div key={discussion.id} className="flex flex-col gap-3 rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{discussion.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={discussion.author.avatar || "/placeholder.svg"}
                            alt={discussion.author.name}
                          />
                          <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{discussion.author.name}</span>
                      </div>
                      <p className="text-sm">{discussion.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {discussion.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{discussion.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{discussion.comments}</span>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-center text-muted-foreground">
                      No discussions found.{" "}
                      {searchQuery ? "Try adjusting your search." : "Start a discussion to get the conversation going!"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Community events in your sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <div key={event.id} className="flex flex-col gap-3 rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                        >
                          Upcoming
                        </Badge>
                      </div>
                      <p className="text-sm">{event.description}</p>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(event.date).toLocaleDateString()} at{" "}
                            {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.participants}/{event.maxParticipants} participants
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-sm">Organized by:</span>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={event.organizer.avatar || "/placeholder.svg"}
                              alt={event.organizer.name}
                            />
                            <AvatarFallback>{event.organizer.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{event.organizer.name}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleJoinEvent(event.id)}
                        disabled={event.participants >= event.maxParticipants}
                        className="mt-2"
                      >
                        {event.participants >= event.maxParticipants ? "Event Full" : "Join Event"}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-center text-muted-foreground">
                      No upcoming events found.{" "}
                      {searchQuery ? "Try adjusting your search." : "Check back later for new events!"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggest an Event</CardTitle>
              <CardDescription>Have an idea for a community event? Let us know!</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Suggest New Event
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
