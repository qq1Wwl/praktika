import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { request } from '../api'
import ServiceCard from '../components/ServiceCard'
import { useCart } from '../context/CartContext'

function Catalog() {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true) // идёт загрузка
  const [error, setError] = useState('')       // текст ошибки
  const [added, setAdded] = useState('')       // последняя добавленная услуга
  const [attempt, setAttempt] = useState(0)    // номер попытки загрузки

  // Загрузка списка услуг с сервера.
  // Эффект запускается при открытии страницы и при каждом нажатии «Повторить»
  useEffect(() => {
    request('/api/services')
      .then((data) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [attempt])

  function handleRetry() {
    setError('')
    setLoading(true)
    setAttempt(attempt + 1)
  }

  function handleAdd(service) {
    addToCart(service)
    setAdded(service.name)
  }

  return (
    <div>
      <h1>Каталог услуг</h1>

      {added && (
        <div className="notice">
          «{added}» добавлена в корзину
          <button className="btn small" onClick={() => navigate('/cart')}>
            Перейти в корзину
          </button>
        </div>
      )}

      {loading && <p className="info">Загрузка услуг...</p>}

      {error && (
        <div className="error-box">
          <p>Не удалось загрузить услуги: {error}</p>
          <button className="btn small" onClick={handleRetry}>
            Повторить
          </button>
        </div>
      )}

      <div className="services">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  )
}

export default Catalog
