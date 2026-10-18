import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import products from '../data/products'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'

function Catalog() {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  // Название последнего добавленного товара (для сообщения)
  const [added, setAdded] = useState('')

  function handleAdd(product) {
    addToCart(product)
    setAdded(product.name)
  }

  return (
    <div>
      <h1>Каталог товаров</h1>

      {added && (
        <div className="notice">
          «{added}» добавлен в корзину
          <button className="btn small" onClick={() => navigate('/cart')}>
            Перейти в корзину
          </button>
        </div>
      )}

      <div className="products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  )
}

export default Catalog
