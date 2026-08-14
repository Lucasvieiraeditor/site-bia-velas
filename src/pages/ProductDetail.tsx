import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Check, Loader2, Package } from 'lucide-react'
import Footer from '../components/Footer'
import ShippingEstimator from '../components/ShippingEstimator'
import ScrollReveal from '../components/ScrollReveal'
import { fetchProductById, isSupabaseConfigured } from '../lib/supabase'
import { mockProducts } from '../data/products'
import { useAromaSelector } from '../hooks/useAromaSelector'
import type { Product } from '../types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setProduct(null)

    ;(async () => {
      try {
        if (isSupabaseConfigured) {
          const data = await fetchProductById(id)
          if (!data) throw new Error('not found')
          if (!cancelled) setProduct(data)
        } else {
          const found = mockProducts.find((p) => p.id === id)
          if (!found) throw new Error('not found')
          if (!cancelled) setProduct(found)
        }
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite pt-16 md:pt-20">
        <Loader2 size={28} className="animate-spin text-rosa" />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-offwhite pt-16 md:pt-20 px-5 text-center gap-5">
        <span className="text-6xl">🕯️</span>
        <h2 className="font-serif text-2xl text-titulo">Criação não encontrada</h2>
        <p className="text-subtexto text-sm">Esse produto pode ter sido removido ou o link está incorreto.</p>
        <Link to="/produtos" className="btn-primary">Ver coleção</Link>
      </div>
    )
  }

  return <ProductDetailView product={product} />
}

function ProductDetailView({ product }: { product: Product }) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const { aromas, selectedAroma, pickAroma, showAromaWarning, handleAdd, added } = useAromaSelector(product)

  const images = product.imagens ? product.imagens.split(',').filter(Boolean) : [product.imagem_url]
  const currentImage = images[activeImage] ?? images[0]

  const infoAdicionais = [
    product.peso ? { label: 'Peso', value: `${product.peso} g` } : null,
    { label: 'Categoria', value: product.subcategoria ? `${product.categoria} · ${product.subcategoria}` : product.categoria },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      <main className="min-h-screen bg-offwhite pt-20 md:pt-24 pb-16 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-subtexto hover:text-titulo text-sm transition-colors duration-200"
            >
              <ArrowLeft size={15} />
              Voltar
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Gallery */}
            <ScrollReveal direction="left">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-rosa-claro">
                {!imgError ? (
                  <img
                    src={currentImage}
                    alt={product.nome}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-bege">
                    <span className="text-6xl">🕯️</span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {images.map((url, i) => (
                    <button
                      key={`${url}-${i}`}
                      type="button"
                      onClick={() => { setActiveImage(i); setImgError(false) }}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors duration-200 ${
                        activeImage === i ? 'border-rosa' : 'border-transparent hover:border-[#D9CBB8]'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </ScrollReveal>

            {/* Info + buy box */}
            <ScrollReveal direction="right" delay={0.1}>
              <p className="flex items-center gap-1.5 text-[10px] font-medium text-subtexto/50 tracking-[0.18em] uppercase mb-3">
                <span className="w-1 h-1 rounded-full bg-rosa/50 inline-block flex-shrink-0" />
                {product.subcategoria ? `${product.categoria} · ${product.subcategoria}` : product.categoria}
              </p>
              <h1 className="font-serif text-2xl md:text-3xl font-medium text-titulo leading-snug">
                {product.nome}
              </h1>
              <p className="font-serif text-dourado font-medium text-xl tracking-wide mt-3">
                R$ {product.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>

              {aromas.length > 1 && (
                <div className="mt-6">
                  <p className="label mb-2">Escolha o aroma</p>
                  <div className="flex flex-wrap gap-2">
                    {aromas.map((aroma) => (
                      <button
                        key={aroma}
                        type="button"
                        onClick={() => pickAroma(aroma)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                          selectedAroma === aroma
                            ? 'bg-rosa text-white'
                            : 'bg-[#FAF7F2] border border-[#D9CBB8] text-titulo hover:border-rosa'
                        }`}
                      >
                        {aroma}
                      </button>
                    ))}
                  </div>
                  {showAromaWarning && (
                    <p className="text-red-400 text-xs mt-2">Escolha um aroma antes de adicionar.</p>
                  )}
                </div>
              )}
              {aromas.length === 1 && (
                <p className="text-subtexto text-sm mt-4">Aroma: <span className="text-titulo font-medium">{aromas[0]}</span></p>
              )}

              <button
                onClick={handleAdd}
                disabled={product.estoque === 0}
                className={`w-full justify-center mt-6 flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide transition-colors duration-200 ${
                  added
                    ? 'bg-[#E8F5EE] text-[#3D8B5E]'
                    : product.estoque === 0
                    ? 'bg-[#F5F5F5] text-subtexto cursor-not-allowed'
                    : 'bg-rosa text-white hover:bg-[#9E7A52]'
                }`}
              >
                {added ? (
                  <><Check size={16} /> Adicionado à sacola</>
                ) : product.estoque === 0 ? (
                  'Esgotado'
                ) : (
                  <><ShoppingBag size={16} /> Adicionar à sacola</>
                )}
              </button>

              <div className="mt-6">
                <ShippingEstimator product={product} />
              </div>
            </ScrollReveal>
          </div>

          {/* Description + additional info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mt-14 pt-10 border-t border-[#D9CBB8]">
            {product.descricao && (
              <ScrollReveal>
                <h2 className="font-serif text-lg font-medium text-titulo mb-3">Sobre esta criação</h2>
                <p className="text-subtexto text-sm leading-relaxed whitespace-pre-line">{product.descricao}</p>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.1}>
              <h2 className="font-serif text-lg font-medium text-titulo mb-3 flex items-center gap-2">
                <Package size={16} className="text-subtexto" />
                Informações adicionais
              </h2>
              <dl className="space-y-2">
                {infoAdicionais.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm border-b border-[#D9CBB8] pb-2">
                    <dt className="text-subtexto">{label}</dt>
                    <dd className="text-titulo font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
