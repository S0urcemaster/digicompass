interface StarRatingProps {
  value: number
  onChange?: (v: number) => void
  size?: number
  color?: string
}

export function StarRating({ value, onChange, size = 16, color = 'currentColor' }: StarRatingProps) {
  const readonly = !onChange

  const handleClick = (star: number) => {
    if (!onChange) return
    onChange(value === star ? 0 : star)
  }

  return (
    <div className={`star-rating${readonly ? ' star-rating--readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star-rating__star${star <= value ? ' filled' : ''}`}
          style={{ fontSize: size, color }}
          onClick={e => { e.stopPropagation(); handleClick(star) }}
        >
          {star <= value ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}
