import type { ImageItem } from '../../types'

interface ImageTileProps {
  image: ImageItem
  selected?: boolean
  onSelect?: () => void
  showId?: boolean
  previewUrl?: string
}

export function ImageTile({ image, selected, onSelect, showId, previewUrl }: ImageTileProps) {
  const src = previewUrl ?? `/images/${image.url}`
  return (
    <div
      className={`image-tile${selected ? ' selected' : ''}`}
      onClick={onSelect}
    >
      <img src={src} alt={image.category} loading="lazy" />
      {showId && <span className="image-tile__id">{image.id}</span>}
    </div>
  )
}
