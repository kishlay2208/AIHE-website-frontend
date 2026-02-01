import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSystemUsers } from "@/services/queries";

export default function UserManagement() {
  const { data: usersData, isLoading } = useSystemUsers();
  const systemUsers = usersData?.data || [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between"><div><h2 className="text-2xl font-bold text-foreground">User Management</h2><p className="text-muted-foreground">Manage system users and roles.</p></div><Button>Add User</Button></div>
      {isLoading ? (
        <div className="text-center py-12">Loading users...</div>
      ) : systemUsers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No users found.
        </div>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg">All Users</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead><TableHead className="text-center">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {systemUsers.map((user: any) => (<TableRow key={user.id}><TableCell><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></TableCell><TableCell><Badge variant={user.role === "superadmin" ? "destructive" : user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge></TableCell><TableCell><Badge variant={user.status === "active" ? "outline" : "secondary"}>{user.status}</Badge></TableCell><TableCell>{user.joinedDate}</TableCell><TableCell className="text-center"><Button size="sm" variant="outline">Edit</Button></TableCell></TableRow>))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
