import { MapPin, UserCheck, ImageIcon, Brain, Clock, Award } from "lucide-react"

export function FeatureSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform offers a comprehensive solution for urban issue reporting and resolution
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Location Tagging</h3>
            <p className="text-center text-muted-foreground">
              Precise GPS-based location tagging for accurate issue reporting
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Image Uploads</h3>
            <p className="text-center text-muted-foreground">
              Upload images of issues for enhanced accuracy and documentation
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">AI Analysis</h3>
            <p className="text-center text-muted-foreground">
              Advanced AI for duplicate detection and complaint prioritization
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Community Moderation</h3>
            <p className="text-center text-muted-foreground">
              Sector-based moderators ensure legitimacy of reported issues
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Real-time Updates</h3>
            <p className="text-center text-muted-foreground">Track the status of reported issues in real-time</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Contributor Recognition</h3>
            <p className="text-center text-muted-foreground">
              Leaderboard recognizes active citizens contributing to community improvement
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
