import { createClient } from '@supabase/supabase-js'
import type { Product, Order } from '../types'

// ─── CONFIGURE SUAS CREDENCIAIS DO SUPABASE AQUI ───────────────────────────
// 1. Acesse https://supabase.com e crie um projeto
// 2. Vá em Settings > API e copie a Project URL e a anon key
// 3. Substitua os valores abaixo pelas suas credenciais reais
// ───────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://SEU_PROJETO.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'SUA_ANON_KEY_AQUI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const isSupabaseConfigured =
  SUPABASE_URL !== 'https://SEU_PROJETO.supabase.co' &&
  SUPABASE_ANON_KEY !== 'SUA_ANON_KEY_AQUI'

// ── Produtos ────────────────────────────────────────────────────────────────

export async function fetchProducts(categoria?: string): Promise<Product[]> {
  let query = supabase
    .from('produtos')
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

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Product | null
}

export async function createProduct(
  product: Omit<Product, 'id' | 'created_at'>,
): Promise<Product> {
  const { data, error } = await supabase.from('produtos').insert(product).select().single()
  if (error) throw error
  return data as Product
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at'>>,
): Promise<Product> {
  const { data, error } = await supabase
    .from('produtos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('produtos').delete().eq('id', id)
  if (error) throw error
}

// ── Pedidos ─────────────────────────────────────────────────────────────────

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at'>,
): Promise<Order> {
  const { data, error } = await supabase.from('pedidos').insert(order).select().single()
  if (error) throw error
  return data as Order
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Order[]
}

export async function updateOrderStatus(
  id: string,
  status: Order['status'],
): Promise<void> {
  const { error } = await supabase.from('pedidos').update({ status }).eq('id', id)
  if (error) throw error
}

// ── Upload de imagem ─────────────────────────────────────────────────────────

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('produtos')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from('produtos').getPublicUrl(fileName)
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
