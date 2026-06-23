import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Plus, Lock, Unlock } from 'lucide-react';
import { api } from '../../../utils/api';
import styles from '../Shared/AdminPage.module.css';

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat daftar pengguna.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/api/admin/users', formData);
      setFormData({ full_name: '', email: '', password: '', role: 'user' });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pengguna baru.');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/api/admin/users/${id}/role`, { role });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui role pengguna.');
    }
  };

  const handleBlockToggle = async (id, blocked) => {
    try {
      await api.put(`/api/admin/users/${id}/block`, { blocked });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui status blokir pengguna.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      await api.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus pengguna.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>Manage administrators and customer accounts.</p>
        </div>
        <button className="btn btn-solid" onClick={() => setShowForm((prev) => !prev)}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          {showForm ? 'Close Form' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <h2 className={styles.cardTitle}>Create new user</h2>
          <form onSubmit={handleCreateUser} className={styles.formGrid}>
            <label className={styles.formField}>
              <span>Full Name</span>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className={styles.formField}>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className={styles.formField}>
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className={styles.formField}>
              <span>Role</span>
              <select name="role" value={formData.role} onChange={handleInputChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className={styles.formActions}>
              <button className="btn btn-solid" type="submit">
                Create user
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderBar}>
          <h2 className={styles.cardTitle}>User list</h2>
          <p>{loading ? 'Loading...' : `${users.length} users found`}</p>
        </div>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={styles.roleSelect}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={user.is_blocked ? styles.badgeBlocked : styles.badgeActive}>
                    {user.is_blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                <td className={styles.actionsCell}>
                  <button
                    className={`btn ${user.is_blocked ? 'btn-outline' : 'btn-danger'}`}
                    onClick={() => handleBlockToggle(user.id, !user.is_blocked)}
                    type="button"
                  >
                    {user.is_blocked ? <Unlock size={14} style={{ marginRight: 6 }} /> : <Lock size={14} style={{ marginRight: 6 }} />}
                    {user.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => handleDeleteUser(user.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
