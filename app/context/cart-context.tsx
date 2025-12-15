"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  variant?: string | null
  image?: string
  color?: string 
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string, variant?: string | null) => void
  updateQuantity: (id: string, variant: string | null | undefined, delta: number) => void
  updateVariant: (id: string, oldVariant: string, newVariant: { name: string, image: string, color: string }) => void
  totalItems: number
  subtotal: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  clearCart: () => void 
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // 1. Identify User
  useEffect(() => {
    const checkUser = () => {
      const profile = localStorage.getItem("mia-profile")
      if (profile) {
        try {
          const { email } = JSON.parse(profile)
          setUserEmail(email)
        } catch (e) { setUserEmail(null) }
      } else {
        setUserEmail(null)
      }
    }
    checkUser()
    window.addEventListener("storage", checkUser)
    return () => window.removeEventListener("storage", checkUser)
  }, [])

  // 2. Load Cart (CRITICAL FIX: Sanitize IDs to Strings)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageKey = userEmail ? `mia-cart-db-${userEmail}` : "mia-guest-cart"
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // Fix: Ensure every ID is converted to a string to prevent .startsWith() crash
          const sanitizedItems = Array.isArray(parsed) 
            ? parsed.map((item: any) => ({ ...item, id: String(item.id) }))
            : []
          setItems(sanitizedItems)
        } catch (e) { 
          console.error("Failed to parse cart", e)
          setItems([])
        }
      } else {
        setItems([])
      }
      setIsLoaded(true)
    }
  }, [userEmail])

  // 3. Save Cart
  useEffect(() => {
    if (isLoaded) {
      const storageKey = userEmail ? `mia-cart-db-${userEmail}` : "mia-guest-cart"
      localStorage.setItem(storageKey, JSON.stringify(items))
    }
  }, [items, isLoaded, userEmail])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((current) => {
      // Fix: Force ID to be string
      const safeId = String(newItem.id)
      
      const idx = current.findIndex(
        (item) => item.id === safeId && item.variant === newItem.variant
      )
      if (idx > -1) {
        const updated = [...current]
        updated[idx].quantity += 1
        return updated
      }
      return [...current, { ...newItem, id: safeId, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeItem = (id: string, variant?: string | null) => {
    setItems((current) =>
      current.filter((item) => !(item.id === String(id) && item.variant === variant))
    )
  }

  const updateQuantity = (id: string, variant: string | null | undefined, delta: number) => {
    setItems((current) => {
      return current.map(item => {
        if (item.id === String(id) && item.variant === variant) {
          const newQuantity = item.quantity + delta
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }
        }
        return item
      })
    })
  }

  const updateVariant = (id: string, oldVariant: string, newVariant: { name: string, image: string, color: string }) => {
    setItems((current) => {
      const safeId = String(id)
      const existingIdx = current.findIndex(item => item.id === safeId && item.variant === newVariant.name)
      const currentItemIdx = current.findIndex(item => item.id === safeId && item.variant === oldVariant)

      if (currentItemIdx === -1) return current

      if (existingIdx > -1 && existingIdx !== currentItemIdx) {
         const updated = [...current]
         updated[existingIdx].quantity += updated[currentItemIdx].quantity
         updated.splice(currentItemIdx, 1)
         return updated
      }

      const updated = [...current]
      updated[currentItemIdx] = {
        ...updated[currentItemIdx],
        variant: newVariant.name,
        image: newVariant.image,
        color: newVariant.color
      }
      return updated
    })
  }

  const clearCart = () => {
      setItems([])
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ 
      items, addItem, removeItem, updateQuantity, updateVariant, clearCart,
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