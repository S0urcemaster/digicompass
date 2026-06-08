import type { ReactNode } from 'react'

interface BrowserGridProps<T> {
  items: T[]
  selectedId: string | number | null
  onSelect: (id: string | number) => void
  getId: (item: T) => string | number
  renderCard: (item: T, size: 'selected' | 'preview') => ReactNode
}

export function BrowserGrid<T>({
  items,
  selectedId,
  onSelect,
  getId,
  renderCard,
}: BrowserGridProps<T>) {
  if (items.length === 0) {
    return <div className="browser-empty">Keine Eintraege vorhanden</div>
  }

  const selIdx = items.findIndex(i => getId(i) === selectedId)
  const activeIdx = selIdx >= 0 ? selIdx : 0
  const selected = items[activeIdx]

  // 8 preview slots: cycle through remaining items
  const others = [...items.slice(0, activeIdx), ...items.slice(activeIdx + 1)]
  const previews = others.slice(0, 8)

  return (
    <div className="browser-grid">
      <div className="browser-grid-cells">
        {/* selected: 2x2 top-left */}
        <div
          className="grid-selected"
          onClick={() => onSelect(getId(selected))}
        >
          {renderCard(selected, 'selected')}
        </div>

        {/* 8 preview slots */}
        {Array.from({ length: 8 }).map((_, i) => {
          const item = previews[i]
          if (!item) {
            return <div key={`empty-${i}`} className="grid-preview grid-empty" />
          }
          return (
            <div
              key={String(getId(item))}
              className="grid-preview"
              onClick={() => onSelect(getId(item))}
            >
              {renderCard(item, 'preview')}
            </div>
          )
        })}
      </div>

      {/* pagination if more than 9 items */}
      {items.length > 9 && (
        <div className="grid-pagination">
          <button
            className="page-btn"
            disabled={activeIdx === 0}
            onClick={() => onSelect(getId(items[Math.max(0, activeIdx - 1)]))}
          >
            ‹
          </button>
          <span className="page-info">{activeIdx + 1} / {items.length}</span>
          <button
            className="page-btn"
            disabled={activeIdx === items.length - 1}
            onClick={() => onSelect(getId(items[Math.min(items.length - 1, activeIdx + 1)]))}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
