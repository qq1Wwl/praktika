import { useState } from 'react'
import './ProductCard.css'

function ProductCard(props) {
  const [count, setCount] = useState(0)

  return (
    <div className="card">
      <div className="card-image">
        <img src={props.image} alt={props.name} />
        {count > 0 && <span className="badge">{count}</span>}
      </div>

      <div className="card-body">
        <h3 className="card-title">{props.name}</h3>
        <p className="card-price">{props.price} ₽</p>

        <p className="card-count">В корзине: {count} шт.</p>

        <button className="btn-add" onClick={() => setCount(count + 1)}>
          Добавить в корзину
        </button>
        <button className="btn-reset" onClick={() => setCount(0)}>
          Очистить
        </button>
      </div>
    </div>
  )
}

export default ProductCard
