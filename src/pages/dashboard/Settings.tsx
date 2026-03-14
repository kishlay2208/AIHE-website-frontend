import { useState, useEffect } from "react";
import { User, Bell, Lock, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateProfile } from "@/services/queries";

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [counselorName, setCounselorName] = useState("");
  const [templeAffiliation, setTempleAffiliation] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setPhone((user as any).phone ?? "");
      setCounselorName((user as any).counselor_name ?? "");
      setTempleAffiliation((user as any).temple_affiliation ?? "");
      setMailingAddress((user as any).mailing_address ?? "");
    }
  }, [user]);

  const handleSaveProfile = () => {
    updateProfile.mutate(
      {
        name: name || undefined,
        phone: phone || undefined,
        counselor_name: counselorName || undefined,
        temple_affiliation: templeAffiliation || undefined,
        mailing_address: mailingAddress || undefined,
      },
      {
        onSuccess: () => {
          refreshUser();
        },
      }
    );
  };

  return (
    <div className="space-y-6 min-w-0">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences.</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </div>
          <CardDescription>Update your personal and devotional details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email ?? ""} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="counselor">Counselor Name</Label>
            <Input
              id="counselor"
              value={counselorName}
              onChange={(e) => setCounselorName(e.target.value)}
              placeholder="Your counselor's name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temple">Temple Affiliation</Label>
            <Input
              id="temple"
              value={templeAffiliation}
              onChange={(e) => setTempleAffiliation(e.target.value)}
              placeholder="Temple or center name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mailing">Mailing Address</Label>
            <Input
              id="mailing"
              value={mailingAddress}
              onChange={(e) => setMailingAddress(e.target.value)}
              placeholder="Full mailing address"
            />
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
          {updateProfile.isSuccess && (
            <p className="text-sm text-green-600">Profile updated successfully.</p>
          )}
          {updateProfile.isError && (
            <p className="text-sm text-destructive">Failed to update. Try again.</p>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Notifications</CardTitle>
          </div>
          <CardDescription>Configure how you receive updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive course updates via email</p>
            </div>
            <Switch defaultChecked className="shrink-0" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-foreground">Session Reminders</p>
              <p className="text-sm text-muted-foreground">Get reminded before live sessions</p>
            </div>
            <Switch defaultChecked className="shrink-0" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-foreground">Assessment Deadlines</p>
              <p className="text-sm text-muted-foreground">Alerts for upcoming submissions</p>
            </div>
            <Switch defaultChecked className="shrink-0" />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Security</CardTitle>
          </div>
          <CardDescription>Manage your account security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" className="shrink-0">Enable</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-foreground">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
            <Button variant="outline" className="shrink-0">Change</Button>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Language & Region</CardTitle>
          </div>
          <CardDescription>Set your preferred language.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-foreground">Display Language</p>
              <p className="text-sm text-muted-foreground">English (India)</p>
            </div>
            <Button variant="outline" className="shrink-0">Change</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
