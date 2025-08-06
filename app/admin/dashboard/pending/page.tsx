import { AdminIssuesList } from "@/components/admin/admin-issues-list"

export default function PendingIssuesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Pending Issues</h1>
        <p className="text-muted-foreground">Review and manage issues awaiting action.</p>
      </div>
      <AdminIssuesList filter="pending" />
    </div>
  )
}
