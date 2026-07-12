import { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Steps, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ParticleBackground from '@/components/ParticleBackground'
import GlassCard from '@/components/GlassCard'
import api from '@/api'
import { fadeInUp, fadeIn } from '@/lib/motion'

const { Text } = Typography

function isMobile() {
  return window.innerWidth <= 768
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [verifyForm] = Form.useForm()
  const [resetForm] = Form.useForm()
  const [formData, setFormData] = useState({ username: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleVerify = async (values: { username: string; email: string }) => {
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', values)
      setFormData(values)
      setStep(1)
      message.success('验证成功，请设置新密码')
    } catch (err: any) {
      message.error(err.response?.data?.message || '验证失败')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (values: { newPassword: string }) => {
    setLoading(true)
    try {
      await api.post('/auth/reset-password', {
        ...formData,
        newPassword: values.newPassword,
      })
      message.success('密码重置成功，请重新登录')
      setTimeout(() => navigate('/login'), 1000)
    } catch (err: any) {
      message.error(err.response?.data?.message || '重置失败')
    } finally {
      setLoading(false)
    }
  }

  const stepItems = [
    { title: '身份验证' },
    { title: '重置密码' },
  ]

  const cardPadding = mobile ? '24px 16px' : '40px 36px'

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
      <ParticleBackground color="rgba(79, 172, 254," particleCount={mobile ? 20 : 50} />

      <motion.div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <GlassCard style={{ padding: cardPadding }}>
            <motion.div variants={fadeIn} style={{ textAlign: 'center', marginBottom: mobile ? 20 : 28 }}>
              <motion.div
                style={{ fontSize: mobile ? 36 : 48, marginBottom: 8 }}
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
              >
                🔐
              </motion.div>
              <h2
                style={{
                  margin: 0,
                  background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  fontSize: mobile ? 20 : 26,
                }}
              >
                找回密码
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: mobile ? 12 : 13, marginTop: 6 }}>
                通过用户名和邮箱验证身份后重置密码
              </p>
            </motion.div>

            <motion.div variants={fadeIn} style={{ marginBottom: mobile ? 20 : 28 }}>
              <Steps
                current={step}
                items={stepItems}
                direction={mobile ? 'vertical' : 'horizontal'}
                style={{ color: 'rgba(255,255,255,0.7)' }}
                progressDot
              />
            </motion.div>

            {step === 0 && (
              <motion.form
                variants={fadeIn}
                onSubmit={(e) => {
                  e.preventDefault()
                  verifyForm.submit()
                }}
              >
                <Form form={verifyForm} layout={mobile ? 'vertical' : 'horizontal'} onFinish={handleVerify}>
                  <Form.Item name="username" label={<span style={{ color: '#333' }}>用户名</span>} rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input placeholder="请输入用户名" size="large" style={{ borderRadius: 10 }} />
                  </Form.Item>
                  <Form.Item name="email" label={<span style={{ color: '#333' }}>注册邮箱</span>} rules={[{ required: true, message: '请输入邮箱', type: 'email' }]}>
                    <Input placeholder="请输入注册时填写的邮箱" size="large" style={{ borderRadius: 10 }} />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 16 }}>
                    <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ borderRadius: 10, background: 'linear-gradient(135deg, #4facfe, #00f2fe)', border: 'none', fontWeight: 600 }}>
                      验证身份
                    </Button>
                  </Form.Item>
                </Form>
              </motion.form>
            )}

            {step === 1 && (
              <motion.form
                variants={fadeIn}
                onSubmit={(e) => {
                  e.preventDefault()
                  resetForm.submit()
                }}
              >
                <Form form={resetForm} layout={mobile ? 'vertical' : 'horizontal'} onFinish={handleReset}>
                  <Form.Item name="newPassword" label={<span style={{ color: '#333' }}>新密码</span>} rules={[{ required: true, message: '请输入新密码', min: 6 }]}>
                    <Input.Password placeholder="请输入新密码（至少6位）" size="large" style={{ borderRadius: 10 }} />
                  </Form.Item>
                  <Form.Item name="confirmPassword" label={<span style={{ color: '#333' }}>确认密码</span>} dependencies={['newPassword']}
                    rules={[
                      { required: true, message: '请再次输入密码' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'))
                        },
                      }),
                    ]}>
                    <Input.Password placeholder="请再次输入新密码" size="large" style={{ borderRadius: 10 }} />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 16 }}>
                    <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ borderRadius: 10, background: 'linear-gradient(135deg, #4facfe, #00f2fe)', border: 'none', fontWeight: 600 }}>
                      重置密码
                    </Button>
                  </Form.Item>
                </Form>
              </motion.form>
            )}

            <motion.div variants={fadeIn} style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/login" style={{ fontSize: 13, color: '#4facfe', textDecoration: 'none' }}>
                ← 返回登录
              </Link>
            </motion.div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}
