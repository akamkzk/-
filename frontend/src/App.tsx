import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import ArticleDetail from './pages/ArticleDetail'
import Editor from './pages/Editor'
import MySubmissions from './pages/MySubmissions'
import AdminDashboard from './pages/Admin/Dashboard'
import ArticleManage from './pages/Admin/ArticleManage'
import ArticleReview from './pages/Admin/ArticleReview'
import CategoryManage from './pages/Admin/CategoryManage'
import TagManage from './pages/Admin/TagManage'
import CommentManage from './pages/Admin/CommentManage'
import { useAuth } from '@/store/AuthContext'
import { Outlet } from 'react-router-dom'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminLayout() {
  const { user } = useAuth()
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />
  return <Outlet />
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* 独立页面（不带 Layout 侧边栏） */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 系统页面（带 Layout 侧边栏） */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="article/:id" element={<ArticleDetail />} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="editor" element={<PrivateRoute><Editor /></PrivateRoute>} />
          <Route path="my-submissions" element={<PrivateRoute><MySubmissions /></PrivateRoute>} />
          <Route element={<AdminLayout />}>
            <Route path="admin">
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<ArticleManage />} />
              <Route path="articles/review" element={<ArticleReview />} />
              <Route path="categories" element={<CategoryManage />} />
              <Route path="tags" element={<TagManage />} />
              <Route path="comments" element={<CommentManage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
