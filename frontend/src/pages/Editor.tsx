import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Form, Input, Select, message, Card, Alert, Tag, Typography } from 'antd'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import api from '@/api'
import { useAuth } from '@/store/AuthContext'
import { fadeInUp, fadeIn } from '@/lib/motion'

const { Text } = Typography

function isMobile() {
  return window.innerWidth <= 768
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: '待审核',
  APPROVED: '已发布',
  REJECTED: '已拒绝',
  DRAFT: '草稿',
}

export default function Editor() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const articleId = searchParams.get('id')
  const [form] = Form.useForm()
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [article, setArticle] = useState<any>(null)
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: '开始写你的文章...' })],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      form.setFieldValue('content', html)
    },
  })

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [cats, tg]: any = await Promise.all([api.get('/categories'), api.get('/tags')])
        setCategories(cats)
        setTags(tg)
      } catch (err) { console.error('获取元数据失败', err) }
    }
    fetchMeta()
    if (articleId) loadArticle(Number(articleId))
  }, [articleId])

  const loadArticle = async (id: number) => {
    try {
      const res: any = await api.get(`/articles/${id}`)
      setArticle(res)
      form.setFieldsValue({ title: res.title, summary: res.summary, categoryId: res.categoryId, status: res.status })
      if (res.content && editor) editor.commands.setContent(res.content)
    } catch { message.error('加载文章失败') }
  }

  const handleSubmit = async (values: any) => {
    if (!values.content || values.content.trim() === '') { message.warning('请输入文章内容'); return }
    setSaving(true)
    try {
      const data: any = { ...values, status: values.status || 'PENDING' }
      if (articleId) {
        await api.put(`/articles/${articleId}`, data)
        message.success('文章更新成功')
      } else {
        await api.post('/articles', data)
        message.success('文章已提交，等待审核')
      }
      navigate(-1)
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存失败')
    } finally { setSaving(false) }
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
      {article && (
        <motion.div variants={fadeIn} style={{ marginBottom: mobile ? 12 : 20 }}>
          <Alert
            title={`当前状态：${STATUS_LABELS[article.status] || article.status}`}
            description={article.rejectReason ? `拒绝原因：${article.rejectReason}` : undefined}
            type={article.status === 'APPROVED' ? 'success' : article.status === 'REJECTED' ? 'error' : 'warning'}
            showIcon
            closable
            style={{ borderRadius: 12 }}
          />
        </motion.div>
      )}

      <GlassCard glow style={{ padding: mobile ? '20px 16px' : '32px 36px' }}>
        <motion.h2 variants={fadeIn} style={{ margin: '0 0 20px', fontSize: mobile ? 20 : 22, fontWeight: 800, color: '#fff' }}>
          {articleId ? '编辑文章' : '写文章'}
        </motion.h2>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <motion.div variants={fadeIn} style={{ marginBottom: 16 }}>
            <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
              <Input placeholder="请输入文章标题" size="large" style={{ borderRadius: 10, fontSize: mobile ? 15 : 16, fontWeight: 600 }} />
            </Form.Item>
          </motion.div>

          <motion.div variants={fadeIn} style={{ marginBottom: 16 }}>
            <Form.Item name="summary" label="摘要">
              <Input placeholder="请输入文章摘要（选填）" style={{ borderRadius: 10 }} />
            </Form.Item>
          </motion.div>

          <motion.div variants={fadeIn} style={{ display: 'flex', gap: mobile ? 8 : 16, marginBottom: 16, flexDirection: mobile ? 'column' : undefined }}>
            <Form.Item name="categoryId" label="分类" style={{ flex: 1 }}>
              <Select placeholder="选择分类" allowClear style={{ borderRadius: 10 }} options={categories.map((c: any) => ({ value: c.id, label: c.name }))} />
            </Form.Item>
            {isAdmin && (
              <Form.Item name="status" label="状态" style={{ flex: 1 }} initialValue="PENDING">
                <Select style={{ borderRadius: 10 }}>
                  <Select.Option value="PENDING">待审核</Select.Option>
                  <Select.Option value="APPROVED">已发布</Select.Option>
                  <Select.Option value="REJECTED">已拒绝</Select.Option>
                  <Select.Option value="DRAFT">草稿</Select.Option>
                </Select>
              </Form.Item>
            )}
          </motion.div>

          <motion.div variants={fadeIn} style={{ marginBottom: 24 }}>
            <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
              <div className="tipap-editor" style={{
                borderRadius: 12,
                border: '2px solid rgba(102,126,234,0.2)',
                background: 'rgba(255,255,255,0.5)',
                minHeight: mobile ? 200 : 300,
              }}>
                <EditorContent editor={editor} />
              </div>
            </Form.Item>
          </motion.div>

          {/* Fix: use style properly */}
          <motion.div variants={fadeIn} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button type="primary" htmlType="submit" loading={saving} size="large"
              style={{
                borderRadius: 10,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                padding: '0 32px',
                fontWeight: 600,
                height: 48,
                flex: mobile ? 1 : undefined,
              }}
            >
              {articleId ? '更新文章' : '提交审核'}
            </Button>
            <Button size="large" onClick={() => navigate(-1)} style={{ borderRadius: 10, height: 48, flex: mobile ? 1 : undefined }}>
              取消
            </Button>
          </motion.div>
        </Form>
      </GlassCard>
    </motion.div>
  )
}
