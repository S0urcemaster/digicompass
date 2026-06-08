import type { ColorType } from '../types'
import { Rating } from './Rating'

export interface CardProps {
  size: 'selected' | 'preview'
  categories: string[]
  text?: string
  fontSize?: number
  imageUrl?: string
  imageColor?: ColorType
  rating: number
  inStore?: boolean
  onRatingChange?: (r: number) => void
  onStoreToggle?: () => void
  onFullscreen?: () => void
  onClick?: () => void
  noReset?: boolean
  fontScale?: number
}

const textColor: Record<ColorType, string> = {
  dunkel: '#fff',
  hell: '#111',
  mix: '#fff',
}

export function Card({
  size,
  categories,
  text,
  fontSize,
  imageUrl,
  imageColor,
  rating,
  inStore,
  onRatingChange,
  onStoreToggle,
  onFullscreen,
  onClick,
  noReset,
  fontScale = 1,
}: CardProps) {
  const color = imageColor ?? 'dunkel'
  const fg = textColor[color]
  const shadow = color === 'mix'
    ? '0 1px 4px rgba(0,0,0,0.8)'
    : color === 'dunkel'
      ? '0 1px 3px rgba(0,0,0,0.6)'
      : '0 1px 3px rgba(255,255,255,0.4)'

  const ratingSize = size === 'selected' ? 14 : 8
  const catSize = size === 'selected' ? 10 : 6

  const computedFontSize = fontSize
    ? Math.max(8, Math.round(fontSize * fontScale))
    : size === 'selected' ? 14 : 9

  const bgStyle = imageUrl
    ? {
        backgroundImage: `url("/images/${imageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { backgroundColor: '#1e1e1e' }

  const visibleCats = categories.slice(0, 5)

  return (
    <div
      className={`card card-${size}${imageUrl ? '' : ' card-noimage'}`}
      style={{ ...bgStyle, color: fg }}
      onClick={onClick}
    >
      {/* header */}
      <div className="card-header" style={{ textShadow: shadow }}>
        {visibleCats.map(cat => (
          <span key={cat} className="cat-chip" style={{ fontSize: catSize }}>{cat}</span>
        ))}
        {onStoreToggle && (
          <button
            className={`store-btn${inStore ? ' in-store' : ''}`}
            onClick={e => { e.stopPropagation(); onStoreToggle() }}
            title={inStore ? 'Aus Store entfernen' : 'In Store aufnehmen'}
          >
            {inStore ? '●' : '○'}
          </button>
        )}
        {onFullscreen && (
          <button
            className="fullscreen-btn"
            onClick={e => { e.stopPropagation(); onFullscreen() }}
            title="Vollbild"
          >
            ⛶
          </button>
        )}
      </div>

      {/* content */}
      <div
        className="card-content"
        style={{ textShadow: shadow }}
      >
        {text && (
          <p className="saying-text" style={{ fontSize: computedFontSize }}>
            {text}
          </p>
        )}
      </div>

      {/* footer */}
      <div className="card-footer">
        <Rating
          value={rating}
          onChange={onRatingChange}
          noReset={noReset}
          size={ratingSize}
        />
      </div>
    </div>
  )
}
