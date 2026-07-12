import { useEffect, useState } from 'react'
import { Card, Tag, Input, Select, Empty, Pagination, Alert, message, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import ParticleBackground from '@/components/ParticleBackground'
import api from '@/api'
import { useAuth } from '@/store/AuthContext'
import { containerVariants, staggerChildren, fadeInUp, fadeIn } from '@/lib/motion'

const { Text } = Typography

function isMobile() {
  return window.innerWidth <= 768
}

interface ArticleItem {
  id: number
  title: string
  summary: string
  authorName: string
  categoryName: string
  tags: Array<{ id: number; name: string }>
  viewCount: number
  publishedAt: string
}

export default function Home() {
  const { user } = useAuth()
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params: any = { page, size: 10 }
      if (keyword) params.keyword = keyword
      if (categoryId) params.categoryId = categoryId
      const res: any = await api.get('/articles', { params })
      setArticles(res.data)
      setTotal(res.total)
    } catch (err) {
      console.error('获取文章失败', err)
      message.error('获取文章列表失败，请检查后端服务是否运行')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res: any = await api.get('/categories')
      setCategories(res)
    } catch (err) {
      console.error('获取分类失败', err)
    }
  }

  useEffect(() => { fetchArticles() }, [page, keyword, categoryId])
  useEffect(() => { fetchCategories() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchArticles()
  }

  // Dynamic grid columns based on screen size
  const gridCols = mobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))'

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        style={{
          textAlign: 'center',
          padding: mobile ? '24px 16px 20px' : '40px 20px 32px',
          marginBottom: mobile ? 20 : 32,
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 100%)',
          border: '1px solid rgba(102,126,234,0.15)',
        }}
      >
        <motion.h1
          variants={fadeIn}
          style={{
            fontSize: mobile ? 26 : 36,
            fontWeight: 800,
            margin: '0 0 8px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          欢迎来到我的博客
        </motion.h1>
        <motion.p variants={fadeIn} style={{ color: 'rgba(255,255,255,0.5)', fontSize: mobile ? 14 : 16, margin: 0 }}>
          记录学习、分享技术、探索未知
        </motion.p>
      </motion.div>

      {/* Guest alert */}
      {!user && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Alert
            title="你是访客模式，登录后查看完整功能"
            type="info"
            showIcon
            closable
            style={{ marginBottom: 20, borderRadius: 12 }}
            action={
              <Link to="/login">
                <Tag color="blue" style={{ cursor: 'pointer' }}>去登录</Tag>
              </Link>
            }
          />
        </motion.div>
      )}

      {/* Search bar */}
      <motion.form
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSearch}
        style={{ display: 'flex', gap: 12, marginBottom: mobile ? 20 : 28, flexWrap: 'wrap' }}
      >
        <Input
          placeholder="搜索文章..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ maxWidth: mobile ? '100%' : 300, flex: 1, borderRadius: 12 }}
          allowClear
        />
        <Select
          placeholder="全部分类"
          allowClear
          value={categoryId}
          onChange={setCategoryId}
          style={{ maxWidth: mobile ? '100%' : 180, borderRadius: 12, flex: mobile ? 1 : undefined }}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ant-btn ant-btn-primary"
          style={{
            borderRadius: 12,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            padding: '0 24px',
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
          }}
        >
          <SearchOutlined /> {mobile ? '搜' : '搜索'}
        </motion.button>
      </motion.form>

      {/* Article grid */}
      {articles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: mobile ? 40 : 60 }}
        >
          <Empty description={loading ? '正在加载文章...' : '暂无文章'} />
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: gridCols, gap: mobile ? 14 : 20, marginBottom: 32 }}
        >
          <AnimatePresence>
            {articles.map((item, index) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                custom={index}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, delay: index * staggerChildren }}
                layout
              >
                <GlassCard hover glow>
                  <Link to={`/article/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: mobile ? '14px 16px' : '20px 24px' }}>
                    {/* Category badge */}
                    {item.categoryName && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Tag
                          color="#667eea"
                          style={{
                            borderRadius: 20,
                            padding: '2px 12px',
                            fontSize: 12,
                            marginBottom: 12,
                            display: 'inline-block',
                          }}
                        >
                          {item.categoryName}
                        </Tag>
                      </motion.div>
                    )}

                    {/* Title */}
                    <motion.h3
                      style={{
                        fontSize: mobile ? 16 : 18,
                        fontWeight: 700,
                        margin: '0 0 8px',
                        color: 'rgba(102, 126, 234, 0.85)',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                      whileHover={{ color: '#667eea' }}
                    >
                      {item.title}
                    </motion.h3>

                    {/* Summary */}
                    <motion.p
                      style={{ color: 'rgba(102, 126, 234, 0.7)', fontSize: mobile ? 13 : 14, margin: '0 0 12px', lineHeight: 1.6, minHeight: mobile ? 38 : 42, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                    >
                      {item.summary || '暂无摘要'}
                    </motion.p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <motion.div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {item.tags.slice(0, mobile ? 2 : 3).map((t) => (
                          <Tag
                            key={t.id}
                            style={{
                              borderRadius: 16,
                              fontSize: 11,
                              padding: '1px 8px',
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

                    {/* Meta */}
                    <motion.div
                      style={{ display: 'flex', justifyContent: 'space-between', fontSize: mobile ? 11 : 12, color: 'rgba(102, 126, 234, 0.55)', borderTop: '1px solid rgba(102,126,234,0.1)', paddingTop: 12, flexWrap: 'wrap', gap: 8 }}
                    >
                      <span style={{ width: mobile ? '100%' : undefined, marginBottom: mobile ? 4 : 0 }}>
                        <Text style={{ color: 'rgba(102, 126, 234, 0.7)' }}>{item.authorName}</Text> ·{' '}
                        {new Date(item.publishedAt).toLocaleDateString('zh-CN')}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          👁
                        </motion.span>
                        {item.viewCount}
                      </span>
                    </motion.div>
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {total > 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <Pagination
            current={page}
            total={total}
            pageSize={10}
            onChange={(p) => {
              setPage(p)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            showSizeChanger={false}
            responsive={mobile}
            style={{ justifyContent: 'center' }}
          />
        </motion.div>
      )}
    </div>
  )
}
