import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Edit2, UserPlus, Slash } from 'lucide-react';
import styles from '../Shared/AdminPage.module.css';
import { api, getDecodedToken } from '../../../utils/api';

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ full_name: '', username: '', email: '', password: '', confirm_password: '' });
  const [editRoleUser, setEditRoleUser] = useState(null);

  const current = getDecodedToken();
  const isSuper = current && current.role === 'superadmin';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (isSuper) fetchUsers(); }, []);

  const handleAdd = async () => {
    try {
      const res = await api.post('/api/admin/users', addForm);
      alert(res.data.message || 'Admin ditambahkan');
      setShowAdd(false);
      fetchUsers();
    } catch (e) { alert(e.response?.data?.message || 'Gagal menambah admin'); }
  };

  const handleUpdateRole = async (id, role) => {
    try {
      await api.put(`/api/admin/users/${id}/role`, { role });
      alert('Role diperbarui');
      setEditRoleUser(null);
      fetchUsers();
    } catch (e) { alert(e.response?.data?.message || 'Gagal memperbarui role'); }
  };

  const handleBlock = async (id, blocked) => {
    if (!confirm(blocked ? 'Blokir pengguna ini?' : 'Buka blokir pengguna ini?')) return;
    try {
      await api.put(`/api/admin/users/${id}/block`, { blocked });
      alert(blocked ? 'User diblokir' : 'User dibuka blokir');
      fetchUsers();
    } catch (e) { alert(e.response?.data?.message || 'Gagal memperbarui status'); }
  };

  if (!isSuper) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Users</h1>
            <p className={styles.subtitle}>Manage administrators and customer accounts.</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.iconWrapper}><UsersIcon size={32} /></div>
          <h3>Akses Ditolak</h3>
          <p>Fitur manajemen pengguna hanya dapat diakses oleh Super Admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>Manage administrators and customer accounts.</p>
        </div>
        <div>
          <button className="btn btn-outline" onClick={() => setShowAdd(true)}><UserPlus size={16} /> Tambah Admin</button>
        </div>
      </div>

      <div className={styles.list}>
        {loading ? <p>Loading...</p> : (
          users.length === 0 ? <p>Tidak ada pengguna.</p> : (
            <table className={styles.table}>
              <thead>
                <tr><th>Nama</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.full_name}</td>
                    <td>{u.username || '-'}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.is_blocked ? 'Blocked' : 'Active'}</td>
                    <td>
                      <button className="btn btn-outline" onClick={() => setEditRoleUser(u)}><Edit2 size={14} /> Edit Role</button>
                      <button className="btn btn-danger" onClick={() => handleBlock(u.id, !u.is_blocked)} style={{marginLeft:8}}>
                        <Slash size={14} /> {u.is_blocked ? 'Buka Blokir' : 'Blokir User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      {showAdd && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Tambah Admin</h3>
            <input placeholder="Nama Lengkap" value={addForm.full_name} onChange={e => setAddForm({...addForm, full_name: e.target.value})} />
            <input placeholder="Username" value={addForm.username} onChange={e => setAddForm({...addForm, username: e.target.value})} />
            <input placeholder="Email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} />
            <input type="password" placeholder="Password" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} />
            <input type="password" placeholder="Konfirmasi Password" value={addForm.confirm_password} onChange={e => setAddForm({...addForm, confirm_password: e.target.value})} />
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button className="btn btn-solid" onClick={handleAdd}>Simpan</button>
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {editRoleUser && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Edit Role - {editRoleUser.full_name}</h3>
            <select defaultValue={editRoleUser.role} onChange={e => handleUpdateRole(editRoleUser.id, e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button className="btn btn-outline" onClick={() => setEditRoleUser(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;