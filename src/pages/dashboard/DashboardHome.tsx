import { BookOpen, Award, Bell, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/lms/StatCard";
import { useEnrolledCourses, useCourses, useAnnouncements } from "@/services/queries";

export default function DashboardHome() {
  const { data: enrolledData, isLoading: enrolledLoading } = useEnrolledCourses();
  const { data: coursesData } = useCourses();
  const { data: announcementsData } = useAnnouncements();

  const enrolledCourses = enrolledData?.data ?? [];
  const allCourses = Array.isArray(coursesData) ? coursesData : (coursesData as any)?.data ?? [];
  const announcements = announcementsData?.announcements ?? [];

  const activeCourses = enrolledCourses.filter((c: any) => c.status === "active");
  const availableCourses = allCourses.length;
  const completedCount = enrolledCourses.filter((c: any) => c.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={enrolledCourses.length}
          icon={BookOpen}
          description={`${activeCourses.length} active`}
        />
        <StatCard
          title="Available Courses"
          value={availableCourses}
          icon={TrendingUp}
          description="Browse catalog"
        />
        <StatCard
          title="Certificates Earned"
          value={completedCount}
          icon={Award}
          description="Completed courses"
        />
        <StatCard
          title="Notifications"
          value={0}
          icon={Bell}
          description="New updates"
        />
      </div>

      {/* Course Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading courses...
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">No enrolled courses yet. Browse available courses to get started.</p>
              </div>
            ) : (
              enrolledCourses.map((course: any) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{course.title || course.course?.title}</p>
                      <p className="text-xs text-muted-foreground">{course.instructor || course.course?.instructor?.name}</p>
                    </div>
                    <Badge variant={course.status === "completed" ? "default" : "secondary"}>
                      {course.status === "completed" ? "Completed" : `${course.progress || 0}%`}
                    </Badge>
                  </div>
                  <Progress value={course.progress || 0} className="h-2" />
                  {course.nextSession && (
                    <p className="text-xs text-muted-foreground">
                      Next: {course.nextSession}
                    </p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* News & Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Latest News</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[360px] overflow-y-auto">
            {announcements.length === 0 ? (
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium text-foreground">Bhakti Vaibhava Module 1 Starting Soon</p>
                <p className="text-sm text-muted-foreground mt-1">Registration now open for the upcoming Bhakti Vaibhava course.</p>
                <p className="text-xs text-muted-foreground mt-2">January 15, 2026</p>
              </div>
            ) : (
              announcements.map((a: any) => (
                <div key={a.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <p className="font-medium text-foreground">{a.title}</p>
                  {a.body && <p className="text-sm text-muted-foreground mt-1">{a.body}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    {a.announced_at ? new Date(a.announced_at).toLocaleDateString() : ""}
                  </p>
                  {a.link && (
                    <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary mt-1 inline-block">
                      Read more
                    </a>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
