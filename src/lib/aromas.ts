export function parseAromas(aroma: string | null | undefined): string[] {
  return (aroma ?? '')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
}
