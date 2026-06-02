import { Link, useNavigate } from 'react-router-dom'
import '../Auth.css'

const Register = () => {
  const navigate = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()

    // pindah ke login
    navigate('/login')
  }

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1>Register</h1>

        <form onSubmit={handleRegister}>
          <input
            type='text'
            placeholder='Nama Lengkap'
          />

          <input
            type='email'
            placeholder='Masukkan Email'
          />

          <input
            type='password'
            placeholder='Masukkan Password'
          />

          <button type='submit'>
            Register
          </button>
        </form>

        <p>
          Sudah punya akun?
          <Link to='/login'> Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register