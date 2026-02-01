import { BookOpen, Award, Bell, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/lms/StatCard";
import { useEnrolledCourses } from "@/services/queries";
import { useCourses } from "@/services/queries";

export default function DashboardHome() {
  const { data: enrolledData, isLoading: enrolledLoading } = useEnrolledCourses();
  const { data: coursesData } = useCourses();
  
  const enrolledCourses = enrolledData?.data || [];
  const allCourses = coursesData?.data || [];
  
  const activeCourses = enrolledCourses.filter((c: any) => c.status === "active");
  const availableCourses = allCourses.length;
  const completedCourses = enrolledCourses.filter((c: any) => c.status === "completed").length;

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
          title="Completed"
          value={completedCourses}
          icon={Award}
          description="Certificates earned"
        />
        <StatCard
          title="Notifications"
          value={newsItems.length}
          icon={Bell}
          description="New updates"
        />
      </div>

      {/* Course Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{course.title}</p>
                    <p className="text-xs text-muted-foreground">{course.instructor}</p>
                  </div>
                  <Badge variant={course.status === "completed" ? "default" : "secondary"}>
                    {course.status === "completed" ? "Completed" : `${course.progress}%`}
                  </Badge>
                </div>
                <Progress value={course.progress} className="h-2" />
                {course.nextSession && (
                  <p className="text-xs text-muted-foreground">
                    Next: {course.nextSession}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* News & Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">News & Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">No updates at the moment.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
