import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  delay?: number
}

export default function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col group"
    >
      {/* Portrait image — takes the visual weight of the card */}
      <div className="relative aspect-[3/4] overflow-hidden bg-rosa-claro">
        {!imgError ? (
          <img
            src={product.imagem_url}
            alt={product.nome}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bege">
            <span className="text-5xl">🕯️</span>
          </div>
        )}

        {/* Hover overlay — appears only on mouse-over */}
        <div className="absolute inset-0 bg-titulo/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={handleAdd}
            disabled={product.estoque === 0}
            className={`translate-y-3 group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium ${
              added
                ? 'bg-[#FAF7F2] text-green-700'
                : product.estoque === 0
                ? 'bg-[#FAF7F2]/70 text-subtexto cursor-not-allowed'
                : 'bg-[#FAF7F2]/90 text-titulo hover:bg-[#FAF7F2]'
            } transition-colors duration-200`}
          >
            {added ? (
              <><Check size={13} /> Adicionado</>
            ) : product.estoque === 0 ? (
              'Esgotado'
            ) : (
              <><ShoppingBag size={13} /> Adicionar</>
            )}
          </button>
        </div>

        {/* Badges */}
        {product.estoque <= 5 && product.estoque > 0 && (
          <span className="absolute top-3 left-3 text-[9px] font-medium px-2.5 py-1 rounded-full bg-[#FAF7F2]/90 text-dourado tracking-wide">
            Últimas unidades
          </span>
        )}

        {product.estoque === 0 && (
          <div className="absolute inset-0 bg-[#F5EFE6]/45 flex items-center justify-center">
            <span className="text-xs font-medium text-subtexto bg-[#FAF7F2]/80 px-4 py-2 rounded-full">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Info below image — minimal and elegant */}
      <div className="pt-5">
        <p className="text-xs font-medium text-subtexto/60 tracking-widest uppercase mb-2">
          {product.categoria}
        </p>
        <h3 className="font-serif text-base sm:text-[1.05rem] font-medium text-titulo leading-snug">
          {product.nome}
        </h3>
        <p className="font-serif text-dourado font-normal text-[0.875rem] mt-3">
          R$ {product.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </motion.article>
  )
}
