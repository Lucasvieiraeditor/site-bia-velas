import { createClient } from '@supabase/supabase-js'
import type { Product, Order } from '../types'

const SUPABASE_URL = 'https://vnmqdyzjbtouanivsadf.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_mzYk0z87Jsv4TW7gz1i6rA_1wYByL0h'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const isSupabaseConfigured = true

// ── Produtos ────────────────────────────────────────────────────────────────

export async function fetchProducts(categoria?: string): Promise<Product[]> {
  let query = supabase
    .from('produtos_bia')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: false })

  if (categoria && categoria !== 'Todas') {
    query = query.eq('categoria', categoria)
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

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('pedidos_bia')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Order[]
}

export async function updateOrderStatus(
  id: string,
  status: Order['status'],
): Promise<void> {
  const { error } = await supabase.from('pedidos_bia').update({ status }).eq('id', id)
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
