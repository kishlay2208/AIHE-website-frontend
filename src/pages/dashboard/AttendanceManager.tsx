import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAttendanceRecords } from "@/services/queries";

export default function AttendanceManager() {
  const { data: attendanceData, isLoading } = useAttendanceRecords();
  const attendanceRecords = attendanceData?.data || [];
  
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-foreground">Attendance Manager</h2><p className="text-muted-foreground">Track student attendance for courses.</p></div>
      {isLoading ? (
        <div className="text-center py-12">Loading attendance records...</div>
      ) : attendanceRecords.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No attendance records.
        </div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg">Bhakti Shastri - Attendance</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-center">Attended</TableHead><TableHead className="text-center">Rate</TableHead><TableHead>Last Attended</TableHead></TableRow></TableHeader>
              <TableBody>
                {attendanceRecords.map((rec: any) => (<TableRow key={rec.studentId}><TableCell className="font-medium">{rec.studentName}</TableCell><TableCell className="text-center">{rec.sessionsAttended}/{rec.totalSessions}</TableCell><TableCell className="text-center"><Badge variant={rec.sessionsAttended / rec.totalSessions >= 0.8 ? "default" : "secondary"}>{Math.round((rec.sessionsAttended / rec.totalSessions) * 100)}%</Badge></TableCell><TableCell>{rec.lastAttended}</TableCell></TableRow>))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
