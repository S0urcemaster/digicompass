import { useApp } from '../store/store'
import { Card } from './Card'

export function MindsetView() {
  const { state, dispatch } = useApp()
  const { store, mindsetFocusIndex, fullscreen } = state

  const mindset = store.mindsets.find(m => m.id === store.activeMindsetId)
    ?? store.mindsets[0]

  if (!mindset) {
    return (
      <div className="mindset-empty">
        <p>Kein Mindset gesetzt</p>
        <button
          className="ghost-btn"
          onClick={() => dispatch({ type: 'SET_TOP_VIEW', view: 'collection' })}
        >
          Zur Collection
        </button>
      </div>
    )
  }

  const slots = Array.from({ length: 5 }).map((_, i) => mindset.foci[i] ?? null)
  const active = slots[mindsetFocusIndex] ?? slots.find(f => f !== null)
  const activeIndex = active ? slots.indexOf(active) : 0

  function handleRate(rating: number) {
    if (!active) return
    dispatch({ type: 'RATE_FOCUS', id: active.id, rating })
  }

  if (fullscreen && active) {
    return (
      <div className="fullscreen-overlay">
        <button
          className="fullscreen-close"
          onClick={() => dispatch({ type: 'SET_FULLSCREEN', value: false })}
        >
          ✕
        </button>
        <Card
          size="selected"
          categories={[...active.saying.categories, active.imageCategory].slice(0, 5)}
          text={active.saying.text}
          fontSize={active.saying.fontSize}
          imageUrl={active.imageUrl}
          imageColor={active.imageColor}
          rating={active.rating}
          onRatingChange={handleRate}
          noReset
          fontScale={0.9}
        />
      </div>
    )
  }

  return (
    <div className="mindset-view">
      {/* large active card */}
      <div className="mindset-active-card">
        {active ? (
          <Card
            size="selected"
            categories={[...active.saying.categories, active.imageCategory].slice(0, 5)}
            text={active.saying.text}
            fontSize={active.saying.fontSize}
            imageUrl={active.imageUrl}
            imageColor={active.imageColor}
            rating={active.rating}
            onRatingChange={handleRate}
            noReset
            fontScale={0.55}
            onFullscreen={() => dispatch({ type: 'SET_FULLSCREEN', value: true })}
          />
        ) : (
          <div className="card-placeholder card-placeholder-large" />
        )}
      </div>

      {/* 4 small preview cards */}
      <div className="mindset-previews">
        {slots.map((focus, i) => (
          <div
            key={i}
            className={`mindset-preview-slot${i === activeIndex ? ' active-slot' : ''}`}
            onClick={() => focus && dispatch({ type: 'SET_MINDSET_FOCUS_INDEX', index: i })}
          >
            {focus ? (
              <Card
                size="preview"
                categories={[...focus.saying.categories, focus.imageCategory].slice(0, 5)}
                text={focus.saying.text}
                imageUrl={focus.imageUrl}
                imageColor={focus.imageColor}
                rating={focus.rating}
                fontScale={0.18}
              />
            ) : (
              <div className="card-placeholder" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
