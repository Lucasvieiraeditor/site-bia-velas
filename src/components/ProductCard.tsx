import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  delay?: number
}

export default function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col group"
    >
      <Link
        to={`/produtos/${product.id}`}
        aria-label={`Ver detalhes de ${product.nome}`}
        className="flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-rosa focus-visible:ring-offset-2 rounded-lg"
      >
        {/* Portrait image */}
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

          {/* Badges */}
          {product.estoque <= 5 && product.estoque > 0 && (
            <span className="absolute top-3 left-3 text-[9px] font-medium px-2.5 py-1 rounded-full bg-[#FAF7F2]/90 text-dourado tracking-widest uppercase">
              Últimas unidades
            </span>
          )}

          {product.estoque === 0 && (
            <div className="absolute inset-0 bg-[#F5EFE6]/45 flex items-center justify-center">
              <span className="text-xs font-medium text-subtexto bg-[#FAF7F2]/80 px-4 py-2 rounded-full tracking-wide">
                Esgotado
              </span>
            </div>
          )}
        </div>

        {/* Info below image */}
        <div className="pt-5">
          {/* Categoria com dot accent */}
          <p className="flex items-center gap-1.5 text-[10px] font-medium text-subtexto/50 tracking-[0.18em] uppercase mb-2">
            <span className="w-1 h-1 rounded-full bg-rosa/50 inline-block flex-shrink-0" />
            {product.categoria}
          </p>
          <h3 className="font-serif text-base sm:text-[1.05rem] font-medium text-titulo leading-snug">
            {product.nome}
          </h3>
          {/* Linha separadora sutil + preço */}
          <div className="flex items-center gap-3 mt-3.5">
            <div className="h-px flex-1 bg-[#D9CBB8]/60" />
            <p className="font-serif text-dourado font-medium text-[0.9rem] tracking-wide">
              R$ {product.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
