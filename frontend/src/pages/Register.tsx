import { useEffect, useState } from 'react'
import { Form, Input, Button, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import ParticleBackground from '@/components/ParticleBackground'
import GlassCard from '@/components/GlassCard'
import api from '@/api'
import { useAuth } from '@/store/AuthContext'
import { fadeInUp, fadeIn } from '@/lib/motion'

const { Text } = Typography

function isMobile() {
  return window.innerWidth <= 768
}

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const onFinish = async (values: { username: string; password: string; email?: string }) => {
    setLoading(true)
    try {
      const res: any = await api.post('/auth/register', values)
      login(res.token, {
        id: res.id,
        username: res.username,
        email: res.email,
        avatar: res.avatar || '',
        bio: '',
        role: res.role,
      })
      message.success('注册成功')
      navigate('/')
    } catch (err: any) {
      message.error(err.response?.data?.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  const cardPadding = mobile ? '24px 16px' : '40px 36px'
  const emojiSize = mobile ? 40 : 52

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: mobile ? '16px' : '24px',
      }}
    >
      <ParticleBackground color="rgba(240, 147, 251," particleCount={50} />

      {/* Decorative orbs — hide on mobile for performance */}
      {!mobile && (
        <motion.div
          style={{
            position: 'absolute',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(240, 147, 251, 0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
            top: '10%',
            right: '10%',
          }}
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
        />
      )}

      <motion.div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <GlassCard style={{ padding: cardPadding }}>
            <motion.div variants={fadeIn} style={{ textAlign: 'center', marginBottom: mobile ? 24 : 32 }}>
              <motion.div
                style={{ fontSize: emojiSize, marginBottom: 8 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <h2
                style={{
                  margin: 0,
                  background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  fontSize: mobile ? 22 : 28,
                }}
              >
                创建账号
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: mobile ? 13 : 14, marginTop: 6 }}>
                加入我们，开始你的博客之旅
              </p>
            </motion.div>

            <Form onFinish={onFinish} autoComplete="off" size="large">
              <motion.div variants={fadeIn} style={{ marginBottom: 16 }}>
                <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]} style={{ marginBottom: 0 }}>
                  <Input
                    placeholder="用户名"
                    prefix={<UserOutlined style={{ color: '#f093fb' }} />}
                    style={{
                      height: 48,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                    }}
                    autoFocus
                  />
                </Form.Item>
              </motion.div>

              <motion.div variants={fadeIn} style={{ marginBottom: 16 }}>
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码', min: 6 }]} style={{ marginBottom: 0 }}>
                  <Input.Password
                    placeholder="密码（至少6位）"
                    prefix={<LockOutlined style={{ color: '#f093fb' }} />}
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

              <motion.div variants={fadeIn} style={{ marginBottom: mobile ? 16 : 24 }}>
                <Form.Item name="email" style={{ marginBottom: 0 }}>
                  <Input
                    placeholder="邮箱（选填）"
                    prefix={<MailOutlined style={{ color: '#f093fb' }} />}
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

              <motion.div variants={fadeIn} style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={{
                    height: 48,
                    fontSize: 16,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    border: 'none',
                    fontWeight: 600,
                  }}
                >
                  注 册
                </Button>
              </motion.div>
            </Form>

            <motion.div
              variants={fadeIn}
              style={{
                textAlign: 'center',
                paddingTop: 16,
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>已有账号？</Text>{' '}
              <Link to="/login" style={{ fontSize: 13, color: '#f093fb' }}>
                去登录
              </Link>
            </motion.div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}
