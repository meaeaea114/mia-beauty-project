"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  variant?: string | null
  image?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string, variant?: string | null) => void
  updateQuantity: (id: string, variant: string | null | undefined, delta: number) => void
  totalItems: number
  subtotal: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mia-cart")
      if (stored) {
        try {
          setItems(JSON.parse(stored))
        } catch (e) {
          console.error("Failed to parse cart", e)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mia-cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((current) => {
      const idx = current.findIndex(
        (item) => item.id === newItem.id && item.variant === newItem.variant
      )
      if (idx > -1) {
        const updated = [...current]
        updated[idx].quantity += 1
        return updated
      }
      return [...current, { ...newItem, quantity: 1 }]
    })
    // Automatically open the cart when adding an item
    setIsCartOpen(true)
  }

  const removeItem = (id: string, variant?: string | null) => {
    setItems((current) =>
      current.filter((item) => !(item.id === id && item.variant === variant))
    )
  }

  const updateQuantity = (id: string, variant: string | null | undefined, delta: number) => {
    setItems((current) => {
      return current.map(item => {
        if (item.id === id && item.variant === variant) {
          const newQuantity = item.quantity + delta
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }
        }
        return item
      })
    })
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ 
      items, addItem, removeItem, updateQuantity, 
      totalItems, subtotal, 
      isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}