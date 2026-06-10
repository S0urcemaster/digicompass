import { useState, useEffect } from 'react'
import { useApp, factoryFoci } from '../store/store'
import { FocusTile } from './shared/FocusTile'

const VISIBLE_TABS = 4

export function PrimaryView() {
  const { state, dispatch } = useApp()
  const { store } = state

  const activeMindset = store.mindsets.find(m => m.id === store.activeMindsetId) ?? store.mindsets[0] ?? null
  const mindsetList = store.mindsets

  const [tabStart, setTabStart] = useState(0)
  const [focusIndex, setFocusIndex] = useState(0)

  const activeIndex = mindsetList.findIndex(m => m.id === activeMindset?.id)
  const maxStart = Math.max(0, mindsetList.length - VISIBLE_TABS)
  const visibleTabs = mindsetList.slice(tabStart, tabStart + VISIBLE_TABS)

  useEffect(() => {
    setFocusIndex(0)
  }, [activeMindset?.id])

  useEffect(() => {
    if (activeIndex >= 0 && activeIndex < tabStart) setTabStart(activeIndex)
    else if (activeIndex >= tabStart + VISIBLE_TABS) setTabStart(Math.min(activeIndex - VISIBLE_TABS + 1, maxStart))
  }, [activeIndex, tabStart, maxStart])

  if (!activeMindset) {
    const demoFoci = factoryFoci.slice(0, 5)
    return (
      <section className="primary-view">
        <p className="section-label" style={{ marginBottom: 12 }}>Demo — noch keine Mindsets. Erstelle eines in der Sammlung.</p>
        <div className="focus-grid">
          <div>{demoFoci[0] && <FocusTile focus={demoFoci[0]} variant="main" />}</div>
          <div className="focus-grid__previews">
            {demoFoci.slice(1, 5).map(f => <FocusTile key={f.id} focus={f} variant="preview" />)}
          </div>
        </div>
      </section>
    )
  }

  const currentFocus = activeMindset.foci[focusIndex] ?? activeMindset.foci[0]
  const otherFoci = activeMindset.foci.filter((_, i) => i !== focusIndex).slice(0, 4)

  const handleRating = (rating: number) => {
    if (!currentFocus) return
    dispatch({ type: 'RATE_FOCUS', id: currentFocus.id, rating })
  }

  return (
    <section className="primary-view">
      {/* Mindset-Tab-Navigation */}
      <div className="mindset-nav">
        <button
          className="mindset-nav-pager"
          disabled={tabStart === 0}
          onClick={() => setTabStart(s => Math.max(0, s - VISIBLE_TABS))}
        >←</button>

        <div className="mindset-nav-tabs">
          {visibleTabs.map(m => (
            <button
              key={m.id}
              className={`mindset-nav-tab${m.id === activeMindset.id ? ' active' : ''}`}
              onClick={() => dispatch({ type: 'SET_ACTIVE_MINDSET', id: m.id })}
            >{m.name || 'Unbenannt'}</button>
          ))}
          {/* leere Plaetze auffuellen */}
          {Array.from({ length: VISIBLE_TABS - visibleTabs.length }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
        </div>

        <button
          className="mindset-nav-pager"
          disabled={tabStart >= maxStart}
          onClick={() => setTabStart(s => Math.min(maxStart, s + VISIBLE_TABS))}
        >→</button>
      </div>

      {/* Focus-Grid */}
      {currentFocus && (
        <div className="focus-grid">
          <div>
            <FocusTile
              focus={currentFocus}
              variant="main"
              onSetRating={handleRating}
            />
          </div>
          <div className="focus-grid__previews">
            {otherFoci.map((f, i) => (
              <FocusTile
                key={f.id}
                focus={f}
                variant="preview"
                onSelect={() => {
                  const idx = activeMindset.foci.indexOf(f)
                  setFocusIndex(idx >= 0 ? idx : i)
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Notizen */}
      <textarea
        className="mindset-notes"
        placeholder="Notizen zum Mindset …"
        value={activeMindset.notes}
        onChange={e => dispatch({ type: 'UPDATE_MINDSET', id: activeMindset.id, updates: { notes: e.target.value } })}
      />
    </section>
  )
}
