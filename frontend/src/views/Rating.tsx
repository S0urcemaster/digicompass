interface RatingProps {
  value: number
  onChange?: (value: number) => void
  noReset?: boolean
  size?: number
}

export function Rating({ value, onChange, noReset, size = 14 }: RatingProps) {
  const filled = Math.round(value * 5)

  function handleClick(star: number) {
    if (!onChange) return
    if (!noReset && star === filled) {
      onChange(0)
    } else {
      onChange(star / 5)
    }
  }

  return (
    <div
      className="rating"
      style={{ fontSize: size, gap: Math.round(size * 0.2) }}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={star <= filled ? 'star filled' : 'star'}
          onClick={onChange ? () => handleClick(star) : undefined}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
        >
          {star <= filled ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}
