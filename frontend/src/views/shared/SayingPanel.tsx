import type { Saying } from '../../types'
import { StarRating } from './StarRating'

interface SayingPanelProps {
  saying: Saying
  variant?: 'main' | 'compact' | 'wide'
  selected?: boolean
  onSelect?: () => void
  onSetRating?: (r: number) => void
  showId?: boolean
}

export function SayingPanel({ saying, variant = 'main', selected, onSelect, onSetRating, showId }: SayingPanelProps) {
  const textSize = variant === 'main' ? (saying.fontSize ?? 15) : 12

  return (
    <div
      className={`saying-panel saying-panel--${variant}${selected ? ' selected' : ''}`}
      onClick={onSelect}
    >
      <div className="saying-panel__cats">
        {saying.categories.slice(0, 3).map(c => (
          <span key={c} className="chip chip--ink">{c}</span>
        ))}
        {showId && <span className="chip chip--ink">#{saying.id}</span>}
      </div>
      <p className="saying-panel__text" style={{ fontSize: textSize }}>
        {saying.text}
      </p>
      <div className="saying-panel__footer">
        <StarRating value={saying.rating} onChange={onSetRating} size={variant === 'main' ? 16 : 12} />
      </div>
    </div>
  )
}
