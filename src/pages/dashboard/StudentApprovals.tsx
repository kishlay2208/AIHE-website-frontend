import { CheckCircle, XCircle, Eye, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStudentApprovals, useUpdateApprovalStatus } from "@/services/queries";

export default function StudentApprovals() {
  const { data: approvalsData, isLoading } = useStudentApprovals();
  const updateStatus = useUpdateApprovalStatus();
  const studentApprovals = approvalsData?.data ?? [];

  const handleApprove = (id: number) => {
    updateStatus.mutate({ id: String(id), status: "approved" });
  };
  const handleReject = (id: number) => {
    updateStatus.mutate({ id: String(id), status: "rejected" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Student Approvals</h2>
        <p className="text-muted-foreground">Review and approve student applications.</p>
      </div>
      {isLoading ? (
        <div className="text-center py-12">Loading approvals...</div>
      ) : studentApprovals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No pending approvals.
        </div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg">Pending Applications</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentApprovals.map((app: any) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <p className="font-medium">{app.studentName ?? app.name}</p>
                      <p className="text-sm text-muted-foreground">{app.email}</p>
                    </TableCell>
                    <TableCell>{app.courseName ?? app.course}</TableCell>
                    <TableCell>{app.appliedDate ?? app.appliedAt?.slice?.(0, 10)}</TableCell>
                    <TableCell>
                      {app.documents?.recommendationLetterUrl ? (
                        <Button size="sm" variant="outline" className="gap-1" asChild>
                          <a href={app.documents.recommendationLetterUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-3 w-3" /> View
                          </a>
                        </Button>
                      ) : (
                        <Badge variant="outline"><FileText className="h-3 w-3 inline mr-1" />—</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(app.id)} disabled={updateStatus.isPending}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(app.id)} disabled={updateStatus.isPending}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
