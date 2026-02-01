import { useState } from "react";
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
import { useEnrolledCourses, useCourseRecordings, useCourseAssessments } from "@/services/queries";

export default function MyCourses() {
  const { data: enrolledData, isLoading: enrolledLoading } = useEnrolledCourses();
  const enrolledCourses = enrolledData?.data || [];
  const [selectedCourse, setSelectedCourse] = useState(enrolledCourses[0] || null);
  
  const { data: recordingsData } = useCourseRecordings(selectedCourse?.id || "");
  const recordings = recordingsData?.data || [];
  
  const { data: assessmentsData } = useCourseAssessments(selectedCourse?.id || "");
  const assessments = assessmentsData?.data || [];

  // Mock CBA availability (based on hardcoded time)
  const isCbaActive = true; // Simulated as active for demo
  const cbaDeadline = "January 30, 2026, 11:59 PM IST";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
        <p className="text-muted-foreground">Access your enrolled courses and materials.</p>
      </div>

      {enrolledLoading ? (
        <div className="text-center py-12">Loading courses...</div>
      ) : enrolledCourses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No enrolled courses.
        </div>
      ) : (
        <>
      {/* Course Grid */}
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

      {/* Course Details */}
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
                <TabsTrigger value="forms">Forms</TabsTrigger>
              </TabsList>

              {/* Recordings Tab */}
              <TabsContent value="recordings" className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {recordings.map((recording) => (
                    <AccordionItem key={recording.id} value={recording.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <Play className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium">
                              Session {recording.sessionNumber} - {recording.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {recording.date} • {recording.duration}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {/* Mock YouTube Embed */}
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Video Player Placeholder
                              </p>
                              <p className="text-xs text-muted-foreground">
                                (YouTube embed would appear here)
                              </p>
                            </div>
                          </div>
                          
                          {/* Materials */}
                          {recording.materials && recording.materials.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {recording.materials.map((material, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <Download className="h-3 w-3" />
                                  {material}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              {/* Assessments Tab */}
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
                    {assessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">{assessment.unit}</TableCell>
                        <TableCell className="text-center">{assessment.cbaMarks}/20</TableCell>
                        <TableCell className="text-center">{assessment.obaMarks}/25</TableCell>
                        <TableCell className="text-center">{assessment.slokaMarks}/10</TableCell>
                        <TableCell className="text-center font-semibold">
                          {assessment.total}/{assessment.maxMarks}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={assessment.status === "completed" ? "default" : "secondary"}>
                            {assessment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Forms Tab */}
              <TabsContent value="forms" className="space-y-4">
                {/* OBA Upload */}
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">OBA Submission</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Upload your Open Book Assessment answers
                        </p>
                        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                          <p className="text-muted-foreground">
                            Drag and drop your PDF here, or click to browse
                          </p>
                          <Button variant="outline" className="mt-3">
                            Select File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CBA Test Link */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Clock className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">CBA (Closed Book Assessment)</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Timed online assessment - {cbaDeadline}
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
