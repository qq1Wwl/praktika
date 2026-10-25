import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})        // ошибки полей
  const [serverError, setServerError] = useState('') // ошибка от сервера
  const [loading, setLoading] = useState(false)

  // Уже вошли - на страницу входа не пускаем
  if (user) {
    return <Navigate to="/" />
  }

  // Проверка заполнения полей
  function validate() {
    const result = {}
    if (!email.trim()) {
      result.email = 'Введите почту'
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      result.email = 'Введите корректную почту'
    }
    if (!password) {
      result.password = 'Введите пароль'
    }
    return result
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const result = validate()
    setErrors(result)
    if (Object.keys(result).length > 0) {
      return // есть ошибки - на сервер не отправляем
    }

    setLoading(true)
    const error = await login(email.trim(), password)
    setLoading(false)

    if (error) {
      setServerError(error)
    } else {
      navigate('/')
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1>Вход</h1>

      <input
        type="email"
        placeholder="Почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <p className="field-error">{errors.email}</p>}

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <p className="field-error">{errors.password}</p>}

      {serverError && <p className="error">{serverError}</p>}

      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Вход...' : 'Войти'}
      </button>
      <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
    </form>
  )
}

export default Login
