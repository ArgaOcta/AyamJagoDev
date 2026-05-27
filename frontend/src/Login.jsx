import { Link, useNavigate } from 'react-router-dom'
import '../Auth.css'

const Login = () => {
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    // pindah halaman
    navigate('/')
  }

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type='email'
            placeholder='Masukkan Email'
          />

          <input
            type='password'
            placeholder='Masukkan Password'
          />

          <button type='submit'>
            Login
          </button>
        </form>

        <p>
          Belum punya akun?
          <Link to='/register'> Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login