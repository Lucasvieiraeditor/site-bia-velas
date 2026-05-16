import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'
import { mockProducts } from '../data/products'
import { fetchProducts, isSupabaseConfigured } from '../lib/supabase'
import type { Product, ProductCategory } from '../types'

const categories: Array<'Todas' | ProductCategory> = [
  'Todas',
  'Relaxamento',
  'Energia',
  'Presente',
  'Edição Limitada',
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const paramCategory = searchParams.get('categoria') ?? 'Todas'

  const [activeCategory, setActiveCategory] = useState<'Todas' | ProductCategory>(
    categories.includes(paramCategory as ProductCategory) ? (paramCategory as 'Todas' | ProductCategory) : 'Todas',
  )
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = useCallback(async (category: string) => {
    setLoading(true)
    setError(null)
    try {
      if (isSupabaseConfigured) {
        const data = await fetchProducts(category === 'Todas' ? undefined : category)
        setProducts(data)
      } else {
        // Fallback to mock data when Supabase is not configured
        await new Promise((r) => setTimeout(r, 300))
        const filtered =
          category === 'Todas'
            ? mockProducts
            : mockProducts.filter((p) => p.categoria === category)
        setProducts(filtered)
      }
    } catch {
      setError('Não foi possível carregar as criações. Tente novamente.')
      setProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts(activeCategory)
  }, [activeCategory, loadProducts])

  const handleCategory = (cat: 'Todas' | ProductCategory) => {
    setActiveCategory(cat)
    if (cat === 'Todas') {
      setSearchParams({})
    } else {
      setSearchParams({ categoria: cat })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <main className="min-h-screen pt-16 md:pt-20 bg-offwhite">
        {/* Header */}
        <div className="bg-[#FAF7F2] border-b border-[#D9CBB8]">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-24 text-center">
            <ScrollReveal>
              <p className="text-[11px] font-medium text-dourado tracking-[0.22em] uppercase mb-4">
                Nossa Coleção Completa
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-medium text-titulo">
                A Nossa Coleção
              </h1>
              <div className="w-8 h-px bg-dourado mx-auto mt-5" />
              <p className="section-subtitle mt-6 max-w-md mx-auto">
                Cada vela criada com intenção e cuidado — escolha a fragrância que conta a sua história.
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-16 md:top-20 z-20 bg-[#F5EFE6]/95 backdrop-blur-sm border-b border-[#D9CBB8]">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-0.5">
              <SlidersHorizontal size={16} className="text-subtexto shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-rosa text-white shadow-rose'
                      : 'bg-[#E4D8C8] text-subtexto hover:bg-rosa-claro hover:text-titulo'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {activeCategory !== 'Todas' && (
                <button
                  onClick={() => handleCategory('Todas')}
                  className="shrink-0 flex items-center gap-1 text-xs text-subtexto hover:text-rosa transition-colors"
                >
                  <X size={13} />
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-20">
          {error && (
            <div className="text-center py-8 text-subtexto text-sm">{error}</div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col animate-pulse">
                    <div className="aspect-[3/4] bg-rosa-claro/60 rounded-lg" />
                    <div className="pt-4 space-y-2.5">
                      <div className="h-2.5 bg-[#E4D8C8] rounded-full w-1/3" />
                      <div className="h-4 bg-[#E4D8C8] rounded-full w-3/4" />
                      <div className="h-3 bg-[#E4D8C8] rounded-full w-1/4" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <span className="text-6xl block mb-4">🕯️</span>
                <h3 className="font-serif text-2xl text-titulo mb-2">
                  Nenhuma criação encontrada
                </h3>
                <p className="text-subtexto text-sm">
                  Tente outra categoria ou veja toda a coleção.
                </p>
                <button
                  onClick={() => handleCategory('Todas')}
                  className="btn-primary mt-6"
                >
                  Ver todas
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`products-${activeCategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              >
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} delay={i * 0.05} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Count */}
          {!loading && products.length > 0 && (
            <p className="text-center text-subtexto text-sm mt-10">
              {products.length} {products.length === 1 ? 'criação encontrada' : 'criações encontradas'}
              {activeCategory !== 'Todas' && ` em ${activeCategory}`}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
