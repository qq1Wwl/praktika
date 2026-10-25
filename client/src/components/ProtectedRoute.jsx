import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Страница доступна только вошедшему пользователю,
// остальных перенаправляем на /login
function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" />
  }
  return children
}

export default ProtectedRoute
