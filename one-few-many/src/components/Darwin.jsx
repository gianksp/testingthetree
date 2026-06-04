import React, { useRef, useEffect } from 'react'

const SEGMENTS = {
  neutral: { start: 1.0, end: 3.8 },
  skeptical: { start: 3.8, end: 6 },
  horrified: { start: 6.1, end: 10.0 },
}
const IDLE = { start: 1.0, end: 3.8 }

const LABELS = {
  neutral: { text: '"One primordial form" — perfectly fine.', color: 'text-green' },
  skeptical: { text: '"How many exactly? This is getting large."', color: 'text-amber' },
  horrified: { text: '"Are you nuts?"', color: 'text-red' },
}

export function moodFromN(n) {
  if (n <= 2) return 'neutral'
  if (n <= 4) return 'skeptical'
  return 'horrified'
}

export default function Darwin({ mood = 'neutral', showLabel = true, muted = false }) {
  const videoRef = useRef(null)
  const seg = SEGMENTS[mood]
  const label = LABELS[mood]

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = muted  // ← here
    let isIdle = false
    video.currentTime = seg.start

    const handleTimeUpdate = () => {
      if (!isIdle && video.currentTime >= seg.end) {
        isIdle = true
        video.currentTime = IDLE.start
      } else if (isIdle && video.currentTime >= IDLE.end) {
        video.currentTime = IDLE.start
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.play().catch(() => { })
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [mood, seg.start, seg.end])

  return (
    <div className="flex flex-col items-center gap-2">
      <video
        ref={videoRef}
        src="darwin.mp4"
        playsInline
        muted={muted}
        onError={(e) => console.error('video error', e)}
        className="w-full max-w-[500px] block"
      />
      {showLabel && (
        <p className={`text-[15px] italic text-center leading-snug max-w-[260px] ${label.color}`}>
          {label.text}
        </p>
      )}
    </div>
  )
}
