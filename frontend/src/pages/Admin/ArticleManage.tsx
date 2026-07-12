import { useEffect, useState } from 'react'
import { Table, Tag, Button, message, Input, Space, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import api from '@/api'
import { fadeInUp, fadeIn } from '@/lib/motion'

function isMobile() {
  return window.innerWidth <= 768
}

const { Text } = Typography

export default function ArticleManage() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
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
      const res: any = await api.get('/admin/articles', { params })
      setArticles(res.data)
      setTotal(res.total)
    } catch (err) { message.error('获取文章列表失败') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchArticles() }, [page, keyword])

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/articles/${id}`)
      message.success('删除成功')
      fetchArticles()
    } catch { message.error('删除失败') }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70, render: (v: number) => <Tag style={{ borderRadius: 8 }}>{v}</Tag> },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      render: (text: string, record: any) => (
        <Link to={`/article/${record.id}`} style={{ fontWeight: 600, color: '#fff' }}>
          {text}
        </Link>
      ),
    },
    { title: '作者', dataIndex: 'authorName', width: mobile ? undefined : 100 },
    { title: '分类', dataIndex: 'categoryName', width: mobile ? undefined : 100 },
    {
      title: '状态',
      dataIndex: 'status',
      width: mobile ? undefined : 100,
      render: (s: string) => s === 'PUBLISHED' ? <Tag color="green" style={{ borderRadius: 16 }}>已发布</Tag> : <Tag style={{ borderRadius: 16 }}>草稿</Tag>,
    },
    { title: '浏览', dataIndex: 'viewCount', width: mobile ? undefined : 70, render: (v: number) => <span style={{ color: '#888' }}>{v}</span> },
    {
      title: '操作',
      width: mobile ? undefined : 180,
      fixed: mobile ? false : 'right' as const,
      render: (_: any, record: any) => (
        <Space size={mobile ? 4 : undefined}>
          <Link to={`/editor?id=${record.id}`}>
            <Button size="small" icon={<EditOutlined />} style={{ borderRadius: 8 }}>编辑</Button>
          </Link>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} style={{ borderRadius: 8 }}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
      <motion.div variants={fadeIn} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: mobile ? 12 : 20, flexWrap: 'wrap', gap: 12 }}>
        <Input.Search
          placeholder="搜索文章..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={() => setPage(1)}
          style={{ width: mobile ? '100%' : 300, borderRadius: 10 }}
          allowClear
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/editor')}
          style={{
            height: 40,
            padding: '0 20px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
          }}
        >
          <PlusOutlined /> {mobile ? '新建' : '新建文章'}
        </motion.button>
      </motion.div>

      <GlassCard hover>
        <Table
          columns={columns}
          dataSource={articles}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            total,
            pageSize: 10,
            onChange: (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) },
            responsive: true,
            size: 'small',
          }}
          size={mobile ? 'small' : 'middle'}
          scroll={{ x: mobile ? '100%' : 1200, y: 600 }}
        />
      </GlassCard>
    </motion.div>
  )
}
