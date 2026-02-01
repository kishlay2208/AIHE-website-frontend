import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGradebook } from "@/services/queries";

export default function Gradebook() {
  const { data: gradebookData, isLoading } = useGradebook();
  const gradebookEntries = gradebookData?.data || [];
  
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-foreground">Gradebook</h2><p className="text-muted-foreground">Manage student grades and assessments.</p></div>
      {isLoading ? (
        <div className="text-center py-12">Loading gradebook...</div>
      ) : gradebookEntries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No gradebook entries.
        </div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg">Bhakti Shastri - Grades</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-center">CBA</TableHead><TableHead className="text-center">OBA</TableHead><TableHead className="text-center">Sloka</TableHead><TableHead className="text-center">Total</TableHead></TableRow></TableHeader>
              <TableBody>
                {gradebookEntries.map((entry: any) => (<TableRow key={entry.studentId}><TableCell className="font-medium">{entry.studentName}</TableCell><TableCell className="text-center">{entry.cba}</TableCell><TableCell className="text-center">{entry.oba}</TableCell><TableCell className="text-center">{entry.sloka}</TableCell><TableCell className="text-center font-bold">{entry.total}</TableCell></TableRow>))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
