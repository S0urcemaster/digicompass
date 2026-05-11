import { MainTab } from './components/MainTab';
import { useCompassStore } from './store/compassStore';
import { CollectionView } from './views/CollectionView';
import { CompassView } from './views/CompassView';
import { NavigatorView } from './views/NavigatorView';

export function App() {
  const activeView = useCompassStore((state) => state.activeView);

  return (
    <div className="page-shell">
      <div className="app-shell">
        <header className="app-header">
          <h1>Digi Compass</h1>
          <p>Mindsets for real situations</p>
          <MainTab />
        </header>
        <main className="app-main">
          {activeView === 'compass' ? <CompassView /> : null}
          {activeView === 'collection' ? <CollectionView /> : null}
          {activeView === 'navigator' ? <NavigatorView /> : null}
        </main>
      </div>
    </div>
  );
}
