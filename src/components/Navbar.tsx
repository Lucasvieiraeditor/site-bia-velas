import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const mobileLinks = [
  { to: '/produtos?categoria=Coleção', label: 'Coleção' },
  { to: '/produtos?categoria=Lembrancinhas', label: 'Lembrancinhas personalizadas para seu evento' },
  { to: '/produtos?categoria=Kit', label: 'Kits completos' },
  { to: '/produtos?categoria=Presente', label: 'Para presentear' },
]

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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

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
          scrolled ? 'bg-[#F5EFE6]/95 backdrop-blur-sm shadow-soft' : 'bg-gradient-to-b from-titulo/40 to-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img
              src="https://vnmqdyzjbtouanivsadf.supabase.co/storage/v1/object/public/imagens-bia/LOGO%20SITE.png"
              alt="By Biaggi"
              className="h-14 md:h-20 w-auto"
              loading="eager"
              style={{ objectFit: 'contain', display: 'block' }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm tracking-wide transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:bg-rosa after:transition-all after:duration-300 ${
                  isActive(to)
                    ? scrolled ? 'text-rosa after:w-full font-medium' : 'text-[#FAF7F2] after:w-full font-medium'
                    : scrolled ? 'text-subtexto hover:text-titulo after:w-0 hover:after:w-full font-normal' : 'text-[#FAF7F2]/80 hover:text-[#FAF7F2] after:w-0 hover:after:w-full font-normal'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Cart + mobile menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              aria-label="Abrir carrinho"
              className={`relative p-2 rounded-full transition-colors duration-200 ${scrolled ? 'text-titulo hover:bg-rosa-claro' : 'text-[#FAF7F2] hover:bg-[#FAF7F2]/10'}`}
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
              className={`md:hidden p-2 rounded-full transition-colors duration-200 ${scrolled ? 'text-titulo hover:bg-rosa-claro' : 'text-[#FAF7F2] hover:bg-[#FAF7F2]/10'}`}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile lateral drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-titulo/70 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="mobile-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-xs bg-titulo md:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-7 pt-8 pb-7 border-b border-[#FAF7F2]/10">
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  <img
                    src="https://vnmqdyzjbtouanivsadf.supabase.co/storage/v1/object/public/imagens-bia/LOGO%20SITE.png"
                    alt="By Biaggi"
                    className="w-[140px] h-auto"
                    style={{ objectFit: 'contain' }}
                  />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fechar menu"
                  className="p-2 text-[#FAF7F2]/60 hover:text-[#FAF7F2] transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex flex-col flex-1 px-7 py-6 overflow-y-auto">
                {mobileLinks.map(({ to, label }, i) => (
                  <div key={i}>
                    <Link
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className="block py-5 text-[#FAF7F2]/75 hover:text-[#FAF7F2] text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors duration-200"
                    >
                      {label}
                    </Link>
                    {i < mobileLinks.length - 1 && (
                      <div className="h-px bg-[#FAF7F2]/10" />
                    )}
                  </div>
                ))}
              </nav>

              {/* Bottom branding */}
              <div className="px-7 py-6 border-t border-[#FAF7F2]/10">
                <p className="text-[#FAF7F2]/25 text-[10px] tracking-[0.2em] uppercase">
                  ByBiaggi · Velas artesanais
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
