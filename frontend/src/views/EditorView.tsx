import { useApp } from '../store/store'
import { Card } from './Card'

export function EditorView() {
  const { state, dispatch } = useApp()
  const { editorTab } = state

  return (
    <div className="editor-view">
      <div className="editor-tabs">
        <button
          className={`tab-btn${editorTab === 'foci' ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_EDITOR_TAB', tab: 'foci' })}
        >
          Foci
        </button>
        <button
          className={`tab-btn${editorTab === 'mindsets' ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_EDITOR_TAB', tab: 'mindsets' })}
        >
          Mindsets
        </button>
      </div>

      {editorTab === 'foci' ? <FociEditor /> : <MindsetEditor />}
    </div>
  )
}

function FociEditor() {
  const { state, dispatch } = useApp()
  const { editorSayingId, editorImageId, store } = state

  const selectedSaying = store.sayings.find(s => s.id === editorSayingId)
  const selectedImage = store.images.find(i => i.id === editorImageId)
  const canCreate = selectedSaying && selectedImage

  return (
    <div className="foci-editor">
      <div className="editor-section">
        <div className="editor-section-label">Saying</div>
        <div className="editor-list">
          {store.sayings.length === 0 && (
            <span className="list-empty">Keine Sayings im Store</span>
          )}
          {store.sayings.map(saying => (
            <div
              key={saying.id}
              className={`editor-list-item${editorSayingId === saying.id ? ' selected' : ''}`}
              onClick={() => dispatch({ type: 'SET_EDITOR_SAYING', id: saying.id })}
            >
              <span className="list-text">{saying.text}</span>
              <span className="list-cats">{saying.categories.slice(0, 3).join(' · ')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-label">Image</div>
        <div className="editor-list editor-list-images">
          {store.images.length === 0 && (
            <span className="list-empty">Keine Images im Store</span>
          )}
          {store.images.map(image => (
            <div
              key={image.id}
              className={`editor-image-item${editorImageId === image.id ? ' selected' : ''}`}
              style={{ backgroundImage: `url("/images/${image.url}")` }}
              onClick={() => dispatch({ type: 'SET_EDITOR_IMAGE', id: image.id })}
            >
              <span className="image-cat">{image.category}</span>
            </div>
          ))}
        </div>
      </div>

      {canCreate && (
        <div className="editor-preview">
          <div className="editor-section-label">Vorschau</div>
          <div className="editor-preview-card">
            <Card
              size="selected"
              categories={[...selectedSaying.categories, selectedImage.category].slice(0, 5)}
              text={selectedSaying.text}
              fontSize={selectedSaying.fontSize}
              imageUrl={selectedImage.url}
              imageColor={selectedImage.color}
              rating={0.5}
              fontScale={0.3}
            />
          </div>
        </div>
      )}

      <button
        className="create-btn"
        disabled={!canCreate}
        onClick={() => dispatch({ type: 'CREATE_FOCUS' })}
      >
        Focus erstellen
      </button>
    </div>
  )
}

function MindsetEditor() {
  const { state, dispatch } = useApp()
  const { editorFocusIds, store } = state

  return (
    <div className="mindset-editor">
      <div className="editor-section">
        <div className="editor-section-label">
          Foci auswaehlen ({editorFocusIds.length}/5)
        </div>
        <div className="editor-list editor-list-foci">
          {store.foci.length === 0 && (
            <span className="list-empty">Keine Foci im Store</span>
          )}
          {store.foci.map(focus => {
            const selected = editorFocusIds.includes(focus.id)
            return (
              <div
                key={focus.id}
                className={`editor-focus-item${selected ? ' selected' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_EDITOR_FOCUS', id: focus.id })}
                style={{ backgroundImage: `url("/images/${focus.imageUrl}")` }}
              >
                <span className="focus-saying-short">
                  {focus.saying.text.length > 40
                    ? focus.saying.text.slice(0, 40) + '…'
                    : focus.saying.text}
                </span>
                {selected && <span className="focus-check">✓</span>}
              </div>
            )
          })}
        </div>
      </div>

      <button
        className="create-btn"
        disabled={editorFocusIds.length === 0}
        onClick={() => dispatch({ type: 'CREATE_MINDSET' })}
      >
        Mindset erstellen
      </button>

      {store.mindsets.length > 0 && (
        <div className="editor-section">
          <div className="editor-section-label">Meine Mindsets</div>
          <div className="editor-list">
            {store.mindsets.map(m => (
              <div
                key={m.id}
                className={`editor-list-item${m.id === store.activeMindsetId ? ' selected' : ''}`}
                onClick={() => dispatch({ type: 'SET_ACTIVE_MINDSET', id: m.id })}
              >
                <span className="list-text">
                  {m.foci.length} {m.foci.length === 1 ? 'Focus' : 'Foci'}
                </span>
                <span className="list-cats">
                  {m.id === store.activeMindsetId ? 'aktiv' : 'als aktiv setzen'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
