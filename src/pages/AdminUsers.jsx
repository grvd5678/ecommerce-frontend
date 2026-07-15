import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const USER_ID_REGEX = /^[a-f0-9]{24}$/i;
const ALLOWED_ROLES = ['user', 'admin'];

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api.get('/admin/users')
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const updateUserRole = async (userId, newRole) => {
    if (!USER_ID_REGEX.test(userId)) {
      console.error('Invalid user ID format');
      return;
    }
    if (!ALLOWED_ROLES.includes(newRole)) {
      console.error('Invalid role value');
      return;
    }
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!USER_ID_REGEX.test(userId)) {
      console.error('Invalid user ID format');
      return;
    }
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (user?.role !== 'admin') return <div className="text-center py-8">Access Denied</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-200 rounded" />)}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['User', 'Role', 'Verified', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{u.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold ${u.isVerified ? 'text-green-600' : 'text-red-500'}`}>
                        {u.isVerified ? '✓ Verified' : '✗ Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u._id, e.target.value)}
                          disabled={u._id === user?._id}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        {u._id !== user?._id && (
                          <button onClick={() => deleteUser(u._id)} className="text-red-600 hover:text-red-900 text-sm">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6">
            {[
              { label: 'Total Users', value: users.length, color: 'text-blue-600' },
              { label: 'Admin Users', value: users.filter(u => u.role === 'admin').length, color: 'text-purple-600' },
              { label: 'Verified Users', value: users.filter(u => u.isVerified).length, color: 'text-green-600' }
            ].map(stat => (
              <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</h3>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsers;
