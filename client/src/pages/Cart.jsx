import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { request } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function Cart() {
  const { cart, total, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [date, setDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Сегодняшняя дата в формате гггг-мм-дд (раньше выбирать нельзя)
  const [today] = useState(() => new Date().toLocaleDateString('sv-SE'))

  // Оформление записи: отправляем корзину на сервер
  async function handleCheckout() {
    setError('')

    if (!user) {
      setError('Чтобы оформить запись, войдите в аккаунт')
      return
    }
    if (!date) {
      setError('Выберите дату записи')
      return
    }
    if (date < today) {
      setError('Дата записи не может быть в прошлом')
      return
    }

    setLoading(true)
    try {
      await request('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({
          date,
          items: cart.map((item) => ({ serviceId: item.id, quantity: item.quantity })),
        }),
      })
      clearCart()
      navigate('/appointments')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (cart.length === 0) {
    return (
      <div>
        <h1>Корзина</h1>
        <p>Корзина пока пуста. <Link to="/">Выбрать услуги</Link></p>
      </div>
    )
  }

  return (
    <div>
      <h1>Корзина</h1>

      {cart.map((item) => (
        <div className="cart-row" key={item.id}>
          <span className="cart-name">{item.name}</span>
          <span>{item.quantity} шт.</span>
          <span className="cart-price">{item.price * item.quantity} ₽</span>
          <button className="btn danger small" onClick={() => removeFromCart(item.id)}>
            Удалить
          </button>
        </div>
      ))}

      <h2 className="total">Итого: {total} ₽</h2>

      <div className="checkout">
        <label>
          Дата записи:
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}
        {!user && <p><Link to="/login">Войти</Link> или <Link to="/register">зарегистрироваться</Link></p>}

        <div className="buttons">
          <button className="btn" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Оформление...' : 'Оформить запись'}
          </button>
          <button className="btn danger" onClick={clearCart}>Очистить корзину</button>
        </div>
      </div>
    </div>
  )
}

export default Cart
