import React, { useEffect, useState } from "react";
import Table2 from "../../../Components/Table2";
import SideBar from "../SideBar";
import api from "../../../utils/api";
import { FiTrash2, FiUserX, FiUserCheck } from "react-icons/fi";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch users from backend
      const { data } = await api.get('/users');
      setUsers(data || []);

      // Calculate quick stats
      const activeUsers = data?.filter(u => u.accountStatus === 'active').length || 0;
      const bannedUsers = data?.filter(u => u.banned).length || 0;
      const pendingUsers = data?.filter(u => u.accountStatus === 'pending').length || 0;

      setStats({
        total: data?.length || 0,
        active: activeUsers,
        banned: bannedUsers,
        pending: pendingUsers
      });

      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleBanToggle = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus ? `/users/${userId}/unban` : `/users/${userId}/ban`;
      await api.put(endpoint);

      // Refresh users
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status");
    }
  };

  if (loading) {
    return (
      <SideBar>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-subMain"></div>
        </div>
      </SideBar>
    );
  }

  if (error) {
    return (
      <SideBar>
        <div className="bg-error/20 border border-error/50 rounded-lg p-4 text-error">
          {error}
        </div>
      </SideBar>
    );
  }

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-white">User Management</h2>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-main border border-border rounded p-4">
              <p className="text-sm text-border">Total Users</p>
              <p className="text-2xl font-bold text-subMain mt-1">{stats.total}</p>
            </div>
            <div className="bg-main border border-border rounded p-4">
              <p className="text-sm text-border">Active</p>
              <p className="text-2xl font-bold text-green-500 mt-1">{stats.active}</p>
            </div>
            <div className="bg-main border border-border rounded p-4">
              <p className="text-sm text-border">Pending</p>
              <p className="text-2xl font-bold text-yellow-500 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-main border border-border rounded p-4">
              <p className="text-sm text-border">Banned</p>
              <p className="text-2xl font-bold text-error mt-1">{stats.banned}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-border">
              <thead className="bg-dry">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Joined</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-border hover:bg-dry transition">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${user.isAdmin ? 'bg-subMain text-white' : 'bg-dry text-text'}`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${user.banned ? 'bg-error text-white' :
                          user.accountStatus === 'active' ? 'bg-green-600 text-white' :
                            'bg-yellow-600 text-white'
                        }`}>
                        {user.banned ? 'Banned' : user.accountStatus}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        {!user.isAdmin && (
                          <>
                            <button
                              onClick={() => handleBanToggle(user._id, user.banned)}
                              className={`p-2 rounded hover:opacity-80 ${user.banned ? 'bg-green-600' : 'bg-yellow-600'}`}
                              title={user.banned ? 'Unban' : 'Ban'}
                            >
                              {user.banned ? <FiUserCheck /> : <FiUserX />}
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-2 rounded bg-error hover:opacity-80"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-border py-8">
            No users found
          </div>
        )}
      </div>
    </SideBar>
  );
}

export default Users;
