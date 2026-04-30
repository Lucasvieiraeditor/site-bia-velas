import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, Flame } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { totalItems, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const links = [
    { to: '/', label: 'Início' },
    { to: '/produtos', label: 'Coleção' },
  ]

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-[#F5EFE6]/95 backdrop-blur-sm shadow-soft' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Flame
              size={20}
              className="text-rosa transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-serif text-xl font-medium text-titulo tracking-wide">
              Bia Velas
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:bg-rosa after:transition-all after:duration-300 ${
                  isActive(to)
                    ? 'text-rosa after:w-full'
                    : 'text-subtexto hover:text-titulo after:w-0 hover:after:w-full'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link to="/produtos" className="btn-primary text-xs px-5 py-2.5">
              Presentear
            </Link>
          </nav>

          {/* Cart + mobile menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              aria-label="Abrir carrinho"
              className="relative p-2 rounded-full text-titulo hover:bg-rosa-claro transition-colors duration-200"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full bg-rosa text-[#FAF7F2] text-[10px] font-semibold leading-none px-1"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              className="md:hidden p-2 rounded-full text-titulo hover:bg-rosa-claro transition-colors duration-200"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-16 left-0 right-0 z-30 bg-[#F5EFE6]/98 backdrop-blur-sm shadow-soft-lg border-b border-[#D9CBB8] md:hidden"
          >
            <nav className="flex flex-col px-6 py-5 gap-4">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`text-base font-medium py-1 transition-colors duration-200 ${
                    isActive(to) ? 'text-rosa' : 'text-titulo hover:text-rosa'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link to="/produtos" className="btn-primary mt-2 w-full text-center">
                Presentear alguém
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
