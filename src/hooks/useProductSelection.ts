import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { parseAromas, parseCores } from '../lib/aromas'
import type { Product } from '../types'

export const MENSAGEM_PERSONALIZADA_MAX = 100

// Junta a escolha de aroma, cor e (se o produto for personalizável) a frase do cliente
// antes de mandar pro carrinho — mesma trava de "escolha antes de adicionar" pros três.
export function useProductSelection(product: Product) {
  const { addItem } = useCart()
  const aromas = parseAromas(product.aroma)
  const cores = parseCores(product.cores)

  const [selectedAroma, setSelectedAroma] = useState(aromas.length === 1 ? aromas[0] : '')
  const [selectedCor, setSelectedCor] = useState(cores.length === 1 ? cores[0] : '')
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState('')

  const [showAromaWarning, setShowAromaWarning] = useState(false)
  const [showCorWarning, setShowCorWarning] = useState(false)
  const [showMensagemWarning, setShowMensagemWarning] = useState(false)
  const [added, setAdded] = useState(false)

  const pickAroma = (aroma: string) => {
    setSelectedAroma(aroma)
    setShowAromaWarning(false)
  }

  const pickCor = (cor: string) => {
    setSelectedCor(cor)
    setShowCorWarning(false)
  }

  const setMensagem = (value: string) => {
    setMensagemPersonalizada(value.slice(0, MENSAGEM_PERSONALIZADA_MAX))
    setShowMensagemWarning(false)
  }

  const handleAdd = () => {
    const precisaAroma = aromas.length > 1 && !selectedAroma
    const precisaCor = cores.length > 1 && !selectedCor
    const precisaMensagem = !!product.personalizavel && !mensagemPersonalizada.trim()

    if (precisaAroma || precisaCor || precisaMensagem) {
      setShowAromaWarning(precisaAroma)
      setShowCorWarning(precisaCor)
      setShowMensagemWarning(precisaMensagem)
      setTimeout(() => {
        setShowAromaWarning(false)
        setShowCorWarning(false)
        setShowMensagemWarning(false)
      }, 2500)
      return
    }

    addItem(product, selectedAroma, selectedCor, mensagemPersonalizada.trim() || undefined)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return {
    aromas,
    selectedAroma,
    pickAroma,
    showAromaWarning,
    cores,
    selectedCor,
    pickCor,
    showCorWarning,
    mensagemPersonalizada,
    setMensagem,
    showMensagemWarning,
    handleAdd,
    added,
  }
}
