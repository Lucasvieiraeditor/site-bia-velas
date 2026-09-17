// Parser genérico de lista separada por vírgula — usado tanto pra aromas quanto pra cores,
// ambos cadastrados no admin com o mesmo componente de tags (digita, Enter, vira selo).
export function parseTagList(value: string | null | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

export function parseAromas(aroma: string | null | undefined): string[] {
  return parseTagList(aroma)
}

export function parseCores(cores: string | null | undefined): string[] {
  return parseTagList(cores)
}
