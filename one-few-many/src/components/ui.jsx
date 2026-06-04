import React from 'react'

export const Screen = ({ children, className = '' }) => (
  <div className={`fade-up w-full min-h-dvh flex flex-col px-5 pt-8 pb-7 max-w-md mx-auto ${className}`}>
    {children}
  </div>
)

export const Label = ({ children, className = '' }) => (
  <div className={`text-[10px] uppercase tracking-[0.14em] text-faint font-mono mb-2.5 ${className}`}>
    {children}
  </div>
)

export const Heading = ({ children, className = '' }) => (
  <h1 className={`text-[28px] font-semibold leading-tight mb-3 text-text ${className}`}>
    {children}
  </h1>
)

export const Body = ({ children, className = '' }) => (
  <p className={`text-md leading-relaxed text-muted ${className}`}>
    {children}
  </p>
)

export const Card = ({ children, className = '', accent = false, danger = false, success = false, style = {} }) => {
  const variant = accent  ? 'bg-amber-soft border border-amber/30'
                : danger  ? 'bg-red-soft border border-red/30'
                : success ? 'bg-green-soft border border-green/30'
                :           'bg-bg-card border border-border'
  return (
    <div
      className={`rounded-xl ${variant} ${className}`}
      style={{ padding: '20px', ...style }}
    >
      {children}
    </div>
  )
}

export const BtnPrimary = ({ children, onClick, className = '', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{ background: '#8a6a1a', color: '#f5f2ec' }}
    className={`w-full text-[17px] font-semibold py-4 px-6 rounded-lg
      tracking-wide transition-opacity active:scale-[0.98]
      ${disabled ? 'opacity-35 pointer-events-none' : ''}
      ${className}`}
  >
    {children}
  </button>
)

export const BtnChoice = ({ children, onClick, chosen = false, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full text-left rounded-xl p-5 transition-all duration-150 border-[1.5px]
      ${chosen
        ? 'bg-amber-soft border-amber'
        : 'bg-bg-card border-border hover:border-amber/40'}
      ${className}`}
  >
    {children}
  </button>
)

export const Divider = () => <div className="h-px bg-border my-4" />
export const Spacer = ({ h = 4 }) => <div className={`h-${h}`} />
