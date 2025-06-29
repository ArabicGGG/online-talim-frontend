"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuth } from "./auth-provider"

interface CartItem {
  id: number
  course_id: number
  course_title: string
  course_price: number
  course_image?: string
}

interface CartContextType {
  items: CartItem[]
  count: number
  loading: boolean
  addToCart: (courseId: number) => Promise<void>
  removeFromCart: (courseId: number) => Promise<void>
  checkout: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const refreshCart = async () => {
    if (!user) {
      setItems([])
      setCount(0)
      return
    }

    try {
      setLoading(true)
      const [cartData, countData] = await Promise.allSettled([api.getCart(), api.getCartCount()])

      const items = cartData.status === "fulfilled" ? cartData.value.items || [] : []
      const count = countData.status === "fulfilled" ? countData.value.count || 0 : 0

      setItems(items)
      setCount(count)
    } catch (error) {
      console.warn("Failed to refresh cart:", error)
      setItems([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [user])

  const addToCart = async (courseId: number) => {
    try {
      await api.addToCart(courseId)
      await refreshCart()
    } catch (error) {
      throw error
    }
  }

  const removeFromCart = async (courseId: number) => {
    try {
      await api.removeFromCart(courseId)
      await refreshCart()
    } catch (error) {
      throw error
    }
  }

  const checkout = async () => {
    try {
      await api.checkout()
      await refreshCart()
    } catch (error) {
      throw error
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        loading,
        addToCart,
        removeFromCart,
        checkout,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
