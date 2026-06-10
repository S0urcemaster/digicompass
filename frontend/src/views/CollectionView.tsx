import { useState, useEffect, useMemo } from 'react'
import { useApp, factoryImages, factorySayings } from '../store/store'
import type { CollectionTab } from '../types'
import type { Focus, Mindset } from '../types'
import { FocusTile } from './shared/FocusTile'
import { ImageTile } from './shared/ImageTile'
import { SayingPanel } from './shared/SayingPanel'
import { MindsetTile, NewMindsetTile, EmptyMindsetTile } from './shared/MindsetTile'
import { StarRating } from './shared/StarRating'

const PAGE = { images: 8, sayings: 8, foci: 8, mindsets: 5 }
const PREVIEW_URL = (url: string) => url.replace('/images/', '/images/preview/')

function useCats(items: { categories?: string[]; category?: string }[]) {
  return useMemo(() => Array.from(new Set(
    items.flatMap(i => i.categories ?? (i.category ? [i.category] : []))
  )).sort((a, b) => a.localeCompare(b, 'de')), [items])
}

function clamp(n: number, max: number) { return Math.min(n, Math.max(0, max)) }

export function CollectionView() {
  const { state, dispatch } = useApp()
  const { collectionTab } = state

  const setTab = (tab: CollectionTab) => dispatch({ type: 'SET_COLLECTION_TAB', tab })

  return (
    <section className="collection-view">
      <div className="tab-bar tab-bar--4">
        {(['images', 'sayings', 'foci', 'mindsets'] as const).map(t => (
          <button key={t} className={`tab-bar-btn${collectionTab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {{ images: 'Bilder', sayings: 'Sprüche', foci: 'Fokusse', mindsets: 'Mindsets' }[t]}
          </button>
        ))}
      </div>

      {collectionTab === 'images'   && <ImagesTab />}
      {collectionTab === 'sayings'  && <SayingsTab />}
      {collectionTab === 'foci'     && <FociTab />}
      {collectionTab === 'mindsets' && <MindsetsTab />}
    </section>
  )
}

// ─── Bilder ───────────────────────────────────────────────────────────────────

function ImagesTab() {
  const { state, dispatch } = useApp()
  const { store } = state

  const allCats = useCats(factoryImages)
  const [catIdx, setCatIdx] = useState(0)
  const [catActive, setCatActive] = useState(false)
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState<number | null>(factoryImages[0]?.id ?? null)
  const [showIds, setShowIds] = useState(false)
  const [zoomedUrl, setZoomedUrl] = useState<string | null>(null)

  const cat = allCats[clamp(catIdx, allCats.length - 1)] ?? ''
  const filtered = catActive && cat ? factoryImages.filter(i => i.category === cat) : factoryImages
  const selected = filtered.find(i => i.id === selectedId) ?? filtered[0] ?? null
  const previews = selected ? filtered.filter(i => i.id !== selected.id) : filtered

  const pageCount = Math.max(1, Math.ceil(previews.length / PAGE.images))
  const safePage = clamp(page, pageCount - 1)
  const paged = previews.slice(safePage * PAGE.images, (safePage + 1) * PAGE.images)
  const topRow = paged.slice(0, 4)
  const bottomRow = paged.slice(4, 8)

  useEffect(() => { if (page !== safePage) setPage(safePage) }, [page, safePage])
  useEffect(() => { setPage(0) }, [catActive, catIdx])

  const collectedImage = selected ? store.images.find(i => i.id === selected.id) ?? null : null
  const displayRating = collectedImage?.rating ?? selected?.rating ?? 0

  const handleRate = (rating: number) => {
    if (!selected) return
    if (!collectedImage) {
      dispatch({ type: 'TOGGLE_STORE_IMAGE', image: { ...selected, rating } })
    } else {
      dispatch({ type: 'RATE_IMAGE', id: selected.id, rating })
    }
  }

  return (
    <>
      {/* Kategorie-Filter */}
      <div className="cat-filter">
        <button className="cat-filter-btn" disabled={allCats.length <= 1}
          onClick={() => setCatIdx(i => (i - 1 + allCats.length) % allCats.length)}>←</button>
        <button className={`cat-filter-name${catActive ? ' active' : ''}`}
          onClick={() => setCatActive(v => !v)}>{cat || 'Alle'}</button>
        <button className="cat-filter-btn" disabled={allCats.length <= 1}
          onClick={() => setCatIdx(i => (i + 1) % allCats.length)}>→</button>
      </div>

      {/* Paginierung */}
      <div className="pager">
        <button className="pager-btn" disabled={safePage === 0}
          onClick={() => setPage(p => p - 1)}>←</button>
        <span className="pager-info">{safePage + 1} / {pageCount}</span>
        <button className="pager-btn" disabled={safePage >= pageCount - 1}
          onClick={() => setPage(p => p + 1)}>→</button>
      </div>

      {/* Mobile */}
      <div className="images-mobile">
        {selected && (
          <div className="image-panel-main">
            <img src={`/images/${selected.url}`} alt={selected.category} onClick={() => setZoomedUrl(`/images/${selected.url}`)} style={{ cursor: 'zoom-in' }} />
            <div className="panel-meta">
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{selected.category}</span>
              <StarRating value={displayRating} onChange={handleRate} />
            </div>
          </div>
        )}
        <div className="images-grid">
          {paged.map(img => (
            <ImageTile key={img.id} image={img} selected={img.id === selectedId} showId={showIds}
              previewUrl={PREVIEW_URL(img.url)} onSelect={() => setSelectedId(img.id)} />
          ))}
        </div>
      </div>

      {/* Desktop ab 900px */}
      <div className="images-desktop" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {selected && (
          <div style={{ gridColumn: '1/span 2', gridRow: '1/span 2' }}>
            <div className="image-panel-main">
              <img src={`/images/${selected.url}`} alt={selected.category} onClick={() => setZoomedUrl(`/images/${selected.url}`)} style={{ cursor: 'zoom-in' }} />
              <div className="panel-meta">
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{selected.category}</span>
                <StarRating value={displayRating} onChange={handleRate} />
              </div>
            </div>
          </div>
        )}
        <div style={{ gridColumn: '3/span 2', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)' }}>
          {topRow.map(img => (
            <ImageTile key={img.id} image={img} selected={img.id === selectedId} showId={showIds}
              previewUrl={PREVIEW_URL(img.url)} onSelect={() => setSelectedId(img.id)} />
          ))}
        </div>
        <div style={{ gridColumn: '1/span 4', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {bottomRow.map(img => (
            <ImageTile key={img.id} image={img} selected={img.id === selectedId} showId={showIds}
              previewUrl={PREVIEW_URL(img.url)} onSelect={() => setSelectedId(img.id)} />
          ))}
        </div>
      </div>

      {/* ID Toggle */}
      <div className="toggle-row">
        <button className={`toggle-switch${showIds ? ' on' : ''}`} onClick={() => setShowIds(v => !v)} />
        <span>Image-ID anzeigen</span>
      </div>

      {/* Zoom Overlay */}
      {zoomedUrl && (
        <div className="zoom-overlay" onClick={() => setZoomedUrl(null)}>
          <img src={zoomedUrl} alt="" />
        </div>
      )}
    </>
  )
}

// ─── Sprüche ──────────────────────────────────────────────────────────────────

function SayingsTab() {
  const { state, dispatch } = useApp()
  const { store } = state

  const allCats = useCats(factorySayings)
  const [catIdx, setCatIdx] = useState(0)
  const [catActive, setCatActive] = useState(false)
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState<number | null>(factorySayings[0]?.id ?? null)
  const [showIds, setShowIds] = useState(false)

  const cat = allCats[clamp(catIdx, allCats.length - 1)] ?? ''
  const filtered = catActive && cat ? factorySayings.filter(s => s.categories.includes(cat)) : factorySayings
  const selected = filtered.find(s => s.id === selectedId) ?? filtered[0] ?? null
  const others = selected ? filtered.filter(s => s.id !== selected.id) : filtered

  const pageCount = Math.max(1, Math.ceil(others.length / PAGE.sayings))
  const safePage = clamp(page, pageCount - 1)
  const paged = others.slice(safePage * PAGE.sayings, (safePage + 1) * PAGE.sayings)

  useEffect(() => { if (page !== safePage) setPage(safePage) }, [page, safePage])
  useEffect(() => { setPage(0) }, [catActive, catIdx])

  const collectedSaying = selected ? store.sayings.find(s => s.id === selected.id) ?? null : null
  const displayRating = collectedSaying?.rating ?? selected?.rating ?? 0

  const handleRate = (saying: typeof selected, rating: number) => {
    if (!saying) return
    const inStore = store.sayings.some(s => s.id === saying.id)
    if (!inStore) {
      dispatch({ type: 'TOGGLE_STORE_SAYING', saying: { ...saying, rating } })
    } else {
      dispatch({ type: 'RATE_SAYING', id: saying.id, rating })
    }
  }

  return (
    <>
      <div className="cat-filter">
        <button className="cat-filter-btn" disabled={allCats.length <= 1}
          onClick={() => setCatIdx(i => (i - 1 + allCats.length) % allCats.length)}>←</button>
        <button className={`cat-filter-name${catActive ? ' active' : ''}`}
          onClick={() => setCatActive(v => !v)}>{cat || 'Alle'}</button>
        <button className="cat-filter-btn" disabled={allCats.length <= 1}
          onClick={() => setCatIdx(i => (i + 1) % allCats.length)}>→</button>
      </div>

      <div className="pager">
        <button className="pager-btn" disabled={safePage === 0} onClick={() => setPage(p => p - 1)}>←</button>
        <span className="pager-info">{safePage + 1} / {pageCount}</span>
        <button className="pager-btn" disabled={safePage >= pageCount - 1} onClick={() => setPage(p => p + 1)}>→</button>
      </div>

      {/* Mobile */}
      <div className="sayings-mobile">
        {selected && (
          <SayingPanel saying={{ ...selected, rating: displayRating }} variant="main"
            onSetRating={r => handleRate(selected, r)} showId={showIds} />
        )}
        {paged.map(s => {
          const r = store.sayings.find(x => x.id === s.id)?.rating ?? s.rating
          return (
            <SayingPanel key={s.id} saying={{ ...s, rating: r }} variant="compact"
              selected={s.id === selectedId} onSelect={() => setSelectedId(s.id)}
              onSetRating={rating => handleRate(s, rating)} showId={showIds} />
          )
        })}
      </div>

      {/* Desktop */}
      <div className="sayings-desktop" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
        {selected && (
          <div style={{ gridColumn: '1/span 2' }}>
            <SayingPanel saying={{ ...selected, rating: displayRating }} variant="wide"
              onSetRating={r => handleRate(selected, r)} showId={showIds} />
          </div>
        )}
        {paged.map(s => {
          const r = store.sayings.find(x => x.id === s.id)?.rating ?? s.rating
          return (
            <SayingPanel key={s.id} saying={{ ...s, rating: r }} variant="compact"
              selected={s.id === selectedId} onSelect={() => setSelectedId(s.id)}
              onSetRating={rating => handleRate(s, rating)} showId={showIds} />
          )
        })}
      </div>

      <div className="toggle-row">
        <button className={`toggle-switch${showIds ? ' on' : ''}`} onClick={() => setShowIds(v => !v)} />
        <span>Spruch-ID anzeigen</span>
      </div>
    </>
  )
}

// ─── Fokusse ──────────────────────────────────────────────────────────────────

type FocusMode = 'foci' | 'images' | 'sayings'

function FociTab() {
  const { state, dispatch } = useApp()
  const { store } = state

  const allCats = useCats([
    ...store.foci.flatMap(f => [...f.saying.categories.map(c => ({ categories: [c] }))]),
    ...store.images.map(i => ({ categories: [i.category] })),
    ...store.sayings,
  ])
  const [catIdx, setCatIdx] = useState(0)
  const [catActive, setCatActive] = useState(false)
  const [mode, setMode] = useState<FocusMode>('foci')
  const [page, setPage] = useState(0)
  const [selectedFocusId, setSelectedFocusId] = useState<string | null>(store.foci[0]?.id ?? null)
  const [editorImageId, setEditorImageId] = useState<number | null>(store.images[0]?.id ?? null)
  const [editorSayingId, setEditorSayingId] = useState<number | null>(store.sayings[0]?.id ?? null)
  const [zoomedUrl, setZoomedUrl] = useState<string | null>(null)

  const cat = allCats[clamp(catIdx, allCats.length - 1)] ?? ''
  const normCat = catActive && cat ? cat.toLowerCase() : ''

  const filteredFoci = store.foci.filter(f =>
    !normCat || f.saying.categories.some(c => c.toLowerCase().includes(normCat)) || f.imageCategory.toLowerCase().includes(normCat))
  const filteredImages = store.images.filter(i => !normCat || i.category.toLowerCase().includes(normCat))
  const filteredSayings = store.sayings.filter(s => !normCat || s.categories.some(c => c.toLowerCase().includes(normCat)))

  const activeList = mode === 'foci' ? filteredFoci : mode === 'images' ? filteredImages : filteredSayings
  const pageCount = Math.max(1, Math.ceil(activeList.length / PAGE.foci))
  const safePage = clamp(page, pageCount - 1)

  useEffect(() => { if (page !== safePage) setPage(safePage) }, [page, safePage])
  useEffect(() => { setPage(0) }, [catActive, catIdx, mode])

  const pagedItems = activeList.slice(safePage * PAGE.foci, (safePage + 1) * PAGE.foci)
  const topItems = pagedItems.slice(0, 4)
  const bottomItems = pagedItems.slice(4, 8)

  // Preview focus: selected focus OR editor-composed preview
  const selectedFocus = filteredFoci.find(f => f.id === selectedFocusId) ?? filteredFoci[0] ?? null
  const editorImage = filteredImages.find(i => i.id === editorImageId) ?? filteredImages[0] ?? null
  const editorSaying = filteredSayings.find(s => s.id === editorSayingId) ?? filteredSayings[0] ?? null

  const editorPreview: Focus | null = editorImage && editorSaying ? {
    id: `preview-${editorSaying.id}-${editorImage.id}`,
    saying: editorSaying,
    imageUrl: editorImage.url,
    imageColor: editorImage.color,
    imageCategory: editorImage.category,
    rating: 0,
    origin: 'user',
  } : null

  const previewFocus = mode === 'foci' ? selectedFocus : editorPreview

  const handleFocusRate = (focusOrPreview: Focus, rating: number) => {
    const inStore = store.foci.find(f => f.id === focusOrPreview.id)
    if (inStore) {
      if (rating === 0) dispatch({ type: 'TOGGLE_STORE_FOCUS', focus: inStore })
      else dispatch({ type: 'RATE_FOCUS', id: inStore.id, rating })
    } else {
      dispatch({ type: 'CREATE_FOCUS', focus: { ...focusOrPreview, id: `user-${Date.now()}`, rating } })
    }
  }

  return (
    <>
      {/* Kategorie-Filter */}
      <div className="cat-filter">
        <button className="cat-filter-btn" disabled={allCats.length <= 1}
          onClick={() => setCatIdx(i => (i - 1 + allCats.length) % allCats.length)}>←</button>
        <button className={`cat-filter-name${catActive ? ' active' : ''}`}
          onClick={() => setCatActive(v => !v)}>{cat || 'Alle'}</button>
        <button className="cat-filter-btn" disabled={allCats.length <= 1}
          onClick={() => setCatIdx(i => (i + 1) % allCats.length)}>→</button>
      </div>

      {/* Modus-Bar */}
      <div className="mode-bar">
        <button className={`mode-btn${mode === 'foci' ? ' active' : ''}`}
          onClick={() => setMode(m => m === 'foci' ? 'images' : 'foci')}>
          {mode !== 'foci' ? '← Fokusse' : 'Edit →'}
        </button>
        <button className={`mode-btn${mode === 'images' ? ' active' : ''}`}
          disabled={mode === 'foci'} onClick={() => setMode('images')}>Bilder</button>
        <button className={`mode-btn${mode === 'sayings' ? ' active' : ''}`}
          disabled={mode === 'foci'} onClick={() => setMode('sayings')}>Sprüche</button>
      </div>

      {/* Paginierung */}
      <div className="pager">
        <button className="pager-btn" disabled={safePage === 0} onClick={() => setPage(p => p - 1)}>←</button>
        <span className="pager-info">{safePage + 1} / {pageCount}</span>
        <button className="pager-btn" disabled={safePage >= pageCount - 1} onClick={() => setPage(p => p + 1)}>→</button>
      </div>

      {/* Mobile */}
      <div className="foci-mobile">
        {previewFocus && (
          <FocusTile
            focus={previewFocus}
            variant="main"
            onSetRating={r => handleFocusRate(previewFocus, r)}
            onZoom={() => setZoomedUrl(`/images/${previewFocus.imageUrl}`)}
          />
        )}
        {mode === 'foci' && (pagedItems as Focus[]).map(f => (
          <FocusTile key={f.id} focus={f} variant="preview"
            selected={f.id === selectedFocusId} onSelect={() => setSelectedFocusId(f.id)} />
        ))}
        {mode === 'images' && filteredImages.map(img => (
          <ImageTile key={img.id} image={img} previewUrl={PREVIEW_URL(img.url)}
            selected={img.id === editorImageId} onSelect={() => setEditorImageId(img.id)} />
        ))}
        {mode === 'sayings' && filteredSayings.map(s => (
          <SayingPanel key={s.id} saying={s} variant="compact"
            selected={s.id === editorSayingId} onSelect={() => setEditorSayingId(s.id)} />
        ))}
      </div>

      {/* Desktop */}
      <div className="foci-desktop" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {previewFocus && (
          <div style={{ gridColumn: '1/span 2', gridRow: '1/span 2' }}>
            <FocusTile focus={previewFocus} variant="main"
              onSetRating={r => handleFocusRate(previewFocus, r)}
              onZoom={() => setZoomedUrl(`/images/${previewFocus.imageUrl}`)} />
          </div>
        )}
        {/* rechts oben */}
        <div style={{ gridColumn: '3/span 2', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)' }}>
          {mode === 'foci' && (topItems as Focus[]).map(f => (
            <FocusTile key={f.id} focus={f} variant="preview"
              selected={f.id === selectedFocusId} onSelect={() => setSelectedFocusId(f.id)} />
          ))}
          {mode === 'images' && topItems.slice(0, 2).map((img: any) => (
            <ImageTile key={img.id} image={img} previewUrl={PREVIEW_URL(img.url)}
              selected={img.id === editorImageId} onSelect={() => setEditorImageId(img.id)} />
          ))}
          {mode === 'sayings' && (topItems as any[]).slice(0, 2).map(s => (
            <SayingPanel key={s.id} saying={s} variant="compact"
              selected={s.id === editorSayingId} onSelect={() => setEditorSayingId(s.id)} />
          ))}
        </div>
        {/* rechts unten */}
        <div style={{ gridColumn: '1/span 4', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {mode === 'foci' && (bottomItems as Focus[]).map(f => (
            <FocusTile key={f.id} focus={f} variant="preview"
              selected={f.id === selectedFocusId} onSelect={() => setSelectedFocusId(f.id)} />
          ))}
          {mode === 'images' && (bottomItems as any[]).map(img => (
            <ImageTile key={img.id} image={img} previewUrl={PREVIEW_URL(img.url)}
              selected={img.id === editorImageId} onSelect={() => setEditorImageId(img.id)} />
          ))}
          {mode === 'sayings' && (bottomItems as any[]).map(s => (
            <SayingPanel key={s.id} saying={s} variant="compact"
              selected={s.id === editorSayingId} onSelect={() => setEditorSayingId(s.id)} />
          ))}
        </div>
      </div>

      {zoomedUrl && (
        <div className="zoom-overlay" onClick={() => setZoomedUrl(null)}>
          <img src={zoomedUrl} alt="" />
        </div>
      )}
    </>
  )
}

// ─── Mindsets ─────────────────────────────────────────────────────────────────

type MindsetListMode = 'mindsets' | 'foci'
const EMPTY_DRAFT = () => Array<string | null>(5).fill(null)

function MindsetsTab() {
  const { state, dispatch } = useApp()
  const { store } = state

  const [selectedMindsetIndex, setSelectedMindsetIndex] = useState(0)
  const [listMode, setListMode] = useState<MindsetListMode>('mindsets')
  const [listPage, setListPage] = useState(0)
  const [isDraft, setIsDraft] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [draftRating, setDraftRating] = useState(0)
  const [draftFoci, setDraftFoci] = useState<(string | null)[]>(EMPTY_DRAFT())
  const [draftSlot, setDraftSlot] = useState(0)

  const safeIndex = clamp(selectedMindsetIndex, store.mindsets.length - 1)
  const activeMindset = store.mindsets[safeIndex] ?? null

  const listItems = listMode === 'mindsets' ? [...store.mindsets, null] : store.foci
  const pageCount = Math.max(1, Math.ceil(listItems.length / PAGE.mindsets))
  const safePage = clamp(listPage, pageCount - 1)
  const pagedSlots = Array.from({ length: PAGE.mindsets }, (_, i) => listItems[safePage * PAGE.mindsets + i] ?? null)

  useEffect(() => { if (listPage !== safePage) setListPage(safePage) }, [listPage, safePage])

  // draft categories
  const draftCats = useMemo(() => Array.from(new Set(
    draftFoci.flatMap(id => {
      const f = store.foci.find(x => x.id === id)
      return f ? f.saying.categories : []
    })
  )), [draftFoci, store.foci])

  const activeCats = useMemo(() => activeMindset
    ? Array.from(new Set(activeMindset.foci.flatMap(f => f.saying.categories)))
    : [], [activeMindset])

  const openDraft = (mindset?: Mindset, index?: number) => {
    setIsDraft(true)
    if (mindset) {
      setEditingId(mindset.id)
      setDraftName(mindset.name)
      setDraftRating(mindset.rating)
      setDraftFoci(Array.from({ length: 5 }, (_, i) => mindset.foci[i]?.id ?? null))
      if (index !== undefined) setSelectedMindsetIndex(index)
    } else {
      setEditingId(null)
      setDraftName('Neues Mindset')
      setDraftRating(0)
      setDraftFoci(EMPTY_DRAFT())
    }
    setDraftSlot(0)
    setListMode('foci')
  }

  const assignFocusToDraft = (focusId: string) => {
    if (!isDraft) return
    const next = draftFoci.map((id, i) => i === draftSlot ? focusId : id)
    setDraftFoci(next)
    if (editingId) {
      const foci = next.map(id => store.foci.find(f => f.id === id)).filter((f): f is Focus => !!f)
      dispatch({ type: 'UPDATE_MINDSET', id: editingId, updates: { name: draftName, rating: draftRating, foci } })
    }
  }

  const handleDraftRate = (rating: number) => {
    setDraftRating(rating)
    const foci = draftFoci.map(id => store.foci.find(f => f.id === id)).filter((f): f is Focus => !!f)
    if (foci.length === 0 && !editingId) return
    if (editingId) {
      if (rating === 0) { dispatch({ type: 'REMOVE_MINDSET', id: editingId }); setIsDraft(false); setEditingId(null) }
      else dispatch({ type: 'UPDATE_MINDSET', id: editingId, updates: { rating, name: draftName, foci } })
    } else if (rating > 0 && foci.length > 0) {
      const id = `mindset-${Date.now()}`
      dispatch({ type: 'ADD_MINDSET', mindset: { id, name: draftName || 'Neues Mindset', foci, rating, notes: '' } })
      setEditingId(id)
      setSelectedMindsetIndex(store.mindsets.length)
    }
  }

  const handleDraftNameChange = (name: string) => {
    setDraftName(name)
    if (editingId) dispatch({ type: 'UPDATE_MINDSET', id: editingId, updates: { name } })
  }

  // sync draft when switching to mindsets tab
  useEffect(() => {
    if (!activeMindset || isDraft) return
    openDraft(activeMindset, safeIndex)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, activeMindset?.id])

  const displayFoci = isDraft
    ? draftFoci.map(id => store.foci.find(f => f.id === id) ?? null)
    : activeMindset
      ? Array.from({ length: 5 }, (_, i) => activeMindset.foci[i] ?? null)
      : Array(5).fill(null)

  return (
    <>
      {/* Aktives Mindset */}
      <div className="mindset-active">
        <div className="mindset-active__left">
          <p className="mindset-active__label">Aktives Mindset</p>
          {isDraft ? (
            <input
              className="mindset-name-input"
              value={draftName}
              onChange={e => handleDraftNameChange(e.target.value)}
              placeholder="Name"
            />
          ) : activeMindset ? (
            <p className="mindset-active__name">{activeMindset.name || 'Unbenannt'}</p>
          ) : (
            <p className="mindset-active__name">Noch kein Mindset</p>
          )}
          <p className="mindset-active__cats">
            {(isDraft ? draftCats : activeCats).join(' / ') || (isDraft ? 'Wähle Fokusse' : 'Lege unten ein Mindset an')}
          </p>
        </div>
        <StarRating
          value={isDraft ? draftRating : activeMindset?.rating ?? 0}
          onChange={handleDraftRate}
          size={20}
        />
      </div>

      {/* 5 Focus-Slots */}
      <div className="focus-slots">
        {displayFoci.map((focus, i) => (
          <div
            key={i}
            className={`focus-slot${isDraft && draftSlot === i ? ' active' : ''}`}
            onClick={() => isDraft && setDraftSlot(i)}
          >
            {focus ? (
              <FocusTile focus={focus} variant="preview" />
            ) : (
              <div className="focus-slot-empty">
                <p>Slot {i + 1}</p>
                {isDraft && <p>Unten Fokus wählen</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Listen-Steuerung */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        <div className="tab-bar tab-bar--2" style={{ flex: 1, borderBottom: 'none' }}>
          <button className={`tab-bar-btn${listMode === 'mindsets' ? ' active' : ''}`}
            onClick={() => setListMode('mindsets')}>Mindsets</button>
          <button className={`tab-bar-btn${listMode === 'foci' ? ' active' : ''}`}
            onClick={() => setListMode('foci')}>Fokusse</button>
        </div>
        <div className="pager" style={{ flex: 1, borderBottom: 'none', borderTop: 'none' }}>
          <button className="pager-btn" disabled={safePage === 0} onClick={() => setListPage(p => p - 1)}>←</button>
          <span className="pager-info">{safePage + 1} / {pageCount}</span>
          <button className="pager-btn" disabled={safePage >= pageCount - 1} onClick={() => setListPage(p => p + 1)}>→</button>
        </div>
      </div>

      {/* Mindset- / Fokus-Kacheln */}
      <div className="mindset-tiles">
        {pagedSlots.map((entry, slotIdx) => {
          const absIdx = safePage * PAGE.mindsets + slotIdx
          if (listMode === 'mindsets') {
            if (absIdx === store.mindsets.length) {
              return (
                <div key="new" className="mindset-tile-slot">
                  <NewMindsetTile active={isDraft && !editingId} onClick={() => openDraft()} />
                </div>
              )
            }
            if (!entry) return <div key={`empty-${slotIdx}`} className="mindset-tile-slot"><EmptyMindsetTile /></div>
            const m = entry as Mindset
            return (
              <div key={m.id} className="mindset-tile-slot">
                <MindsetTile mindset={m} selected={m.id === activeMindset?.id}
                  onClick={() => openDraft(m, store.mindsets.indexOf(m))} />
              </div>
            )
          } else {
            if (!entry) return <div key={`empty-${slotIdx}`} className="mindset-tile-slot"><EmptyMindsetTile /></div>
            const f = entry as Focus
            return (
              <div key={f.id} className="mindset-tile-slot">
                <FocusTile focus={f} variant="preview"
                  selected={isDraft && draftFoci[draftSlot] === f.id}
                  onSelect={() => assignFocusToDraft(f.id)} />
              </div>
            )
          }
        })}
      </div>
    </>
  )
}
