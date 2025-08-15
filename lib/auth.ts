export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Simple in-memory storage for demo (in production, use proper database)
const users: Array<User & { password: string }> = []

export class AuthService {
  static async signUp(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Create new user
    const user: User & { password: string } = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password, // In production, hash this password
      createdAt: new Date().toISOString(),
    }

    users.push(user)

    // Generate simple token (in production, use JWT)
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }))

    return {
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      token,
    }
  }

  static async signIn(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Generate simple token
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }))

    return {
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      token,
    }
  }

  static async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = JSON.parse(atob(token))
      const user = users.find((u) => u.id === decoded.userId)
      if (!user) return null

      return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
    } catch {
      return null
    }
  }

  static setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  static removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }
}
