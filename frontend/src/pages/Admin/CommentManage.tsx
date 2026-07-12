import { useEffect, useState } from 'react'
import { Table, Tag, Button, message, Space, Typography } from 'antd'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import api from '@/api'
import { fadeInUp, fadeIn } from '@/lib/motion'

function isMobile() {
  return window.innerWidth <= 768
}

const { Text } = Typography

interface CommentItem {
  id: number
  content: string
  username: string
  articleId: number
  status: string
  createdAt: string
}

export default function CommentManage() {
  const [data, setData] = useState<CommentItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchData = async () => {
    try {
      const res: any = await api.get('/comments/pending', { params: { page, size: 10 } })
      setData(res.data)
      setTotal(res.total)
    } catch { message.error('获取评论失败') }
  }

  useEffect(() => { fetchData() }, [page])

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/comments/${id}/status?status=APPROVED`)
      message.success('已通过')
      fetchData()
    } catch { message.error('操作失败') }
  }

  const handleReject = async (id: number) => {
    try {
      await api.put(`/comments/${id}/status?status=REJECTED`)
      message.success('已拒绝')
      fetchData()
    } catch { message.error('操作失败') }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/comments/${id}`)
      message.success('已删除')
      fetchData()
    } catch { message.error('操作失败') }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60, render: (v: number) => <Tag style={{ borderRadius: 8 }}>{v}</Tag> },
    { title: '评论者', dataIndex: 'username', width: mobile ? undefined : 100, render: (t: string) => <span style={{ fontWeight: 600, color: '#fff' }}>{t}</span> },
    {
      title: '评论内容',
      ellipsis: true,
      render: (record: CommentItem) => (
        <span title={record.content}>
          {record.content.length > 60 ? record.content.substring(0, 60) + '...' : record.content}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: mobile ? undefined : 100,
      render: (s: string) => (
        <Tag color={s === 'APPROVED' ? 'green' : s === 'REJECTED' ? 'red' : 'orange'} style={{ borderRadius: 16, fontSize: mobile ? 11 : undefined }}>
          {s === 'APPROVED' ? '✅ 已通过' : s === 'REJECTED' ? '❌ 已拒绝' : '⏳ 待审核'}
        </Tag>
      ),
    },
    { title: '时间', dataIndex: 'createdAt', width: mobile ? undefined : 160, render: (t: string) => new Date(t).toLocaleString('zh-CN') },
    {
      title: '操作',
      width: mobile ? undefined : 220,
      fixed: mobile ? false : 'right' as const,
      render: (_: any, record: CommentItem) => (
        <Space size={mobile ? 4 : undefined} wrap>
          <Button size="small" type="primary" onClick={() => handleApprove(record.id)} style={{ borderRadius: 8, background: '#52c41a', border: 'none' }}>通过</Button>
          <Button size="small" danger onClick={() => handleReject(record.id)} style={{ borderRadius: 8 }}>拒绝</Button>
          <Button size="small" onClick={() => handleDelete(record.id)} style={{ borderRadius: 8 }}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
      <motion.h3 variants={fadeIn} style={{ marginBottom: mobile ? 12 : 16, fontSize: mobile ? 16 : 18, fontWeight: 700, color: '#fff' }}>
        💬 待审核评论
      </motion.h3>
      <GlassCard hover>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            current: page,
            total,
            pageSize: 10,
            onChange: (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) },
            size: 'small',
          }}
          size={mobile ? 'small' : 'middle'}
          scroll={{ x: mobile ? '100%' : 1200, y: 600 }}
        />
      </GlassCard>
    </motion.div>
  )
}
