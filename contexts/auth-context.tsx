"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { AuthService, type AuthState, type Profile } from "@/lib/auth"
import type { User } from '@supabase/supabase-js'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for existing session
    AuthService.getCurrentUser().then((result) => {
      setState({
        user: result?.user || null,
        profile: result?.profile || null,
        isLoading: false,
        isAuthenticated: !!result?.user,
      })
    })

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user, profile) => {
      setState({
        user,
        profile,
        isLoading: false,
        isAuthenticated: !!user,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const { user, profile } = await AuthService.signIn(email, password)
      setState({
        user,
        profile,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const { user, profile } = await AuthService.signUp(name, email, password)
      setState({
        user,
        profile,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signOut = async () => {
    try {
      await AuthService.signOut()
      setState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
      })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const updatedProfile = await AuthService.updateProfile(updates)
      setState((prev) => ({
        ...prev,
        profile: updatedProfile,
      }))
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, updateProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
