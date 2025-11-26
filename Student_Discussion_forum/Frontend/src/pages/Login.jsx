import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login(form)
    navigate('/', { replace: true })
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p>Sign in to participate in discussions.</p>
        {error && <p className="form-error">{error}</p>}
        <label>
          Email address
          <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
        </label>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="helper">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </form>
    </section>
  )
}

export default Login
