import { useEffect, useRef, useState } from 'react'
import { Form, Input, Button, Checkbox, message, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { UserOutlined, LockOutlined, EyeOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import Lightfall from '@/components/Lightfall'
import ShinyText from '@/components/ShinyText'
import api from '@/api'
import { useAuth } from '@/store/AuthContext'
import { fadeInUp, fadeIn } from '@/lib/motion'

const { Text } = Typography

function isMobile() {
  return window.innerWidth <= 768
}

// Storage keys for remembered credentials
const REMEMBER_KEY = 'remembered_creds'

interface RememberedCreds {
  username: string
  password: string
}

function getRememberedCreds(): RememberedCreds | null {
  try {
    const raw = localStorage.getItem(REMEMBER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as RememberedCreds
  } catch {
    return null
  }
}

function saveRememberedCreds(username: string, password: string) {
  localStorage.setItem(REMEMBER_KEY, JSON.stringify({ username, password }))
}

function clearRememberedCreds() {
  localStorage.removeItem(REMEMBER_KEY)
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load remembered credentials on mount
  const [initialValues, setInitialValues] = useState<{ username?: string; password?: string; rememberMe?: boolean }>({})

  useEffect(() => {
    const creds = getRememberedCreds()
    if (creds?.username && creds?.password) {
      setInitialValues({ username: creds.username, password: creds.password, rememberMe: true })
    }
  }, [])

  const onFinish = async (values: { username: string; password: string; rememberMe?: boolean }) => {
    setLoading(true)
    try {
      const res: any = await api.post('/auth/login', values)
      login(res.token, {
        id: res.id,
        username: res.username,
        email: res.email,
        avatar: res.avatar || '',
        bio: '',
        role: res.role,
      })
      // Save credentials if remember me is checked
      if (values.rememberMe) {
        saveRememberedCreds(values.username, values.password)
      } else {
        clearRememberedCreds()
      }
      message.success('登录成功')
      if (res.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = () => {
    navigate('/', { replace: true })
  }

  const cardPadding = mobile ? '24px 16px' : '40px 36px'
  const titleSize = mobile ? 22 : 28
  const emojiSize = mobile ? 40 : 52

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: mobile ? '16px' : '24px',
        overflow: 'auto',
      }}
    >
      {/* 全屏 Lightfall 背景（fixed 定位铺满视口） */}
      <Lightfall
        colors={['#667eea', '#764ba2', '#a78bfa', '#818cf8']}
        backgroundColor="#0f0c29"
        speed={0.8}
        streakCount={6}
        streakWidth={1.2}
        streakLength={1.5}
        glow={1.2}
        density={0.8}
        twinkle={0.8}
        zoom={2.5}
        backgroundGlow={0.6}
        opacity={0.85}
        mouseInteraction={mobile ? false : true}
        mouseStrength={0.6}
        mouseRadius={0.8}
      />

      <motion.div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 440,
        }}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <GlassCard style={{ padding: cardPadding }}>
          {/* Logo & Title */}
          <motion.div
            variants={fadeIn}
            style={{ textAlign: 'center', marginBottom: mobile ? 24 : 32 }}
          >
            <motion.div
              style={{ fontSize: emojiSize, marginBottom: 8 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              📝
            </motion.div>
            <h2
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: titleSize,
                letterSpacing: '1px',
                color: '#fff',
              }}
            >
              个人博客系统
            </h2>
            <p style={{ color: '#fff', fontSize: mobile ? 13 : 14, marginTop: 6, opacity: 0.7 }}>
              欢迎回来，请登录你的账号
            </p>
          </motion.div>

          <Form onFinish={onFinish} initialValues={initialValues} autoComplete="on" size="large">
            {/* Username */}
            <motion.div variants={fadeIn} style={{ marginBottom: 16 }}>
              <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]} style={{ marginBottom: 0 }}>
                <div style={{ position: 'relative' }}>
                  <Input
                    placeholder="用户名"
                    prefix={
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <UserOutlined style={{ color: '#667eea' }} />
                      </motion.span>
                    }
                    style={{
                      height: 48,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      paddingLeft: 44,
                    }}
                    autoFocus
                  />
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  </div>
                </div>
              </Form.Item>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeIn} style={{ marginBottom: mobile ? 16 : 20 }}>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]} style={{ marginBottom: 0 }}>
                <Input.Password
                  placeholder="密码"
                  prefix={<LockOutlined style={{ color: '#667eea', visibility: 'hidden' }} />}
                  style={{
                    height: 48,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                  }}
                />
              </Form.Item>
            </motion.div>

            {/* Forgot password & Remember me */}
            <motion.div variants={fadeIn} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
              <Link
                to="/forgot-password"
                style={{ fontSize: 13, color: '#fff', textDecoration: 'none', opacity: 0.6 }}
              >
                忘记密码？
              </Link>
              <Form.Item name="rememberMe" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox style={{ color: '#fff' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>记住密码</Text>
                </Checkbox>
              </Form.Item>
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeIn} style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  height: 48,
                  fontSize: 16,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                登 录
              </Button>
            </motion.div>

            {/* Guest */}
            <motion.div variants={fadeIn} style={{ marginBottom: 24 }}>
              <Button
                type="default"
                block
                onClick={handleGuest}
                style={{
                  height: 48,
                  fontSize: 14,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                }}
                icon={<EyeOutlined />}
              >
                游客浏览
              </Button>
            </motion.div>
          </Form>

          {/* Register link */}
          <motion.div
            variants={fadeIn}
            style={{
              textAlign: 'center',
              paddingTop: 16,
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 13, opacity: 0.5 }}>还没有账号？</Text>{' '}
            <Link to="/register" style={{ fontSize: 13, color: '#a78bfa' }}>
              立即注册
            </Link>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
