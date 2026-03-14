import { useState } from "react";
import { useInstructors, useCreateInstructor, useUpdateInstructor, useDeleteInstructor } from "@/services/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, GraduationCap, ChevronDown, ChevronUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InstructorFormData {
  name: string;
  title: string;
  bio: string;
  fullBio: string;
  image: string;
  tier: "senior" | "instructor";
  teaches: string[];
}

const emptyForm: InstructorFormData = {
  name: "",
  title: "",
  bio: "",
  fullBio: "",
  image: "",
  tier: "instructor",
  teaches: [],
};

export default function InstructorManager() {
  const { data, isLoading } = useInstructors();
  const createInstructor = useCreateInstructor();
  const updateInstructor = useUpdateInstructor();
  const deleteInstructor = useDeleteInstructor();
  const { toast } = useToast();

  const instructors: any[] = data?.data ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<InstructorFormData>(emptyForm);
  const [newTeach, setNewTeach] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setNewTeach("");
    setDialogOpen(true);
  };

  const openEdit = (instructor: any) => {
    setEditingId(instructor.id);
    setForm({
      name: instructor.name ?? "",
      title: instructor.title ?? "",
      bio: instructor.bio ?? "",
      fullBio: instructor.fullBio ?? instructor.full_bio ?? "",
      image: instructor.image ?? "",
      tier: instructor.tier ?? "instructor",
      teaches: Array.isArray(instructor.teaches) ? instructor.teaches : [],
    });
    setNewTeach("");
    setDialogOpen(true);
  };

  const handleAddTeach = () => {
    const trimmed = newTeach.trim();
    if (trimmed && !form.teaches.includes(trimmed)) {
      setForm((f) => ({ ...f, teaches: [...f.teaches, trimmed] }));
      setNewTeach("");
    }
  };

  const handleRemoveTeach = (tag: string) => {
    setForm((f) => ({ ...f, teaches: f.teaches.filter((t) => t !== tag) }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.title.trim()) {
      toast({ title: "Validation Error", description: "Name and Title are required.", variant: "destructive" });
      return;
    }

    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      bio: form.bio.trim(),
      full_bio: form.fullBio.trim(),
      image: form.image.trim(),
      tier: form.tier,
      teaches: form.teaches,
    };

    if (editingId !== null) {
      updateInstructor.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            toast({ title: "Instructor updated successfully." });
            setDialogOpen(false);
          },
          onError: () => {
            toast({ title: "Failed to update instructor.", variant: "destructive" });
          },
        }
      );
    } else {
      createInstructor.mutate(payload, {
        onSuccess: () => {
          toast({ title: "Instructor created successfully." });
          setDialogOpen(false);
        },
        onError: () => {
          toast({ title: "Failed to create instructor.", variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteInstructor.mutate(id, {
      onSuccess: () => {
        toast({ title: "Instructor deleted." });
        setDeleteConfirmId(null);
      },
      onError: () => {
        toast({ title: "Failed to delete instructor.", variant: "destructive" });
        setDeleteConfirmId(null);
      },
    });
  };

  const isBusy = createInstructor.isPending || updateInstructor.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Instructor Manager
          </h2>
          <p className="text-muted-foreground mt-1">
            Create and manage instructors for the AIHE learning portal.
          </p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Instructor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Instructors</p>
            <p className="text-3xl font-bold text-foreground mt-1">{instructors.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Senior Faculty</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {instructors.filter((i) => i.tier === "senior").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Instructors</p>
            <p className="text-3xl font-bold text-foreground mt-1">
              {instructors.filter((i) => i.tier === "instructor").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Instructors</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground">Loading instructors...</div>
          ) : instructors.length === 0 ? (
            <div className="py-16 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No instructors yet</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Click "Add Instructor" to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructors.map((inst: any) => (
                  <>
                    <TableRow key={inst.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {inst.image ? (
                            <img
                              src={inst.image}
                              alt={inst.name}
                              className="h-9 w-9 rounded-full object-cover border border-border shrink-0"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-semibold text-primary">
                                {inst.name?.charAt(0) ?? "?"}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground">{inst.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{inst.bio}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{inst.title}</TableCell>
                      <TableCell>
                        <Badge variant={inst.tier === "senior" ? "default" : "secondary"}>
                          {inst.tier === "senior" ? "Senior Faculty" : "Instructor"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(inst.teaches ?? []).slice(0, 2).map((t: string) => (
                            <Badge key={t} variant="outline" className="text-xs">
                              {t}
                            </Badge>
                          ))}
                          {(inst.teaches ?? []).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{inst.teaches.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Expand"
                            onClick={() => setExpandedId(expandedId === inst.id ? null : inst.id)}
                          >
                            {expandedId === inst.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            title="Edit"
                            onClick={() => openEdit(inst)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Delete"
                            onClick={() => setDeleteConfirmId(inst.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === inst.id && (
                      <TableRow key={`${inst.id}-expanded`} className="bg-muted/30">
                        <TableCell colSpan={5} className="py-4">
                          <div className="grid md:grid-cols-2 gap-4 px-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Short Bio</p>
                              <p className="text-sm text-foreground">{inst.bio || "—"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Full Bio</p>
                              <p className="text-sm text-foreground">{inst.fullBio ?? inst.full_bio ?? "—"}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">All Subjects</p>
                              <div className="flex flex-wrap gap-1">
                                {(inst.teaches ?? []).map((t: string) => (
                                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => !isBusy && setDialogOpen(v)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Instructor" : "Add New Instructor"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="inst-name">Full Name *</Label>
                <Input
                  id="inst-name"
                  placeholder="e.g. HG Vraja Bihari Das"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inst-title">Designation / Title *</Label>
                <Input
                  id="inst-title"
                  placeholder="e.g. Senior Bhakti-Shastri Faculty"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inst-tier">Tier</Label>
              <Select
                value={form.tier}
                onValueChange={(v) => setForm((f) => ({ ...f, tier: v as "senior" | "instructor" }))}
              >
                <SelectTrigger id="inst-tier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="senior">Senior Faculty</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inst-image">Photo URL</Label>
              <Input
                id="inst-image"
                placeholder="https://..."
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              />
              {form.image && (
                <img src={form.image} alt="preview" className="h-14 w-14 rounded-full object-cover border border-border mt-1" />
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inst-bio">Short Bio</Label>
              <Textarea
                id="inst-bio"
                rows={2}
                placeholder="One or two sentence introduction..."
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inst-fullbio">Full Bio</Label>
              <Textarea
                id="inst-fullbio"
                rows={4}
                placeholder="Detailed background, qualifications, spiritual journey..."
                value={form.fullBio}
                onChange={(e) => setForm((f) => ({ ...f, fullBio: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Subjects Taught</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a subject and press Enter"
                  value={newTeach}
                  onChange={(e) => setNewTeach(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); handleAddTeach(); }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTeach}>
                  Add
                </Button>
              </div>
              {form.teaches.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.teaches.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTeach(tag)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isBusy}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isBusy}>
              {isBusy ? "Saving..." : editingId ? "Save Changes" : "Create Instructor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(v) => !v && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Instructor?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this instructor from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteConfirmId !== null && handleDelete(deleteConfirmId)}
              disabled={deleteInstructor.isPending}
            >
              {deleteInstructor.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
