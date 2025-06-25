import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, PlusCircle } from "lucide-react"

// Mock data for recent activity
const recentActivities = [
  {
    id: 1,
    user: {
      name: "Rahul Sharma",
      avatar: "/placeholder-user.jpg",
      initials: "RS",
    },
    action: "reported",
    issue: "Pothole on Main Street",
    time: "2 hours ago",
    icon: PlusCircle,
    iconColor: "text-green-500",
  },
  {
    id: 2,
    user: {
      name: "Priya Patel",
      avatar: "/placeholder-user.jpg",
      initials: "PP",
    },
    action: "updated",
    issue: "Broken Street Light",
    time: "5 hours ago",
    icon: Clock,
    iconColor: "text-blue-500",
  },
  {
    id: 3,
    user: {
      name: "Amit Kumar",
      avatar: "/placeholder-user.jpg",
      initials: "AK",
    },
    action: "resolved",
    issue: "Garbage Collection Missed",
    time: "1 day ago",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  {
    id: 4,
    user: {
      name: "Neha Singh",
      avatar: "/placeholder-user.jpg",
      initials: "NS",
    },
    action: "commented on",
    issue: "Water Leakage",
    time: "1 day ago",
    icon: PlusCircle,
    iconColor: "text-violet-500",
  },
  {
    id: 5,
    user: {
      name: "Vikram Mehta",
      avatar: "/placeholder-user.jpg",
      initials: "VM",
    },
    action: "verified",
    issue: "Fallen Tree",
    time: "2 days ago",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-semibold">{activity.issue}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
          <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
        </div>
      ))}
    </div>
  )
}
