import { Heart, Receipt, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDonations } from "@/services/queries";

export default function Donations() {
  const { data: donationsData, isLoading } = useDonations();
  const donations = donationsData?.data || [];
  const totalDonated = donations.reduce((sum: number, d: any) => sum + Number(d.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Donations</h2>
          <p className="text-muted-foreground">Your contributions to ISKCON Ujjain.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Make Donation
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-primary/20">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Contributions</p>
              <p className="text-3xl font-bold text-foreground">
                ₹{totalDonated.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donation History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          {donations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation: any) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.date}</TableCell>
                    <TableCell>{donation.purpose}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{donation.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {donation.receipt ? (
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Receipt className="h-4 w-4" />
                          {donation.receipt}
                        </Button>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isLoading ? "Loading donations..." : "No donations yet"}
              </p>
              {!isLoading && (
                <Button variant="outline" className="mt-4">
                  Make Your First Donation
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
