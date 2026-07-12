import { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import BorderGlow from '@/components/BorderGlow'

interface GlassCardProps {
  children: React.ReactNode
  onClick?: () => void
  hover?: boolean
  glow?: boolean
  style?: React.CSSProperties
  className?: string
}

export default function GlassCard({
  children,
  onClick,
  hover = true,
  glow = false,
  style,
  className = '',
}: GlassCardProps) {
  const controls = useAnimation()
  const prevHover = useRef(false)

  useEffect(() => {
    if (hover !== prevHover.current) {
      prevHover.current = hover
      if (hover) {
        controls.start({
          scale: 1.02,
          boxShadow: glow
            ? '0 20px 60px rgba(102, 126, 234, 0.25), 0 0 40px rgba(118, 75, 162, 0.15)'
            : '0 20px 40px rgba(0, 0, 0, 0.1)',
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        })
      } else {
        controls.start({
          scale: 1,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        })
      }
    }
  }, [hover, glow, controls])

  const glowColors = ['#667eea', '#764ba2', '#a78bfa']

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    ...style,
  }

  const wrappedChildren = (
    <motion.div
      animate={controls}
      whileTap={{ scale: 0.98 }}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )

  return (
    <BorderGlow
      colors={glowColors}
      glowColor="260 70 75"
      backgroundColor="rgba(255, 255, 255, 0.06)"
      borderRadius={16}
      glowRadius={30}
      glowIntensity={0.8}
      coneSpread={20}
      animated={false}
      className={className}
    >
      {wrappedChildren}
    </BorderGlow>
  )
}
