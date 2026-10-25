import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to="/" />
  }

  // Проверка данных формы
  function validate() {
    const result = {}
    if (!email.trim()) {
      result.email = 'Введите почту'
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      result.email = 'Введите корректную почту'
    }
    if (!password) {
      result.password = 'Введите пароль'
    } else if (password.length < 6) {
      result.password = 'Пароль должен быть не короче 6 символов'
    }
    return result
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const result = validate()
    setErrors(result)
    if (Object.keys(result).length > 0) {
      return
    }

    setLoading(true)
    const error = await register(email.trim(), password)
    setLoading(false)

    if (error) {
      setServerError(error)
    } else {
      navigate('/')
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1>Регистрация</h1>

      <input
        type="email"
        placeholder="Почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <p className="field-error">{errors.email}</p>}

      <input
        type="password"
        placeholder="Пароль (минимум 6 символов)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <p className="field-error">{errors.password}</p>}

      {serverError && <p className="error">{serverError}</p>}

      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
      <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </form>
  )
}

export default Register
