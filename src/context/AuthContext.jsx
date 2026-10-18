import { createContext, useContext, useState } from 'react'

// Авторизация. Сервера нет, поэтому пользователи хранятся в localStorage
const AuthContext = createContext()

// Пароль не храним в открытом виде - сохраняем только его SHA-256 хеш
async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]')
}

export function AuthProvider({ children }) {
  // Текущий вошедший пользователь (null - никто не вошёл)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  )

  function saveUser(newUser) {
    setUser(newUser)
    localStorage.setItem('currentUser', JSON.stringify(newUser))
  }

  // Регистрация. Возвращает строку с ошибкой или null, если всё хорошо
  async function register(name, email, password) {
    const users = getUsers()
    if (users.find((u) => u.email === email)) {
      return 'Пользователь с такой почтой уже существует'
    }
    const passwordHash = await hashPassword(password)
    users.push({ name, email, passwordHash })
    localStorage.setItem('users', JSON.stringify(users))
    saveUser({ name, email })
    return null
  }

  // Вход. Проверяем почту и хеш пароля
  async function login(email, password) {
    const found = getUsers().find((u) => u.email === email)
    const passwordHash = await hashPassword(password)
    if (!found || found.passwordHash !== passwordHash) {
      return 'Неверная почта или пароль'
    }
    saveUser({ name: found.name, email: found.email })
    return null
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
