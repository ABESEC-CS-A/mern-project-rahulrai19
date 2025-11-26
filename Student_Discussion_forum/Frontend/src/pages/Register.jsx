import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const Register = () => {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await register(form)
    navigate('/', { replace: true })
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p>Collaborate with classmates in real-time.</p>
        {error && <p className="form-error">{error}</p>}
        <label>
          Full name
          <input type="text" name="fullName" placeholder="Alex Doe" value={form.fullName} onChange={handleChange} required />
        </label>
        <label>
          Email address
          <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="At least 8 characters" value={form.password} onChange={handleChange} required minLength={8} />
        </label>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
        <p className="helper">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  )
}

export default Register