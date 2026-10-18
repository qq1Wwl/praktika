import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Уже вошли - на страницу входа не пускаем
  if (user) {
    return <Navigate to="/dashboard" />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const result = await login(email, password)
    if (result) {
      setError(result)
    } else {
      navigate('/dashboard') // успешный вход - редирект в кабинет
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Вход</h1>

      <input
        type="email"
        placeholder="Почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button className="btn" type="submit">Войти</button>
      <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
    </form>
  )
}

export default Login
