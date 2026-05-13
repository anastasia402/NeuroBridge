import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { apiGet, apiPost, apiPut, apiDelete } from '../../services/authService';

const ROLES = ['JUNIOR', 'MENTOR', 'ADMIN'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [progressUser, setProgressUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const pageSize = 10;

  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'JUNIOR' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, pageSize, ...(search && { search }), ...(roleFilter && { role: roleFilter }) });
      const data = await apiGet(`/api/admin/users?${params}`);
      setUsers(data.items || []);
      setTotal(data.totalCount || 0);
    } catch { setUsers([]); }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiPost('/api/admin/users', form);
      setShowCreate(false);
      setForm({ fullName: '', email: '', password: '', role: 'JUNIOR' });
      load();
    } catch (err) { alert(err.message || 'Error creating user'); }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiPut(`/api/admin/users/${userId}/role`, { role: newRole });
      load();
    } catch (err) { alert(err.message || 'Error'); }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      if (isActive) {
        await apiDelete(`/api/admin/users/${userId}`);
      } else {
        await apiPost(`/api/admin/users/${userId}/activate`, {});
      }
      load();
    } catch (err) { alert(err.message || 'Error'); }
  };

  const handleViewProgress = async (user) => {
    setProgressUser(user);
    setProgress(null);
    try {
      const data = await apiGet(`/api/admin/users/${user.id}/progress`);
      setProgress(data);
    } catch { setProgress({}); }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <PageWrapper role="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500 mt-1">{total} total users</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700"
          >
            + New User
          </button>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                      {(u.fullName || u.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{u.fullName || '—'}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {u.role === 'JUNIOR' && (
                      <button
                        onClick={() => handleViewProgress(u)}
                        className="text-xs text-blue-600 font-semibold px-2 py-1 border border-blue-200 rounded-lg hover:bg-blue-50"
                      >
                        Progress
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleActive(u.id, u.isActive)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border ${
                        u.isActive
                          ? 'text-red-600 border-red-200 hover:bg-red-50'
                          : 'text-green-600 border-green-200 hover:bg-green-50'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
                {!u.isActive && (
                  <div className="mt-2 text-xs text-red-500 font-medium">⚠ Deactivated</div>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40">←</button>
            <span className="px-3 py-1 text-sm text-gray-600">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40">→</button>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create User</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input required placeholder="Full Name" value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input required type="email" placeholder="Email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input required type="password" placeholder="Password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {progressUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{progressUser.fullName}</h2>
            <p className="text-sm text-gray-500 mb-4">Learning Progress</p>
            {!progress ? (
              <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quizzes Completed</span>
                  <span className="font-bold text-gray-900">{progress.quizzesCompleted ?? 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Score</span>
                  <span className="font-bold text-gray-900">{progress.avgScore != null ? `${Math.round(progress.avgScore)}%` : '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">XP</span>
                  <span className="font-bold text-gray-900">{progress.xp ?? 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Streak</span>
                  <span className="font-bold text-gray-900">{progress.streak ?? 0} days</span>
                </div>
              </div>
            )}
            <button onClick={() => setProgressUser(null)}
              className="mt-5 w-full py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600">
              Close
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
