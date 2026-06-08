import { useApp, factoryImages, factorySayings, factoryFoci } from '../store/store'
import { BrowserGrid } from './BrowserGrid'
import { Card } from './Card'
import { EditorView } from './EditorView'

export function CollectionView() {
  const { state, dispatch } = useApp()
  const { collectionSubview } = state

  return (
    <div className="collection-view">
      <div className="collection-tabs">
        {(['images', 'sayings', 'foci', 'editor'] as const).map(sub => (
          <button
            key={sub}
            className={`tab-btn${collectionSubview === sub ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'SET_COLLECTION_SUBVIEW', subview: sub })}
          >
            {sub.charAt(0).toUpperCase() + sub.slice(1)}
          </button>
        ))}
      </div>

      <div className="collection-body">
        {collectionSubview === 'images' && <ImagesBrowser />}
        {collectionSubview === 'sayings' && <SayingsBrowser />}
        {collectionSubview === 'foci' && <FociBrowser />}
        {collectionSubview === 'editor' && <EditorView />}
      </div>
    </div>
  )
}

function ImagesBrowser() {
  const { state, dispatch } = useApp()
  const { selectedImageId, store } = state

  return (
    <BrowserGrid
      items={factoryImages}
      selectedId={selectedImageId}
      onSelect={id => dispatch({ type: 'SELECT_IMAGE', id: id as number })}
      getId={item => item.id}
      renderCard={(item, size) => {
        const inStore = store.images.some(i => i.id === item.id)
        const storeItem = store.images.find(i => i.id === item.id)
        const rating = storeItem?.rating ?? item.rating
        const isSelected = size === 'selected'
        return (
          <Card
            size={size}
            categories={[item.category]}
            imageUrl={item.url}
            imageColor={item.color}
            rating={rating}
            inStore={inStore}
            onStoreToggle={isSelected
              ? () => dispatch({ type: 'TOGGLE_STORE_IMAGE', image: item })
              : undefined}
            onRatingChange={isSelected && inStore
              ? r => dispatch({ type: 'RATE_IMAGE', id: item.id, rating: r })
              : undefined}
          />
        )
      }}
    />
  )
}

function SayingsBrowser() {
  const { state, dispatch } = useApp()
  const { selectedSayingId, store } = state

  return (
    <BrowserGrid
      items={factorySayings}
      selectedId={selectedSayingId}
      onSelect={id => dispatch({ type: 'SELECT_SAYING', id: id as number })}
      getId={item => item.id}
      renderCard={(item, size) => {
        const inStore = store.sayings.some(s => s.id === item.id)
        const storeItem = store.sayings.find(s => s.id === item.id)
        const rating = storeItem?.rating ?? item.rating
        const isSelected = size === 'selected'
        return (
          <Card
            size={size}
            categories={item.categories}
            text={item.text}
            fontSize={item.fontSize}
            rating={rating}
            inStore={inStore}
            onStoreToggle={isSelected
              ? () => dispatch({ type: 'TOGGLE_STORE_SAYING', saying: item })
              : undefined}
            onRatingChange={isSelected && inStore
              ? r => dispatch({ type: 'RATE_SAYING', id: item.id, rating: r })
              : undefined}
            fontScale={size === 'selected' ? 0.25 : 0.15}
          />
        )
      }}
    />
  )
}

function FociBrowser() {
  const { state, dispatch } = useApp()
  const { selectedFocusId, store } = state

  return (
    <BrowserGrid
      items={factoryFoci}
      selectedId={selectedFocusId}
      onSelect={id => dispatch({ type: 'SELECT_FOCUS', id: id as string })}
      getId={item => item.id}
      renderCard={(item, size) => {
        const inStore = store.foci.some(f => f.id === item.id)
        const storeItem = store.foci.find(f => f.id === item.id)
        const rating = storeItem?.rating ?? item.rating
        const isSelected = size === 'selected'
        return (
          <Card
            size={size}
            categories={[...item.saying.categories, item.imageCategory].slice(0, 5)}
            text={item.saying.text}
            fontSize={item.saying.fontSize}
            imageUrl={item.imageUrl}
            imageColor={item.imageColor}
            rating={rating}
            inStore={inStore}
            onStoreToggle={isSelected
              ? () => dispatch({ type: 'TOGGLE_STORE_FOCUS', focus: item })
              : undefined}
            onRatingChange={isSelected && inStore
              ? r => dispatch({ type: 'RATE_FOCUS', id: item.id, rating: r })
              : undefined}
            fontScale={size === 'selected' ? 0.25 : 0.15}
          />
        )
      }}
    />
  )
}
