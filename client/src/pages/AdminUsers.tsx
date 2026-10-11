import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { adminService } from '../services/adminService';
import { User } from '../types';
import { Users, Search, Shield, RefreshCw } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      setUsers(res.users);
    } catch (err) {
      console.warn('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole as any } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              User Directory &amp; Roles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Audit registered student accounts and assign administrator or instructor permissions.
            </p>
          </div>

          <button
            onClick={loadUsers}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">Name</th>
                    <th className="pb-3 px-3">Email</th>
                    <th className="pb-3 px-3">Country / Status</th>
                    <th className="pb-3 px-3">Interests</th>
                    <th className="pb-3 px-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-slate-400 text-[10px]">
                          Joined {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{u.email}</td>
                      <td className="py-3 px-3">
                        <span>{u.country || 'Not specified'}</span>
                        <span className="block text-slate-400 text-[10px]">{u.educationStatus}</span>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {u.learningInterests?.map((item, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px]">
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};
