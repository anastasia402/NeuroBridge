import React, { useState, useEffect } from 'react';
import { apiGet } from '../../services/authService';

function ScoreBadge({ score }) {
  if (score === 0) return <span className="text-xs text-gray-400">—</span>;
  const color = score >= 80 ? 'text-green-700 bg-green-50' : score >= 60 ? 'text-blue-700 bg-blue-50' : 'text-red-700 bg-red-50';
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${color}`}>{score}%</span>;
}

export default function UsersDataTable() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    apiGet('/admin/dashboard/recent-users')
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Junior Progress</h2>
          <p className="text-xs text-gray-400 mt-0.5">{filtered.length} learners</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-40"
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Se încarcă...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Niciun junior găsit.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-6 py-3">Utilizator</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">XP</th>
                <th className="px-6 py-3">Quiz-uri</th>
                <th className="px-6 py-3">Scor Mediu</th>
                <th className="px-6 py-3">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {(user.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-sm text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-700">Lv. {user.level}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {user.xp.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {user.quizzesTaken}
                  </td>
                  <td className="px-6 py-4">
                    <ScoreBadge score={user.avgScore} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-orange-600">
                      {user.streak > 0 ? `🔥 ${user.streak}d` : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
