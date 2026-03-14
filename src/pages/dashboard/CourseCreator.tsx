import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourse, useInstructors } from "@/services/queries";

export default function CourseCreator() {
  const { data: instructorsData } = useInstructors();
  const instructors = Array.isArray(instructorsData) ? instructorsData : (instructorsData as any)?.data ?? [];
  const createCourse = useCreateCourse();

  const [title, setTitle] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [fee, setFee] = useState("");
  const [language, setLanguage] = useState("Hindi");
  const [courseType, setCourseType] = useState<"idc" | "bhakti-shastri" | "bhakti-vaibhav">("bhakti-shastri");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructorId || !description.trim() || !startDate || !fee) return;
    const numFee = parseFloat(fee);
    if (isNaN(numFee) || numFee < 0) return;
    createCourse.mutate(
      {
        title: title.trim(),
        instructor_id: parseInt(instructorId, 10),
        description: description.trim(),
        start_date: new Date(startDate).toISOString(),
        fee: numFee,
        language: language.trim() || "Hindi",
        type: courseType,
        status: "upcoming",
      },
      {
        onSuccess: () => {
          setTitle("");
          setInstructorId("");
          setDescription("");
          setStartDate("");
          setFee("");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Course Creator</h2>
        <p className="text-muted-foreground">Create and manage courses.</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">New Course</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course Title</Label>
                <Input placeholder="e.g., Bhakti Shastri" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Instructor</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                  required
                >
                  <option value="">Select instructor</option>
                  {instructors.map((inst: any) => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Course description..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Fee (INR)</Label>
                <Input type="number" placeholder="12501" value={fee} onChange={(e) => setFee(e.target.value)} min={0} required />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Input placeholder="Hindi" value={language} onChange={(e) => setLanguage(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Course Type</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={courseType}
                onChange={(e) => setCourseType(e.target.value as any)}
              >
                <option value="idc">IDC</option>
                <option value="bhakti-shastri">Bhakti Shastri</option>
                <option value="bhakti-vaibhav">Bhakti Vaibhava</option>
              </select>
            </div>
            <Button type="submit" disabled={createCourse.isPending}>
              {createCourse.isPending ? "Creating..." : "Create Course"}
            </Button>
            {createCourse.isSuccess && <p className="text-sm text-green-600">Course created successfully.</p>}
            {createCourse.isError && <p className="text-sm text-destructive">Failed to create course.</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
