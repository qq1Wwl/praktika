import { createContext, useContext, useState } from 'react'
import { request } from '../api'

// Авторизация через серверное API
const AuthContext = createContext()

export function AuthProvider({ children }) {
  // В auth лежит { token, user }. Если null - никто не вошёл
  const [auth, setAuth] = useState(
    JSON.parse(localStorage.getItem('auth') || 'null')
  )

  // Отправляет email и пароль на сервер.
  // Возвращает текст ошибки или null, если всё хорошо
  async function sendAuth(path, email, password) {
    try {
      const data = await request(path, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      localStorage.setItem('auth', JSON.stringify(data))
      setAuth(data)
      return null
    } catch (err) {
      return err.message
    }
  }

  function login(email, password) {
    return sendAuth('/api/auth/login', email, password)
  }

  function register(email, password) {
    return sendAuth('/api/auth/register', email, password)
  }

  function logout() {
    localStorage.removeItem('auth')
    setAuth(null)
  }

  const user = auth ? auth.user : null

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
