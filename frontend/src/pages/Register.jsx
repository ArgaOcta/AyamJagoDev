import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../Auth.css'
import { API_BASE_URL, registerLocalUser, createLocalToken, setToken } from '../utils/api'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('Membuat akun...')

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!form.full_name.trim()) {
      setMessage('Nama lengkap wajib diisi')
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
      const registerResponse = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      })

      const token = registerResponse.data.token
      if (token) {
        setToken(token)
        setMessage('Register berhasil. Mengarahkan ke profil...')
        setTimeout(() => navigate('/profile'), 800)
        return
      }

      const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: form.email,
        password: form.password,
      })

      const loginToken = loginResponse.data.token
      if (loginToken) {
        setToken(loginToken)
        setMessage('Register berhasil. Mengarahkan ke profil...')
        setTimeout(() => navigate('/profile'), 800)
        return
      }

      setMessage('Register berhasil. Silakan login.')
      setTimeout(() => navigate('/login'), 1200)
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 400 || error.response.status === 409) {
          setMessage(error.response.data.message || 'Gagal register. Cek input.')
          return
        }
      }

      // Fallback ke local storage ketika backend tidak tersedia
      const localResult = registerLocalUser({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      })

      if (localResult.success) {
        createLocalToken(localResult.user)
        setMessage('Akun dibuat lokal. Mengarahkan ke profil...')
        setTimeout(() => navigate('/profile'), 1200)
      } else {
        setMessage(localResult.message)
      }
    }
  }

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1>Register</h1>

        <form onSubmit={handleRegister}>
          <input
            type='text'
            name='full_name'
            value={form.full_name}
            onChange={handleChange}
            placeholder='Nama Lengkap'
            required
          />

          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='Masukkan Email'
            required
          />

          <input
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}
            placeholder='Masukkan Password'
            required
          />

          <button type='submit'>
            Register
          </button>
        </form>

        {message && <p style={{ marginTop: '12px' }}>{message}</p>}

        <p>
          Sudah punya akun?
          <Link to='/login'> Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register