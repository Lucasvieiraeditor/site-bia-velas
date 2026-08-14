import { createClient } from '@supabase/supabase-js'
import type { Product, Order, Coupon } from '../types'

const SUPABASE_URL = 'https://vnmqdyzjbtouanivsadf.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_mzYk0z87Jsv4TW7gz1i6rA_1wYByL0h'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const isSupabaseConfigured = true

// ── Produtos ────────────────────────────────────────────────────────────────

export async function fetchProducts(categoria?: string, subcategoria?: string): Promise<Product[]> {
  let query = supabase
    .from('produtos_bia')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: false })

  if (categoria && categoria !== 'Todas') {
    query = query.eq('categoria', categoria)
  }

  if (subcategoria) {
    query = query.eq('subcategoria', subcategoria)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Product[]
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('produtos_bia')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Product[]
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('produtos_bia')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Product | null
}

export async function createProduct(
  product: Omit<Product, 'id' | 'created_at'>,
): Promise<Product> {
  const { data, error } = await supabase.from('produtos_bia').insert(product).select().single()
  if (error) throw error
  return data as Product
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at'>>,
): Promise<Product> {
  const { data, error } = await supabase
    .from('produtos_bia')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('produtos_bia').delete().eq('id', id)
  if (error) throw error
}

// ── Pedidos ─────────────────────────────────────────────────────────────────

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at'>,
): Promise<Order> {
  const { data, error } = await supabase.from('pedidos_bia').insert(order).select().single()
  if (error) throw error
  return data as Order
}

export async function updateOrder(
  id: string,
  updates: Partial<Omit<Order, 'id' | 'created_at'>>,
): Promise<Order> {
  const { data, error } = await supabase
    .from('pedidos_bia')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Order
}

// Evita duplicar pedido quando o cliente abandona o checkout e volta pra pagar de novo:
// procura um pedido "aguardando" recente (últimas 24h) com o mesmo e-mail pra reaproveitar.
export async function findRecentPendingOrder(email: string): Promise<Order | null> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('pedidos_bia')
    .select('*')
    .ilike('cliente_email', email.trim())
    .eq('status', 'aguardando')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as Order | null
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('pedidos_bia')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((row) => {
    const itens = Array.isArray(row.itens)
      ? row.itens
      : typeof row.itens === 'string'
      ? (() => { try { return JSON.parse(row.itens) } catch { return [] } })()
      : []
    const endereco = row.endereco && typeof row.endereco === 'object' && !Array.isArray(row.endereco)
      ? row.endereco
      : typeof row.endereco === 'string'
      ? (() => { try { return JSON.parse(row.endereco) } catch { return {} } })()
      : {}
    return { ...row, itens, endereco }
  }) as Order[]
}

export async function updateOrderStatus(
  id: string,
  status: Order['status'],
): Promise<void> {
  const { error } = await supabase.from('pedidos_bia').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from('pedidos_bia').delete().eq('id', id)
  if (error) throw error
}

// ── Cupons ──────────────────────────────────────────────────────────────────

export async function fetchCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from('cupons_bia')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Coupon[]
}

export async function fetchActiveCouponByCode(codigo: string): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from('cupons_bia')
    .select('*')
    .eq('codigo', codigo.trim().toUpperCase())
    .eq('ativo', true)
    .maybeSingle()
  if (error) throw error
  return data as Coupon | null
}

export async function createCoupon(
  coupon: Omit<Coupon, 'id' | 'created_at'>,
): Promise<Coupon> {
  const { data, error } = await supabase
    .from('cupons_bia')
    .insert({ ...coupon, codigo: coupon.codigo.trim().toUpperCase() })
    .select()
    .single()
  if (error) throw error
  return data as Coupon
}

export async function updateCoupon(
  id: string,
  updates: Partial<Omit<Coupon, 'id' | 'created_at'>>,
): Promise<Coupon> {
  const { data, error } = await supabase
    .from('cupons_bia')
    .update(updates.codigo ? { ...updates, codigo: updates.codigo.trim().toUpperCase() } : updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Coupon
}

export async function deleteCoupon(id: string): Promise<void> {
  const { error } = await supabase.from('cupons_bia').delete().eq('id', id)
  if (error) throw error
}

// ── Upload de imagem ─────────────────────────────────────────────────────────

export async function uploadProductImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('imagens-bia')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from('imagens-bia').getPublicUrl(fileName)
  return data.publicUrl
}

// ── Auth (admin) ─────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  return supabase.auth.getSession()
}
