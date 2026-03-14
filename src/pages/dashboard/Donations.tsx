import { useState } from "react";
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
import { useDonations, useDonationCauses } from "@/services/queries";
import { apiClient } from "@/services/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export default function Donations() {
  const { data: donationsData, isLoading, refetch } = useDonations();
  const { data: causesData } = useDonationCauses();
  const donations = donationsData?.data ?? [];
  const causes = causesData?.data ?? [];
  const totalDonated = donations.reduce((sum: number, d: any) => sum + Number(d.amount), 0);

  const [generalAmount, setGeneralAmount] = useState("");
  const [paying, setPaying] = useState(false);

  const handleDonate = async (amount: number, causeId: string) => {
    if (amount < 1) return;
    setPaying(true);
    try {
      const orderData = await apiClient.createDonationOrder(amount, causeId);
      await loadRazorpay();
      const options = {
        key: orderData.key_id,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: "AIHE - ISKCON Ujjain",
        description: "Donation",
        handler: async (response: any) => {
          try {
            await apiClient.verifyDonation({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderData.amount,
              cause: causeId,
            });
            refetch();
          } catch {
            // show error
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setPaying(false);
      if ((e as any)?.response?.status === 503) {
        alert("Payments are not configured. Please try later.");
      } else {
        alert("Could not start payment. Try again.");
      }
    }
  };

  const presetAmounts: Record<string, number> = {
    "tribal-preaching": 500,
    "midday-meals": 500,
    general: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Donations</h2>
          <p className="text-muted-foreground">Your contributions to ISKCON Ujjain.</p>
        </div>
      </div>

      {/* Cause slabs */}
      {causes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {causes.map((cause: any) => (
            <Card key={cause.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">{cause.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{cause.description}</p>
              </CardHeader>
              <CardContent>
                {cause.id === "general" ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Amount (₹)"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={generalAmount}
                      onChange={(e) => setGeneralAmount(e.target.value)}
                    />
                    <Button
                      className="gap-2 w-full"
                      disabled={paying || !generalAmount || Number(generalAmount) < 1}
                      onClick={() => handleDonate(Number(generalAmount), cause.id)}
                    >
                      <Plus className="h-4 w-4" />
                      {paying ? "Opening..." : "Donate"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="gap-2 w-full"
                    disabled={paying}
                    onClick={() => handleDonate(presetAmounts[cause.id] ?? 500, cause.id)}
                  >
                    <Heart className="h-4 w-4" />
                    {paying ? "Opening..." : `Donate ₹${presetAmounts[cause.id] ?? 500}`}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
                    <TableCell>{donation.date ?? donation.donation_date?.slice?.(0, 10)}</TableCell>
                    <TableCell>{donation.purpose ?? "—"}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{Number(donation.amount ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {donation.receipt ? (
                        <Badge variant="secondary">{donation.receipt}</Badge>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
