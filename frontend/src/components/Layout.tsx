import { Layout, Menu, Avatar, Dropdown, Button, Space, Typography } from 'antd'
import {
  HomeOutlined,
  EditOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  MessageOutlined,
  FileTextOutlined,
  SettingOutlined,
  LoginOutlined,
  SmileOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'
import { useState, useEffect } from 'react'
import type { MenuProps } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import ClickSpark from '@/components/ClickSpark'
import GooeyNav from '@/components/GooeyNav'
import RippleGrid from '@/components/RippleGrid'
import PageBackground from '@/components/PageBackground'

const { Header, Content } = Layout
const { Text } = Typography

function isMobile() {
  return window.innerWidth <= 768
}

export default function AppLayout() {
  const { user, logout, avatarVersion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAdmin = user?.role === 'ADMIN'
  const mobile = isMobile()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Top navigation menu items (for logged-in users)
  const topMenuItems: MenuProps['items'] = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">博客首页</Link> },
    ...(isAdmin
      ? [
          { key: '/admin', icon: <UnorderedListOutlined />, label: <Link to="/admin">管理概览</Link> },
          { key: '/admin/articles', icon: <EditOutlined />, label: <Link to="/admin/articles">文章管理</Link> },
          { key: '/admin/articles/review', icon: <FileTextOutlined />, label: <Link to="/admin/articles/review">文章审核</Link> },
          { key: '/admin/categories', icon: <UnorderedListOutlined />, label: <Link to="/admin/categories">分类管理</Link> },
          { key: '/admin/tags', icon: <UnorderedListOutlined />, label: <Link to="/admin/tags">标签管理</Link> },
          { key: '/admin/comments', icon: <MessageOutlined />, label: <Link to="/admin/comments">评论管理</Link> },
        ]
      : !user
        ? []
        : [
            { key: '/editor', icon: <EditOutlined />, label: <Link to="/editor">写文章</Link> },
            { key: '/my-submissions', icon: <FileTextOutlined />, label: <Link to="/my-submissions">我的投稿</Link> },
          ]),
  ]

  // GooeyNav quick-access items (always show these in header)
  const [navItems, setNavItems] = useState<Array<{ label: string; href: string }>>([])
  const [navActiveIndex, setNavActiveIndex] = useState(0)

  useEffect(() => {
    const base = [{ label: '首页', href: '/' }]
    if (user) {
      base.push({ label: '写文章', href: '/editor' })
      base.push({ label: '我的投稿', href: '/my-submissions' })
      base.push({ label: '个人中心', href: '/profile' })
      if (isAdmin) {
        base.push({ label: '管理后台', href: '/admin' })
      }
    } else {
      base.push({ label: '写文章', href: '/editor' })
      base.push({ label: '我的投稿', href: '/my-submissions' })
    }
    setNavItems(base)

    const idx = base.findIndex(item => location.pathname.startsWith(item.href))
    setNavActiveIndex(idx >= 0 ? idx : 0)
  }, [location.pathname, user, isAdmin])

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <SettingOutlined />, label: <Link to="/profile">个人中心</Link> },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => { logout(); navigate('/login') },
    },
  ]

  // Mobile: simplified nav items for hamburger menu
  const mobileNavItems: MenuProps['items'] = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">博客首页</Link> },
    ...(user
      ? [
          { key: '/editor', icon: <EditOutlined />, label: <Link to="/editor">写文章</Link> },
          { key: '/my-submissions', icon: <FileTextOutlined />, label: <Link to="/my-submissions">我的投稿</Link> },
          { key: '/profile', icon: <SettingOutlined />, label: <Link to="/profile">个人中心</Link> },
          ...(isAdmin
            ? [
                { type: 'divider' as const },
                { key: '/admin', icon: <UnorderedListOutlined />, label: <Link to="/admin">管理概览</Link> },
                { key: '/admin/articles', icon: <EditOutlined />, label: <Link to="/admin/articles">文章管理</Link> },
                { key: '/admin/articles/review', icon: <FileTextOutlined />, label: <Link to="/admin/articles/review">文章审核</Link> },
                { key: '/admin/categories', icon: <UnorderedListOutlined />, label: <Link to="/admin/categories">分类管理</Link> },
                { key: '/admin/tags', icon: <UnorderedListOutlined />, label: <Link to="/admin/tags">标签管理</Link> },
                { key: '/admin/comments', icon: <MessageOutlined />, label: <Link to="/admin/comments">评论管理</Link> },
              ]
            : []),
        ]
      : []),
    ...(user
      ? [{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: () => { logout(); navigate('/login') } }]
      : [
          { key: 'guest', icon: <SmileOutlined />, label: '访客浏览', onClick: () => navigate('/') },
          { key: 'login', icon: <LoginOutlined />, label: '登录', onClick: () => navigate('/login') },
        ]),
  ]

  return (
    <>
      <PageBackground />
      <ClickSpark
        sparkColor="#667eea"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={10}
        duration={500}
        extraScale={1.2}
      >
        <RippleGrid
          enableRainbow={false}
          gridColor="#667eea"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          fadeDistance={1.5}
          vignetteStrength={2.0}
          glowIntensity={0.1}
          opacity={0.6}
          gridRotation={0}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
        />
        <Layout style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          {/* Sticky Top Header */}
          <Header
            style={{
              position: 'sticky',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              padding: mobile ? '0 12px' : '0 24px',
              background: scrolled ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.65)',
              backdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
              WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: mobile ? 'space-between' : 'space-between',
              transition: 'all 0.3s ease',
              height: mobile ? 56 : 64,
              overflow: 'hidden',
            }}
          >
            {/* Left: GooeyNav or Hamburger */}
            {mobile ? (
              <>
                <Button
                  type="text"
                  icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  style={{
                    color: '#667eea',
                    fontSize: 22,
                    padding: '4px 8px',
                  }}
                />
                <Link to="/" style={{ fontWeight: 700, fontSize: 18, color: '#fff', textDecoration: 'none' }}>
                  博客
                </Link>
              </>
            ) : (
              <GooeyNav
                items={navItems}
                initialActiveIndex={navActiveIndex}
                animationTime={500}
                particleCount={12}
                particleDistances={[80, 15]}
                particleR={80}
                timeVariance={200}
                colors={[1, 2, 1, 3, 1, 2, 1, 1]}
                onNavigate={index => navigate(navItems[index].href)}
              />
            )}

            {/* Center: Top Menu (full nav) — hidden on mobile */}
            {!mobile && (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
                <Menu
                  theme="light"
                  mode="horizontal"
                  selectedKeys={[location.pathname === '/' ? '/' : location.pathname]}
                  items={topMenuItems}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    minWidth: 0,
                  }}
                  overflowedIndicator={<UnorderedListOutlined style={{ fontSize: 22, color: '#667eea' }} />}
                />
              </div>
            )}

            {/* Right: User Menu */}
            <Space size="large" style={{ flexShrink: 0 }}>
              {user ? (
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <motion.div
                    key={avatarVersion}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Avatar
                      size={mobile ? 32 : 36}
                      src={user.avatar && !user.avatar.includes('/uploads/uploads') ? user.avatar : undefined}
                      style={{
                        backgroundColor: 'transparent',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: '2px solid rgba(102, 126, 234, 0.3)',
                      }}
                    >
                      {user.username?.[0]?.toUpperCase()}
                    </Avatar>
                  </motion.div>
                </Dropdown>
              ) : (
                <Space size={mobile ? 8 : 16} wrap={false}>
                  <Button
                    type="text"
                    icon={<SmileOutlined />}
                    onClick={() => navigate('/')}
                    style={{ color: '#667eea', padding: mobile ? '4px 8px' : undefined }}
                  >
                    {mobile ? '访客' : '访客浏览'}
                  </Button>
                  <Link to="/login">
                    <Button
                      type="primary"
                      icon={<LoginOutlined />}
                      style={{
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        padding: mobile ? '4px 12px' : undefined,
                        fontSize: mobile ? 13 : undefined,
                      }}
                    >
                      {mobile ? '登录' : '登录'}
                    </Button>
                  </Link>
                </Space>
              )}
            </Space>
          </Header>

          {/* Mobile slide-down menu */}
          <AnimatePresence>
            {mobile && mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  overflow: 'hidden',
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Menu
                  mode="inline"
                  selectedKeys={[location.pathname === '/' ? '/' : location.pathname]}
                  items={mobileNavItems}
                  theme="light"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: 15,
                  }}
                  className="mobile-menu"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Area */}
          <Content
            style={{
              padding: mobile ? '16px 12px' : '24px',
              maxWidth: mobile ? '100%' : 1200,
              margin: '0 auto',
              width: '100%',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname + location.search}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </Content>
        </Layout>
      </ClickSpark>
    </>
  )
}
