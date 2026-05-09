import { useCompassStore } from './store/compassStore';
import { MainTab } from './components/MainTab';
import { CompassView } from './views/CompassView';
import { CollectionView } from './views/CollectionView';
import { NavigatorView } from './views/NavigatorView';

function ActiveView() {
  const activeView = useCompassStore((state) => state.activeView);

  if (activeView === 'collection') {
    return <CollectionView />;
  }

  if (activeView === 'navigator') {
    return <NavigatorView />;
  }

  return <CompassView />;
}

export default function App() {
  const { activeView, data, setActiveView, updateUsername } = useCompassStore();

  return (
    <div className="page-shell">
      <div className="app-frame">
        <header className="app-header">
          <div>
            <h1>Digi Compass</h1>
            <p>Mindsets for real situations</p>
          </div>
          <label className="username-field">
            <span>Username</span>
            <input
              value={data.username}
              onChange={(event) => updateUsername(event.target.value)}
            />
          </label>
          <MainTab activeView={activeView} onChange={setActiveView} />
        </header>
        <main className="app-main">
          <ActiveView />
        </main>
      </div>
    </div>
  );
}
