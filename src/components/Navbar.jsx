import { NavLink } from 'react-router-dom'
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
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <span className="logo">🛍 Магазин</span>

      <div className="nav-links">
        <NavLink to="/" end className={linkClass}>Каталог</NavLink>
        <NavLink to="/cart" className={linkClass}>Корзина ({count})</NavLink>

        {user ? (
          <NavLink to="/dashboard" className={linkClass}>Кабинет</NavLink>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>Вход</NavLink>
            <NavLink to="/register" className={linkClass}>Регистрация</NavLink>
          </>
        )}
      </div>

      <button className="theme-btn" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
      </button>
    </nav>
  )
}

export default Navbar
