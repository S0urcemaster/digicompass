import type { Focus } from '../../types'
import { StarRating } from './StarRating'

interface FocusTileProps {
  focus: Focus
  variant?: 'main' | 'preview'
  onSetRating?: (r: number) => void
  onSelect?: () => void
  onZoom?: () => void
  selected?: boolean
}

const contrast: Record<string, { color: string; shadow: string }> = {
  dunkel: { color: '#fff',     shadow: '0 1px 3px rgba(0,0,0,0.7)' },
  hell:   { color: '#201a18', shadow: '0 1px 2px rgba(255,255,255,0.5)' },
  mix:    { color: '#fff',     shadow: '0 1px 4px rgba(0,0,0,0.9)' },
}

export function FocusTile({ focus, variant = 'main', onSetRating, onSelect, onZoom, selected }: FocusTileProps) {
  const { color, shadow } = contrast[focus.imageColor] ?? contrast.dunkel
  const cats = [...new Set([...focus.saying.categories, focus.imageCategory])].slice(0, 5)
  const textSize = variant === 'main' ? Math.max(12, focus.saying.fontSize ?? 14) : 9
  const catSize  = variant === 'main' ? 10 : 7

  return (
    <div
      className={`focus-tile focus-tile--${variant}${selected ? ' selected' : ''}`}
      onClick={onSelect}
    >
      <div
        className="focus-tile__bg"
        style={{ backgroundImage: `url("/images/${focus.imageUrl}")` }}
      />
      <div className="focus-tile__overlay" style={{ color, textShadow: shadow }}>
        <div className="focus-tile__header">
          {cats.map(cat => (
            <span key={cat} className="chip" style={{ fontSize: catSize }}>{cat}</span>
          ))}
          {onZoom && variant === 'main' && (
            <button
              className="focus-tile__zoom"
              onClick={e => { e.stopPropagation(); onZoom() }}
              title="Bild vergrössern"
            >⊕</button>
          )}
        </div>
        <div className="focus-tile__content">
          <p
            className="focus-tile__text"
            style={{
              fontSize: textSize,
              ...(variant === 'preview' ? {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical' as const,
                WebkitLineClamp: 4,
                overflow: 'hidden',
              } : {}),
            }}
          >{focus.saying.text}</p>
        </div>
        <div className="focus-tile__footer">
          <StarRating
            value={focus.rating}
            onChange={onSetRating}
            size={variant === 'main' ? 16 : 10}
            color={color}
          />
        </div>
      </div>
    </div>
  )
}
