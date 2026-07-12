import { useEffect, useState } from 'react'
import { Table, Tag, Button, message, Modal, Form, Input, Space, Typography } from 'antd'
import { EyeOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import api from '@/api'

function isMobile() {
  return window.innerWidth <= 768
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: '待审核', color: 'orange', icon: '⏳' },
  APPROVED: { label: '已发布', color: 'green', icon: '✅' },
  REJECTED: { label: '已拒绝', color: 'red', icon: '❌' },
  DRAFT: { label: '草稿', color: 'default', icon: '📄' },
}

export default function ArticleReview() {
  const [articles, setArticles] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<any>(null)
  const [reviewForm] = Form.useForm()
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const res: any = await api.get('/admin/articles', { params: { page, size: 10 } })
      setArticles(res.data)
      setTotal(res.total)
    } catch { message.error('获取文章列表失败') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchArticles() }, [page])

  const handleReview = async (id: number, status: string) => {
    try {
      const values = await reviewForm.validateFields()
      const rejectReason = values.rejectReason || ''
      await api.put(`/admin/articles/${id}/review?status=${status}&rejectReason=${encodeURIComponent(rejectReason)}`)
      message.success(status === 'APPROVED' ? '审核通过' : '已拒绝')
      setDetailVisible(false)
      reviewForm.resetFields()
      fetchArticles()
    } catch { /* cancel or validation error */ }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/articles/${id}`)
      message.success('删除成功')
      fetchArticles()
    } catch { message.error('删除失败') }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60, render: (v: number) => <Tag style={{ borderRadius: 8 }}>{v}</Tag> },
    {
      title: '标题', dataIndex: 'title', ellipsis: true,
      render: (text: string, record: any) => (
        <a href={`/article/${record.id}`} target="_blank" rel="noreferrer" style={{ color: '#667eea' }}>{text}</a>
      ),
    },
    { title: '作者', dataIndex: 'authorName', width: mobile ? undefined : 100 },
    {
      title: '状态', dataIndex: 'status', width: mobile ? undefined : 120,
      render: (s: string) => {
        const info = STATUS_MAP[s] || { label: s, color: 'default', icon: '❓' }
        return <Tag color={info.color} style={{ borderRadius: 16, padding: '3px 12px', fontSize: mobile ? 11 : undefined }}>{info.icon} {info.label}</Tag>
      },
    },
    { title: '浏览量', dataIndex: 'viewCount', width: mobile ? undefined : 80, render: (v: number) => <span style={{ color: '#888' }}>{v}</span> },
    { title: '时间', dataIndex: 'createdAt', width: mobile ? undefined : 160, render: (t: string) => new Date(t).toLocaleString('zh-CN') },
    {
      title: '操作',
      width: mobile ? undefined : 240,
      fixed: mobile ? false : 'right' as const,
      render: (_: any, record: any) => (
        <Space size={mobile ? 4 : undefined} wrap>
          <Button size="small" icon={<EyeOutlined />} onClick={() => { setCurrentArticle(record); setDetailVisible(true) }} style={{ borderRadius: 8 }}>查看</Button>
          {record.status === 'PENDING' && (
            <>
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleReview(record.id, 'APPROVED')} style={{ borderRadius: 8, background: '#52c41a', border: 'none' }}>通过</Button>
              <Button size="small" danger icon={<CloseOutlined />} onClick={() => { setCurrentArticle(record); setDetailVisible(true) }} style={{ borderRadius: 8 }}>拒绝</Button>
            </>
          )}
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} style={{ borderRadius: 8 }}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard hover style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: mobile ? '16px 12px 0' : '20px 24px 0' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: mobile ? 16 : 18, fontWeight: 700, color: '#fff' }}>
            📋 文章审核
          </h3>
        </div>
        <Table
          columns={columns}
          dataSource={articles}
          rowKey="id"
          loading={loading}
          pagination={{ current: page, total, pageSize: 10, onChange: setPage, size: 'small' }}
          size={mobile ? 'small' : 'middle'}
          scroll={{ x: mobile ? '100%' : 1200, y: 600 }}
        />
      </GlassCard>

      <Modal
        title={<span style={{ fontWeight: 700 }}>审核文章</span>}
        open={detailVisible}
        onCancel={() => { setDetailVisible(false); reviewForm.resetFields() }}
        footer={null}
        width={mobile ? '100%' : 700}
        style={{ maxWidth: mobile ? '100%' : 700, margin: mobile ? '0' : undefined }}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        {currentArticle && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{currentArticle.title}</h3>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>
              作者：{currentArticle.authorName} | 状态：<Tag color={STATUS_MAP[currentArticle.status]?.color}>{STATUS_MAP[currentArticle.status]?.icon} {STATUS_MAP[currentArticle.status]?.label}</Tag>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: currentArticle.content }}
              style={{
                maxHeight: 350,
                overflow: 'auto',
                padding: 16,
                background: '#fafafa',
                borderRadius: 10,
                marginBottom: 20,
                lineHeight: 1.8,
                border: '1px solid #f0f0f0',
              }}
            />
            <Form form={reviewForm} layout="vertical">
              <Form.Item name="rejectReason" label="拒绝原因（仅拒绝时填写）">
                <Input.TextArea rows={3} placeholder="请输入拒绝原因..." />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Space>
                  <Button type="primary" onClick={() => handleReview(currentArticle.id, 'APPROVED')} icon={<CheckOutlined />} style={{ borderRadius: 8, background: '#52c41a', border: 'none' }}>通过</Button>
                  <Button danger onClick={() => handleReview(currentArticle.id, 'REJECTED')} icon={<CloseOutlined />} style={{ borderRadius: 8 }}>拒绝</Button>
                  <Button onClick={() => setDetailVisible(false)} style={{ borderRadius: 8 }}>取消</Button>
                </Space>
              </Form.Item>
            </Form>
          </motion.div>
        )}
      </Modal>
    </motion.div>
  )
}
