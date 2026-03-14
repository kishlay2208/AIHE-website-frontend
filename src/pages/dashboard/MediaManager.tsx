import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCourses } from "@/services/queries";
import { apiClient } from "@/services/api";

export default function MediaManager() {
  const [courseId, setCourseId] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"recordings" | "materials">("recordings");

  const { data: coursesData } = useCourses();
  const courses = Array.isArray(coursesData) ? coursesData : (coursesData as any)?.data ?? [];

  const loadSessions = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await apiClient.getAdminCourseSessions(courseId);
      setSessions(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await apiClient.getAdminCourseMaterials(courseId);
      setMaterials(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (id: string) => {
    setCourseId(id);
    setSessions([]);
    setMaterials([]);
    if (id) {
      loadSessions();
      loadMaterials();
    }
  };

  const [newSession, setNewSession] = useState({ session_number: "", topic: "", youtube_url: "", youtube_video_id: "", ppt_url: "" });
  const [newMaterial, setNewMaterial] = useState({ title: "", material_type: "pdf", url: "", description: "" });

  const getYoutubeVideoId = (input: string): string | undefined => {
    if (!input?.trim()) return undefined;
    const trimmed = input.trim();
    const m = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : (trimmed.length <= 11 ? trimmed : undefined);
  };

  const addSession = async () => {
    if (!courseId || !newSession.session_number) return;
    const num = parseInt(newSession.session_number, 10);
    if (isNaN(num)) return;
    const ytInput = newSession.youtube_url || newSession.youtube_video_id;
    const youtube_video_id = getYoutubeVideoId(ytInput);
    await apiClient.createCourseSession(courseId, {
      session_number: num,
      topic: newSession.topic || undefined,
      youtube_url: ytInput || undefined,
      youtube_video_id: youtube_video_id || undefined,
      ppt_url: newSession.ppt_url || undefined,
    });
    setNewSession({ session_number: "", topic: "", youtube_url: "", youtube_video_id: "", ppt_url: "" });
    loadSessions();
  };

  const addMaterial = async () => {
    if (!courseId || !newMaterial.title.trim()) return;
    await apiClient.createCourseMaterial(courseId, {
      title: newMaterial.title.trim(),
      material_type: newMaterial.material_type,
      url: newMaterial.url || undefined,
      description: newMaterial.description || undefined,
    });
    setNewMaterial({ title: "", material_type: "pdf", url: "", description: "" });
    loadMaterials();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Media Manager</h2>
        <p className="text-muted-foreground">Upload YouTube playlist links and PDF materials for course Recordings and Materials.</p>
      </div>

      <div className="flex gap-4 items-center">
        <Label>Course</Label>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm min-w-[240px]"
          value={courseId}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          <option value="">Select course</option>
          {courses.map((c: any) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {!courseId ? (
        <div className="text-center py-12 text-muted-foreground">Select a course to manage recordings and materials.</div>
      ) : (
        <>
          <div className="flex gap-2 border-b">
            <Button variant={activeTab === "recordings" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("recordings")}>Recordings</Button>
            <Button variant={activeTab === "materials" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("materials")}>Materials</Button>
          </div>

          {activeTab === "recordings" && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Course Sessions (Recordings)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Add session number, topic, and YouTube video link. Students will see these in the Recordings tab.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Session #</Label>
                    <Input type="number" min={1} placeholder="1" value={newSession.session_number} onChange={(e) => setNewSession((s) => ({ ...s, session_number: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Input placeholder="Topic" value={newSession.topic} onChange={(e) => setNewSession((s) => ({ ...s, topic: e.target.value }))} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>YouTube URL or Video ID</Label>
                    <Input placeholder="https://youtube.com/... or video ID" value={newSession.youtube_url || newSession.youtube_video_id} onChange={(e) => setNewSession((s) => ({ ...s, youtube_url: e.target.value, youtube_video_id: e.target.value }))} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>PPT URL (optional)</Label>
                    <Input placeholder="https://..." value={newSession.ppt_url} onChange={(e) => setNewSession((s) => ({ ...s, ppt_url: e.target.value }))} />
                  </div>
                </div>
                <Button onClick={addSession} disabled={!newSession.session_number}>Add Session</Button>
                {loading ? <p className="text-sm">Loading...</p> : (
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    {sessions.map((s) => (
                      <li key={s.id}>Session {s.session_number} – {s.topic || "—"} {s.youtube_video_id ? "(video)" : ""}</li>
                    ))}
                    {sessions.length === 0 && <li className="text-muted-foreground">No sessions yet.</li>}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "materials" && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Course Materials</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Add PDF or reference links. Students will see these in the Materials tab.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="Title" value={newMaterial.title} onChange={(e) => setNewMaterial((s) => ({ ...s, title: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newMaterial.material_type} onChange={(e) => setNewMaterial((s) => ({ ...s, material_type: e.target.value }))}>
                      <option value="pdf">PDF</option>
                      <option value="reading">Reading</option>
                      <option value="reference">Reference</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>URL</Label>
                    <Input placeholder="https://..." value={newMaterial.url} onChange={(e) => setNewMaterial((s) => ({ ...s, url: e.target.value }))} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description (optional)</Label>
                    <Input placeholder="Description" value={newMaterial.description} onChange={(e) => setNewMaterial((s) => ({ ...s, description: e.target.value }))} />
                  </div>
                </div>
                <Button onClick={addMaterial} disabled={!newMaterial.title.trim()}>Add Material</Button>
                {loading ? <p className="text-sm">Loading...</p> : (
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    {materials.map((m) => (
                      <li key={m.id}>{m.title} ({m.material_type})</li>
                    ))}
                    {materials.length === 0 && <li className="text-muted-foreground">No materials yet.</li>}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
