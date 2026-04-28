import type { Product } from '../types'

// Dados de fallback usados quando o Supabase não está configurado.
// Todas as imagens vêm do Unsplash com queries otimizadas para velas artesanais.
export const mockProducts: Product[] = [
  {
    id: '1',
    created_at: '2024-01-01T00:00:00Z',
    nome: 'Vela Calma da Tarde',
    descricao:
      'Deixe o fim do dia chegar com suavidade. Nossa blend de lavanda francesa e baunilha de Madagascar cria um acolhimento invisível que abraça o ambiente e aquieta os pensamentos.',
    aroma: 'Lavanda & Baunilha',
    preco: 89.9,
    categoria: 'Relaxamento',
    imagem_url:
      'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=600&q=80',
    estoque: 15,
    ativo: true,
  },
  {
    id: '2',
    created_at: '2024-01-02T00:00:00Z',
    nome: 'Vela Ritual da Manhã',
    descricao:
      'Acenda antes do café e sinta o dia começar com intenção. O frescor do eucalipto australiano e a vivacidade do limão siciliano despertam os sentidos com leveza e clareza.',
    aroma: 'Eucalipto & Limão Siciliano',
    preco: 79.9,
    categoria: 'Energia',
    imagem_url:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    estoque: 20,
    ativo: true,
  },
  {
    id: '3',
    created_at: '2024-01-03T00:00:00Z',
    nome: 'Vela Abraço de Inverno',
    descricao:
      'Para os dias em que o vento chega mais frio e a alma pede aconchego. Canela do Ceilão e âmbar dourado criam um calor que vai além da chama — é quase um abraço.',
    aroma: 'Canela & Âmbar',
    preco: 94.9,
    categoria: 'Relaxamento',
    imagem_url:
      'https://images.unsplash.com/photo-1574175485576-2e5b57f2a98c?auto=format&fit=crop&w=600&q=80',
    estoque: 12,
    ativo: true,
  },
  {
    id: '4',
    created_at: '2024-01-04T00:00:00Z',
    nome: 'Vela Noite Estrelada',
    descricao:
      'Para as noites que pedem silêncio e contemplação. Jasmim indiano e sândalo branco tecem uma atmosfera etérea que transforma qualquer quarto em santuário.',
    aroma: 'Jasmim & Sândalo',
    preco: 109.9,
    categoria: 'Presente',
    imagem_url:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    estoque: 8,
    ativo: true,
  },
  {
    id: '5',
    created_at: '2024-01-05T00:00:00Z',
    nome: 'Vela Jardim Secreto',
    descricao:
      'Como entrar em um jardim florido em plena primavera. Rosas de Bulgária e figo fresco se entrelaçam em uma fragrância verde e floral que evoca liberdade e alegria.',
    aroma: 'Rosa & Figo',
    preco: 84.9,
    categoria: 'Energia',
    imagem_url:
      'https://images.unsplash.com/photo-1563241527-3004b7be0acb?auto=format&fit=crop&w=600&q=80',
    estoque: 18,
    ativo: true,
  },
  {
    id: '6',
    created_at: '2024-01-06T00:00:00Z',
    nome: 'Vela Brisa do Mar',
    descricao:
      'Feche os olhos e deixe a brisa entrar. Sal marinho, algas do Atlântico e um toque de madeira flutuante criam a memória de uma tarde à beira-mar.',
    aroma: 'Sal Marinho & Madeira Flutuante',
    preco: 89.9,
    categoria: 'Relaxamento',
    imagem_url:
      'https://images.unsplash.com/photo-1559535332-db9971090158?auto=format&fit=crop&w=600&q=80',
    estoque: 14,
    ativo: true,
  },
  {
    id: '7',
    created_at: '2024-01-07T00:00:00Z',
    nome: 'Vela Edição Especial Natal',
    descricao:
      'Uma criação especial que chega uma vez ao ano. Laranja com cravo, pinho e patchouli formam a fragrância mais reconfortante do inverno. Em embalagem presente exclusiva.',
    aroma: 'Laranja, Cravo & Pinho',
    preco: 129.9,
    categoria: 'Edição Limitada',
    imagem_url:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
    estoque: 5,
    ativo: true,
  },
  {
    id: '8',
    created_at: '2024-01-08T00:00:00Z',
    nome: 'Vela Sonhos de Mel',
    descricao:
      'Para as noites que pedem doçura. Mel silvestre e baunilha cremosa formam uma fragrância que parece um mimo — ideal para quem precisa de cuidado e acolhimento.',
    aroma: 'Mel & Baunilha Cremosa',
    preco: 99.9,
    categoria: 'Presente',
    imagem_url:
      'https://images.unsplash.com/photo-1608181831718-c9b1d85a8c40?auto=format&fit=crop&w=600&q=80',
    estoque: 10,
    ativo: true,
  },
]

export const featuredProducts = mockProducts.slice(0, 3)
