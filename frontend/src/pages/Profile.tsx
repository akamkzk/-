import { useEffect, useState } from 'react'
import { Card, Statistic, Form, Input, Button, message, Tabs, Avatar, Row, Col, Upload, Space, Typography } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  FileTextOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  InboxOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import api from '@/api'
import { useAuth } from '@/store/AuthContext'
import type { UploadFile } from 'antd'
import { containerVariants, fadeInUp, fadeIn } from '@/lib/motion'

function isMobile() {
  return window.innerWidth <= 768
}

const { Dragger } = Upload
const { Text } = Typography

interface UserProfile {
  id: number
  username: string
  nickname: string
  email: string
  avatar: string
  bio: string
  role: string
  createdAt: string
}

interface ProfileStats {
  totalArticles: number
  published: number
  pending: number
  drafts: number
  rejected: number
  totalViews: number
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    id: 0, username: '', nickname: '', email: '', avatar: '', bio: '', role: '', createdAt: '',
  })
  const [stats, setStats] = useState<ProfileStats>({
    totalArticles: 0, published: 0, pending: 0, drafts: 0, rejected: 0, totalViews: 0,
  })
  const [avatarKey, setAvatarKey] = useState(0)
  const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>([])
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => { fetchProfile() }, [])
  useEffect(() => { fetchStats() }, [])

  const fetchProfile = async () => {
    try {
      const res: any = await api.get('/auth/me')
      if (res.avatar && res.avatar.includes('/uploads/uploads')) {
        res.avatar = res.avatar.replace('/uploads/uploads', '/uploads')
      }
      setProfile(res)
      profileForm.setFieldsValue({
        nickname: res.nickname,
        email: res.email,
        avatar: res.avatar,
        bio: res.bio,
      })
      if (res.avatar) {
        setAvatarFileList([{ uid: '-1', name: 'avatar.png', status: 'done', url: res.avatar }])
      }
    } catch { message.error('获取个人信息失败') }
  }

  const fetchStats = async () => {
    try {
      const res: any = await api.get('/auth/stats')
      setStats(res)
    } catch { /* ignore */ }
  }

  const handleAvatarUpload = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)
      api.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((res: any) => resolve(res.avatar))
        .catch((err: any) => reject(err))
    })
  }

  const handleAvatarChange = async (info: { fileList: UploadFile[] }) => {
    const { fileList } = info
    setAvatarFileList(fileList)
    if (fileList.length > 0) {
      const uploadedFile = fileList[fileList.length - 1]
      if (uploadedFile.originFileObj) {
        try {
          const avatarUrl = await handleAvatarUpload(uploadedFile.originFileObj as File)
          profileForm.setFieldValue('avatar', avatarUrl)
          updateUser({ avatar: avatarUrl })
          setProfile(prev => ({ ...prev, avatar: avatarUrl }))
          setAvatarKey(prev => prev + 1)
          message.success('头像上传成功')
        } catch (err: any) {
          message.error(err.response?.data?.message || '上传失败')
          setAvatarFileList([])
        }
      }
    }
  }

  const handleProfileSubmit = async (values: any) => {
    try {
      await api.put('/auth/profile', values)
      updateUser(values)
      message.success('资料更新成功')
    } catch (err: any) {
      message.error(err.response?.data?.message || '更新失败')
    }
  }

  const handlePasswordSubmit = async (values: any) => {
    try {
      await api.put('/auth/password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
      message.success('密码修改成功，请重新登录')
      passwordForm.resetFields()
      setTimeout(() => window.location.href = '/login', 1500)
    } catch (err: any) {
      message.error(err.response?.data?.message || '修改失败')
    }
  }

  const quickLinks = [
    { icon: <EditOutlined />, label: '写文章', color: '#667eea', to: '/editor' },
    { icon: <FileTextOutlined />, label: '浏览博客', color: '#52c41a', to: '/' },
    { icon: <UserOutlined />, label: '我的投稿', color: '#faad14', to: '/my-submissions' },
  ]

  const items = [
    {
      key: 'basic',
      label: '个人资料',
      icon: <UserOutlined />,
      children: (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar
            key={avatarKey}
            size={mobile ? 72 : 88}
            icon={<UserOutlined />}
            src={profile.avatar}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: '4px solid rgba(102,126,234,0.2)',
              cursor: 'pointer',
            }}
          />
          <Dragger
            accept="image/*"
            showUploadList={false}
            customRequest={({ file }) => handleAvatarUpload(file as File)}
            onChange={handleAvatarChange}
            style={{ marginTop: 16, maxWidth: mobile ? '100%' : 300, marginInline: 'auto' }}
          >
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">点击或拖拽图片上传头像</p>
            <p className="ant-upload-hint">支持 JPG、PNG 格式</p>
          </Dragger>
        </div>
      ),
    },
    {
      key: 'stats',
      label: '数据统计',
      icon: <FileTextOutlined />,
      children: (
        <Row gutter={[mobile ? 8 : 16, mobile ? 8 : 16]}>
          <Col xs={24} sm={8}>
            <GlassCard style={{ textAlign: 'center', padding: 20 }}>
              <motion.div
                style={{ fontSize: 32, marginBottom: 8 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📊
              </motion.div>
              <AnimatedCounter end={stats.totalArticles} suffix=" 篇" style={{ fontSize: 24, fontWeight: 700, color: '#667eea' }} />
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>总文章</div>
            </GlassCard>
          </Col>
          <Col xs={24} sm={8}>
            <GlassCard style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👁️</div>
              <AnimatedCounter end={stats.totalViews} suffix=" 次" style={{ fontSize: 24, fontWeight: 700, color: '#52c41a' }} />
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>总浏览</div>
            </GlassCard>
          </Col>
          <Col xs={24} sm={8}>
            <GlassCard style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <AnimatedCounter end={stats.published} suffix=" 篇" style={{ fontSize: 24, fontWeight: 700, color: '#faad14' }} />
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>已发布</div>
            </GlassCard>
          </Col>
        </Row>
      ),
    },
    {
      key: 'password',
      label: '修改密码',
      icon: <LockOutlined />,
      children: (
        <div style={{ maxWidth: mobile ? '100%' : 480 }}>
          <Form form={passwordForm} onFinish={handlePasswordSubmit} layout={mobile ? 'vertical' : 'vertical'}>
            <Form.Item name="oldPassword" label="旧密码" rules={[{ required: true, message: '请输入旧密码' }]}>
              <Input.Password placeholder="请输入当前密码" style={{ borderRadius: 10 }} />
            </Form.Item>
            <Form.Item name="newPassword" label="新密码" rules={[{ required: true, message: '请输入新密码', min: 6 }]}>
              <Input.Password placeholder="请输入新密码（至少6位）" style={{ borderRadius: 10 }} />
            </Form.Item>
            <Form.Item name="confirmPassword" label="确认新密码"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}>
              <Input.Password placeholder="请再次输入新密码" style={{ borderRadius: 10 }} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" icon={<LockOutlined />} size="large" style={{ borderRadius: 10, background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}>
                修改密码
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Banner */}
      <motion.div variants={fadeInUp}>
        <GlassCard glow style={{ padding: mobile ? '20px 16px' : '32px', marginBottom: 24, background: 'linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))' }}>
          <Row align="middle" gutter={mobile ? 12 : 24}>
            <Col xs={24} sm={auto}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Avatar
                  key={avatarKey}
                  size={mobile ? 56 : 80}
                  icon={<UserOutlined />}
                  src={profile.avatar}
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: '3px solid rgba(255,255,255,0.5)',
                    boxShadow: '0 4px 20px rgba(102,126,234,0.3)',
                  }}
                />
              </motion.div>
            </Col>
            <Col xs={24} sm={undefined}>
              <h2 style={{ margin: 0, fontSize: mobile ? 18 : 24, fontWeight: 800, color: '#fff' }}>
                {profile.nickname || profile.username}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: mobile ? 12 : 14, margin: '4px 0 0' }}>
                @{profile.username} · {profile.role === 'ADMIN' ? '管理员' : '普通用户'}
              </p>
              {profile.bio && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: mobile ? 12 : 13, margin: '4px 0 0' }}>{profile.bio}</p>}
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: mobile ? 11 : 12, margin: '4px 0 0' }}>
                注册时间：{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('zh-CN') : '-'}
              </p>
            </Col>
          </Row>
        </GlassCard>
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={fadeIn} style={{ display: 'flex', gap: mobile ? 8 : 16, marginBottom: mobile ? 16 : 28, flexWrap: 'wrap' }}>
        {quickLinks.map((link) => (
          <motion.div
            key={link.label}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ flex: mobile ? '1 1 calc(50% - 8px)' : undefined, minWidth: mobile ? 120 : undefined, flexShrink: 1 }}
          >
            <GlassCard hover>
              <div
                onClick={() => (window.location.href = link.to)}
                style={{
                  padding: mobile ? '14px 12px' : '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <motion.div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${link.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    color: link.color,
                    flexShrink: 0,
                  }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  {link.icon}
                </motion.div>
                <Text strong style={{ fontSize: mobile ? 13 : 15 }}>{link.label}</Text>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="basic"
        items={items}
        size={mobile ? 'small' : 'large'}
        style={{ borderRadius: 16 }}
        tabBarStyle={{ paddingInline: mobile ? 4 : undefined }}
      />
    </motion.div>
  )
}
