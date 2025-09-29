"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "./api"

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: "client" | "freelancer" | "admin"
  phone?: string
  bio?: string
  profile_image?: string
  location?: string
  skills?: string[]
  hourly_rate?: number
  is_verified: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token")
      if (token) {
        apiClient.setToken(token)
        const userData = await apiClient.getMe()
        setUser(userData)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      apiClient.clearToken()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(username, password)
      if (response.tokens) {
        apiClient.setToken(response.tokens.access)
        localStorage.setItem("refresh_token", response.tokens.refresh)
        setUser(response.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await apiClient.register(userData)
      if (response.tokens) {
        apiClient.setToken(response.tokens.access)
        localStorage.setItem("refresh_token", response.tokens.refresh)
        setUser(response.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = () => {
    apiClient.clearToken()
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const userData = await apiClient.getMe()
      setUser(userData)
    } catch (error) {
      console.error("Failed to refresh user:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
