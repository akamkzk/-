import { useEffect, useRef, useCallback } from 'react'

interface DotGridBgProps {
  color?: string
  spacing?: number
  opacity?: number
}

/**
 * Subtle dot-grid overlay for depth texture.
 * Renders as a fixed canvas behind everything.
 */
function DotGridOverlay({ color = '#667eea', spacing = 32, opacity = 0.06 }: DotGridBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dotRadius = 1.2
      for (let x = spacing / 2; x < canvas.width; x += spacing) {
        for (let y = spacing / 2; y < canvas.height; y += spacing) {
          ctx.beginPath()
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
          ctx.fillStyle = `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
          ctx.fill()
        }
      }
    }

    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [color, spacing, opacity])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

interface AmbientOrb {
  x: string
  y: string
  size: number
  color: string
  delay: number
  driftX: number
  driftY: number
}

const ORBS: AmbientOrb[] = [
  { x: '15%', y: '20%', size: 500, color: 'rgba(102, 126, 234, 0.12)', delay: 0, driftX: 30, driftY: 20 },
  { x: '75%', y: '60%', size: 600, color: 'rgba(118, 75, 162, 0.10)', delay: 5, driftX: -40, driftY: -30 },
  { x: '50%', y: '80%', size: 400, color: 'rgba(167, 139, 250, 0.08)', delay: 10, driftX: -20, driftY: -15 },
  { x: '85%', y: '10%', size: 350, color: 'rgba(102, 126, 234, 0.07)', delay: 3, driftX: 25, driftY: -25 },
]

/**
 * Single ambient orb with CSS animation.
 */
function Orb({ x, y, size, color, delay, driftX, driftY }: AmbientOrb & { driftX: number; driftY: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(80px)',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        animation: `orbDrift 22s ease-in-out ${delay}s infinite alternate`,
        willChange: 'transform',
        pointerEvents: 'none',
        '--drift-x': `${driftX}px`,
        '--drift-y': `${driftY}px`,
      } as React.CSSProperties}
    />
  )
}

/**
 * Unified atmospheric background for all Layout-wrapped pages.
 * Provides: deep gradient base + dot-grid texture + drifting ambient orbs.
 * Placed inside Layout.tsx Content area so it sits behind glass-morphism cards.
 */
export default function PageBackground() {
  return (
    <>
      {/* Inject keyframe animations once */}
      <style>{`
        @keyframes orbDrift {
          0% { transform: translate(-50%, -50%) translate(0, 0); }
          100% { transform: translate(-50%, -50%) translate(var(--drift-x, 30px), var(--drift-y, -20px)); }
        }
      `}</style>

      {/* Deep gradient base */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(160deg, #0f0c29 0%, #1a1640 35%, #24243e 65%, #1a1640 100%)',
          zIndex: -2,
        }}
      />

      {/* Radial light pools for depth */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 20% 20%, rgba(102, 126, 234, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 55%)
          `,
          zIndex: -1,
        }}
      />

      {/* Dot grid overlay */}
      <DotGridOverlay color="#667eea" spacing={28} opacity={0.04} />

      {/* Drifting ambient orbs */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {ORBS.map((orb, i) => (
          <Orb key={i} {...orb} />
        ))}
      </div>
    </>
  )
}
