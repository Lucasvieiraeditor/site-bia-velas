import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Cart from './components/Cart'
import Home from './pages/Home'
import Products from './pages/Products'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Cart />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmacao" element={<Confirmation />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
