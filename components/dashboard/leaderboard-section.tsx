import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for leaderboard
const leaderboardData = [
  {
    id: 1,
    user: {
      name: "Rahul Sharma",
      avatar: "/placeholder-user.jpg",
      initials: "RS",
    },
    points: 1250,
    issues: 15,
    badge: "Gold",
  },
  {
    id: 2,
    user: {
      name: "Priya Patel",
      avatar: "/placeholder-user.jpg",
      initials: "PP",
    },
    points: 980,
    issues: 12,
    badge: "Silver",
  },
  {
    id: 3,
    user: {
      name: "Amit Kumar",
      avatar: "/placeholder-user.jpg",
      initials: "AK",
    },
    points: 820,
    issues: 10,
    badge: "Silver",
  },
  {
    id: 4,
    user: {
      name: "Neha Singh",
      avatar: "/placeholder-user.jpg",
      initials: "NS",
    },
    points: 750,
    issues: 8,
    badge: "Bronze",
  },
  {
    id: 5,
    user: {
      name: "Vikram Mehta",
      avatar: "/placeholder-user.jpg",
      initials: "VM",
    },
    points: 620,
    issues: 7,
    badge: "Bronze",
  },
]

export function LeaderboardSection() {
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

  return (
    <div className="space-y-4">
      {leaderboardData.map((item, index) => (
        <div key={item.id} className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-semibold">
            {index + 1}
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
            <AvatarFallback>{item.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{item.user.name}</p>
            <p className="text-sm text-muted-foreground">{item.issues} issues reported</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-sm font-medium">{item.points} pts</p>
            <Badge className={`${getBadgeColor(item.badge)} text-white`}>{item.badge}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
