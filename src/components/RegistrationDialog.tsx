import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course } from "@/types";
import { Calendar, Clock, User, IndianRupee, Upload, FileText } from "lucide-react";

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  onAddToCart: (registration: RegistrationData) => void;
}

export interface RegistrationData {
  course: Course;
  registrantType: "self" | "others";
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  counselorName?: string;
  recommendingTemple?: string;
  chantingSince?: string;
  language?: string;
  initiatedName?: string;
  idcCompletionDate?: string;
  homeAddress?: string;
}

const RegistrationDialog = ({
  open,
  onOpenChange,
  course,
  onAddToCart,
}: RegistrationDialogProps) => {
  const [registrantType, setRegistrantType] = useState<"self" | "others">("self");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    counselorName: "",
    recommendingTemple: "",
    chantingSince: "",
    language: "Hindi",
    initiatedName: "",
    idcCompletionDate: "",
    homeAddress: "",
  });

  if (!course) return null;

  const isIDC = course.type === "idc";
  const isBhaktiShastri = course.type === "bhakti-shastri";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart({
      course,
      registrantType,
      ...formData,
    });
    onOpenChange(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Register for {course.title}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">{course.subtitle}</p>
        </DialogHeader>

        {/* Course Summary */}
        <div className="bg-secondary/50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{course.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span className="font-bold">{course.fee.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Registration Type */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={registrantType === "self"}
                onCheckedChange={() => setRegistrantType("self")}
              />
              <span>Register for Self</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={registrantType === "others"}
                onCheckedChange={() => setRegistrantType("others")}
              />
              <span>Register for Others</span>
            </label>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email ID *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                placeholder="WhatsApp number (if different)"
              />
            </div>
          </div>

          {/* IDC Specific Fields */}
          {isIDC && (
            <>
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-4 text-foreground">IDC Specific Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="counselorName">Counselor Name *</Label>
                    <Input
                      id="counselorName"
                      value={formData.counselorName}
                      onChange={(e) => updateField("counselorName", e.target.value)}
                      placeholder="Name of your counselor"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recommendingTemple">Recommending Temple *</Label>
                    <Input
                      id="recommendingTemple"
                      value={formData.recommendingTemple}
                      onChange={(e) => updateField("recommendingTemple", e.target.value)}
                      placeholder="Name of ISKCON temple"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="chantingSince">Chanting 16 rounds since? *</Label>
                    <Textarea
                      id="chantingSince"
                      value={formData.chantingSince}
                      onChange={(e) => updateField("chantingSince", e.target.value)}
                      placeholder="How many rounds are you chanting and since when?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language Preference</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => updateField("language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recommendation">Recommendation Letter</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload PDF or Image</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bhakti Shastri Specific Fields */}
          {isBhaktiShastri && (
            <>
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-4 text-foreground">Bhakti Shastri Specific Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initiatedName">Initiated Name (if applicable)</Label>
                    <Input
                      id="initiatedName"
                      value={formData.initiatedName}
                      onChange={(e) => updateField("initiatedName", e.target.value)}
                      placeholder="Your initiated name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idcCompletionDate">IDC Completion Date *</Label>
                    <Input
                      id="idcCompletionDate"
                      type="date"
                      value={formData.idcCompletionDate}
                      onChange={(e) => updateField("idcCompletionDate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IDC Certificate *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <FileText className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload IDC Certificate (PDF)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Recommendation Letter</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload Recommendation (PDF)</p>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="homeAddress">Home Address *</Label>
                    <Textarea
                      id="homeAddress"
                      value={formData.homeAddress}
                      onChange={(e) => updateField("homeAddress", e.target.value)}
                      placeholder="Enter your complete home address"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Submit */}
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="orange" className="flex-1">
              Add to Cart - ₹{course.fee.toLocaleString()}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;
