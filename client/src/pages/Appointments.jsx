import { useState, useEffect } from 'react'
import { request } from '../api'

function Appointments() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Загружаем записи текущего пользователя
  useEffect(() => {
    request('/api/appointments')
      .then((data) => setList(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1>Мои записи</h1>

      {loading && <p className="info">Загрузка записей...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && list.length === 0 && (
        <p>У вас пока нет записей.</p>
      )}

      {list.map((item) => (
        <div className="cart-row" key={item.id}>
          <span className="cart-name">{item.serviceName}</span>
          <span>{item.quantity} шт.</span>
          <span>{item.date}</span>
          <span className="cart-price">{item.amount} ₽</span>
          <span className="status">
            {item.paymentStatus === 'paid' ? 'Оплачено' : 'Не оплачено'}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Appointments
