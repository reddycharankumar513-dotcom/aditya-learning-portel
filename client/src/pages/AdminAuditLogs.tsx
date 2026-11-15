import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService, AuditLogItem } from '../services/adminService';
import { 
  History, Search, Filter, Shield, Eye, 
  RefreshCw, X, ArrowRight 
} from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  useEffect(() => {
    loadLogs();
  }, [actionFilter, page]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs({
        action: actionFilter,
        page: page.toString(),
      });
      setLogs(res.logs);
      setTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      console.warn('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Administrative Audit Trail & Security Ledger"
      subtitle="Immutable event logs recording administrative modifications, role escalations, and financial adjustments"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#151D35] border border-white/10">
        <div className="flex items-center gap-3">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
          >
            <option value="all">All Audited Actions</option>
            <option value="USER_SUSPEND">User Suspension</option>
            <option value="USER_REACTIVATE">User Reactivation</option>
            <option value="CREDITS_MANUAL_ADJUSTMENT">Credits Adjustment</option>
            <option value="PLAN_CREATE">Plan Created</option>
            <option value="PLAN_UPDATE">Plan Updated</option>
            <option value="PAYMENT_REFUND_PROCESSED">Refund Processed</option>
            <option value="AI_SCORING_WEIGHTS_UPDATE">AI Rubric Updated</option>
            <option value="PLATFORM_SETTINGS_UPDATE">Settings Modified</option>
          </select>

          <button
            onClick={loadLogs}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A6B0C8] hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="text-xs text-[#A6B0C8] font-mono">
          Security standard: Passwords & secrets permanently redacted
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-[#151D35] border border-white/10 overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10162A] border-b border-white/10 text-[#A6B0C8] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Administrator</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-[#A6B0C8] text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-white font-sans">
                      <p className="font-semibold">{log.adminEmail}</p>
                      <p className="text-[10px] text-[#8065FF] uppercase font-mono">{log.adminRole}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#8065FF]/10 text-[#8065FF] border border-[#8065FF]/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#32C8F5] text-xs font-sans">
                      <p className="font-semibold">{log.resourceType}</p>
                      {log.resourceId && <p className="text-[10px] font-mono text-[#A6B0C8] truncate max-w-[120px]">{log.resourceId}</p>}
                    </td>
                    <td className="px-6 py-4 text-[#A6B0C8] text-[11px]">
                      {log.ipAddress || 'Internal'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#32C8F5] font-sans font-semibold text-[11px] flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#A6B0C8] font-sans">
                    No audit records found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A6B0C8]">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inspect Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-mono">{selectedLog.action}</h3>
                <p className="text-xs text-[#A6B0C8]">
                  By {selectedLog.adminEmail} on {new Date(selectedLog.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-[#A6B0C8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Before Value */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#A6B0C8] uppercase font-sans">Before Value</h4>
                <pre className="p-3 rounded-xl bg-[#10162A] border border-white/5 overflow-x-auto text-[11px] text-[#A6B0C8] max-h-60">
                  {JSON.stringify(selectedLog.beforeValue || 'None', null, 2)}
                </pre>
              </div>

              {/* After Value */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#30D6A0] uppercase font-sans">After Value</h4>
                <pre className="p-3 rounded-xl bg-[#10162A] border border-white/5 overflow-x-auto text-[11px] text-white max-h-60">
                  {JSON.stringify(selectedLog.afterValue || 'None', null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-[#A6B0C8] hover:text-white"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
