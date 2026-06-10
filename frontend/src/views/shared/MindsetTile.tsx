import type { Mindset } from '../../types'
import { StarRating } from './StarRating'

interface MindsetTileProps {
  mindset: Mindset
  selected?: boolean
  onClick?: () => void
}

export function MindsetTile({ mindset, selected, onClick }: MindsetTileProps) {
  const first = mindset.foci[0]
  return (
    <div
      className={`mindset-tile${selected ? ' selected' : ''}`}
      onClick={onClick}
      style={first ? { backgroundImage: `url("/images/${first.imageUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <div className="mindset-tile__overlay">
        <span className="mindset-tile__name">{mindset.name || 'Unbenannt'}</span>
        <StarRating value={mindset.rating} size={10} color="#fff" />
      </div>
    </div>
  )
}

interface NewMindsetTileProps {
  onClick: () => void
  active?: boolean
}

export function NewMindsetTile({ onClick, active }: NewMindsetTileProps) {
  return (
    <div
      className={`mindset-tile mindset-tile--new${active ? ' selected' : ''}`}
      onClick={onClick}
    />
  )
}

export function EmptyMindsetTile() {
  return <div className="mindset-tile mindset-tile--empty" />
}
