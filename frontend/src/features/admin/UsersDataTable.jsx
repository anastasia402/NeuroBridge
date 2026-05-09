import React from 'react';
import Badge from '../../components/common/Badge';

export default function UsersDataTable() {
  const users = [
    { id: 1, name: 'Alex Chen', dept: 'Data Science', score: '84%', quizzes: 12, status: 'Active' },
    { id: 2, name: 'Sarah Jenkins', dept: 'Backend', score: '92%', quizzes: 28, status: 'Active' },
    { id: 3, name: 'Jordan Bridge', dept: 'Frontend', score: '45%', quizzes: 3, status: 'Inactive' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Junior Progress</h2>
        <input type="text" placeholder="Search junior..." className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold cursor-pointer hover:bg-gray-100">Junior Name ↕</th>
              <th className="p-4 font-bold cursor-pointer hover:bg-gray-100">Department ↕</th>
              <th className="p-4 font-bold cursor-pointer hover:bg-gray-100">Average Score ↕</th>
              <th className="p-4 font-bold">Completed Quizzes</th>
              <th className="p-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="p-4 font-medium text-gray-900">{user.name}</td>
                <td className="p-4 text-gray-600">{user.dept}</td>
                <td className="p-4 font-bold text-blue-600">{user.score}</td>
                <td className="p-4 text-gray-600">{user.quizzes}</td>
                <td className="p-4">
                  <Badge text={user.status} variant={user.status === 'Active' ? 'success' : 'default'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}