import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

// Функция для NavLink: активная ссылка получает класс "active"
function linkClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link'
}

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <span className="logo">🛴 СамокатСервис</span>

      <div className="nav-links">
        <NavLink to="/" end className={linkClass}>Услуги</NavLink>
        <NavLink to="/cart" className={linkClass}>Корзина ({count})</NavLink>

        {user ? (
          <NavLink to="/appointments" className={linkClass}>Мои записи</NavLink>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>Вход</NavLink>
            <NavLink to="/register" className={linkClass}>Регистрация</NavLink>
          </>
        )}
      </div>

      <div className="nav-right">
        {user && (
          <button className="theme-btn" onClick={handleLogout}>
            Выйти ({user.email})
          </button>
        )}
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
