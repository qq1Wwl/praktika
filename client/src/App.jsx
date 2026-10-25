import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Catalog from './pages/Catalog'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Appointments from './pages/Appointments'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div>
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
