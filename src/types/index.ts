export interface Product {
  id: string
  created_at: string
  nome: string
  descricao: string
  aroma: string
  preco: number
  categoria: 'Relaxamento' | 'Energia' | 'Presente' | 'Edição Limitada'
  imagem_url: string
  imagens?: string
  estoque: number
  ativo: boolean
}

export interface CartItem {
  product: Product
  quantidade: number
}

export interface OrderItem {
  produto_id: string
  nome: string
  aroma: string
  preco: number
  quantidade: number
  imagem_url: string
}

export interface Order {
  id: string
  created_at: string
  cliente_nome: string
  cliente_email: string
  cliente_telefone: string
  endereco: {
    cep: string
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
  }
  itens: OrderItem[]
  valor_total: number
  status: 'aguardando' | 'pago' | 'enviado' | 'entregue'
  mercadopago_id?: string
}

export type OrderStatus = Order['status']
export type ProductCategory = Product['categoria']
