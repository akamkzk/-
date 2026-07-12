import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Tag, Avatar, Button, message, Form, Input } from 'antd'
import { ArrowLeftOutlined, UserOutlined, HeartOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import api from '@/api'
import { useAuth } from '@/store/AuthContext'
import { fadeInUp, fadeIn, scaleIn } from '@/lib/motion'

function isMobile() {
  return window.innerWidth <= 768
}

interface ArticleData {
  id: number
  title: string
  content: string
  summary: string
  authorName: string
  categoryName: string
  tags: Array<{ id: number; name: string }>
  viewCount: number
  publishedAt: string
  createdAt: string
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [commentForm] = Form.useForm()
  const [liked, setLiked] = useState(false)
  const [mobile, setMobile] = useState(isMobile())

  const fetchArticle = async () => {
    try {
      const res: any = await api.get(`/articles/${id}`)
      setArticle(res)
    } catch (err) {
      message.error('获取文章失败')
    }
  }

  const fetchComments = async () => {
    try {
      const res: any = await api.get(`/comments/public/${id}`)
      setComments(res)
    } catch (err) {
      console.error('获取评论失败', err)
    }
  }

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => { fetchArticle() }, [id])
  useEffect(() => { fetchComments() }, [id])

  const handleSubmitComment = async (values: { content: string }) => {
    try {
      await api.post('/comments', { articleId: Number(id), content: values.content })
      message.success('评论成功')
      commentForm.resetFields()
      fetchComments()
    } catch (err: any) {
      message.error(err.response?.data?.message || '评论失败')
    }
  }

  const contentPadding = mobile ? '20px 16px' : '32px 36px'
  const titleSize = mobile ? 22 : 32
  const bodyFontSize = mobile ? 15 : 16

  if (!article) return (
    <div style={{ textAlign: 'center', padding: mobile ? 32 : 48 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ fontSize: 32, display: 'inline-block' }}
      >
        ⏳
      </motion.div>
      <p style={{ color: '#999', marginTop: 12 }}>加载中...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: mobile ? '100%' : 900, margin: '0 auto', padding: mobile ? '0 4px' : 0 }}>
      {/* Back button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => window.history.back()}
          style={{
            marginBottom: mobile ? 12 : 20,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
          }}
        >
          返回列表
        </Button>
      </motion.div>

      {/* Article Card */}
      <motion.div variants={scaleIn} initial="hidden" animate="visible">
        <GlassCard glow style={{ padding: contentPadding, marginBottom: mobile ? 16 : 20 }}>
          {/* Category */}
          {article.categoryName && (
            <motion.div variants={fadeIn} style={{ marginBottom: 12 }}>
              <Tag color="#667eea" style={{ borderRadius: 20, padding: '4px 14px', fontSize: 13 }}>
                {article.categoryName}
              </Tag>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            variants={fadeIn}
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              margin: '0 0 16px',
              lineHeight: 1.4,
              color: 'rgba(102, 126, 234, 0.9)',
              wordBreak: 'break-word',
            }}
          >
            {article.title}
          </motion.h1>

          {/* Meta info */}
          <motion.div
            variants={fadeIn}
            style={{
              display: 'flex',
              gap: mobile ? 12 : 20,
              alignItems: 'center',
              marginBottom: 24,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(102, 126, 234, 0.7)', fontSize: mobile ? 13 : 14 }}>
              <Avatar size={mobile ? 24 : 'small'} icon={<UserOutlined />} style={{ background: '#667eea' }}>
                {article.authorName?.[0]}
              </Avatar>
              {article.authorName}
            </span>
            <span style={{ color: 'rgba(102, 126, 234, 0.55)', fontSize: mobile ? 12 : 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              <EyeOutlined /> {article.viewCount} 阅读
            </span>
            <span style={{ color: 'rgba(102, 126, 234, 0.55)', fontSize: mobile ? 12 : 13 }}>
              {new Date(article.publishedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </motion.div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <motion.div variants={fadeIn} style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {article.tags.map((t) => (
                <Tag
                  key={t.id}
                  style={{
                    borderRadius: 16,
                    padding: '3px 12px',
                    fontSize: 12,
                    background: 'rgba(102, 126, 234, 0.08)',
                    color: '#667eea',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  #{t.name}
                </Tag>
              ))}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            variants={fadeIn}
            style={{
              lineHeight: 1.8,
              color: 'rgba(102, 126, 234, 0.75)',
              fontSize: bodyFontSize,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: mobile ? 16 : 24,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Like button */}
          <motion.div variants={fadeIn} style={{ marginTop: mobile ? 16 : 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Button
              icon={liked ? <HeartOutlined style={{ color: '#f5576c' }} /> : <HeartOutlined />}
              onClick={() => setLiked(!liked)}
              style={{
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.15)',
                color: liked ? '#f5576c' : 'rgba(255,255,255,0.7)',
                background: 'transparent',
              }}
            >
              {liked ? `已点赞` : `点赞`}
            </Button>
          </motion.div>
        </GlassCard>
      </motion.div>

      {/* Comments Section */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard style={{ padding: mobile ? '16px' : '24px 28px' }}>
          <motion.div variants={fadeIn} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <MessageOutlined style={{ color: '#667eea', fontSize: mobile ? 16 : 18 }} />
            <h3 style={{ margin: 0, fontSize: mobile ? 16 : 18, fontWeight: 700, color: '#fff' }}>
              评论 ({comments.length})
            </h3>
          </motion.div>

          {/* Comment form */}
          {user ? (
            <motion.div variants={fadeIn} style={{ marginBottom: 24 }}>
              <Form form={commentForm} onFinish={handleSubmitComment}>
                <Form.Item name="content" rules={[{ required: true, message: '请输入评论内容' }]} style={{ marginBottom: 12 }}>
                  <Input.TextArea
                    rows={mobile ? 2 : 3}
                    placeholder="写下你的评论..."
                    style={{ borderRadius: 12 }}
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      height: 40,
                      padding: '0 24px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    发表评论
                  </motion.button>
                </Form.Item>
              </Form>
            </motion.div>
          ) : (
            <motion.div variants={fadeIn} style={{ textAlign: 'center', padding: mobile ? 16 : 20, background: 'rgba(102,126,234,0.04)', borderRadius: 12, marginBottom: 20 }}>
              <UserOutlined style={{ fontSize: 28, color: '#d9d9d9', marginBottom: 8, display: 'block' }} />
              <p style={{ color: '#999', margin: 0, fontSize: mobile ? 13 : 14 }}>
                <Link to="/login" style={{ color: '#667eea' }}>登录</Link> 后可发表评论
              </p>
            </motion.div>
          )}

          {/* Comments list */}
          <motion.div style={{ maxHeight: mobile ? 300 : 500, overflowY: 'auto' }}>
            {comments.length > 0 ? (
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                {comments.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    variants={fadeIn}
                    custom={idx}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: mobile ? '12px 0' : '16px 0',
                      borderBottom: idx < comments.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Avatar
                        size={mobile ? 32 : 40}
                        style={{
                          backgroundColor: `hsl(${(item.id * 37) % 360}, 70%, 60%)`,
                          cursor: 'pointer',
                        }}
                      >
                        {item.username?.[0]?.toUpperCase()}
                      </Avatar>
                    </motion.div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: mobile ? 13 : 14, color: 'rgba(102, 126, 234, 0.75)' }}>
                          {item.username}
                        </span>
                        <span style={{ fontSize: mobile ? 11 : 12, color: 'rgba(102, 126, 234, 0.55)' }}>
                          {new Date(item.createdAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <div style={{ color: 'rgba(102, 126, 234, 0.7)', fontSize: mobile ? 13 : 14, lineHeight: 1.6, wordBreak: 'break-word' }}>
                        {item.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p
                variants={fadeIn}
                style={{ textAlign: 'center', color: '#bbb', padding: mobile ? 16 : 24, fontSize: mobile ? 13 : undefined }}
              >
                暂无评论，快来抢沙发吧~
              </motion.p>
            )}
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
