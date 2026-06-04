import React, { useState, useEffect, useRef } from 'react'

/**
 * Each Cell mounts hidden, waits a random delay, then becomes visible.
 * Because the GIF is already playing in the background during that delay,
 * each cell "joins" the animation mid-stream at a different frame.
 */
export default function Cell({
  size = 80,
  index = 0,
  style = {},
  onClick,
  selected = false,
  faded = false,
  label,
}) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    // Each cell waits a different random amount before becoming visible.
    // This means the GIF has been running for a different duration per cell,
    // so they're all at different frames when they appear.
    const baseDelay = (index * 137) % 800   // spread 0–800ms deterministically
    const jitter    = Math.floor(Math.random() * 600) // extra 0–600ms random
    timerRef.current = setTimeout(() => setVisible(true), baseDelay + jitter)
    return () => clearTimeout(timerRef.current)
  }, [index])

  // Float parameters — vary per index so wobbles never sync
  const duration  = 2.6 + (index % 7) * 0.28          // 2.6s–4.5s
  const delay     = -((index * 0.83) % duration)       // start mid-cycle
  const yAmp      = 4 + (index % 5)                    // 4–8px
  const rot       = (index % 2 === 0 ? 1 : -1) * (2 + (index % 4)) // ±2–5deg
  const scaleAmp  = 0.025 + (index % 4) * 0.008

  const floatStyle = visible ? {
    animation: `cellFloat_${index % 9} ${duration}s ${delay}s ease-in-out infinite`,
  } : {
    visibility: 'hidden',  // hidden but GIF is already playing
  }

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        cursor: onClick ? 'pointer' : 'default',
        opacity: faded ? 0.2 : 1,
        transition: 'opacity 0.35s',
        ...style,
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        {selected && (
          <div style={{
            position: 'absolute', inset: -6,
            borderRadius: '50%',
            border: '2px solid var(--amber)',
            background: 'rgba(200,168,75,0.1)',
            animation: 'pulse 1.6s ease-in-out infinite',
          }} />
        )}
        <img
          src="cell.gif"
          alt="cell"
          width={size}
          height={size}
          style={{
            display: 'block',
            willChange: 'transform',
            userSelect: 'none',
            WebkitUserDrag: 'none',
            ...floatStyle,
          }}
        />
      </div>

      {label && (
        <span style={{
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-faint)',
          textAlign: 'center',
        }}>
          {label}
        </span>
      )}

      {/* Each index bucket gets its own keyframe with slightly different arc */}
      <style>{`
        @keyframes cellFloat_${index % 9} {
          0%   { transform: translateY(0px)              rotate(0deg)    scale(1); }
          30%  { transform: translateY(${-yAmp * 0.7}px) rotate(${rot * 0.5}deg) scale(${1 + scaleAmp * 0.6}); }
          55%  { transform: translateY(${-yAmp}px)       rotate(${rot}deg)       scale(${1 + scaleAmp}); }
          80%  { transform: translateY(${-yAmp * 0.4}px) rotate(${rot * 0.3}deg) scale(${1 + scaleAmp * 0.2}); }
          100% { transform: translateY(0px)              rotate(0deg)    scale(1); }
        }
      `}</style>
    </div>
  )
}
