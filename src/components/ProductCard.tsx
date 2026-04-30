import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  delay?: number
}

const categoryColors: Record<string, string> = {
  Relaxamento: 'bg-[#EDE5D8] text-[#6B5A4E]',
  Energia: 'bg-[#E4EDE6] text-[#3D7A5A]',
  Presente: 'bg-rosa-claro text-[#8C6840]',
  'Edição Limitada': 'bg-[#E8DDD0] text-[#9E7A52]',
}

export default function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -6 }}
      className="bg-[#FAF7F2] rounded-2xl overflow-hidden shadow-soft hover:shadow-rose-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-rosa-claro">
        {!imgError ? (
          <img
            src={product.imagem_url}
            alt={product.nome}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bege">
            <span className="text-5xl">🕯️</span>
          </div>
        )}

        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide ${
            categoryColors[product.categoria] ?? 'bg-rosa-claro text-subtexto'
          }`}
        >
          {product.categoria}
        </span>

        {/* Low stock warning */}
        {product.estoque <= 5 && product.estoque > 0 && (
          <span className="absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F2]/90 text-[#9E7A52] tracking-wide">
            Últimas unidades
          </span>
        )}

        {product.estoque === 0 && (
          <div className="absolute inset-0 bg-[#F5EFE6]/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-sm font-medium text-subtexto">Esgotado</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5 flex-1">
        <h3 className="font-serif text-lg font-medium text-titulo leading-snug">{product.nome}</h3>
        <p className="text-xs text-subtexto tracking-wider uppercase">{product.aroma}</p>
        <p className="text-sm text-subtexto leading-relaxed line-clamp-2 flex-1">
          {product.descricao}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#D9CBB8]">
          <span className="price text-xl">
            R${' '}
            {product.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>

          <motion.button
            onClick={handleAdd}
            disabled={product.estoque === 0}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              added
                ? 'bg-green-100 text-green-700'
                : product.estoque === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-rosa text-[#FAF7F2] hover:bg-[#9E7A52] hover:shadow-rose'
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
                Adicionado
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                Quero essa
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
