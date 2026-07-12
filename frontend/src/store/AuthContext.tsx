import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface UserInfo {
  id: number
  username: string
  email: string
  avatar: string
  bio: string
  role: string
}

interface AuthContextType {
  token: string | null
  user: UserInfo | null
  avatarVersion: number
  login: (token: string, user: UserInfo) => void
  logout: () => void
  updateUser: (user: Partial<UserInfo>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<UserInfo | null>(null)
  const [avatarVersion, setAvatarVersion] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      // 清理可能损坏的头像路径
      if (parsed.avatar && parsed.avatar.includes('/uploads/uploads')) {
        parsed.avatar = parsed.avatar.replace('/uploads/uploads', '/uploads')
        localStorage.setItem('user', JSON.stringify(parsed))
      }
      setUser(parsed)
    }
  }, [])

  const login = (newToken: string, newUser: UserInfo) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Keep remembered_creds so login page auto-fills username/password
  }

  const updateUser = useCallback((partial: Partial<UserInfo>) => {
    if (user) {
      const updated = { ...user, ...partial }
      setUser(updated)
      localStorage.setItem('user', JSON.stringify(updated))
      // 如果更新了 avatar，版本号 +1 触发全局刷新
      if (partial.avatar) {
        setAvatarVersion(prev => prev + 1)
      }
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ token, user, avatarVersion, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
