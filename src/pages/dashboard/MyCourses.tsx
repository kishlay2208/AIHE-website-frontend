import { useState, useRef } from "react";
import { Play, Download, FileText, Clock, ExternalLink, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  useEnrolledCourses,
  useCourseRecordings,
  useCourseMaterials,
  useCourseAssessments,
  useUploadObaDocument,
} from "@/services/queries";
import type { Recording } from "@/types";

export default function MyCourses() {
  const { data: enrolledData, isLoading: enrolledLoading } = useEnrolledCourses();
  const enrolledCourses = enrolledData?.data ?? [];
  const [selectedCourse, setSelectedCourse] = useState<(typeof enrolledCourses)[0] | null>(enrolledCourses[0] ?? null);

  const courseId = selectedCourse?.courseId != null ? String(selectedCourse.courseId) : "";
  const { data: recordingsData } = useCourseRecordings(courseId);
  const { data: materialsData } = useCourseMaterials(courseId);
  const { data: assessmentsData } = useCourseAssessments(courseId);

  const recordings: Recording[] = recordingsData?.recordings ?? [];
  const materials = materialsData?.materials ?? [];
  const assessments = Array.isArray(assessmentsData?.data) ? assessmentsData.data : (assessmentsData as any) ?? [];

  const uploadOba = useUploadObaDocument();
  const [obaUnit, setObaUnit] = useState("");
  const [obaFile, setObaFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCbaActive = true;
  const cbaDeadline = "January 30, 2026, 11:59 PM IST";

  const handleObaSubmit = () => {
    if (!courseId || !obaUnit.trim() || !obaFile) return;
    uploadOba.mutate(
      { courseId, unit: obaUnit.trim(), file: obaFile },
      {
        onSuccess: () => {
          setObaUnit("");
          setObaFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
        <p className="text-muted-foreground">Access your enrolled courses and materials.</p>
      </div>

      {enrolledLoading ? (
        <div className="text-center py-12">Loading courses...</div>
      ) : enrolledCourses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No enrolled courses.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course: any) => (
              <Card
                key={course.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCourse?.id === course.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={course.status === "completed" ? "default" : "secondary"}>
                      {course.status}
                    </Badge>
                    <span className="text-2xl font-bold text-primary">{course.progress}%</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  <Progress value={course.progress} className="h-2 mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedCourse && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedCourse.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="recordings">
                  <TabsList className="mb-4">
                    <TabsTrigger value="recordings">Recordings</TabsTrigger>
                    <TabsTrigger value="assessments">Assessments</TabsTrigger>
                    <TabsTrigger value="materials">Materials</TabsTrigger>
                    <TabsTrigger value="forms">Forms</TabsTrigger>
                  </TabsList>

                  <TabsContent value="recordings" className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {recordings.map((rec) => (
                        <AccordionItem key={rec.id} value={String(rec.id)}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 text-left">
                              <Play className="h-4 w-4 text-primary shrink-0" />
                              <div>
                                <p className="font-medium">
                                  Session {rec.session_number} – {rec.session_date ? new Date(rec.session_date).toLocaleDateString() : ""} – {rec.topic || "Session"}
                                </p>
                                {rec.session_date && (
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(rec.session_date).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              {(rec.youtube_video_id || rec.youtube_url) ? (
                                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                                  <iframe
                                    title={`Session ${rec.session_number}`}
                                    className="w-full h-full"
                                    src={
                                      rec.youtube_video_id
                                        ? `https://www.youtube.com/embed/${rec.youtube_video_id}`
                                        : rec.youtube_url || ""
                                    }
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              ) : (
                                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                  <p className="text-sm text-muted-foreground">No video link for this session.</p>
                                </div>
                              )}
                              {rec.ppt_url && (
                                <Button variant="outline" size="sm" className="gap-2" asChild>
                                  <a href={rec.ppt_url} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-3 w-3" />
                                    Download PPT
                                  </a>
                                </Button>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    {recordings.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4">No recordings for this course yet.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="assessments">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit</TableHead>
                          <TableHead className="text-center">CBA</TableHead>
                          <TableHead className="text-center">OBA</TableHead>
                          <TableHead className="text-center">Sloka</TableHead>
                          <TableHead className="text-center">Total</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assessments.map((a: any) => (
                          <TableRow key={a.id}>
                            <TableCell className="font-medium">{a.unit}</TableCell>
                            <TableCell className="text-center">{a.cba_marks ?? a.cbaMarks ?? 0}/20</TableCell>
                            <TableCell className="text-center">{a.oba_marks ?? a.obaMarks ?? 0}/25</TableCell>
                            <TableCell className="text-center">{a.sloka_marks ?? a.slokaMarks ?? 0}/10</TableCell>
                            <TableCell className="text-center font-semibold">
                              {a.total ?? 0}/{a.max_marks ?? a.maxMarks ?? 50}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={(a.status ?? "").toString() === "completed" ? "default" : "secondary"}>
                                {a.status ?? "pending"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {assessments.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4">No assessments yet.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="materials" className="space-y-3">
                    {materials.map((m) => (
                      <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">{m.title}</p>
                          {m.description && (
                            <p className="text-sm text-muted-foreground">{m.description}</p>
                          )}
                        </div>
                        {m.url && (
                          <Button variant="outline" size="sm" className="gap-2" asChild>
                            <a href={m.url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-3 w-3" />
                              {m.material_type === "pdf" ? "Download PDF" : "View"}
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                    {materials.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4">No materials for this course yet.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="forms" className="space-y-4">
                    <Card className="border-dashed">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <FileText className="h-8 w-8 text-primary shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">OBA Submission</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Upload your Open Book Assessment answers (PDF or Word).
                            </p>
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Unit (e.g. Unit 1)"
                                className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={obaUnit}
                                onChange={(e) => setObaUnit(e.target.value)}
                              />
                              <div className="flex items-center gap-2 flex-wrap">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  className="text-sm"
                                  onChange={(e) => setObaFile(e.target.files?.[0] ?? null)}
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  Select File
                                </Button>
                                <Button
                                  disabled={!obaUnit.trim() || !obaFile || uploadOba.isPending}
                                  onClick={handleObaSubmit}
                                >
                                  {uploadOba.isPending ? "Uploading..." : "Upload"}
                                </Button>
                              </div>
                              {uploadOba.isSuccess && (
                                <p className="text-sm text-green-600">Upload successful.</p>
                              )}
                              {uploadOba.isError && (
                                <p className="text-sm text-destructive">Upload failed. Try again.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Clock className="h-8 w-8 text-primary shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">CBA (Closed Book Assessment)</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Timed online assessment – {cbaDeadline}
                            </p>
                            {isCbaActive ? (
                              <Button className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Start CBA Test
                              </Button>
                            ) : (
                              <Button disabled className="gap-2">
                                <Lock className="h-4 w-4" />
                                CBA Not Available
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
