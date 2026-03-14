import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGradebook, useCourses } from "@/services/queries";

export default function Gradebook() {
  const [courseId, setCourseId] = useState<string>("");
  const { data: coursesData } = useCourses();
  const courses = Array.isArray(coursesData) ? coursesData : (coursesData as any)?.data ?? [];
  const { data: gradebookData, isLoading } = useGradebook(courseId || undefined);
  const gradebookEntries = gradebookData?.data ?? [];
  const selectedCourse = courses.find((c: any) => String(c.id) === courseId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Gradebook</h2>
        <p className="text-muted-foreground">Manage student grades and assessments.</p>
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
        <div className="text-center py-12 text-muted-foreground">Select a course to view gradebook.</div>
      ) : isLoading ? (
        <div className="text-center py-12">Loading gradebook...</div>
      ) : gradebookEntries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No gradebook entries for this course.</div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg">{selectedCourse?.title ?? "Grades"}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-center">CBA</TableHead><TableHead className="text-center">OBA</TableHead><TableHead className="text-center">Sloka</TableHead><TableHead className="text-center">Total</TableHead></TableRow></TableHeader>
              <TableBody>
                {gradebookEntries.map((entry: any) => (
                  <TableRow key={entry.studentId ?? entry.enrollmentId}>
                    <TableCell className="font-medium">{entry.studentName}</TableCell>
                    <TableCell className="text-center">{entry.cba}</TableCell>
                    <TableCell className="text-center">{entry.oba}</TableCell>
                    <TableCell className="text-center">{entry.sloka}</TableCell>
                    <TableCell className="text-center font-bold">{entry.total}</TableCell>
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
