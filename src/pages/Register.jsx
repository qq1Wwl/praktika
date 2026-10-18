import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/dashboard" />
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Проверка данных формы
    if (!name || !email || !password) {
      return setError('Заполните все поля')
    }
    if (!email.includes('@')) {
      return setError('Введите корректную почту')
    }
    if (password.length < 6) {
      return setError('Пароль должен быть не короче 6 символов')
    }
    if (password !== repeat) {
      return setError('Пароли не совпадают')
    }

    const result = await register(name, email, password)
    if (result) {
      setError(result)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Регистрация</h1>

      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль (минимум 6 символов)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Повторите пароль"
        value={repeat}
        onChange={(e) => setRepeat(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button className="btn" type="submit">Зарегистрироваться</button>
      <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </form>
  )
}

export default Register
