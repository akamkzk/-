import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

// 请求拦截器：自动添加 JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：401 自动跳转登录
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('remembered_creds')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 头像 URL 标准化：确保以 /uploads 开头（后端返回的路径已经是 /uploads/avatars/xxx）
const originalPost = api.post.bind(api)
api.post = async (url: string, data: any, config?: any) => {
  const res: any = await originalPost(url, data, config)
  // 上传头像后，后端返回的路径已经是 /uploads/avatars/xxx，不需要再加前缀
  if (url === '/auth/upload-avatar' && res.avatar) {
    if (!res.avatar.startsWith('/uploads')) {
      res.avatar = `/uploads${res.avatar}`
    }
  }
  return res
}

export default api
