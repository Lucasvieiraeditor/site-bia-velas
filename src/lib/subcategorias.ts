export const SUBCATEGORIAS_COLECAO = [
  'Velas Aromáticas',
  'Aromatizadores',
  'Home Spray',
  'Águas para Lençóis',
] as const

export type SubcategoriaColecao = (typeof SUBCATEGORIAS_COLECAO)[number]
