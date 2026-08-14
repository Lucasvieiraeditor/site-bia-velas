export interface Product {
  id: string
  created_at: string
  nome: string
  descricao: string
  aroma: string
  preco: number
  categoria: 'Coleção' | 'Lembrancinhas' | 'Kit' | 'Presente'
  subcategoria?: string
  imagem_url: string
  imagens?: string
  estoque: number
  ativo: boolean
  peso?: number
}

export interface CartItem {
  id: string
  product: Product
  aroma: string
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
  frete_nome?: string
  frete_prazo?: number
  frete_valor?: number
  cupom_codigo?: string
  desconto_valor?: number
}

export interface Coupon {
  id: string
  created_at: string
  codigo: string
  tipo: 'percentual' | 'fixo'
  valor: number
  ativo: boolean
}

export type OrderStatus = Order['status']
export type ProductCategory = Product['categoria']
