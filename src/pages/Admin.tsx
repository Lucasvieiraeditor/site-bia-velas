import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, Package, ShoppingBag, TrendingUp, Plus, Edit2, Trash2,
  Eye, EyeOff, X, Check, Loader2, Search, ChevronDown, UploadCloud,
  AlertCircle, Flame
} from 'lucide-react'
import {
  supabase, signIn, signOut, getSession,
  fetchProducts, fetchOrders,
  createProduct, updateProduct, deleteProduct, updateOrderStatus,
  uploadProductImage, isSupabaseConfigured,
} from '../lib/supabase'
import { mockProducts } from '../data/products'
import type { Product, Order, OrderStatus, ProductCategory } from '../types'

// ── Auth Gate ─────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Preencha e-mail e senha.'); return }
    setLoading(true)
    setError('')
    try {
      if (!isSupabaseConfigured) {
        // Demo login — any credentials work
        await new Promise((r) => setTimeout(r, 800))
        onLogin()
        return
      }
      const { error: authError } = await signIn(email, password)
      if (authError) throw authError
      onLogin()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenciais inválidas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-rosa-claro flex items-center justify-center mx-auto mb-4">
            <Flame size={24} className="text-rosa" />
          </div>
          <h1 className="font-serif text-2xl font-medium text-titulo">Área Admin</h1>
          <p className="text-subtexto text-sm mt-1">Bia Velas Aromáticas</p>
          {!isSupabaseConfigured && (
            <p className="text-xs text-dourado mt-2 bg-[#FFF3E0] rounded-lg px-3 py-2">
              Modo demonstração — configure o Supabase para usar autenticação real.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-soft space-y-5">
          <div>
            <label className="label">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="admin@biavelas.com.br"
              className="input-field"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label">Senha</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                className="input-field pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtexto hover:text-titulo transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle size={13} />
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon size={20} />
      </div>
      <p className="text-subtexto text-sm">{label}</p>
      <p className="font-serif text-2xl font-medium text-titulo mt-1">{value}</p>
    </div>
  )
}

// ── Product Form Modal ─────────────────────────────────────────────────────────

const CATEGORIES: ProductCategory[] = ['Relaxamento', 'Energia', 'Presente', 'Edição Limitada']

interface ProductFormProps {
  initial?: Product
  onSave: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>
  onClose: () => void
}

function ProductForm({ initial, onSave, onClose }: ProductFormProps) {
  const [form, setForm] = useState({
    nome: initial?.nome ?? '',
    descricao: initial?.descricao ?? '',
    aroma: initial?.aroma ?? '',
    preco: initial?.preco?.toString() ?? '',
    categoria: initial?.categoria ?? ('Relaxamento' as ProductCategory),
    imagem_url: initial?.imagem_url ?? '',
    estoque: initial?.estoque?.toString() ?? '10',
    ativo: initial?.ativo ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!isSupabaseConfigured) {
      setForm((prev) => ({ ...prev, imagem_url: URL.createObjectURL(file) }))
      return
    }
    setUploading(true)
    try {
      const url = await uploadProductImage(file)
      setForm((prev) => ({ ...prev, imagem_url: url }))
    } catch {
      setError('Erro ao fazer upload da imagem.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome || !form.preco || !form.categoria) { setError('Preencha os campos obrigatórios.'); return }
    setLoading(true)
    setError('')
    try {
      await onSave({
        nome: form.nome,
        descricao: form.descricao,
        aroma: form.aroma,
        preco: parseFloat(form.preco),
        categoria: form.categoria,
        imagem_url: form.imagem_url || 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=600&q=80',
        estoque: parseInt(form.estoque) || 0,
        ativo: form.ativo,
      })
      onClose()
    } catch {
      setError('Erro ao salvar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-titulo/40 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="bg-white rounded-2xl shadow-soft-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F5EDE4]">
          <h2 className="font-serif text-lg font-medium text-titulo">
            {initial ? 'Editar criação' : 'Nova criação'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-rosa-claro text-subtexto transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image upload */}
          <div>
            <label className="label">Imagem do produto</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative border-2 border-dashed border-[#EDE0DD] rounded-xl overflow-hidden cursor-pointer hover:border-rosa transition-colors aspect-video bg-rosa-claro/30"
            >
              {form.imagem_url ? (
                <img src={form.imagem_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-subtexto">
                  {uploading ? <Loader2 size={24} className="animate-spin text-rosa" /> : <UploadCloud size={24} />}
                  <span className="text-sm">{uploading ? 'Enviando…' : 'Clique para enviar foto'}</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <input
              type="url"
              value={form.imagem_url}
              onChange={set('imagem_url')}
              placeholder="Ou cole uma URL de imagem"
              className="input-field mt-2 text-sm"
            />
          </div>

          <div>
            <label className="label">Nome da criação *</label>
            <input type="text" value={form.nome} onChange={set('nome')} placeholder="Vela Calma da Tarde" className="input-field" required />
          </div>

          <div>
            <label className="label">Aroma</label>
            <input type="text" value={form.aroma} onChange={set('aroma')} placeholder="Lavanda & Baunilha" className="input-field" />
          </div>

          <div>
            <label className="label">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={set('descricao')}
              placeholder="Descreva a experiência que essa vela proporciona..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Preço (R$) *</label>
              <input type="number" value={form.preco} onChange={set('preco')} placeholder="89.90" step="0.01" min="0" className="input-field" required />
            </div>
            <div>
              <label className="label">Estoque</label>
              <input type="number" value={form.estoque} onChange={set('estoque')} placeholder="10" min="0" className="input-field" />
            </div>
          </div>

          <div>
            <label className="label">Categoria *</label>
            <select value={form.categoria} onChange={set('categoria')} className="input-field">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.ativo} onChange={(e) => setForm((p) => ({ ...p, ativo: e.target.checked }))} className="w-4 h-4 accent-rosa rounded" />
            <span className="text-sm text-titulo">Produto ativo (visível na loja)</span>
          </label>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle size={13} />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-3">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3 disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {loading ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ── Status Badge ──────────────────────────────────────────────────────────────

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  aguardando: { label: 'Aguardando', color: 'bg-[#FFF3E0] text-[#C9A96E]' },
  pago: { label: 'Pago', color: 'bg-[#E8F5EE] text-[#3D8B5E]' },
  enviado: { label: 'Enviado', color: 'bg-[#E8EFF5] text-[#3D6B8B]' },
  entregue: { label: 'Entregue', color: 'bg-rosa-claro text-[#C06080]' },
}

// ── Main Admin Dashboard ───────────────────────────────────────────────────────

type Tab = 'dashboard' | 'produtos' | 'pedidos'

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [productSearch, setProductSearch] = useState('')
  const [orderFilter, setOrderFilter] = useState<OrderStatus | 'todos'>('todos')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoadingData(true)
    try {
      if (isSupabaseConfigured) {
        const [prods, ords] = await Promise.all([fetchProducts(), fetchOrders()])
        setProducts(prods)
        setOrders(ords)
      } else {
        await new Promise((r) => setTimeout(r, 400))
        setProducts(mockProducts)
        setOrders([
          {
            id: 'demo-1',
            created_at: new Date().toISOString(),
            cliente_nome: 'Mariana Costa',
            cliente_email: 'mariana@email.com',
            cliente_telefone: '(11) 99999-0001',
            endereco: { cep: '01310-100', rua: 'Av. Paulista', numero: '1000', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP' },
            itens: [{ produto_id: '1', nome: 'Vela Calma da Tarde', aroma: 'Lavanda & Baunilha', preco: 89.90, quantidade: 2, imagem_url: mockProducts[0].imagem_url }],
            valor_total: 179.80,
            status: 'pago',
          },
          {
            id: 'demo-2',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            cliente_nome: 'Juliana Ferreira',
            cliente_email: 'juliana@email.com',
            cliente_telefone: '(21) 99999-0002',
            endereco: { cep: '20050-001', rua: 'Av. Rio Branco', numero: '45', bairro: 'Centro', cidade: 'Rio de Janeiro', estado: 'RJ' },
            itens: [{ produto_id: '4', nome: 'Vela Noite Estrelada', aroma: 'Jasmim & Sândalo', preco: 109.90, quantidade: 1, imagem_url: mockProducts[3].imagem_url }],
            valor_total: 109.90,
            status: 'enviado',
          },
          {
            id: 'demo-3',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            cliente_nome: 'Camila Rodrigues',
            cliente_email: 'camila@email.com',
            cliente_telefone: '(31) 99999-0003',
            endereco: { cep: '30130-110', rua: 'Av. Afonso Pena', numero: '777', bairro: 'Centro', cidade: 'Belo Horizonte', estado: 'MG' },
            itens: [{ produto_id: '2', nome: 'Vela Ritual da Manhã', aroma: 'Eucalipto & Limão Siciliano', preco: 79.90, quantidade: 3, imagem_url: mockProducts[1].imagem_url }],
            valor_total: 239.70,
            status: 'aguardando',
          },
        ] as Order[])
      }
    } catch (e) {
      console.error('Erro ao carregar dados:', e)
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Dashboard stats
  const today = new Date().toDateString()
  const ordersToday = orders.filter((o) => new Date(o.created_at).toDateString() === today)
  const currentMonth = new Date().getMonth()
  const ordersMonth = orders.filter((o) => new Date(o.created_at).getMonth() === currentMonth)
  const totalRevenue = orders.filter((o) => o.status === 'pago' || o.status === 'enviado' || o.status === 'entregue').reduce((a, o) => a + o.valor_total, 0)

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Remover este produto da loja?')) return
    setDeletingId(id)
    try {
      if (isSupabaseConfigured) {
        await deleteProduct(id)
      }
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('Erro ao remover produto.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      const updated = { ...product, ativo: !product.ativo }
      if (isSupabaseConfigured) {
        await updateProduct(product.id, { ativo: !product.ativo })
      }
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)))
    } catch {
      alert('Erro ao atualizar produto.')
    }
  }

  const handleSaveProduct = async (data: Omit<Product, 'id' | 'created_at'>) => {
    if (editingProduct) {
      if (isSupabaseConfigured) {
        const updated = await updateProduct(editingProduct.id, data)
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)))
      } else {
        setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, ...data } : p))
      }
    } else {
      if (isSupabaseConfigured) {
        const created = await createProduct(data)
        setProducts((prev) => [created, ...prev])
      } else {
        const newProd = { ...data, id: `local-${Date.now()}`, created_at: new Date().toISOString() }
        setProducts((prev) => [newProd, ...prev])
      }
    }
  }

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      if (isSupabaseConfigured) {
        await updateOrderStatus(id, status)
      }
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } catch {
      alert('Erro ao atualizar status.')
    }
  }

  const filteredProducts = products.filter((p) =>
    p.nome.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.aroma.toLowerCase().includes(productSearch.toLowerCase()),
  )

  const filteredOrders = orderFilter === 'todos' ? orders : orders.filter((o) => o.status === orderFilter)

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Top bar */}
      <header className="bg-white border-b border-[#F5EDE4] px-5 md:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-rosa" />
          <span className="font-serif text-lg font-medium text-titulo">Admin</span>
          <span className="text-subtexto text-sm hidden sm:inline">— Bia Velas</span>
        </div>
        <div className="flex items-center gap-4">
          {!isSupabaseConfigured && (
            <span className="text-xs text-dourado bg-[#FFF3E0] px-3 py-1 rounded-full hidden sm:inline">
              Modo demonstração
            </span>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-subtexto hover:text-titulo transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#F5EDE4]">
          {([['dashboard', 'Dashboard'], ['produtos', 'Produtos'], ['pedidos', 'Pedidos']] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 -mb-[2px] ${
                tab === t
                  ? 'text-rosa border-rosa'
                  : 'text-subtexto border-transparent hover:text-titulo hover:border-[#EDE0DD]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-rosa" />
          </div>
        ) : (
          <>
            {/* ── DASHBOARD ── */}
            {tab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-serif text-2xl font-medium text-titulo mb-6">Visão geral</h1>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard icon={Package} label="Total de produtos" value={products.filter((p) => p.ativo).length} color="bg-rosa-claro text-rosa" />
                  <StatCard icon={ShoppingBag} label="Pedidos hoje" value={ordersToday.length} color="bg-bege text-dourado" />
                  <StatCard icon={TrendingUp} label="Pedidos no mês" value={ordersMonth.length} color="bg-[#E8F5EE] text-[#3D8B5E]" />
                  <StatCard
                    icon={TrendingUp}
                    label="Faturamento"
                    value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    color="bg-[#E8EFF5] text-[#3D6B8B]"
                  />
                </div>

                {/* Recent orders preview */}
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-serif text-lg font-medium text-titulo">Pedidos recentes</h2>
                    <button onClick={() => setTab('pedidos')} className="text-rosa text-sm hover:underline">
                      Ver todos
                    </button>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-3 border-b border-[#F5EDE4] last:border-0">
                        <div>
                          <p className="text-sm font-medium text-titulo">{order.cliente_nome}</p>
                          <p className="text-xs text-subtexto">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-sm text-dourado">
                            R$ {order.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[order.status].color}`}>
                            {statusConfig[order.status].label}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-subtexto text-sm text-center py-6">Nenhum pedido ainda.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PRODUTOS ── */}
            {tab === 'produtos' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h1 className="font-serif text-2xl font-medium text-titulo">Produtos</h1>
                  <button onClick={() => setNewProduct(true)} className="btn-primary text-sm">
                    <Plus size={15} />
                    Nova criação
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtexto" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar por nome ou aroma..."
                    className="input-field pl-11"
                  />
                </div>

                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-offwhite border-b border-[#F5EDE4]">
                        <tr>
                          {['Produto', 'Aroma', 'Preço', 'Estoque', 'Status', 'Ações'].map((h) => (
                            <th key={h} className="text-left text-xs font-medium text-subtexto uppercase tracking-wider px-5 py-3.5">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F5EDE4]">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-offwhite/60 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-rosa-claro shrink-0">
                                  <img src={product.imagem_url} alt={product.nome} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-titulo line-clamp-1">{product.nome}</p>
                                  <p className="text-xs text-subtexto">{product.categoria}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-subtexto">{product.aroma}</td>
                            <td className="px-5 py-4 text-sm font-medium text-dourado">
                              R$ {product.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`text-sm font-medium ${product.estoque <= 5 ? 'text-amber-500' : 'text-titulo'}`}>
                                {product.estoque}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => handleToggleActive(product)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                                  product.ativo
                                    ? 'bg-[#E8F5EE] text-[#3D8B5E] hover:bg-[#d2ede0]'
                                    : 'bg-[#F5F5F5] text-subtexto hover:bg-[#ebebeb]'
                                }`}
                              >
                                {product.ativo ? 'Ativo' : 'Inativo'}
                              </button>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingProduct(product)}
                                  className="p-1.5 rounded-lg hover:bg-rosa-claro text-subtexto hover:text-rosa transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  disabled={deletingId === product.id}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-subtexto hover:text-red-500 transition-colors disabled:opacity-40"
                                  title="Remover"
                                >
                                  {deletingId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center text-subtexto text-sm py-10">
                              Nenhum produto encontrado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PEDIDOS ── */}
            {tab === 'pedidos' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h1 className="font-serif text-2xl font-medium text-titulo">Pedidos</h1>
                  <div className="flex gap-2 flex-wrap">
                    {(['todos', 'aguardando', 'pago', 'enviado', 'entregue'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setOrderFilter(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          orderFilter === s
                            ? 'bg-rosa text-white shadow-rose'
                            : 'bg-white text-subtexto hover:bg-rosa-claro'
                        }`}
                      >
                        {s === 'todos' ? 'Todos' : statusConfig[s].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-soft p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[order.status].color}`}>
                              {statusConfig[order.status].label}
                            </span>
                            <span className="text-xs text-subtexto font-mono">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                          <p className="font-medium text-titulo">{order.cliente_nome}</p>
                          <p className="text-sm text-subtexto">{order.cliente_email} · {order.cliente_telefone}</p>
                          <p className="text-xs text-subtexto mt-1">
                            {order.endereco.cidade}, {order.endereco.estado} ·{' '}
                            {new Date(order.created_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-xl font-medium text-dourado">
                            R$ {order.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-subtexto mt-0.5">{order.itens.length} {order.itens.length === 1 ? 'item' : 'itens'}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mt-4 pt-4 border-t border-[#F5EDE4] flex gap-2 flex-wrap">
                        {order.itens.map((item) => (
                          <div key={item.produto_id} className="flex items-center gap-2 bg-offwhite rounded-xl px-3 py-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-rosa-claro">
                              <img src={item.imagem_url} alt={item.nome} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-titulo leading-none">{item.nome}</p>
                              <p className="text-[10px] text-subtexto mt-0.5">x{item.quantidade}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Status update */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs text-subtexto">Atualizar status:</span>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="appearance-none bg-offwhite border border-[#EDE0DD] text-sm text-titulo rounded-lg pl-3 pr-7 py-1.5 cursor-pointer hover:border-rosa focus:outline-none focus:ring-1 focus:ring-rosa"
                          >
                            {(['aguardando', 'pago', 'enviado', 'entregue'] as OrderStatus[]).map((s) => (
                              <option key={s} value={s}>{statusConfig[s].label}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-subtexto pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-16 text-subtexto">
                      <Package size={40} className="mx-auto mb-3 text-rosa-claro" />
                      <p>Nenhum pedido encontrado.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Product form modals */}
      <AnimatePresence>
        {(newProduct || editingProduct) && (
          <ProductForm
            initial={editingProduct ?? undefined}
            onSave={handleSaveProduct}
            onClose={() => { setNewProduct(false); setEditingProduct(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Root Admin Page ────────────────────────────────────────────────────────────

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false)
      return
    }
    getSession().then(({ data }) => {
      setAuthed(!!data.session)
      setChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, session) => {
      setAuthed(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    if (isSupabaseConfigured) await signOut()
    setAuthed(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <Loader2 size={28} className="animate-spin text-rosa" />
      </div>
    )
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />
  return <AdminDashboard onLogout={handleLogout} />
}
