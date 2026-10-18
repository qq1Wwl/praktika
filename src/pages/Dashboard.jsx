import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function Dashboard() {
  const { user, logout } = useAuth()
  const { count, total } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <h1>Личный кабинет</h1>
      <div className="panel">
        <p>Здравствуйте, <b>{user.name}</b>!</p>
        <p>Ваша почта: {user.email}</p>
        <p>Товаров в корзине: {count} на сумму {total} ₽</p>
        <p><Link to="/cart">Открыть корзину</Link></p>
        <button className="btn danger" onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  )
}

export default Dashboard
