import React, { useEffect, useState } from 'react';
import { Users as UsersIcon } from 'lucide-react';
import styles from '../Shared/AdminPage.module.css';
import { api } from '../../../utils/api';

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get('/api/admin/users');

      setUsers(response.data?.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat pengguna.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateAdmin = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/api/admin/users/admin', form);

      setMessage(response.data?.message || 'Admin berhasil ditambahkan.');

      setForm({
        full_name: '',
        email: '',
        password: '',
      });

      setShowForm(false);

      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal menambahkan admin.');
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const response = await api.put(
        `/api/admin/users/${userId}/role`,
        { role }
      );

      setMessage(response.data?.message || 'Role berhasil diperbarui.');

      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal memperbarui role.');
    }
  };

  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      const response = await api.patch(
        `/api/admin/users/${userId}/block`,
        {
          is_blocked: !isBlocked,
        }
      );

      setMessage(response.data?.message || 'Status blokir berhasil diubah.');

      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal mengubah status blokir.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>
            Kelola admin, role, dan status blokir akun pelanggan.
          </p>
        </div>

        <button
          className="btn btn-solid"
          onClick={() => setShowForm((value) => !value)}
        >
          {showForm ? 'Tutup Form' : 'Tambah Admin'}
        </button>
      </div>

      {message && (
        <div className={styles.infoBox}>
          {message}
        </div>
      )}

      {showForm && (
        <form
          className={styles.formCard}
          onSubmit={handleCreateAdmin}
        >
          <h3>Tambah Admin Baru</h3>

          <div className={styles.formGrid}>
            <input
              className={styles.input}
              placeholder="Nama lengkap"
              value={form.full_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  full_name: e.target.value,
                })
              }
              required
            />

            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              className={styles.input}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className="btn btn-solid"
            >
              Simpan
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowForm(false)}
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <div className={styles.content}>
        {loading ? (
          <p>Memuat data pengguna...</p>
        ) : error ? (
          <p className={styles.errorText}>{error}</p>
        ) : users.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.iconWrapper}>
              <UsersIcon size={32} />
            </div>

            <h3>Belum ada pengguna</h3>

            <p>
              Data pengguna akan muncul di sini setelah akun dibuat.
            </p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
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
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.full_name}</td>

                    <td>{user.email}</td>

                    <td>
                      <select
                        className={styles.select}
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                      >
                        <option value="user">
                          User
                        </option>

                        <option value="admin">
                          Admin
                        </option>
                      </select>
                    </td>

                    <td>
                      <span
                        className={`${styles.badge} ${
                          user.is_blocked
                            ? styles.badgeDanger
                            : styles.badgeSuccess
                        }`}
                      >
                        {user.is_blocked
                          ? 'Terblokir'
                          : 'Aktif'}
                      </span>
                    </td>

                    <td>
                      <button
                        className={`btn ${
                          user.is_blocked
                            ? 'btn-outline'
                            : 'btn-solid'
                        }`}
                        onClick={() =>
                          handleToggleBlock(
                            user.id,
                            user.is_blocked
                          )
                        }
                      >
                        {user.is_blocked
                          ? 'Buka Blokir'
                          : 'Blokir'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;