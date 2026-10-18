import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Cart() {
  const { cart, total, removeFromCart, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div>
        <h1>Корзина</h1>
        <p>Корзина пока пуста. <Link to="/">Перейти в каталог</Link></p>
      </div>
    )
  }

  return (
    <div>
      <h1>Корзина</h1>

      {cart.map((item) => (
        <div className="cart-row" key={item.id}>
          <img className="cart-image" src={item.image} alt={item.name} />
          <span className="cart-name">{item.name}</span>
          <span>{item.quantity} шт.</span>
          <span className="cart-price">{item.price * item.quantity} ₽</span>
          <button className="btn danger small" onClick={() => removeFromCart(item.id)}>
            Удалить
          </button>
        </div>
      ))}

      <h2 className="total">Итого: {total} ₽</h2>
      <button className="btn danger" onClick={clearCart}>Очистить корзину</button>
    </div>
  )
}

export default Cart
