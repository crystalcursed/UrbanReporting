import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminRecentActivity() {
  const activities = [
    {
      id: 1,
      user: "Admin Sarah",
      action: "Resolved issue #1234 - Street light repair",
      time: "2 minutes ago",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AS",
    },
    {
      id: 2,
      user: "Admin Mike",
      action: "Assigned issue #1235 to Road Maintenance Team",
      time: "15 minutes ago",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AM",
    },
    {
      id: 3,
      user: "Admin Lisa",
      action: "Updated status of issue #1236 to In Progress",
      time: "1 hour ago",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AL",
    },
    {
      id: 4,
      user: "Admin John",
      action: "Created work order for pothole repair",
      time: "2 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
    {
      id: 5,
      user: "Admin Emma",
      action: "Approved guest report #1237",
      time: "3 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AE",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
            <AvatarFallback>{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{activity.user}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
