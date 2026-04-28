-- ═══════════════════════════════════════════════════════════════════════════
-- BIA VELAS AROMÁTICAS — Supabase Schema
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Habilita a extensão UUID ─────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tabela: produtos ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produtos (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  nome        TEXT NOT NULL,
  descricao   TEXT NOT NULL DEFAULT '',
  aroma       TEXT NOT NULL DEFAULT '',
  preco       NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
  categoria   TEXT NOT NULL CHECK (categoria IN ('Relaxamento', 'Energia', 'Presente', 'Edição Limitada')),
  imagem_url  TEXT NOT NULL DEFAULT '',
  estoque     INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
  ativo       BOOLEAN NOT NULL DEFAULT TRUE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos (ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos (categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_created_at ON produtos (created_at DESC);

-- ── Tabela: pedidos ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
  id                 UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  cliente_nome       TEXT NOT NULL,
  cliente_email      TEXT NOT NULL,
  cliente_telefone   TEXT NOT NULL DEFAULT '',
  endereco           JSONB NOT NULL,
  itens              JSONB NOT NULL,
  valor_total        NUMERIC(10, 2) NOT NULL CHECK (valor_total >= 0),
  status             TEXT NOT NULL DEFAULT 'aguardando'
                     CHECK (status IN ('aguardando', 'pago', 'enviado', 'entregue')),
  mercadopago_id     TEXT
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos (status);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_email ON pedidos (cliente_email);

-- ── Row Level Security (RLS) ─────────────────────────────────────────────────

-- Produtos: leitura pública para produtos ativos, escrita apenas para admins autenticados
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Produtos ativos são públicos" ON produtos
  FOR SELECT USING (ativo = TRUE);

CREATE POLICY "Admins podem ver todos os produtos" ON produtos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem inserir produtos" ON produtos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins podem atualizar produtos" ON produtos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem deletar produtos" ON produtos
  FOR DELETE USING (auth.role() = 'authenticated');

-- Pedidos: criação pública (qualquer pessoa pode criar pedido),
--           leitura e atualização apenas para admins autenticados
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer pessoa pode criar pedidos" ON pedidos
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins podem ver todos os pedidos" ON pedidos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem atualizar pedidos" ON pedidos
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ── Storage bucket para imagens de produtos ──────────────────────────────────
-- Execute manualmente no dashboard do Supabase > Storage > New Bucket
-- Nome: produtos  |  Public: TRUE

-- OU via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Imagens de produtos são públicas" ON storage.objects
  FOR SELECT USING (bucket_id = 'produtos');

CREATE POLICY "Admins podem fazer upload de imagens" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'produtos' AND auth.role() = 'authenticated');

CREATE POLICY "Admins podem deletar imagens" ON storage.objects
  FOR DELETE USING (bucket_id = 'produtos' AND auth.role() = 'authenticated');

-- ── Dados iniciais de exemplo ─────────────────────────────────────────────────
INSERT INTO produtos (nome, descricao, aroma, preco, categoria, imagem_url, estoque, ativo)
VALUES
  (
    'Vela Calma da Tarde',
    'Deixe o fim do dia chegar com suavidade. Nossa blend de lavanda francesa e baunilha de Madagascar cria um acolhimento invisível que abraça o ambiente e aquieta os pensamentos.',
    'Lavanda & Baunilha',
    89.90,
    'Relaxamento',
    'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=600&q=80',
    15,
    TRUE
  ),
  (
    'Vela Ritual da Manhã',
    'Acenda antes do café e sinta o dia começar com intenção. O frescor do eucalipto australiano e a vivacidade do limão siciliano despertam os sentidos com leveza e clareza.',
    'Eucalipto & Limão Siciliano',
    79.90,
    'Energia',
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    20,
    TRUE
  ),
  (
    'Vela Abraço de Inverno',
    'Para os dias em que o vento chega mais frio e a alma pede aconchego. Canela do Ceilão e âmbar dourado criam um calor que vai além da chama.',
    'Canela & Âmbar',
    94.90,
    'Relaxamento',
    'https://images.unsplash.com/photo-1574175485576-2e5b57f2a98c?auto=format&fit=crop&w=600&q=80',
    12,
    TRUE
  ),
  (
    'Vela Noite Estrelada',
    'Para as noites que pedem silêncio e contemplação. Jasmim indiano e sândalo branco tecem uma atmosfera etérea que transforma qualquer quarto em santuário.',
    'Jasmim & Sândalo',
    109.90,
    'Presente',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    8,
    TRUE
  ),
  (
    'Vela Edição Especial Natal',
    'Uma criação especial que chega uma vez ao ano. Laranja com cravo, pinho e patchouli formam a fragrância mais reconfortante do inverno. Em embalagem presente exclusiva.',
    'Laranja, Cravo & Pinho',
    129.90,
    'Edição Limitada',
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
    5,
    TRUE
  );
