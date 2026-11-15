import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService, PaymentItem, RefundItem } from '../services/adminService';
import { 
  FileText, Search, Download, AlertCircle, CheckCircle2, 
  Clock, ShieldAlert, RefreshCw, X 
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [activeTab, setActiveTab] = useState<'payments' | 'refunds'>('payments');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Refund Modal State
  const [refundModalPayment, setRefundModalPayment] = useState<PaymentItem | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [search, statusFilter, activeTab]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      if (activeTab === 'payments') {
        const res = await adminService.getPayments({
          search,
          status: statusFilter,
        });
        setPayments(res.payments);
      } else {
        const res = await adminService.getRefunds(statusFilter);
        setRefunds(res.refunds);
      }
    } catch (err) {
      console.warn('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      window.open('/api/admin/payments/export', '_blank');
    } catch (err: any) {
      alert('Could not download CSV export.');
    }
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalPayment) return;
    try {
      await adminService.processRefund({
        paymentId: refundModalPayment._id,
        amount: refundAmount,
        reason: refundReason,
        adminNotes,
      });
      alert(`Refund of ₹${refundAmount} successfully processed.`);
      setRefundModalPayment(null);
      setRefundReason('');
      setAdminNotes('');
      loadTransactions();
    } catch (err: any) {
      alert(err.message || 'Refund processing failed');
    }
  };

  return (
    <AdminLayout
      title="Financial Transactions & Payment Auditing"
      subtitle="Inspect Razorpay payment orders, webhook confirmations, and authorized customer refunds"
      actions={
        <div className="flex items-center gap-3">
          <div className="flex bg-[#151D35] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'payments' ? 'bg-[#8065FF] text-white' : 'text-[#A6B0C8] hover:text-white'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('refunds')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'refunds' ? 'bg-[#8065FF] text-white' : 'text-[#A6B0C8] hover:text-white'
              }`}
            >
              Refunds Log
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10"
          >
            <Download className="w-4 h-4 text-[#32C8F5]" />
            <span>Export CSV</span>
          </button>
        </div>
      }
    >
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#151D35] border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A6B0C8] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search order ID, payment ID, or student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-[#A6B0C8] focus:outline-none focus:border-[#8065FF]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed / Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <button
            onClick={loadTransactions}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A6B0C8] hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      {activeTab === 'payments' && (
        <div className="rounded-2xl bg-[#151D35] border border-white/10 overflow-hidden shadow-lg shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10162A] border-b border-white/10 text-[#A6B0C8] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Transaction / Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Item Purchased</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono">
                        <p className="font-bold text-white text-xs">{p.razorpayOrderId || p._id}</p>
                        <p className="text-[10px] text-[#A6B0C8]">{p.razorpayPaymentId || 'Pending Checkout'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{p.user?.name || 'Student'}</p>
                        <p className="text-[10px] text-[#A6B0C8]">{p.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-[#F5F7FF]">
                        <span className="font-medium">{p.itemTitle || p.itemType}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white text-sm">
                        ₹{p.amount}
                      </td>
                      <td className="px-6 py-4">
                        {p.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-[#30D6A0] border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Success
                          </span>
                        ) : p.status === 'refunded' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-[#A68BFF] border border-purple-500/20">
                            Refunded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-[#F4B860] border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            {p.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-[#A6B0C8]">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {p.status === 'success' && (
                          <button
                            onClick={() => {
                              setRefundModalPayment(p);
                              setRefundAmount(p.amount);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[#FF647C] font-semibold text-[11px]"
                          >
                            Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#A6B0C8]">
                      No transactions recorded in this scope.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Refunds Table */}
      {activeTab === 'refunds' && (
        <div className="rounded-2xl bg-[#151D35] border border-white/10 overflow-hidden shadow-lg shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10162A] border-b border-white/10 text-[#A6B0C8] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Refund ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount Refunded</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Processed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {refunds.length > 0 ? (
                  refunds.map((rf) => (
                    <tr key={rf._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        {rf.razorpayRefundId || rf._id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{rf.userId?.name || 'Customer'}</p>
                        <p className="text-[10px] text-[#A6B0C8]">{rf.userId?.email}</p>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-[#FF647C] text-sm">
                        ₹{rf.amountINR}
                      </td>
                      <td className="px-6 py-4 text-[#F5F7FF] max-w-[200px] truncate">
                        {rf.reason}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-[#30D6A0] border border-emerald-500/20">
                          Processed
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-[#A6B0C8]">
                        {new Date(rf.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#A6B0C8]">
                      No refund records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Execution Modal */}
      {refundModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Authorize Razorpay Refund</h3>
              <button onClick={() => setRefundModalPayment(null)} className="text-[#A6B0C8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#A6B0C8]">
              Issuing refund for transaction <strong className="text-white font-mono">{refundModalPayment.razorpayOrderId}</strong> (₹{refundModalPayment.amount}).
            </p>

            <form onSubmit={handleProcessRefund} className="space-y-3 pt-2 text-xs">
              <div>
                <label className="text-[#A6B0C8] block mb-1">Refund Amount (INR ₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={refundModalPayment.amount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[#A6B0C8] block mb-1">Customer-Facing Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student request within 7-day guarantee..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-[#A6B0C8] block mb-1">Internal Admin Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Approved by Finance Admin"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRefundModalPayment(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A6B0C8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF647C] text-white font-bold"
                >
                  Process Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
