import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSystemUsers, useUpdateUser } from "@/services/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserManagement() {
  const { data: usersData, isLoading } = useSystemUsers();
  const updateUser = useUpdateUser();
  const systemUsers = usersData?.data ?? [];
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState<string>("");

  const handleSaveRole = (userId: number) => {
    updateUser.mutate(
      { userId: String(userId), data: { role: editRole } },
      { onSuccess: () => setEditingId(null) }
    );
  };

  const handleRevoke = (userId: number) => {
    updateUser.mutate(
      { userId: String(userId), data: { is_active: false } },
      { onSuccess: () => setEditingId(null) }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">User Management</h2>
        <p className="text-muted-foreground">Manage system users and roles.</p>
      </div>
      {isLoading ? (
        <div className="text-center py-12">Loading users...</div>
      ) : systemUsers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No users found.</div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg">All Users</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemUsers.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </TableCell>
                    <TableCell>
                      {editingId === user.id ? (
                        <div className="flex items-center gap-2">
                          <Select value={editRole} onValueChange={setEditRole}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">user</SelectItem>
                              <SelectItem value="admin">admin</SelectItem>
                              <SelectItem value="superadmin">superadmin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" onClick={() => handleSaveRole(user.id)} disabled={updateUser.isPending}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <Badge variant={user.role === "superadmin" ? "destructive" : user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" && user.is_active !== false ? "outline" : "secondary"}>
                        {user.is_active === false ? "inactive" : (user.status ?? "active")}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joinedDate ?? user.created_at?.slice?.(0, 10) ?? "—"}</TableCell>
                    <TableCell className="text-center">
                      {editingId === user.id ? null : (
                        <div className="flex justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingId(user.id); setEditRole(user.role ?? "user"); }}>Edit</Button>
                          {user.role !== "superadmin" && user.is_active !== false && (
                            <Button size="sm" variant="destructive" onClick={() => handleRevoke(user.id)} disabled={updateUser.isPending}>Revoke</Button>
                          )}
                        </div>
                      )}
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
