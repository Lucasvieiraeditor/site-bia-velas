import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart()
  const navigate = useNavigate()

  // Lock body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-titulo/30 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-soft-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F5EDE4]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-rosa" />
                <h2 className="font-serif text-lg font-medium text-titulo">
                  Minha Sacola
                </h2>
                {items.length > 0 && (
                  <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-rosa text-white text-[10px] font-semibold">
                    {items.reduce((a, i) => a + i.quantidade, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Fechar sacola"
                className="p-2 rounded-full hover:bg-rosa-claro text-subtexto hover:text-titulo transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-rosa-claro flex items-center justify-center">
                    <ShoppingBag size={24} className="text-rosa" />
                  </div>
                  <div>
                    <p className="font-serif text-titulo text-base">Sua sacola está vazia</p>
                    <p className="text-subtexto text-sm mt-1">Explore nossa coleção e escolha sua criação favorita.</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-secondary text-sm mt-2"
                  >
                    Ver coleção
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3"
                  >
                    {/* Image */}
                    <div className="w-18 h-18 min-w-[72px] rounded-xl overflow-hidden bg-rosa-claro">
                      <img
                        src={item.product.imagem_url}
                        alt={item.product.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-medium text-titulo leading-snug line-clamp-1">
                        {item.product.nome}
                      </p>
                      <p className="text-[11px] text-subtexto uppercase tracking-wider mt-0.5">
                        {item.product.aroma}
                      </p>
                      <p className="price text-sm mt-1">
                        R$ {(item.product.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantidade - 1)}
                          className="w-6 h-6 rounded-full border border-[#EDE0DD] flex items-center justify-center hover:border-rosa hover:text-rosa transition-colors duration-200"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-sm font-medium text-titulo w-4 text-center">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantidade + 1)}
                          className="w-6 h-6 rounded-full border border-[#EDE0DD] flex items-center justify-center hover:border-rosa hover:text-rosa transition-colors duration-200"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto p-1 text-subtexto hover:text-red-400 transition-colors duration-200"
                          aria-label="Remover"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[#F5EDE4] bg-offwhite space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-subtexto text-sm">Subtotal</span>
                  <span className="font-serif text-lg font-medium text-titulo">
                    R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-subtexto">Frete calculado no checkout.</p>
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full justify-center gap-2"
                >
                  Finalizar pedido
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
