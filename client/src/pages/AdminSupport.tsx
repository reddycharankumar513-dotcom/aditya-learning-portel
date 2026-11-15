import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService, SupportTicketItem } from '../services/adminService';
import { 
  MessageSquare, Search, Filter, AlertCircle, 
  CheckCircle2, Clock, Send, Shield, RefreshCw, X 
} from 'lucide-react';

export const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadTickets();
  }, [statusFilter, priorityFilter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSupportTickets({
        status: statusFilter,
        priority: priorityFilter,
      });
      setTickets(res.tickets);
    } catch (err) {
      console.warn('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTicket = async (ticket: SupportTicketItem) => {
    try {
      const res = await adminService.getSupportTicketById(ticket._id);
      setSelectedTicket(res.ticket);
      setNewStatus(res.ticket.status);
    } catch (err) {
      alert('Could not fetch ticket details');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const res = await adminService.replySupportTicket(selectedTicket._id, {
        message: replyMessage,
        isInternal,
        newStatus: newStatus || undefined,
      });
      setSelectedTicket(res.ticket);
      setReplyMessage('');
      setIsInternal(false);
      loadTickets();
    } catch (err: any) {
      alert(err.message || 'Failed to submit response');
    }
  };

  return (
    <AdminLayout
      title="Support Ticketing & Student Helpdesk"
      subtitle="Triage student and employer inquiries, dispatch responses, and record internal troubleshooting notes"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Col 1: Ticket Queue Table / List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#151D35] border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_for_user">Waiting on User</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <button
              onClick={loadTickets}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A6B0C8] hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Tickets List */}
          <div className="rounded-2xl bg-[#151D35] border border-white/10 overflow-hidden divide-y divide-white/5 shadow-lg shadow-black/20">
            {tickets.length > 0 ? (
              tickets.map((t) => (
                <div
                  key={t._id}
                  onClick={() => handleOpenTicket(t)}
                  className={`p-4 hover:bg-white/[0.02] cursor-pointer transition-colors flex items-center justify-between ${
                    selectedTicket?._id === t._id ? 'bg-[#8065FF]/10 border-l-2 border-[#8065FF]' : ''
                  }`}
                >
                  <div className="space-y-1 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#8065FF]">{t.ticketId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.priority === 'critical'
                          ? 'bg-red-500/20 text-[#FF647C]'
                          : t.priority === 'high'
                          ? 'bg-amber-500/20 text-[#F4B860]'
                          : 'bg-white/10 text-slate-300'
                      }`}>
                        {t.priority}
                      </span>
                      <span className="text-[10px] text-[#A6B0C8] uppercase tracking-wider">{t.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">{t.subject}</h4>
                    <p className="text-xs text-[#A6B0C8] truncate">{t.description}</p>
                    <p className="text-[10px] text-[#A6B0C8]/60">From {t.userName} ({t.userEmail})</p>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'open'
                        ? 'bg-emerald-500/20 text-[#30D6A0]'
                        : t.status === 'resolved'
                        ? 'bg-white/10 text-[#A6B0C8]'
                        : 'bg-[#32C8F5]/20 text-[#32C8F5]'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                    <p className="text-[10px] font-mono text-[#A6B0C8] mt-1">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-xs text-[#A6B0C8]">
                No support tickets found in this queue.
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Active Conversation & Reply Thread */}
        <div className="p-6 rounded-2xl bg-[#151D35] border border-white/10 flex flex-col justify-between h-[650px]">
          {selectedTicket ? (
            <>
              {/* Ticket Header */}
              <div className="border-b border-white/10 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#8065FF]">{selectedTicket.ticketId}</span>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="bg-[#10162A] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_for_user">Waiting on User</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">{selectedTicket.subject}</h3>
                <p className="text-xs text-[#A6B0C8]">{selectedTicket.description}</p>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
                {selectedTicket.replies && selectedTicket.replies.length > 0 ? (
                  selectedTicket.replies.map((reply, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        reply.isInternal
                          ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200'
                          : reply.sender === 'admin'
                          ? 'bg-[#8065FF]/10 border border-[#8065FF]/20 text-white ml-4'
                          : 'bg-white/5 border border-white/5 text-[#F5F7FF] mr-4'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] text-[#A6B0C8]">
                        <span className="font-bold">{reply.senderName} {reply.isInternal && '(Internal Note)'}</span>
                        <span>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p>{reply.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-[#A6B0C8] py-8">No responses yet on this ticket.</p>
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="border-t border-white/10 pt-4 space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder={isInternal ? 'Write an internal note (only visible to admins)...' : 'Write a response to the user...'}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-[#A6B0C8] focus:outline-none"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-[#A6B0C8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    <span>Internal Note</span>
                  </label>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#A6B0C8] space-y-2">
              <MessageSquare className="w-8 h-8 text-white/20" />
              <p className="text-xs">Select a ticket from the queue to review and respond.</p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
