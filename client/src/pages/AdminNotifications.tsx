import React, { useState } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService } from '../services/adminService';
import { 
  Bell, Send, Users, ShieldAlert, Sparkles, 
  CheckCircle2, Mail, Info 
} from 'lucide-react';

export const AdminNotifications: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'announcement' | 'feature' | 'maintenance' | 'offer'>('announcement');
  const [targetRole, setTargetRole] = useState<'all' | 'student' | 'employer'>('all');
  const [targetPlan, setTargetPlan] = useState<'all' | 'FREE' | 'STARTER' | 'PRO' | 'PREMIUM'>('all');
  const [deliveryChannel, setDeliveryChannel] = useState<'in_app' | 'email' | 'both'>('in_app');
  const [sending, setSending] = useState(false);
  const [lastDispatched, setLastDispatched] = useState<any | null>(null);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setSending(true);
      const res = await adminService.createBroadcastNotification({
        title,
        message,
        type,
        targetRole,
        targetPlan,
        deliveryChannel,
      });

      setLastDispatched(res.notification);
      alert(res.message || 'Broadcast notification dispatched!');
      setTitle('');
      setMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch broadcast');
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout
      title="Broadcast Announcements & Targeted Notifications"
      subtitle="Dispatch real-time in-app banners, maintenance alerts, and targeted email notifications"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Col 1 & 2: Broadcast Composer */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8065FF]/10 text-[#8065FF] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Compose Targeted Broadcast
              </h3>
              <p className="text-xs text-[#A6B0C8]">Select audience segmentation and dispatch message</p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 pt-2 text-xs">
            <div>
              <label className="text-[#A6B0C8] block mb-1">Announcement Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Scheduled Maintenance Notice or New AI Coding Sandbox Live"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[#A6B0C8] block mb-1">Message Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#10162A] border border-white/10 text-white"
                >
                  <option value="announcement">General Announcement</option>
                  <option value="feature">New Feature Release</option>
                  <option value="maintenance">Maintenance Notice</option>
                  <option value="offer">Promotional Offer</option>
                </select>
              </div>

              <div>
                <label className="text-[#A6B0C8] block mb-1">Target Audience</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#10162A] border border-white/10 text-white"
                >
                  <option value="all">All Platform Users</option>
                  <option value="student">Students Only</option>
                  <option value="employer">Employers Only</option>
                </select>
              </div>

              <div>
                <label className="text-[#A6B0C8] block mb-1">Target Subscription</label>
                <select
                  value={targetPlan}
                  onChange={(e) => setTargetPlan(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#10162A] border border-white/10 text-white"
                >
                  <option value="all">All Plan Tiers</option>
                  <option value="FREE">Free Explorer Users</option>
                  <option value="PRO">Pro Subscribers</option>
                  <option value="PREMIUM">Elite Subscribers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[#A6B0C8] block mb-1">Notification Body</label>
              <textarea
                rows={4}
                required
                placeholder="Compose announcement body..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <div className="flex items-center gap-4 text-xs text-[#A6B0C8]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="channel"
                    checked={deliveryChannel === 'in_app'}
                    onChange={() => setDeliveryChannel('in_app')}
                  />
                  <span>In-App Banner</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="channel"
                    checked={deliveryChannel === 'both'}
                    onChange={() => setDeliveryChannel('both')}
                  />
                  <span>In-App & Email</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-md shadow-[#8065FF]/20 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Dispatching...' : 'Dispatch Announcement'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Col 3: Live Preview & Delivery State */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Preview
            </h3>
            <p className="text-xs text-[#A6B0C8]">How users see this in their console</p>

            <div className="p-4 rounded-xl bg-[#10162A] border border-[#8065FF]/30 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#32C8F5] animate-ping" />
                <span className="font-bold text-white text-sm">{title || 'Sample Announcement Title'}</span>
              </div>
              <p className="text-[#A6B0C8] text-xs leading-relaxed">
                {message || 'This is how your broadcast message will render to students and employers on their dashboard top header.'}
              </p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-[#A6B0C8]/60 font-mono">
                <span>Audience: {targetRole} ({targetPlan})</span>
                <span>Just Now</span>
              </div>
            </div>
          </div>

          {lastDispatched && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Successfully Dispatched</span>
              </div>
              <p className="text-[#A6B0C8]">
                Delivered to <strong className="text-white">{lastDispatched.recipientCount}</strong> users.
              </p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
