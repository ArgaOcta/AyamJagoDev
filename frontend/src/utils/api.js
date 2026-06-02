import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const clearToken = () => {
  localStorage.removeItem('token');
};

const safeDecodeBase64 = (value) => {
  try {
    return JSON.parse(atob(value.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
};

export const isJwtToken = (token) => typeof token === 'string' && token.split('.').length === 3 && !token.startsWith('local.');
export const isLocalToken = (token) => typeof token === 'string' && token.startsWith('local.');

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;

  let decoded = null;
  if (isLocalToken(token)) {
    const payload = token.split('.')[1];
    decoded = safeDecodeBase64(payload);
  } else if (isJwtToken(token)) {
    const payload = token.split('.')[1];
    decoded = safeDecodeBase64(payload);
  }

  if (!decoded) {
    clearToken();
    return null;
  }

  if (decoded.exp && Date.now() / 1000 >= decoded.exp) {
    clearToken();
    return null;
  }

  return decoded;
};

export const isAuthenticated = () => !!getDecodedToken();

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const LOCAL_USERS_KEY = 'ayamjagodev_local_users';

export const getLocalUsers = () => {
  const raw = localStorage.getItem(LOCAL_USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

export const registerLocalUser = ({ full_name, email, password }) => {
  const users = getLocalUsers();
  const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    return { success: false, message: 'Email sudah terdaftar.' };
  }

  const newUser = {
    id: Date.now(),
    full_name,
    email,
    password,
    role: 'user',
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);

  return { success: true, user: newUser };
};

export const loginLocalUser = ({ email, password }) => {
  const users = getLocalUsers();
  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );
};

export const createLocalToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role || 'user',
    avatar_url: user.avatar_url || null,
    created_at: user.created_at,
  };
  const encoded = btoa(JSON.stringify(payload));
  const token = `local.${encoded}.token`;
  setToken(token);
  return token;
};

export const getLocalProfile = () => {
  const decoded = getDecodedToken();
  if (!decoded) return null;
  return {
    profile: {
      full_name: decoded.full_name,
      email: decoded.email,
      role: decoded.role,
      avatar_url: decoded.avatar_url || null,
      created_at: decoded.created_at,
    },
    history: [],
  };
};

export const updateLocalUser = ({ id, full_name, email }) => {
  const users = getLocalUsers();
  const existingEmail = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.id !== id
  );

  if (existingEmail) {
    return { success: false, message: 'Email sudah digunakan oleh akun lain.' };
  }

  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }

  users[index].full_name = full_name;
  users[index].email = email;
  saveLocalUsers(users);
  return { success: true, user: users[index] };
};

export const updateLocalUserAvatar = ({ id, avatar_url }) => {
  const users = getLocalUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }

  users[index].avatar_url = avatar_url;
  saveLocalUsers(users);
  return { success: true, user: users[index] };
};

export const changeLocalUserPassword = ({ id, current_password, new_password }) => {
  const users = getLocalUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }

  if (users[index].password !== current_password) {
    return { success: false, message: 'Password saat ini salah.' };
  }

  if (new_password.length < 8) {
    return { success: false, message: 'Password baru harus minimal 8 karakter.' };
  }

  users[index].password = new_password;
  saveLocalUsers(users);
  return { success: true };
};

export const deleteLocalUser = ({ id }) => {
  const users = getLocalUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }

  users.splice(index, 1);
  saveLocalUsers(users);
  return { success: true };
};

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// attach auth header automatically when token exists
api.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  config.headers = { ...(config.headers || {}), ...headers };
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);
