import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAttendanceRecords, useCourses } from "@/services/queries";

export default function AttendanceManager() {
  const [courseId, setCourseId] = useState<string>("");
  const { data: coursesData } = useCourses();
  const courses = Array.isArray(coursesData) ? coursesData : (coursesData as any)?.data ?? [];
  const { data: attendanceData, isLoading } = useAttendanceRecords(courseId || undefined);
  const attendanceRecords = attendanceData?.data ?? [];
  const selectedCourse = courses.find((c: any) => String(c.id) === courseId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Attendance Manager</h2>
        <p className="text-muted-foreground">Track student attendance for courses.</p>
      </div>
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium">Course</label>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm min-w-[200px]"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select course</option>
          {courses.map((c: any) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      {!courseId ? (
        <div className="text-center py-12 text-muted-foreground">Select a course to view attendance.</div>
      ) : isLoading ? (
        <div className="text-center py-12">Loading attendance records...</div>
      ) : attendanceRecords.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No attendance records for this course.</div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg">{selectedCourse?.title ?? "Attendance"}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-center">Attended</TableHead><TableHead className="text-center">Rate</TableHead><TableHead>Last Attended</TableHead></TableRow></TableHeader>
              <TableBody>
                {attendanceRecords.map((rec: any) => (
                  <TableRow key={rec.studentId ?? rec.enrollmentId}>
                    <TableCell className="font-medium">{rec.studentName}</TableCell>
                    <TableCell className="text-center">{rec.sessionsAttended}/{rec.totalSessions}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={(rec.sessionsAttended / (rec.totalSessions || 1)) >= 0.8 ? "default" : "secondary"}>
                        {rec.totalSessions ? Math.round((rec.sessionsAttended / rec.totalSessions) * 100) : 0}%
                      </Badge>
                    </TableCell>
                    <TableCell>{rec.lastAttended ? new Date(rec.lastAttended).toLocaleDateString() : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
