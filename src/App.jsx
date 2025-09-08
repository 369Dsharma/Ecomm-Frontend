import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import  AuthProvider  from "./context/AuthContext"
import  CartProvider  from './context/CartContext'
import Header from './components/Header'
import Items from './pages/Items'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Items />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="*" element={<NotFound />} />

              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App