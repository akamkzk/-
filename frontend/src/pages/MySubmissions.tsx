import { useEffect, useState } from 'react'
import { Table, Tag, Button, message, Card, Space, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import api from '@/api'
import { useAuth } from '@/store/AuthContext'
import { fadeInUp, fadeIn } from '@/lib/motion'

const { Text } = Typography

function isMobile() {
  return window.innerWidth <= 768
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: '待审核', color: 'orange', icon: '⏳' },
  APPROVED: { label: '已发布', color: 'green', icon: '✅' },
  REJECTED: { label: '已拒绝', color: 'red', icon: '❌' },
  DRAFT: { label: '草稿', color: 'default', icon: '📄' },
}

export default function MySubmissions() {
  const { user } = useAuth()
  const [articles, setArticles] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
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
      const res: any = await api.get('/articles/my', { params: { page, size: 10 } })
      setArticles(res.data)
      setTotal(res.total)
    } catch { message.error('获取投稿列表失败') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchArticles() }, [page])

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/articles/${id}`)
      message.success('删除成功')
      fetchArticles()
    } catch { message.error('删除失败') }
  }

  const columns = [
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
    {
      title: '状态',
      dataIndex: 'status',
      width: mobile ? undefined : 120,
      render: (status: string) => {
        const info = STATUS_MAP[status] || { label: status, color: 'default', icon: '❓' }
        return (
          <Tag color={info.color} style={{ borderRadius: 20, padding: '4px 14px', fontSize: mobile ? 11 : undefined }}>
            {info.icon} {info.label}
          </Tag>
        )
      },
    },
    { title: '分类', dataIndex: 'categoryName', width: mobile ? undefined : 100 },
    {
      title: '浏览',
      dataIndex: 'viewCount',
      width: mobile ? undefined : 80,
      render: (v: number) => <span style={{ color: '#888' }}>{v}</span>,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: mobile ? undefined : 160,
      render: (t: string) => new Date(t).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      width: mobile ? undefined : 150,
      fixed: mobile ? false : 'right' as const,
      render: (_: any, record: any) => (
        <Space size={mobile ? 8 : undefined}>
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
      <motion.div variants={fadeIn} style={{ marginBottom: mobile ? 12 : 20 }}>
        <GlassCard style={{ padding: mobile ? '16px' : '20px 24px' }}>
          <div style={{ display: 'flex', gap: mobile ? 16 : 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <Text type="secondary" style={{ fontSize: 13 }}>总投稿</Text>
              <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 800, color: '#667eea' }}>
                <AnimatedCounter end={total} />
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: '#eee' }} />
            <div>
              <Text type="secondary" style={{ fontSize: 13 }}>当前页</Text>
              <div style={{ fontSize: mobile ? 16 : 20, fontWeight: 700, color: '#fff' }}>{page}</div>
            </div>
          </div>
        </GlassCard>
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
          rowClassName="glass-table-row"
          style={{ borderRadius: 12, overflow: 'hidden' }}
          scroll={{ x: mobile ? '100%' : 1200, y: 600 }}
          size={mobile ? 'small' : 'middle'}
        />
      </GlassCard>
    </motion.div>
  )
}
