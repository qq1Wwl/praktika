import { createContext, useContext, useReducer, useEffect } from 'react'

// Глобальная корзина. Состояние меняется через useReducer
const CartContext = createContext()

function cartReducer(cart, action) {
  switch (action.type) {
    case 'add': {
      const found = cart.find((item) => item.id === action.service.id)
      if (found) {
        // Услуга уже есть в корзине - увеличиваем количество
        return cart.map((item) =>
          item.id === found.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...cart, { ...action.service, quantity: 1 }]
    }
    case 'remove':
      return cart.filter((item) => item.id !== action.id)
    case 'clear':
      return []
    default:
      return cart
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    [],
    () => JSON.parse(localStorage.getItem('cart') || '[]')
  )

  // Сохраняем корзину, чтобы она не пропадала после обновления страницы
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)

  function addToCart(service) {
    dispatch({ type: 'add', service })
  }
  function removeFromCart(id) {
    dispatch({ type: 'remove', id })
  }
  function clearCart() {
    dispatch({ type: 'clear' })
  }

  return (
    <CartContext.Provider
      value={{ cart, total, count, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
