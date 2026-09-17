-- ═══════════════════════════════════════════════════════════════════════════
-- BIA VELAS AROMÁTICAS — Favoritos da home, cores do produto e personalização
-- Execute este SQL no SQL Editor do projeto Supabase (vnmqdyzjbtouanivsadf)
-- ═══════════════════════════════════════════════════════════════════════════

-- "favorito": marca quais produtos aparecem em "Nossas Favoritas" na home
ALTER TABLE produtos_bia ADD COLUMN IF NOT EXISTS favorito BOOLEAN NOT NULL DEFAULT FALSE;

-- "cores": mesma lógica do campo "aroma" — lista separada por vírgula
ALTER TABLE produtos_bia ADD COLUMN IF NOT EXISTS cores TEXT NOT NULL DEFAULT '';

-- "personalizavel": libera o campo "escreva sua frase" na página do produto
ALTER TABLE produtos_bia ADD COLUMN IF NOT EXISTS personalizavel BOOLEAN NOT NULL DEFAULT FALSE;
