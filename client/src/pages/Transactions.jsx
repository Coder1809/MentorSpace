import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { api } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldCheck, Receipt } from "lucide-react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get("/payment");
        if (data.success) setTransactions(data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((txn) => {
    const term = searchTerm.toLowerCase();
    return (
      (txn.orderID || "").toLowerCase().includes(term) ||
      (txn.paymentID || "").toLowerCase().includes(term) ||
      (txn.status || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Payments & <span className="gradient-text">Transactions Ledger</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete transaction history and signature verified Razorpay payment receipts.
          </p>
        </div>
        <Badge className="badge-glowing px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Razorpay HMAC Verified
        </Badge>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by Payment ID, Order ID, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 rounded-2xl h-11 bg-slate-900/80 border-white/10 text-white shadow-lg focus:border-indigo-500 text-sm"
        />
      </div>

      {/* Table Container */}
      <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900/80 border-b border-white/10">
            <TableRow>
              <TableHead className="font-bold text-slate-300">Date</TableHead>
              <TableHead className="font-bold text-slate-300">Item / Goal</TableHead>
              <TableHead className="font-bold text-slate-300">Amount (₹)</TableHead>
              <TableHead className="font-bold text-slate-300">Payment ID</TableHead>
              <TableHead className="font-bold text-slate-300">Order ID</TableHead>
              <TableHead className="font-bold text-slate-300">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400 italic">
                  <Receipt className="w-10 h-10 mx-auto text-slate-500 mb-2" />
                  No payment transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((txn) => (
                <TableRow key={txn._id} className="hover:bg-white/5 border-b border-white/5 transition-colors">
                  <TableCell className="font-semibold text-slate-300">
                    {format(new Date(txn.createdAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="font-bold text-white">
                    {txn.items && txn.items.length > 0 ? txn.items[0].name : "1-on-1 Mentorship Session"}
                  </TableCell>
                  <TableCell className="font-extrabold text-emerald-400">
                    ₹{txn.amount > 1000 ? (txn.amount / 100).toLocaleString() : txn.amount}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-indigo-400 truncate max-w-[150px]">
                    {txn.paymentID || txn.paymentId}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-400 truncate max-w-[150px]">
                    {txn.orderID || txn.orderId}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`font-bold text-xs px-3 py-1 rounded-full ${
                        txn.status === "success"
                          ? "badge-glowing"
                          : "bg-red-500/15 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {txn.status === "success" ? "Verified" : txn.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Transactions;
