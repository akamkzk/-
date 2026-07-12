import { useEffect, useState } from 'react'
import { UserOutlined, FileTextOutlined, TagsOutlined, CommentOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons'
import MagicBento from '@/components/MagicBento'
import api from '@/api'

function isMobile() {
  return window.innerWidth <= 768
}

interface Stats {
  users: number
  articles: number
  categories: number
  comments: number
  pendingReviews: number
  views: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    articles: 0,
    categories: 0,
    comments: 0,
    pendingReviews: 0,
    views: 0,
  })
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => setMobile(isMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cats, tags]: any = await Promise.all([api.get('/categories'), api.get('/tags')])
        setStats({
          users: 2,
          articles: 0,
          categories: cats.length,
          comments: tags.length,
          pendingReviews: 0,
          views: 0,
        })
      } catch {
        // ignore
      }
    }
    fetchStats()
  }, [])

  const bentoCards = [
    {
      color: 'rgba(102,126,234,0.06)',
      title: '总浏览量',
      description: '全站累计文章阅读次数',
      label: 'Views',
      icon: <EyeOutlined />,
      value: stats.views.toLocaleString(),
    },
    {
      color: 'rgba(118,75,162,0.06)',
      title: '文章总数',
      description: '已发布的所有文章数量',
      label: 'Articles',
      icon: <FileTextOutlined />,
      value: String(stats.articles),
    },
    {
      color: 'rgba(167,139,250,0.06)',
      title: '待审核稿件',
      description: '等待管理员审核的投稿',
      label: 'Pending',
      icon: <CheckCircleOutlined />,
      value: String(stats.pendingReviews),
    },
    {
      color: 'rgba(102,126,234,0.06)',
      title: '注册用户',
      description: '平台累计注册用户数',
      label: 'Users',
      icon: <UserOutlined />,
      value: String(stats.users),
    },
    {
      color: 'rgba(118,75,162,0.06)',
      title: '分类数量',
      description: '文章分类目录总数',
      label: 'Categories',
      icon: <TagsOutlined />,
      value: String(stats.categories),
    },
    {
      color: 'rgba(167,139,250,0.06)',
      title: '评论互动',
      description: '用户留言与互动总数',
      label: 'Comments',
      icon: <CommentOutlined />,
      value: String(stats.comments),
    },
  ]

  return (
    <div style={{ padding: mobile ? '0 4px' : '0 8px' }}>
      <h3 style={{ marginBottom: mobile ? 16 : 24, fontSize: mobile ? 20 : 24, fontWeight: 800, color: '#fff' }}>
        管理概览
      </h3>
      <MagicBento
        textAutoHide
        enableStars
        enableSpotlight
        enableBorderGlow
        enableTilt
        enableMagnetism
        clickEffect
        spotlightRadius={mobile ? 200 : 300}
        particleCount={12}
        glowColor="102, 126, 234"
        cards={bentoCards}
      />
    </div>
  )
}
