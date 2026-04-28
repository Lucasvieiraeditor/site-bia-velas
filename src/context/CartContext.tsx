import { createContext, useContext, useReducer, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantidade: number } }
  | { type: 'CLEAR_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.payload.id
              ? { ...i, quantidade: i.quantidade + 1 }
              : i,
          ),
        }
      }
      return { ...state, items: [...state.items, { product: action.payload, quantidade: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.product.id !== action.payload) }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantidade <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.payload.id
            ? { ...i, quantidade: action.payload.quantidade }
            : i,
        ),
      }
    }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantidade: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = state.items.reduce((acc, i) => acc + i.quantidade, 0)
  const totalPrice = state.items.reduce((acc, i) => acc + i.product.preco * i.quantidade, 0)

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
    setIsOpen(true)
  }

  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id })

  const updateQuantity = (id: string, quantidade: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantidade } })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((v) => !v),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
