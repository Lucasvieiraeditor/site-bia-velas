import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { parseAromas } from '../lib/aromas'
import type { Product } from '../types'

export function useAromaSelector(product: Product) {
  const { addItem } = useCart()
  const aromas = parseAromas(product.aroma)
  const [selectedAroma, setSelectedAroma] = useState(aromas.length === 1 ? aromas[0] : '')
  const [showAromaWarning, setShowAromaWarning] = useState(false)
  const [added, setAdded] = useState(false)

  const pickAroma = (aroma: string) => {
    setSelectedAroma(aroma)
    setShowAromaWarning(false)
  }

  const handleAdd = () => {
    if (aromas.length > 1 && !selectedAroma) {
      setShowAromaWarning(true)
      setTimeout(() => setShowAromaWarning(false), 2500)
      return
    }
    addItem(product, selectedAroma)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return { aromas, selectedAroma, pickAroma, showAromaWarning, handleAdd, added }
}
