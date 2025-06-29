"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/lib/api"

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    name: string
    email: string
    password: string
    role: string
  }) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const userData = await api.getCurrentUser()
      setUser(userData)
    } catch (error: any) {
      console.warn("Auth check failed:", error.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password })
      setUser(response.user)
    } catch (error: any) {
      console.error("Login failed:", error)
      throw new Error(error.message || "Login failed")
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    role: string
  }) => {
    try {
      const response = await api.register(userData)
      setUser(response.user)
    } catch (error: any) {
      console.error("Registration failed:", error)
      throw new Error(error.message || "Registration failed")
    }
  }

  const logout = async () => {
    await api.logout()
    setUser(null)
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
