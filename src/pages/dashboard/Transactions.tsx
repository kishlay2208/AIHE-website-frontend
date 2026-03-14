import { CreditCard, CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTransactions } from "@/services/queries";

export default function Transactions() {
  const { data: transactionsData, isLoading } = useTransactions();
  const transactions = transactionsData?.data ?? [];
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null;
  const openReceipt = (transactionId: number) => {
    if (!token) return;
    const url = `${apiBase}/students/transactions/${transactionId}/receipt`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.text())
      .then((html) => {
        const w = window.open("", "_blank");
        if (w) {
          w.document.write(html);
          w.document.close();
        }
      });
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default" as const;
      case "pending":
        return "secondary" as const;
      case "failed":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  const totalAmount = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center py-12">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No transactions found.
        </div>
      ) : (
        <>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
        <p className="text-muted-foreground">Your payment history and invoices.</p>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-primary/20">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-3xl font-bold text-foreground">
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction: any) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-muted-foreground">
                    {transaction.date ?? transaction.transaction_date?.slice?.(0, 10)}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ₹{Number(transaction.amount ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(transaction.status)} className="gap-1">
                      {getStatusIcon(transaction.status)}
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => openReceipt(transaction.id)}
                    >
                      <FileText className="h-4 w-4" />
                      Generate Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}
