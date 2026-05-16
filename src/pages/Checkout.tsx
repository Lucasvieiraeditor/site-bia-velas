import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, CreditCard, Loader2, Minus, Plus, Trash2, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { createOrder, isSupabaseConfigured } from '../lib/supabase'
import type { Order } from '../types'

const MP_ACCESS_TOKEN = 'APP_USR-2258868822720925-050116-cc5053beb86ff19f470e519b05e13c47-203809776'

interface ShippingOption {
  id: number
  name: string
  price: number
  delivery_time: number
  company: { id: number; name: string }
}

interface FormData {
  nome: string
  email: string
  telefone: string
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

const emptyForm: FormData = {
  nome: '',
  email: '',
  telefone: '',
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
}

function formatPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function formatCEP(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

export default function Checkout() {
  const { items, totalPrice, clearCart, updateQuantity, removeItem } = useCart()
  const [form, setForm] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [loading, setLoading] = useState(false)
  const [fetchingCep, setFetchingCep] = useState(false)

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [shippingError, setShippingError] = useState<string | null>(null)
  const [calculatingShipping, setCalculatingShipping] = useState(false)
  const [shippingValidationError, setShippingValidationError] = useState<string | null>(null)

  const cepRaw = form.cep.replace(/\D/g, '')
  const canCalculateShipping = cepRaw.length === 8
  const finalTotal = totalPrice + (selectedShipping?.price ?? 0)

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-offwhite pt-16 md:pt-20 px-5 text-center gap-5">
        <span className="text-6xl">🛒</span>
        <h2 className="font-serif text-2xl text-titulo">Sua sacola está vazia</h2>
        <p className="text-subtexto text-sm">Escolha suas criações preferidas antes de continuar.</p>
        <Link to="/produtos" className="btn-primary">
          Ver coleção
        </Link>
      </div>
    )
  }

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value
    if (field === 'telefone') value = formatPhone(value)
    if (field === 'cep') {
      value = formatCEP(value)
      setShippingOptions([])
      setSelectedShipping(null)
      setShippingError(null)
      setShippingValidationError(null)
    }
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const fetchCep = async (cep: string) => {
    const raw = cep.replace(/\D/g, '')
    if (raw.length !== 8) return
    setFetchingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          rua: data.logradouro ?? prev.rua,
          bairro: data.bairro ?? prev.bairro,
          cidade: data.localidade ?? prev.cidade,
          estado: data.uf ?? prev.estado,
        }))
      }
    } catch {
      // silent fail — user fills manually
    } finally {
      setFetchingCep(false)
    }
  }

  const calculateShipping = async () => {
    if (!canCalculateShipping) return
    setCalculatingShipping(true)
    setShippingError(null)
    setShippingOptions([])
    setSelectedShipping(null)
    setShippingValidationError(null)

    try {
      const totalPeso = items.reduce((sum, item) => sum + (item.product.peso ?? 100) * item.quantidade, 0)
      const totalQuantidade = items.reduce((sum, item) => sum + item.quantidade, 0)

      const res = await fetch('/.netlify/functions/calcular-frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cepDestino: cepRaw,
          peso: totalPeso,
          quantidade: totalQuantidade,
        }),
      })

      if (!res.ok) throw new Error('API error')

      const data: Record<string, unknown>[] = await res.json()
      const valid: ShippingOption[] = data
        .filter((s) => !s.error && s.price != null && (s.company as { name: string } | undefined)?.name === 'Correios')
        .map((s) => ({
          id: s.id as number,
          name: s.name as string,
          price: parseFloat(s.price as string),
          delivery_time: s.delivery_time as number,
          company: s.company as { id: number; name: string },
        }))

      if (valid.length === 0) throw new Error('no options')
      setShippingOptions(valid)
    } catch {
      setShippingError('Não foi possível calcular o frete. Entre em contato pelo WhatsApp.')
    } finally {
      setCalculatingShipping(false)
    }
  }

  const validate = (): boolean => {
    const required: Array<keyof FormData> = ['nome', 'email', 'telefone', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado']
    const newErrors: Partial<FormData> = {}
    required.forEach((key) => {
      if (!form[key].trim()) newErrors[key] = 'Campo obrigatório'
    })
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'E-mail inválido'
    }
    setErrors(newErrors)
    if (!selectedShipping) {
      setShippingValidationError('Calcule e selecione uma opção de frete para continuar.')
    } else {
      setShippingValidationError(null)
    }
    return Object.keys(newErrors).length === 0 && !!selectedShipping
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      const orderItems = items.map((i) => ({
        produto_id: i.product.id,
        nome: i.product.nome,
        aroma: i.product.aroma,
        preco: i.product.preco,
        quantidade: i.quantidade,
        imagem_url: i.product.imagem_url,
      }))

      const orderPayload: Omit<Order, 'id' | 'created_at'> = {
        cliente_nome: form.nome,
        cliente_email: form.email,
        cliente_telefone: form.telefone,
        endereco: {
          cep: form.cep,
          rua: form.rua,
          numero: form.numero,
          complemento: form.complemento || undefined,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado,
        },
        itens: orderItems,
        valor_total: finalTotal,
        status: 'aguardando',
      }

      let orderId = `local-${Date.now()}`
      if (isSupabaseConfigured) {
        const order = await createOrder(orderPayload)
        orderId = order.id
      }

      // ─── MercadoPago: cria preferência de pagamento ──────────────────
      const mpItems = [
        ...orderItems.map((i) => ({
          title: i.nome,
          description: i.aroma || '',
          unit_price: i.preco,
          quantity: i.quantidade,
          currency_id: 'BRL',
        })),
        ...(selectedShipping ? [{
          title: `Frete — ${selectedShipping.name}`,
          description: `Correios · até ${selectedShipping.delivery_time} dias úteis`,
          unit_price: selectedShipping.price,
          quantity: 1,
          currency_id: 'BRL',
        }] : []),
      ]

      const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          external_reference: orderId,
          items: mpItems,
          payer: {
            name: form.nome.split(' ')[0],
            surname: form.nome.split(' ').slice(1).join(' ') || '',
            email: form.email,
            phone: { number: form.telefone.replace(/\D/g, '') },
          },
          back_urls: {
            success: `https://bybiaggi.com.br/confirmacao?pedido=${orderId}`,
            failure: 'https://bybiaggi.com.br/carrinho',
            pending: `https://bybiaggi.com.br/confirmacao?pedido=${orderId}`,
          },
          auto_return: 'approved',
        }),
      })
      const mpData = await mpRes.json()
      if (!mpRes.ok) throw new Error(mpData.message ?? 'Erro ao criar preferência de pagamento.')
      clearCart()
      window.location.href = mpData.init_point
    } catch (err) {
      console.error('Erro ao processar pedido:', err)
      alert('Não foi possível processar seu pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-offwhite pt-20 md:pt-24 pb-16 px-5 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 text-subtexto hover:text-titulo text-sm transition-colors duration-200"
          >
            <ArrowLeft size={15} />
            Voltar à coleção
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Contact */}
              <div className="bg-[#FAF7F2] rounded-2xl p-6 shadow-soft space-y-5">
                <h2 className="font-serif text-xl font-medium text-titulo">Seus dados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label">Nome completo *</label>
                    <input
                      type="text"
                      value={form.nome}
                      onChange={set('nome')}
                      placeholder="Como você se chama?"
                      className={`input-field ${errors.nome ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                    />
                    {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome}</p>}
                  </div>
                  <div>
                    <label className="label">E-mail *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      placeholder="seu@email.com"
                      className={`input-field ${errors.email ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="label">Telefone / WhatsApp *</label>
                    <input
                      type="tel"
                      value={form.telefone}
                      onChange={set('telefone')}
                      placeholder="(11) 99999-9999"
                      className={`input-field ${errors.telefone ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                    />
                    {errors.telefone && <p className="text-red-400 text-xs mt-1">{errors.telefone}</p>}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-[#FAF7F2] rounded-2xl p-6 shadow-soft space-y-5">
                <h2 className="font-serif text-xl font-medium text-titulo">Endereço de entrega</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">CEP *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.cep}
                        onChange={set('cep')}
                        onBlur={() => fetchCep(form.cep)}
                        placeholder="00000-000"
                        maxLength={9}
                        className={`input-field pr-10 ${errors.cep ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                      />
                      {fetchingCep && (
                        <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-rosa animate-spin" />
                      )}
                    </div>
                    {errors.cep && <p className="text-red-400 text-xs mt-1">{errors.cep}</p>}
                  </div>
                  <div>
                    <label className="label">Estado *</label>
                    <input
                      type="text"
                      value={form.estado}
                      onChange={set('estado')}
                      placeholder="SP"
                      maxLength={2}
                      className={`input-field uppercase ${errors.estado ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                    />
                    {errors.estado && <p className="text-red-400 text-xs mt-1">{errors.estado}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Rua / Avenida *</label>
                    <input
                      type="text"
                      value={form.rua}
                      onChange={set('rua')}
                      placeholder="Nome da rua"
                      className={`input-field ${errors.rua ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                    />
                    {errors.rua && <p className="text-red-400 text-xs mt-1">{errors.rua}</p>}
                  </div>
                  <div>
                    <label className="label">Número *</label>
                    <input
                      type="text"
                      value={form.numero}
                      onChange={set('numero')}
                      placeholder="123"
                      className={`input-field ${errors.numero ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                    />
                    {errors.numero && <p className="text-red-400 text-xs mt-1">{errors.numero}</p>}
                  </div>
                  <div>
                    <label className="label">Complemento</label>
                    <input
                      type="text"
                      value={form.complemento}
                      onChange={set('complemento')}
                      placeholder="Apto, bloco... (opcional)"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Bairro *</label>
                    <input
                      type="text"
                      value={form.bairro}
                      onChange={set('bairro')}
                      placeholder="Seu bairro"
                      className={`input-field ${errors.bairro ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                    />
                    {errors.bairro && <p className="text-red-400 text-xs mt-1">{errors.bairro}</p>}
                  </div>
                  <div>
                    <label className="label">Cidade *</label>
                    <input
                      type="text"
                      value={form.cidade}
                      onChange={set('cidade')}
                      placeholder="Sua cidade"
                      className={`input-field ${errors.cidade ? 'border-red-300 ring-1 ring-red-300' : ''}`}
                    />
                    {errors.cidade && <p className="text-red-400 text-xs mt-1">{errors.cidade}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping calculation */}
              <div className="bg-[#FAF7F2] rounded-2xl p-6 shadow-soft space-y-4">
                <div className="flex items-center gap-2">
                  <Truck size={17} className="text-subtexto" />
                  <h2 className="font-serif text-xl font-medium text-titulo">Calcular frete</h2>
                </div>

                {!canCalculateShipping && (
                  <p className="text-xs text-subtexto">Preencha o CEP de entrega acima para calcular o frete.</p>
                )}

                {canCalculateShipping && shippingOptions.length === 0 && !shippingError && (
                  <button
                    type="button"
                    onClick={calculateShipping}
                    disabled={calculatingShipping}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rosa text-[#FAF7F2] text-sm font-medium hover:bg-rosa/90 transition-colors duration-200 disabled:opacity-60"
                  >
                    {calculatingShipping ? (
                      <><Loader2 size={14} className="animate-spin" /> Calculando…</>
                    ) : (
                      <><Truck size={14} /> Calcular Frete</>
                    )}
                  </button>
                )}

                {shippingOptions.length > 0 && (
                  <div className="space-y-2">
                    {shippingOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { setSelectedShipping(opt); setShippingValidationError(null) }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                          selectedShipping?.id === opt.id
                            ? 'border-rosa bg-rosa/5 text-titulo'
                            : 'border-[#D9CBB8] bg-white/60 text-subtexto hover:border-rosa/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-colors ${
                            selectedShipping?.id === opt.id ? 'border-rosa bg-rosa' : 'border-[#D9CBB8]'
                          }`} />
                          <span className="font-medium text-titulo">{opt.name}</span>
                          <span className="text-subtexto text-xs hidden sm:inline">· Correios · até {opt.delivery_time} dias úteis</span>
                          <span className="text-subtexto text-xs sm:hidden">· {opt.delivery_time} dias</span>
                        </div>
                        <span className="font-medium text-dourado shrink-0 ml-3">
                          R$ {opt.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={calculateShipping}
                      disabled={calculatingShipping}
                      className="text-xs text-subtexto hover:text-rosa transition-colors mt-1 disabled:opacity-50"
                    >
                      {calculatingShipping ? 'Recalculando…' : 'Recalcular'}
                    </button>
                  </div>
                )}

                {shippingError && (
                  <div className="space-y-3">
                    <p className="text-sm text-subtexto">{shippingError}</p>
                    <a
                      href="https://wa.me/5511992930655"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-rosa hover:underline"
                    >
                      Falar no WhatsApp →
                    </a>
                    <div>
                      <button
                        type="button"
                        onClick={calculateShipping}
                        disabled={calculatingShipping}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rosa text-[#FAF7F2] text-sm font-medium hover:bg-rosa/90 transition-colors duration-200 disabled:opacity-60 mt-1"
                      >
                        {calculatingShipping ? (
                          <><Loader2 size={14} className="animate-spin" /> Calculando…</>
                        ) : (
                          <><Truck size={14} /> Tentar novamente</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {shippingValidationError && (
                  <p className="text-red-400 text-xs">{shippingValidationError}</p>
                )}
              </div>

              {/* Submit (mobile) */}
              <div className="lg:hidden">
                <SubmitButton loading={loading} finalTotal={finalTotal} />
              </div>
            </form>
          </motion.div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="bg-[#FAF7F2] rounded-2xl p-6 shadow-soft">
              <h2 className="font-serif text-xl font-medium text-titulo mb-5">Seu pedido</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-rosa-claro shrink-0">
                      <img
                        src={item.product.imagem_url}
                        alt={item.product.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-titulo text-sm leading-snug line-clamp-1">
                        {item.product.nome}
                      </p>
                      <p className="text-[11px] text-subtexto uppercase tracking-wider">
                        {item.product.aroma}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantidade - 1)}
                          className="w-5 h-5 rounded-full border border-[#D4C4B0] flex items-center justify-center hover:border-rosa text-subtexto"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-medium text-titulo">{item.quantidade}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantidade + 1)}
                          className="w-5 h-5 rounded-full border border-[#D4C4B0] flex items-center justify-center hover:border-rosa text-subtexto"
                        >
                          <Plus size={10} />
                        </button>
                        <span className="ml-auto text-sm font-medium text-dourado">
                          R$ {(item.product.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="text-subtexto hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[#D9CBB8] space-y-2">
                <div className="flex justify-between text-sm text-subtexto">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-subtexto">Frete</span>
                  <span className="text-titulo">
                    {selectedShipping
                      ? `R$ ${selectedShipping.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '—'}
                  </span>
                </div>
                {selectedShipping && (
                  <p className="text-[11px] text-subtexto">
                    {selectedShipping.name} · Correios · até {selectedShipping.delivery_time} dias úteis
                  </p>
                )}
                <div className="flex justify-between font-serif text-lg font-medium text-titulo pt-2 border-t border-[#D9CBB8]">
                  <span>Total</span>
                  <span>R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Security badges */}
            <div className="bg-[#FAF7F2] rounded-2xl p-5 shadow-soft">
              <div className="flex items-center gap-2 text-subtexto text-xs mb-3">
                <ShieldCheck size={15} className="text-green-500" />
                <span className="font-medium text-titulo text-sm">Compra 100% segura</span>
              </div>
              <p className="text-subtexto text-xs leading-relaxed">
                Seus dados são protegidos. Pagamento processado pelo MercadoPago com criptografia SSL.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <CreditCard size={20} className="text-subtexto" />
                <p className="text-xs text-subtexto">Cartão, Pix, Boleto e muito mais</p>
              </div>
            </div>

            {/* Submit (desktop) */}
            <div className="hidden lg:block">
              <button
                type="submit"
                form="checkout-form"
                onClick={handleSubmit as unknown as React.MouseEventHandler}
                disabled={loading}
                className="btn-primary w-full justify-center py-4 text-base gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processando…
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Finalizar Pagamento
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

function SubmitButton({ loading, finalTotal }: { loading: boolean; finalTotal: number }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn-primary w-full justify-center py-4 text-base gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Processando…
        </>
      ) : (
        <>
          <CreditCard size={18} />
          Pagar R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </>
      )}
    </button>
  )
}
