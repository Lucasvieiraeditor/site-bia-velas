// Comprime/redimensiona uma foto no navegador antes de subir pro Supabase Storage.
// Fotos de celular costumam vir com 3000-4000px e vários MB — o site nunca precisa
// disso, já que a maior exibição (galeria do produto) roda em telas normais. Reduz
// o peso da imagem sem trocar o conteúdo dela.
const MAX_DIMENSAO = 1600
const QUALIDADE_JPEG = 0.82

export async function compressImage(file: File): Promise<File> {
  // Só sabemos comprimir formatos de imagem "de foto". SVG, GIF animado etc. passam direto.
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSAO / Math.max(bitmap.width, bitmap.height))

    // Já é pequena o suficiente — não vale a pena reprocessar.
    if (scale >= 1 && file.size <= 600 * 1024) {
      bitmap.close?.()
      return file
    }

    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALIDADE_JPEG),
    )
    if (!blob || blob.size >= file.size) return file // se não reduziu, mantém o original

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } catch {
    // Qualquer falha no processo (formato não suportado pelo navegador etc.) — sobe o original.
    return file
  }
}
