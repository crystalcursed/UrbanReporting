"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Flag } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  likes: number;
  dislikes: number;
  comments: number;
  isAdmin: boolean;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "P001",
      author: "Admin Sarah",
      avatar: "/placeholder.svg?height=32&width=32",
      timestamp: "2 hours ago",
      content: "Reminder: Community clean-up drive this Saturday at Central Park. Let's make our city shine!",
      likes: 15,
      dislikes: 0,
      comments: 3,
      isAdmin: true,
    },
    {
      id: "P002",
      author: "Citizen John",
      avatar: "/placeholder.svg?height=32&width=32",
      timestamp: "5 hours ago",
      content: "Anyone else experiencing slow internet speeds in the downtown area?",
      likes: 8,
      dislikes: 2,
      comments: 5,
      isAdmin: false,
    },
    {
      id: "P003",
      author: "Citizen Jane",
      avatar: "/placeholder.svg?height=32&width=32",
      timestamp: "1 day ago",
      content: "Thank you to the Public Works team for fixing the pothole on Elm Street so quickly!",
      likes: 25,
      dislikes: 0,
      comments: 1,
      isAdmin: false,
    },
  ])
  const [newPostContent, setNewPostContent] = useState("")
  const { toast } = useToast()

  const handleNewPost = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty.",
        variant: "destructive",
      })
      return
    }
    const newPost: CommunityPost = {
      id: `P${String(posts.length + 1).padStart(3, '0')}`,
      author: "Admin - Current User", // Placeholder for logged-in admin
      avatar: "/placeholder.svg?height=32&width=32",
      timestamp: "Just now",
      content: newPostContent,
      likes: 0,
      dislikes: 0,
      comments: 0,
      isAdmin: true,
    }
    setPosts([newPost, ...posts]) // Add new post to the top
    setNewPostContent("")
    toast({
      title: "Success",
      description: "Your post has been published!",
    })
  }

  const handleLike = (id: string) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ))
    toast({
      title: "Liked!",
      description: "You liked this post.",
    })
  }

  const handleDislike = (id: string) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post
    ))
    toast({
      title: "Disliked!",
      description: "You disliked this post.",
    })
  }

  const handleReport = (id: string) => {
    toast({
      title: "Reported",
      description: `Post ${id} has been reported for review.`,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Community Forum</h1>
        <p className="text-muted-foreground">Engage with citizens and manage community discussions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>Share announcements or start a discussion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="What's on your mind, Admin?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <Button className="w-full" onClick={handleNewPost}>
            <Send className="h-4 w-4 mr-2" /> Post to Community
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Community Posts</CardTitle>
          <CardDescription>Latest discussions and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-muted-foreground">No community posts yet.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.author} />
                      <AvatarFallback>{post.author.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{post.author}</h4>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleLike(post.id)}>
                      <ThumbsUp className="h-4 w-4" /> {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleDislike(post.id)}>
                      <ThumbsDown className="h-4 w-4" /> {post.dislikes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" /> {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => handleReport(post.id)}>
                      <Flag className="h-4 w-4" /> Report
                    </Button>
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
