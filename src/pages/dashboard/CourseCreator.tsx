import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CourseCreator() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-foreground">Course Creator</h2><p className="text-muted-foreground">Create and manage courses.</p></div>
      <Card>
        <CardHeader><CardTitle className="text-lg">New Course</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Course Title</Label><Input placeholder="e.g., Bhakti Shastri" /></div>
            <div className="space-y-2"><Label>Instructor</Label><Input placeholder="e.g., HG Chittahari Krishna Pr" /></div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Course description..." rows={4} /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
            <div className="space-y-2"><Label>Fee (INR)</Label><Input type="number" placeholder="12501" /></div>
            <div className="space-y-2"><Label>Language</Label><Input placeholder="Hindi" /></div>
          </div>
          <Button>Create Course</Button>
        </CardContent>
      </Card>
    </div>
  );
}
