import { AppProvider, useApp } from './store/store'
import { MindsetView } from './views/MindsetView'
import { NavigatorView } from './views/NavigatorView'
import { CollectionView } from './views/CollectionView'

function AppShell() {
  const { state, dispatch } = useApp()
  const { topView } = state

  return (
    <div className="app">
      <div className="view-area">
        {topView === 'mindset' && <MindsetView />}
        {topView === 'navigator' && <NavigatorView />}
        {topView === 'collection' && <CollectionView />}
      </div>

      <nav className="bottom-nav">
        <button
          className={`nav-btn${topView === 'navigator' ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_TOP_VIEW', view: 'navigator' })}
        >
          <span className="nav-icon">◈</span>
          <span className="nav-label">Navigator</span>
        </button>
        <button
          className={`nav-btn${topView === 'mindset' ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_TOP_VIEW', view: 'mindset' })}
        >
          <span className="nav-icon">◎</span>
          <span className="nav-label">Mindset</span>
        </button>
        <button
          className={`nav-btn${topView === 'collection' ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_TOP_VIEW', view: 'collection' })}
        >
          <span className="nav-icon">▦</span>
          <span className="nav-label">Collection</span>
        </button>
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
