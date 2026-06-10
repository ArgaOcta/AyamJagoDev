import React, { useEffect, useState } from 'react';
import { Users as UsersIcon } from 'lucide-react';
import styles from '../Shared/AdminPage.module.css';
import { getDecodedToken, api } from '../../../utils/api';

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '', confirm_password: '' });
  const [roleChoice, setRoleChoice] = useState('user');
  const [blockReason, setBlockReason] = useState('');

  const decoded = getDecodedToken();
  const isSuper = decoded?.role === 'superadmin';
  const isAdmin = decoded?.role === 'admin' || isSuper;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat daftar pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddAdmin = () => {
    setForm({ full_name: '', username: '', email: '', password: '', confirm_password: '' });
    setShowAddAdmin(true);
  };

  const submitAddAdmin = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password || !form.confirm_password) return alert('Lengkapi semua field');
    if (form.password.length < 8) return alert('Password minimal 8 karakter');
    if (form.password !== form.confirm_password) return alert('Password dan konfirmasi tidak cocok');

    try {
      await api.post('/api/admin/create-admin', {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        username: form.username || null,
      });
      alert('Admin berhasil ditambahkan');
      setShowAddAdmin(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menambahkan admin');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setRoleChoice(user.role || 'user');
    setShowRoleModal(true);
  };

  const submitRoleChange = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/api/admin/users/${selectedUser.id}/role`, { role: roleChoice });
      alert('Role berhasil diubah');
      setShowRoleModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal mengubah role');
    }
  };

  const openBlockModal = (user, unblock = false) => {
    setSelectedUser(user);
    setBlockReason('');
    setShowBlockModal(true);
  };

  const submitBlock = async (blocked) => {
    if (!selectedUser) return;
    if (blocked && !blockReason) return alert('Mohon isi alasan blokir');
    try {
      await api.put(`/api/admin/users/${selectedUser.id}/block`, { blocked, reason: blockReason });
      alert(blocked ? 'Pengguna diblokir' : 'Pengguna dibuka blokir');
      setShowBlockModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal memperbarui status blokir');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>Manage administrators and customer accounts.</p>
        </div>
        <div>
          {isSuper && (
            <button className="btn btn-solid" onClick={openAddAdmin}>Tambah Admin</button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <UsersIcon size={32} />
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          {loading ? (
            <p>Memuat...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.is_blocked ? 'Blocked' : 'Active'}</td>
                    <td>
                      {isSuper && (
                        <button className="btn btn-outline" onClick={() => openRoleModal(u)}>Edit Role</button>
                      )}
                      {isAdmin && (
                        <>
                          <button className="btn btn-danger" style={{ marginLeft: 8 }} onClick={() => { setSelectedUser(u); setShowBlockModal(true); }}>{u.is_blocked ? 'Unblock' : 'Block'}</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="modal">
          <div className="modal-content">
            <h3>Tambah Admin</h3>
            <form onSubmit={submitAddAdmin}>
              <div>
                <label>Nama Lengkap</label>
                <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div>
                <label>Username</label>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </div>
              <div>
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label>Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <label>Konfirmasi Password</label>
                <input type="password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} />
              </div>
              <div style={{ marginTop: 12 }}>
                <button type="submit" className="btn btn-solid">Simpan</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddAdmin(false)} style={{ marginLeft: 8 }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Role - {selectedUser.full_name}</h3>
            <div>
              <label>Role</label>
              <select value={roleChoice} onChange={(e) => setRoleChoice(e.target.value)}>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-solid" onClick={submitRoleChange}>Simpan</button>
              <button className="btn btn-outline" onClick={() => setShowRoleModal(false)} style={{ marginLeft: 8 }}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {showBlockModal && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedUser.is_blocked ? 'Unblock User' : 'Block User'} - {selectedUser.full_name}</h3>
            {!selectedUser.is_blocked && (
              <div>
                <label>Alasan Blokir</label>
                <textarea value={blockReason} onChange={(e) => setBlockReason(e.target.value)} />
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              {selectedUser.is_blocked ? (
                <button className="btn btn-solid" onClick={() => submitBlock(false)}>Unblock</button>
              ) : (
                <button className="btn btn-danger" onClick={() => submitBlock(true)}>Block</button>
              )}
              <button className="btn btn-outline" onClick={() => setShowBlockModal(false)} style={{ marginLeft: 8 }}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;