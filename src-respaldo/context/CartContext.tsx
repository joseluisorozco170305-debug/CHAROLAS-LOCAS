import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'

type CartItem = { id: string; name: string; quantity: number; price: number }
type CartContextValue = {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  clearCart: () => void
}
const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('charolas-cart') ?? '[]') } catch { return [] }
  })
  useEffect(() => localStorage.setItem('charolas-cart', JSON.stringify(items)), [items])
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])
  return <CartContext.Provider value={{ items, total, addItem: item => setItems(v => [...v, item]), clearCart: () => setItems([]) }}>{children}</CartContext.Provider>
}
export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart debe usarse dentro de CartProvider')
  return value
}
