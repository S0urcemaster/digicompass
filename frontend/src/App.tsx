import { AppProvider, useApp } from './store/store'
import { NavigatorView } from './views/NavigatorView'
import { PrimaryView } from './views/PrimaryView'
import { CollectionView } from './views/CollectionView'

function AppContent() {
  const { state, dispatch } = useApp()
  const { topView } = state

  const nav = (view: typeof topView) => dispatch({ type: 'SET_TOP_VIEW', view })

  const handleReset = () => {
    if (!window.confirm('Lokalen Store zurücksetzen?')) return
    dispatch({ type: 'RESET' })
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Digi Compass</p>
          <h1>Mindsets für reale Situationen</h1>
          <p className="app-subtitle">
            Wähle ein Mindset, fokussiere dich auf einen visuellen Spruch und halte den Rest des Sets direkt griffbereit.
          </p>
        </div>
        <nav className="view-tabs">
          <button className={`view-tab${topView === 'navigator'  ? ' active' : ''}`} onClick={() => nav('navigator')}>Navigator</button>
          <button className={`view-tab${topView === 'primary'    ? ' active' : ''}`} onClick={() => nav('primary')}>Kompass</button>
          <button className={`view-tab${topView === 'collection' ? ' active' : ''}`} onClick={() => nav('collection')}>Sammlung</button>
        </nav>
      </header>

      <div className="app-content">
        {topView === 'navigator'  && <NavigatorView />}
        {topView === 'primary'    && <PrimaryView />}
        {topView === 'collection' && <CollectionView />}
      </div>

      <footer className="app-footer">
        <button className="reset-btn" onClick={handleReset}>User-Store zurücksetzen</button>
      </footer>
    </main>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
