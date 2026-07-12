import { useEffect, useState } from 'react'
import { Table, Button, Popconfirm, message, Modal, Form, Input } from 'antd'
import { motion } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import api from '@/api'
import { fadeInUp, fadeIn } from '@/lib/motion'

function isMobile() {
  return window.innerWidth <= 768
}

interface CategoryItem {
  id: number
  name: string
  description: string
  sortOrder: number
  createdAt: string
}

export default function CategoryManage() {
  const [data, setData] = useState<CategoryItem[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editing, setEditing] = useState<CategoryItem | null>(null)
  const [form] = Form.useForm()
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchData = async () => {
    try {
      const res: any = await api.get('/categories')
      setData(res)
    } catch { message.error('获取分类失败') }
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = async (values: any) => {
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, values)
      } else {
        await api.post('/categories', values)
      }
      message.success('保存成功')
      setModalVisible(false)
      form.resetFields()
      setEditing(null)
      fetchData()
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存失败')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`)
      message.success('删除成功')
      fetchData()
    } catch { message.error('删除失败') }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60, render: (v: number) => <span style={{ color: '#888' }}>{v}</span> },
    { title: '名称', dataIndex: 'name', render: (t: string) => <span style={{ fontWeight: 600, color: '#fff' }}>{t}</span> },
    { title: '描述', dataIndex: 'description' },
    { title: '排序', dataIndex: 'sortOrder', width: mobile ? undefined : 80, render: (v: number) => <span style={{ color: '#888' }}>{v}</span> },
    {
      title: '操作',
      width: mobile ? undefined : 150,
      fixed: mobile ? false : 'right' as const,
      render: (_: any, record: CategoryItem) => (
        <>
          <Button size="small" onClick={() => { setEditing(record); form.setFieldsValue(record); setModalVisible(true) }} style={{ borderRadius: 8 }}>编辑</Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger style={{ borderRadius: 8 }}>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
      <motion.div variants={fadeIn} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ margin: 0, fontSize: mobile ? 16 : 18, fontWeight: 700, color: '#fff' }}>分类管理</h3>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditing(null); form.resetFields(); setModalVisible(true) }}
          style={{
            height: 36, padding: '0 16px', borderRadius: 8,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          新增分类
        </motion.button>
      </motion.div>

      <GlassCard hover>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          size={mobile ? 'small' : 'middle'}
          scroll={{ x: mobile ? '100%' : 800 }}
        />
      </GlassCard>

      <Modal
        title={editing ? '编辑分类' : '新增分类'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnHidden
        mask={{ closable: false }}
        width={mobile ? '100%' : 480}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入分类名称" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input placeholder="请输入分类描述" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序" rules={[{ type: 'number' }]}>
            <Input type="number" placeholder="数值越小越靠前" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" style={{ borderRadius: 8, background: '#667eea', border: 'none' }}>保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  )
}
