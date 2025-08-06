"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, FileText, TrendingUp, Users, Wrench, Building } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Stat = {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: LucideIcon
}

const ICON_MAP: Record<string, LucideIcon> = {
  "FileText": FileText,
  "Clock": Clock,
  "CheckCircle": CheckCircle,
  "AlertTriangle": AlertTriangle,
  "Users": Users,
  "TrendingUp": TrendingUp,
  "Wrench": Wrench,
  "Building": Building,
}

export function AdminIssueStats() {
  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    // Replace this URL with your actual API endpoint
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        // Map icon names from API to actual icon components
        const mappedStats = data.map((stat: any) => ({
          ...stat,
          icon: ICON_MAP[stat.icon] || FileText,
        }))
        setStats(mappedStats)
      })
      .catch(() => {
        // fallback to static data if API fails
        setStats([
          {
            title: "Total Issues",
            value: "1,234",
            change: "+12%",
            changeType: "positive",
            icon: FileText,
          },
          {
            title: "Pending Issues",
            value: "89",
            change: "-5%",
            changeType: "positive",
            icon: Clock,
          },
          {
            title: "Resolved This Month",
            value: "456",
            change: "+23%",
            changeType: "positive",
            icon: CheckCircle,
          },
          {
            title: "Urgent Issues",
            value: "12",
            change: "-8%",
            changeType: "positive",
            icon: AlertTriangle,
          },
          {
            title: "Active Citizens",
            value: "2,847",
            change: "+18%",
            changeType: "positive",
            icon: Users,
          },
          {
            title: "Avg Resolution Time",
            value: "3.2 days",
            change: "-0.5 days",
            changeType: "positive",
            icon: TrendingUp,
          },
          {
            title: "Active Workers",
            value: "156",
            change: "+7%",
            changeType: "positive",
            icon: Wrench,
          },
          {
            title: "Departments",
            value: "8",
            change: "No change",
            changeType: "neutral",
            icon: Building,
          },
        ])
      })
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                {stat.changeType === "neutral"
                  ? stat.change
                  : `${stat.change} from last month`}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}