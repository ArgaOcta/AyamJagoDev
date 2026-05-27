import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../Auth.css'
import { API_BASE_URL, setToken, loginLocalUser, createLocalToken } from '../utils/api'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('Memproses login...')

    // client-side validation
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!form.email.trim()) {
      setMessage('Email wajib diisi')
      return
    }
    if (!emailRegex.test(form.email)) {
      setMessage('Format email tidak valid')
      return
    }
    if (form.password.length < 8) {
      setMessage('Password harus minimal 8 karakter')
      return
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: form.email,
        password: form.password,
      })

      const { token } = response.data
      setToken(token)
      setMessage('Login berhasil! Mengarahkan ke profil...')
      navigate('/profile')
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || 'Gagal login. Cek kembali email/password.')
        if (error.response.status === 401 || error.response.status === 404) {
          return
        }
      }

      const localUser = loginLocalUser({
        email: form.email,
        password: form.password,
      })

      if (localUser) {
        createLocalToken(localUser)
        setMessage('Login lokal berhasil! Mengarahkan ke profil...')
        navigate('/profile')
      } else {
        setMessage('Login gagal. Cek kembali email dan password.')
      }
    }
  }

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='Masukkan Email'
            required
            aria-required='true'
          />

          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}
            placeholder='Masukkan Password'
            required
            aria-required='true'
          />

          <button type='submit'>Login</button>
        </form>

        {message && <p style={{ marginTop: '12px' }}>{message}</p>}

        <p>
          Belum punya akun?
          <Link to='/register'> Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
