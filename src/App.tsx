import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Cart from './components/Cart'
import Home from './pages/Home'
import Products from './pages/Products'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Admin from './pages/Admin'

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Cart />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmacao" element={<Confirmation />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
